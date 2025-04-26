// src/next/lib/libUtils.js
//
// Utility methods migrated from Utils.pm (Perl)
// Author: Dr. Martín Raskovsky
// Date: April 2025

import { getExplorer } from './libDefs';

/**
 * Trim leading and trailing whitespace
 * @param {string} str
 * @returns {string}
 */
export function trimSpaces(str) {
  if (typeof str !== 'string') return '';
  return str.trim();
}

/**
 * Decorate unclaimed value if present
 * @param {string} value
 * @returns {string}
 */
export function decorateUnclaimed(value) {
  if (!value || value === '0.00') return '';
  return `<span class='unclaimed'>${value}</span>`;
}

/**
 * Generate a block explorer URL wrapped in an <a> tag
 * @param {string} network
 * @param {string} address
 * @param {string} [abbrev]
 * @param {string} [name]
 * @returns {string}
 */
export function getExplorerURL(network, address, abbrev, name) {
  if (!network) return '';
  const label = name && name !== '' ? name : (abbrev || address);
  const fullLabel = `<span title="${address}">${label}</span>`;
  const base = getExplorer(network);
  return base ? `<a target="_blank" href="${base}${address}">${fullLabel}</a>` : '';
}

/**
 * Create an explorer label unless grouped
 * @param {string} network
 * @param {string} grouping
 * @param {string} data
 * @param {string} [name]
 * @returns {string}
 */
export function getLabel(network, grouping, data, name) {
  if (!data) return '';
  if (grouping !== 'none') return data;
  if (data === 'Total') return data;
  return getExplorerURL(network, data, truncateAddress(data), name);
}

/**
 * Truncate a wallet address (e.g., 0x123...abcd)
 * @param {string} wallet
 * @returns {string}
 */
export function truncateAddress(wallet) {
  if (!wallet || wallet.length < 10) return wallet;
  return wallet.slice(0, 6) + '...' + wallet.slice(-4);
}

/**
 * Split a whitespace-separated wallet string into an array
 * @param {string} wallets
 * @returns {string[]}
 */
export function processWallets(wallets) {
  if (!wallets || typeof wallets !== 'string') return [];
  return wallets.trim().split(/\s+/);
}
