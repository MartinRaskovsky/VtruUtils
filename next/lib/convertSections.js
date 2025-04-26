/**
 * Author: Dr Martín Raskovsky
 * Date: April 2025
 *
 * Converts vault-format wallet-oriented data into a section-oriented layout
 * suitable for token transfer UIs. This is used primarily in the `index.js`
 * transfer simulation page. It scans the specified chains in order and returns
 * a symbol-to-wallet-entry map.
 *
 * This module is chain-aware and uses the canonical `chainList` imported
 * from `libDefs.js`, so it automatically adapts to EVM, Solana, Tezos, etc.
 *
 * Related modules:
 *   - `extractSectionGroups.js`: groups sections into layout blocks.
 *   - `getSections.js`: backend script providing the vault-format JSON input.
 *   - `section-metadata.json`: adds UI metadata like labels and groups.
 */


import { chainList } from '../lib/libDefs';

export default function convertSections(raw) {
  const sectionMap = {};

  for (const chain of chainList) {
    const cdata = raw?.[chain];
    if (!cdata?.wallets) continue;

    const wallets = cdata.wallets;
    const sections = Object.entries(cdata)
      .filter(([key]) => key.startsWith('section'));

    sections.forEach(([sectionKey, balances]) => {
      const symbol = sectionKey.replace(/^section/, '');
      balances.forEach((balance, idx) => {
        if (!sectionMap[symbol]) sectionMap[symbol] = [];
        sectionMap[symbol].push({
          address: wallets[idx],
          formattedBalance: balance
        });
      });
    });
  }

  return sectionMap;
}

