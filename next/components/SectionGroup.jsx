'use client';

/**
 * Author: Dr Martín Raskovsky
 * Date: April 2025
 *
 * SectionGroup.jsx
 *
 * Renders multiple SectionBlocks inside a group.
 * Distributes them into left/right columns based on row balancing.
 */

import React from 'react';
import SectionBlock from './SectionBlock';

/**
 * @param {string} title - Group name (e.g., "Native Coins")
 * @param {Array} sections - Array of section block objects
 * @param {object} data - Full vault JSON (with diffs inside __diffs)
 * @param {object} sectionToNetwork - Map of sectionKey → networkKey
 */
export default function SectionGroup({ title, sections, data, sectionToNetwork = {} }) {
  if (!sections || sections.length === 0) return null;
  const vault = data?.address || '';

  const left = [], right = [];
  let leftCount = 0, rightCount = 0;
  let top = 0, bottom = sections.length - 1;

  while (top <= bottom) {
    if (leftCount <= rightCount) {
      const block = sections[top++];
      const rows = (block.entries?.length || 0) + 2;
      left.push(block);
      leftCount += rows;
    } else {
      const block = sections[bottom--];
      const rows = (block.entries?.length || 0) + 2;
      right.push(block);
      rightCount += rows;
    }
  }

  return (
    <div className="table-container">
      <div className="section-title" id={title}>{title}</div>
      <div className="section-container">
        <div className="section-column">
          {left.map((block, i) => (
            <SectionBlock
              key={`left-${i}`}
              {...block}
              vault={vault}
              networkKey={sectionToNetwork[block.sectionKey] || 'UNKNOWN'}
              diffs={block.diffs}
              totalDiff={block.totalDiff}
            />
          ))}
        </div>
        <div className="section-column">
          {right.map((block, i) => (
            <SectionBlock
              key={`right-${i}`}
              {...block}
              vault={vault}
              networkKey={sectionToNetwork[block.sectionKey] || 'UNKNOWN'}
              diffs={block.diffs}
              totalDiff={block.totalDiff}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

