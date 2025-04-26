'use client';

/**
 * Author: Dr Martín Raskovsky
 * Date: April 2025
 *
 * DashboardInputForm.jsx
 *
 * React input form for Vault & Wallets entry and interaction.
 * This component allows setting/editing vault & wallets, navigating to naming,
 * and initiating the "Get Details" process. Preserves existing CSS structure.
 */

import React, { useState, useEffect } from 'react';
import { saveCurrentSet, getSections } from '../lib/apiClient';
import { useDashboardSession } from '../lib/useDashboardSession';

function getAddressType(address) {
  address = address.trim();
  if (/^(tz1|tz2|tz3|KT1)[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)) return 'tezos';
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) return 'evm';
  if (
    /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address) &&
    !/^(tz1|tz2|tz3|KT1)/.test(address)
  ) return 'solana';
  return null;
}

export default function DashboardInputForm({
  onDataLoaded,
  initialVault = '',
  initialWallets = [],
  initialSetName = ''
}) {
  const [vault, setVault] = useState(initialVault);
  const [walletsText, setWalletsText] = useState(initialWallets.join('\n'));
  const [setName, setSetName] = useState(initialSetName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const { setStage } = useDashboardSession();

  useEffect(() => {
    setVault(initialVault);
    setWalletsText(initialWallets.join('\n'));
    setSetName(initialSetName);
  }, [initialVault, initialWallets, initialSetName]);

  function parseWallets(text) {
    return text
      .split(/\s+/)
      .map(addr => addr.trim())
      .filter(Boolean);
  }

  useEffect(() => {
    const vaultAddress = vault.trim();
    const walletList = parseWallets(walletsText);

    const isValidVault = vaultAddress.length === 0 || getAddressType(vaultAddress);
    const isValidWallets = walletList.length === 0 || walletList.every(getAddressType);
    const hasSomeInput = vaultAddress || walletList.length > 0;

    setIsFormValid(hasSomeInput && isValidVault && isValidWallets);
  }, [vault, walletsText]);

  useEffect(() => {
    const vaultChanged = vault.trim() !== initialVault.trim();
    const walletsChanged = walletsText.trim() !== initialWallets.join('\n').trim();
    setIsEdited(vaultChanged || walletsChanged);
  }, [vault, walletsText, initialVault, initialWallets]);  

  async function updateCurrentSet(vault, wallets, name) {
    await saveCurrentSet(name, vault, wallets);
  }

  async function getDetailsFromApi(vault, wallets) {
    return await getSections(vault, wallets);
  }

  async function handleGetDetails(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const wallets = parseWallets(walletsText);

    try {
      await updateCurrentSet(vault, wallets, setName || 'current');
      const data = await getDetailsFromApi(vault, wallets);
      await updateCurrentSet(data.vault || vault, data.wallets || wallets, setName || 'current');
      onDataLoaded(data);
      setStage('details');
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  function handleNameWallets() {
    const payload = {
      vault,
      wallets: walletsText,
      setName: setName || 'current',
    };
    sessionStorage.setItem('walletNamePayload', JSON.stringify(payload));
    window.location.href = '/name-wallets';
  }

  return (
    <form
      onSubmit={handleGetDetails}
      id="detailsForm"
      className={`form-container ${loading ? 'form-disabled' : ''}`}
    >
      <div id="currentSetName" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
      {setName || '(will be set name)'}{isEdited ? ' (edited)' : ''}
    </div>

      <label htmlFor="vault">Vault:</label>
      <input
        type="text"
        id="vaultAddress"
        name="vault"
        placeholder="Enter Vault Address"
        value={vault}
        onChange={e => setVault(e.target.value)}
        className="form-input"
      />

      <label htmlFor="wallets">Wallets (extra wallets not in Vault):</label>
      <textarea
        id="walletAddresses"
        name="wallets"
        rows={5}
        placeholder="Enter Wallet Addresses, one per line"
        value={walletsText}
        onChange={e => setWalletsText(e.target.value)}
      />

      <input type="hidden" name="set_name" id="setNameHidden" value={setName} />

      <div className="button-row" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
        <button type="button" id="nameWalletsBtn" disabled={!isFormValid || loading} onClick={handleNameWallets}>
          Names
        </button>
        <button type="button" id="loadSetBtn" disabled={loading}>Load</button>
        <button type="button" id="saveSetsBtn" disabled={!isFormValid || loading}>Save</button>
      </div>

      <button type="submit" id="getDetailsBtn" disabled={!isFormValid || loading}>
        {loading ? 'Loading...' : 'Get Details'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </form>
  );
}

