'use client';

/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * Temporary test page to visualize SectionBlock.jsx standalone.
 * Allows easy layout and rendering tests inside the Next.js app.
 */

import React from 'react';
import SectionBlock from '../../components/SectionBlock';
import { getChainMarker } from '../../lib/libDefs';

// Fake test data
const sampleEntries = [
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    value: '100.00',
    diff: '<span class="diff-cell increase">(+10.00)</span>',
  },
  {
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    value: '250.50',
    diff: '<span class="diff-cell decrease">(-5.25)</span>',
  },
];

const testSection = {
  label: 'Test Token',
  sectionKey: 'testtoken',
  entries: sampleEntries,
  total: '350.50',
  vault: '0x9876543210abcdef9876543210abcdef98765432',
  networkKey: 'ETH', // Any known network key you have
};

export default function TestSectionBlockPage() {
  return (
    <div className="rendered-page" id="rendered-page">
      <div id="main-wrapper">
        <div className="logo-container">
          <img src="/images/logo.png" alt="VaWa Logo" className="vawa-logo" />
          <span className="version-text">Test Mode</span>
        </div>

        <div id="header">
          <button className="header-btn" onClick={() => window.history.back()}>Back</button>
          <h1>Test SectionBlock</h1>
        </div>

        <div id="content">
          <div className="table-container">
            <SectionBlock {...testSection} />
          </div>
        </div>
      </div>
    </div>
  );
}

