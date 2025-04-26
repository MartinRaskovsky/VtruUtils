/*
 * Author: Dr Martín Raskovsky
 * Date: April 2025
 *
 * This SectionRenderer component acts as a top-level orchestrator for rendering the full dashboard in the React/Next.js version of the VaWa app.
 *
 * It handles:
 *   - Title generation
 *   - Invoking extractSectionGroups, which compiles sectionSummaryConfig into renderable groups
 *   - Injecting sectionToNetwork so that subcomponents like SectionBlock can attach icons and links
 *   - Rendering both SummaryTable and grouped sections
 *
 * This version no longer handles wallet name caching; that is now preloaded upstream in DashboardWithNames.
 */

import React from 'react';
import SectionGroup from './SectionGroup';
import SummaryTable from './SummaryTable';
import extractSectionGroups from '../lib/extractSectionGroups';
import { chainList } from '../lib/libDefs';

/**
 * Renders the full dashboard: summary + all grouped sections.
 * @param {object} props.data - Parsed JSON vault data
 */
export default function SectionRenderer({ data }) {
  const name = data.name || 'Vault';
  const wallets = data.wallets || [];
  const count = wallets.length;
  const title = `${name}`;

  if (count === 0) {
    return <p style={{ textAlign: 'center' }}>No wallet data available.</p>;
  }

  const { groups, sectionToNetwork } = extractSectionGroups(data, chainList);

  return (
    <>
      <h2 className="table-title">
        {title}
        <br />Analysed {count} address{count === 1 ? '' : 'es'}
      </h2>
      <SummaryTable data={data} />
      <div className="table-container">
        {groups.map((group, index) => (
          <SectionGroup 
            key={index}
            title={group.title} 
            sections={group.sections} 
            data={data} 
            sectionToNetwork={sectionToNetwork} 
          />
        ))}
      </div>
    </>
  );
}

