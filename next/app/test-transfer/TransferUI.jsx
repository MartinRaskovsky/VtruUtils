'use client';

/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * This is the client-side interactive component for the test transfer page.
 * It uses wallet connection, state hooks, and renders grouped section data
 * with buttons for simulating token transfers.
 */

import { useState } from 'react';
import SendModal from '../../components/SendModal';
import useEvmWallet from '../../lib/useEvmWallet';
import sectionMeta from '../../../shared/section-metadata.json';

export default function TransferUI({ rawSections }) {
  const [source, setSource] = useState(null);
  const [target, setTarget] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const { connect, signer, address, status } = useEvmWallet();

  const isSame = (a, b) => a?.address === b?.address && a?.symbol === b?.symbol;

  const handleRedClick = (entry) => {
    if (parseFloat(entry.formattedBalance.replace(/,/g, '')) === 0) return;
    setSource(isSame(source, entry) ? null : entry);
  };

  const handleGreenClick = (entry) => {
    setTarget(isSame(target, entry) ? null : entry);
  };

  const openSendModal = (symbol) => {
    if (source?.symbol === symbol && target?.symbol === symbol) {
      setActiveModal(symbol);
    }
  };

  const grouped = {};
  for (const [symbol, entries] of Object.entries(rawSections)) {
    const group = sectionMeta[symbol]?.group || 'Other';
    const label = sectionMeta[symbol]?.label || symbol;

    if (!entries.some(e => parseFloat(e.formattedBalance.replace(/,/g, '')) > 0)) continue;
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push({ symbol, label, entries });
  }

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        {status !== 'connected' ? (
          <button onClick={connect} style={{ padding: '0.5rem 1rem', backgroundColor: '#6A0DAD', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            🔌 Connect Wallet
          </button>
        ) : (
          <div style={{ color: 'green', fontWeight: 'bold' }}>
            ✅ Connected: {address}
          </div>
        )}
      </div>

      <div style={{ padding: '2rem', fontFamily: 'Arial', backgroundColor: '#f4f4f8' }}>
        <h1 style={{ color: '#6A0DAD' }}>Grouped Sections</h1>

        {Object.entries(grouped).map(([groupName, sectionList]) => (
          <div key={groupName} style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#4B0082', borderBottom: '2px solid #ccc' }}>{groupName}</h2>

            {sectionList.map(({ symbol, label, entries }) => (
              <div key={symbol} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '10px', padding: '1rem', marginTop: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ color: '#6A0DAD' }}>{label}</h3>
                  <button
                    onClick={() => openSendModal(symbol)}
                    disabled={
                      !source || !target || source.symbol !== symbol || target.symbol !== symbol
                    }
                    style={{
                      backgroundColor:
                        source?.symbol === symbol && target?.symbol === symbol ? '#6A0DAD' : '#ccc',
                      color: 'white',
                      padding: '0.4rem 1rem',
                      borderRadius: '6px',
                      border: 'none',
                      cursor:
                        source?.symbol === symbol && target?.symbol === symbol
                          ? 'pointer'
                          : 'not-allowed'
                    }}
                  >
                    🚀 Send
                  </button>
                </div>

                <ul style={{ marginTop: '0.5rem' }}>
                  {entries.map((entry, idx) => {
                    const isSelectedRed = isSame(source, { ...entry, symbol });
                    const isSelectedGreen = isSame(target, { ...entry, symbol });
                    const isZero = parseFloat(entry.formattedBalance.replace(/,/g, '')) === 0;

                    return (
                      <li key={idx} style={{ marginBottom: '0.3rem' }}>
                        <strong>{entry.address}</strong>: {entry.formattedBalance}
                        <button
                          style={{
                            marginLeft: '1rem',
                            backgroundColor: isSelectedRed ? 'red' : '#eee',
                            color: isSelectedRed ? 'white' : 'black',
                            cursor: isZero ? 'not-allowed' : 'pointer',
                            opacity: isZero ? 0.4 : 1,
                            borderRadius: '4px'
                          }}
                          disabled={isZero}
                          onClick={() => handleRedClick({ ...entry, symbol })}
                        >
                          🔴 From
                        </button>
                        <button
                          style={{
                            marginLeft: '0.5rem',
                            backgroundColor: isSelectedGreen ? 'green' : '#eee',
                            color: isSelectedGreen ? 'white' : 'black',
                            borderRadius: '4px'
                          }}
                          onClick={() => handleGreenClick({ ...entry, symbol })}
                        >
                          🟢 To
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {activeModal === symbol && (
                  <SendModal
                    data={{ from: source, to: target }}
                    onClose={() => {
                      setActiveModal(null);
                      setSource(null);
                      setTarget(null);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

