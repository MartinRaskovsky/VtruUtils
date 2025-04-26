/**
 * Author: Dr Martín Raskovsky
 * Date: April 2025
 *
 * Updated: April 2025
 * 
 * Also extracts diffs and total diffs alongside sections.
 * 
 * NOTE: Section diffs are stored as arrays indexed by wallet position, not by wallet address.
 * This design assumes wallet ordering consistency during section extraction.
 */

import sectionSummaryConfig from '../config/sectionSummaryConfig';

/**
 * Extracts grouped section data from multiple chains (evm, sol, tez).
 *
 * @param {object} data - Full dataset including data.evm, data.sol, etc.
 * @param {Array} chainList - List of supported chain keys (e.g., ['evm', 'sol', 'tez'])
 * @returns {object} - { groups, sectionToNetwork }
 */
export default function extractSectionGroups(data, chainList) {
  const sectionToNetwork = {};
  const groups = [];

  for (const group of sectionSummaryConfig) {
    const sections = [];

    for (const chain of chainList) {
      const cdata = data[chain];
      if (!cdata || !cdata.sectionTitles) continue;

      const wallets = cdata.wallets || [];

      for (const title of group.sections) {
        const index = cdata.sectionTitles.indexOf(title);
        if (index === -1) continue;

        const sectionKey = cdata.sectionKeys[index];
        const rawValues = cdata[sectionKey] || [];
        const total = cdata[cdata.totalKeys[index]] || '0';

        const entries = rawValues.map((value, i) => ({
          address: wallets[i],
          value
        }));

        const diffs = cdata.__diffs?.[sectionKey] || {};
        const totalDiff = cdata.__diff_totals?.[index] || '';

        sections.push({ 
          sectionKey, 
          label: title, 
          entries, 
          total,
          diffs,        // 🎯 ADDED
          totalDiff     // 🎯 ADDED
        });

        sectionToNetwork[sectionKey] = cdata.networkKeys?.[index] || 'UNKNOWN';
      }
    }

    if (sections.length > 0) {
      groups.push({ title: group.name, sections });
    }
  }

  return { groups, sectionToNetwork };
}

