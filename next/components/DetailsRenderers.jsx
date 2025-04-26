'use client';

/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * DetailsRenderers.jsx
 *
 * Renders detail views for token-specific data (e.g., VTRU Staked, VIBE).
 * Matches the HTML layout and CSS class structure used in the Perl version.
 */

import React from 'react';
import { getLabel } from '../lib/libUtils';
import { getWalletName } from '../lib/nameCache';

export function renderVtruStaked(data, grouping) {
  const label = grouping === 'none' ? 'Wallet' : '#Stakes';

  return (
    <>
      <h2>VTRU Staked Details</h2>
      <div className="scrollable">
        <table className="stake-table">
          <thead>
            <tr>
              <th>{label}</th>
              <th>Amount</th>
              <th>Reward</th>
              <th>Locked</th>
              <th>Available</th>
              <th>Maturity</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const label = getLabel('VTRU', grouping, row.wallet, getWalletName(row.wallet));
              return (
                <tr key={idx}>
                  <td className="wallet-cell" dangerouslySetInnerHTML={{ __html: label }} />
                  <td className="decimal-align">{row.amount}</td>
                  <td className="decimal-align">{row.reward}</td>
                  <td className="decimal-align">{row.totalStaked}</td>
                  <td>{row.availableToUnstake}</td>
                  <td>{row.estimatedMaturity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function renderVibeDetails(data, grouping) {
  return (
    <>
      <h2>Vibe Details</h2>
      <div className="scrollable">
        <table className="stake-table">
          <thead>
            <tr>
              <th>Wallet</th>
              <th>#Tokens</th>
              <th>Balance</th>
              <th>Claimed</th>
              <th>Unclaimed</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const label = getLabel('VTRU', grouping, row.wallet, getWalletName(row.wallet));
              const unclaimed = row.unclaimed ?? '0.00';
              const decorated = unclaimed !== '0.00'
                ? <span class='unclaimed'>{unclaimed}</span>
                : '';
              return (
                <tr key={idx}>
                  <td className="wallet-cell" dangerouslySetInnerHTML={{ __html: label }} />
                  <td className="decimal-align">{row.noTokens}</td>
                  <td className="decimal-align">{row.balance}</td>
                  <td className="decimal-align">{row.claimed}</td>
                  <td className="decimal-align">{decorated}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

// 🟡 Same pattern applies to all other renderXxx functions below

export function renderBscStaked(data, grouping) {
  const label = grouping === 'none' ? 'Wallet' : '#Stakes';
  return (
    <>
      <h2>SEVO-X Staked Details</h2>
      <table className="stake-table">
        <thead>
          <tr>
            <th>{label}</th>
            <th>Date</th>
            <th>Locked</th>
            <th>Unlocked</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const label = getLabel('BSC', grouping, row.wallet, getWalletName(row.wallet));
            return (
              <tr key={idx}>
                <td dangerouslySetInnerHTML={{ __html: label }} />
                <td>{row.date}</td>
                <td className="decimal-align">{row.locked}</td>
                <td className="decimal-align">{row.unlocked}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export function renderVortexDetails(data, grouping) {
  return (
    <>
      <h2>Vortex Details</h2>
      <div className="scrollable">
        <table className="stake-table">
          <thead>
            <tr>
              <th>Wallet</th>
              <th>Rarity</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const label = getLabel('VTRU', grouping, row.wallet, getWalletName(row.wallet));
              return (
                <tr key={idx}>
                  <td className="wallet-cell" dangerouslySetInnerHTML={{ __html: label }} />
                  <td className="decimal-align">{row.kind}</td>
                  <td className="decimal-align">{row.count}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function renderSevoDetails(data, grouping) {
  return (
    <>
      <h2>SEVO Claim Info</h2>
      <div className="scrollable">
        <table className="stake-table">
          <thead>
            <tr>
              <th>Wallet</th>
              <th>Claim w/ BTC</th>
              <th>Claim w/o BTC</th>
              <th>Gain</th>
              <th>Previously Claimed</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const skip = ['withBtc', 'withoutBtc', 'gain', 'priorClaimed']
                .every(key => row[key] === '0.00');
              if (skip) return null;
              const label = getLabel('VTRU', grouping, row.wallet, getWalletName(row.wallet));
              return (
                <tr key={idx}>
                  <td className="wallet-cell" dangerouslySetInnerHTML={{ __html: label }} />
                  <td className="decimal-align">{row.withBtc}</td>
                  <td className="decimal-align">{row.withoutBtc}</td>
                  <td className="decimal-align">{row.gain}</td>
                  <td className="decimal-align">{row.priorClaimed}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
