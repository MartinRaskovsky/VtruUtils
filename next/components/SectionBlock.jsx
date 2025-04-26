'use client';

/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * SectionBlock.jsx
 *
 * Renders a section group of wallet balances.
 * Shows balance, diffs, and details button for each subsection.
 */

import React from 'react';
import { getChainMarker, getDetailType } from '../lib/libDefs';
import { hasGroups } from '../../shared/constants';
import { getExplorerURL, truncateAddress } from '../lib/libUtils';
import { getWalletName } from '../lib/nameCache';

export default function SectionBlock({ label, sectionKey, entries, total, networkKey, vault, diffs = {}, totalDiff = '' }) {
  const marker = getChainMarker(networkKey);
  const detailType = getDetailType(label);
  const showGrouping = hasGroups[label];

  const radioName = `grouping${sectionKey.replace(/\s+/g, '').toLowerCase()}`;
  const walletList = entries.map(e => e.address);

  const handleViewDetails = async () => {
    const group = document.querySelector(`input[name=${radioName}]:checked`)?.value || 'none';
    if (!window.VaWaModal) {
      console.warn('Modal system not initialized');
      return;
    }
    window.VaWaModal.open(detailType, group, vault, walletList);
  };

  return (
    <table className="section-table">
      <tbody>
        <tr className="section-header" id={label}>
          <td colSpan="2">{label}</td>
          <td style={{ textAlign: 'right', fontSize: '16px' }}>
            <span dangerouslySetInnerHTML={{ __html: marker }} />
          </td>
        </tr>

        {entries.map((entry, idx) => {
          const balance = entry.value;
          const wallet = entry.address;
          if (balance === '0' || balance === '0.00') return null;

          const labelHTML = getExplorerURL(networkKey, wallet, truncateAddress(wallet), getWalletName(wallet));
          const diffHTML = diffs[idx] || '&nbsp;'; // 🎯 lookup by index, not address

          return (
            <tr key={idx} className="section-row">
              <td className="wallet-cell">
                <span dangerouslySetInnerHTML={{ __html: labelHTML }} />
              </td>
              <td className="diff-cell">
                <span dangerouslySetInnerHTML={{ __html: diffHTML }} />
              </td>
              <td className="balance-cell decimal-align">{balance}</td>
            </tr>
          );
        })}

        <tr className="total-row">
          <td>
            <span dangerouslySetInnerHTML={{ __html: marker }} /> <strong>Total</strong>
          </td>
          <td className="diff-cell">
            <span dangerouslySetInnerHTML={{ __html: totalDiff || '&nbsp;' }} />
          </td>
          <td className="balance-cell decimal-align">{total}</td>
        </tr>

        {showGrouping && (
          <tr className="total-row">
            <td colSpan="3">
              <div className="group-container">
                <span className="group-label">Grouped by:</span>
                <div className="radio-group">
                  <label className="radio-label"><input type="radio" name={radioName} value="none" defaultChecked /> None</label>
                  <label className="radio-label"><input type="radio" name={radioName} value="day" /> Day</label>
                  <label className="radio-label"><input type="radio" name={radioName} value="month" /> Month</label>
                  <label className="radio-label"><input type="radio" name={radioName} value="year" /> Year</label>
                </div>
              </div>
            </td>
          </tr>
        )}

        {detailType && (
          <tr className="total-row">
            <td colSpan="3">
              <div className="stake-btn-container">
                <button className="stake-btn" onClick={handleViewDetails}>
                  View {label} Details
                </button>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

