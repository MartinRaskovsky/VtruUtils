// src/next/lib/fetchNames.js

/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * Fetches wallet-name mappings from the server for a given list of wallet addresses.
 * Used to populate the global name cache (not the editable form).
 *
 * @param {string[]} wallets - List of wallet addresses to look up.
 * @returns {Promise<Object>} - A map from wallet address to name.
 */

import { loadWalletNames } from './apiClient';

export async function fetchNameMap(wallets = []) {
  if (!Array.isArray(wallets) || wallets.length === 0) return {};

  try {
    const result = await loadWalletNames('', 'current', wallets);
    return result || {};
  } catch (err) {
    console.error('fetchNameMap: error loading names:', err);
    return {};
  }
}
