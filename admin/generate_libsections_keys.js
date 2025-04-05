#!/usr/bin/env node

/**
 * generate_libsections_keys.js
 *
 * GENERATED FILE — DO NOT EDIT BY HAND
 * Replaces section key block in libSections.js using section-config.js
 *
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 */

const fs = require('fs');
const path = require('path');
const config = require('./section-config');

const FILE_PATH = path.resolve(__dirname, '../lib/libSections.js');
const OUT_PATH = path.resolve(__dirname, '../lib/libSections.generated.js');

const startTag = '// ==== GENERATED SECTIONS START ====';
const endTag = '// ==== GENERATED SECTIONS END ====';

// Section keys from config
const sectionKeys = config.sections.map(s => s.key);

// Grouped import block (8 per line)
function formatGrouped(keys) {
  const lines = [];
  for (let i = 0; i < keys.length; i += 8) {
    const slice = keys.slice(i, i + 8).map(k => `SEC_${k}`);
    lines.push('  ' + slice.join(', '));
  }
  return lines.join(',\n');
}

const importBlock = `const {\n${formatGrouped(sectionKeys)}\n} = require('../shared/constants');`;

const keysBlock = `const sectionKeys = [\n  ${sectionKeys.map(k => `SEC_${k}`).join(', ')}\n];`;

// dont close the constructor, not the class
const constructorBlock = `class Sections {
  constructor(network, full = false, formatOutput = false) {

    this.full = full;
    this.formatOutput = formatOutput;
    this.networkMap = new Map([
      [Web3.VTRU, network.get(Web3.VTRU)],
      [Web3.BSC,  network.get(Web3.BSC)],
      [Web3.ETH,  network.get(Web3.ETH)],
      [Web3.POL,  network.get(Web3.POL)],
      [Web3.ARB,  network.get(Web3.ARB)],
      [Web3.OPT,  network.get(Web3.OPT)],
      [Web3.BASE, network.get(Web3.BASE)],
      [Web3.AVAX, network.get(Web3.AVAX)],
      [Web3.SOL,  network.get(Web3.SOL)],
      [Web3.TEZ,  network.get(Web3.TEZ)],
    ]);
  `;

const generatedBlock = `${startTag}
${importBlock}

${keysBlock}

${constructorBlock}
// ${endTag}`;

// Inject into file
const content = fs.readFileSync(FILE_PATH, 'utf8');
const pattern = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, 'gm');
const updated = content.replace(pattern, generatedBlock);

fs.writeFileSync(OUT_PATH, updated);
console.log(`✅ libSections.generated.js written → ${OUT_PATH}`);
