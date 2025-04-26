// src/next/components/SummaryTable.jsx

/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * Displays a summary of totals per section across all chains (EVM, Solana, Tezos).
 * 
 * This module is used by the dashboard page (`page.jsx`) to render a "Summary" table
 * showing totals for each defined group (e.g., Native Coins, ETH Bridged, USDC).
 *
 * It uses the `sectionSummaryConfig.js` grouping, matches section titles to totals,
 * and pulls totals from each chain independently using the canonical `chainList` 
 * imported from `libDefs.js`. This ensures that chains can evolve independently
 * without disrupting summary logic.
 *
 * Each section title is checked in all chains until found, and its total value is shown.
 * The assumption is that a section (e.g., "USDC on Solana") belongs to exactly one chain.
 * 
 * NEW: Adds icon markers before each section title, using sectionToNetwork mapping.
 */

'use client';

import React from 'react';
import sectionSummaryConfig from '../config/sectionSummaryConfig';
import { chainList, getChainMarker } from '../lib/libDefs';

/**
 * Renders the top-level summary based on section grouping,
 * collecting totals from all supported chains.
 *
 * @param {Object} props
 * @param {Object} props.data - Full JSON data with per-chain totals and sectionToNetwork
 */
export default function SummaryTable({ data }) {
  if (!data) return null;

  return (
    <>
      <div className="section-title">Summary</div>
      <div className="table-wrapper">
        <table className="summary-table">
          <tbody>
            {sectionSummaryConfig.map((group, idx) => {
              const rows = group.sections.map(sectionTitle => {
                for (const chain of chainList) {
                  const cdata = data[chain];
                  if (!cdata || !cdata.sectionTitles) continue;

                  const index = cdata.sectionTitles.indexOf(sectionTitle);
                  if (index === -1) continue;

                  const totalKey = cdata.totalKeys?.[index];
                  const value = cdata[totalKey] || '0.00';
                  const totalDiff = cdata.__diff_totals?.[index] || '';

                  const networkKey = cdata.networkKeys?.[index];
                  const marker = getChainMarker(networkKey);

                  return (
                    <tr className="total-row" key={sectionTitle}>
                      <td>
                        <span dangerouslySetInnerHTML={{ __html: marker }} />{' '}
                        <a href={`#${sectionTitle}`}>{sectionTitle}</a>
                      </td>
                      <td className="diff-cell">
                        <span dangerouslySetInnerHTML={{ __html: totalDiff || '&nbsp;' }} />
                      </td>
                      <td className="balance-cell decimal-align">{value}</td>
                    </tr>
                  );
                }
                return null;
              });

              if (!rows.some(Boolean)) return null;

              return (
                <React.Fragment key={group.name}>
                  <tr className="summary-section">
                    <td colSpan={3}><a href={`#${group.name}`}>{group.name}</a></td>
                  </tr>
                  {rows}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
