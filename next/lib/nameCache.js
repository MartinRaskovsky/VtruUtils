// src/next/lib/nameCache.js

/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * Simple front-end cache for wallet name mapping.
 * Used to avoid redundant fetches and speed up UI rendering.
 *
 * @getWalletName(address) → returns user-assigned name or empty string
 * @setNameCache(map) → replaces the cache with a full new map
 * @resetNameCache() → clears the cache (normally not needed if setNameCache is used)
 */

let walletNameCache = {};

/**
 * Returns the user-friendly name for a given address.
 * @param {string} address - Wallet address
 * @return {string} - Name if available, else empty string
 */
export function getWalletName(address) {
  if (!address) return '';
  const key = address.toLowerCase();
  const result = walletNameCache[key] || '';
  //console.log(`[nameCache] Resolved name for ${key}: ${result}`);
  return result;
}

/**
 * Replaces the entire wallet name cache.
 * @param {Object} map - { address: name } mapping
 */
export function setNameCache(map) {
  //console.log('[nameCache] Setting wallet name cache with', Object.keys(map).length, 'entries');  walletNameCache = {};
  for (const k in map) {
    if (Object.hasOwn(map, k)) {
      walletNameCache[k.toLowerCase()] = map[k];
    }
  }
}

/**
 * Clears the wallet name cache.
 */
export function resetNameCache() {
  //console.log('resetNameCache()');
  walletNameCache = {};
}
