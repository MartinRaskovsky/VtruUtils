'use client';

/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * This page mirrors the legacy Perl/HTML version of "Name Your Wallets".
 * It displays wallet addresses in a table with editable names, and
 * allows users to save the updated names to the database.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadWalletNames, saveWalletNames } from '../../lib/apiClient';

export default function NameWalletsPage() {
  const router = useRouter();

  const [vault, setVault] = useState('');
  const [wallets, setWallets] = useState([]);
  const [setName, setSetName] = useState('current');
  const [nameMap, setNameMap] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = sessionStorage.getItem('walletNamePayload');
    if (!raw) {
      setError('Missing input');
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setVault(parsed.vault || '');
      setSetName(parsed.setName || 'current');
      const walletsList = (parsed.wallets || '').split(/\s+/).map(x => x.trim()).filter(Boolean);
      setWallets(walletsList);

      loadWalletNames(parsed.vault, parsed.setName, walletsList)
        .then(data => setNameMap(data))
        .catch(() => setError('Could not load wallet names.'))
        .finally(() => setLoading(false));
    } catch (err) {
      console.error('Invalid sessionStorage JSON:', err);
      setError('Invalid session state');
      setLoading(false);
    }
  }, []);

  const handleNameChange = (addr, name) => {
    setNameMap(prev => ({ ...prev, [addr]: name }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const seen = new Set();

    for (const n of Object.values(nameMap)) {
      const lower = n.trim().toLowerCase();
      if (lower && seen.has(lower)) {
        setError('Duplicate names not allowed');
        return;
      }
      seen.add(lower);
    }

    try {
      const json = await saveWalletNames(vault, setName, wallets, nameMap);
      if (!json.success) {
        setError(json.message || 'Save failed');
      } else {
        router.push('/');
      }
    } catch {
      setError('Save failed');
    }
  };

  if (loading) return <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div className="names-page" id="names-page" style={{ padding: '20px' }}>
      <div id="main-wrapper">
        <div className="logo-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src="/images/logo.png" alt="VaWa Logo" className="vawa-logo" />
          <span className="version-text"></span>
        </div>

        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', color: 'white' }}>Name Your Wallets</h2>

          <form onSubmit={handleSubmit} id="nameForm">
            <div className="form-container" style={{
              background: 'var(--accent-color-2)',
              padding: '20px',
              borderRadius: '12px'
            }}>
              <input type="hidden" name="setNameHidden" value={setName} />
              <input type="hidden" name="vaultHidden" value={vault} />
              <input type="hidden" name="walletsHidden" value={wallets.join(' ')} />

              <table id="walletTable" className="data-table" style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: 'var(--text-primary)',
                marginTop: '10px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#673d96' }}>
                    <th style={{ textAlign: 'left', color: 'white', fontSize: '0.95rem', padding: '8px 12px' }}>Wallet Address</th>
                    <th style={{ textAlign: 'left', color: 'white', fontSize: '0.95rem', padding: '8px 12px' }}>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.map(addr => (
                    <tr key={addr} style={{ backgroundColor: '#673d96' }}>
                      <td className="wallet-address">{addr}</td>
                      <td>
                          <input
                            type="text"
                            value={nameMap[addr] || ''}
                            onChange={e => handleNameChange(addr, e.target.value)}
                            placeholder="Enter name"
                            className="wallet-name"
                          />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="button-row" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => router.push('/')}>Cancel</button>
                <button type="submit">Save</button>
              </div>

              {error && <div id="error" style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
