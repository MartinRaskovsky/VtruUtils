'use client';

/**
 * Author: Dr Martín Raskovsky
 * Date: April 2025
 *
 * This page renders the full VaWa dashboard for a test vault,
 * showing both the Summary section and per-group detailed sections.
 *
 * It now supports multiple chains (EVM, SOL, TEZ) using the extracted
 * logic from `extractSectionGroups.js`, ensuring future maintainability.
 *
 * Educational Note:
 * Rather than mutate `sampleWallets` to attach `sectionToNetwork`,
 * we explicitly pass it to each <SectionGroup />. This keeps components
 * pure, self-contained, and testable. It also aligns with how we treat
 * live rendering in <SectionRenderer /> — consistency prevents confusion.
 */

import React from 'react';
import VaWaDashboardLayout from '../../components/VaWaDashboardLayout';
import SectionGroup from '../../components/SectionGroup';
import SummaryTable from '../../components/SummaryTable';
import extractSectionGroups from '../../lib/extractSectionGroups';
import sampleWallets from '../../../data/sample-wallets.json';
import { chainList } from '../../lib/libDefs'; // ✅ Now pulled from generated source

export default function TestDashboardPage() {
  const { groups: sectionGroups, sectionToNetwork } = extractSectionGroups(sampleWallets, chainList);

  const count = sampleWallets.wallets.length;
  const addresses = count === 1 ? 'address' : 'addresses';

  return (
    <VaWaDashboardLayout>
      <h2 className="table-title">
        {sampleWallets.name}
        <br />
        Analysed {count} {addresses}
      </h2>

      <SummaryTable data={sampleWallets} />

      {sectionGroups.map((group, idx) => (
        <SectionGroup
          key={idx}
          {...group}
          data={sampleWallets}
          sectionToNetwork={sectionToNetwork} // ✅ Explicit prop for per-chain mapping
        />
      ))}
    </VaWaDashboardLayout>
  );
}

