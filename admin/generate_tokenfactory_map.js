#!/usr/bin/env node

/**
 * generate_tokenfactory_map.js
 * 
 * Generates the TokenFactory map section based on section-config.js
 * Intended to be run from src/admin using `make`
 *
 * WARNING: This file is generated automatically. Do not edit by hand.
 *
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 */

const fs = require("fs");
const path = require("path");
const { sections } = require("./section-config");

const origPath = path.join(__dirname, "../lib/TokenFactory.js");
const outPath = path.join(__dirname, "../lib/TokenFactory.generated.js");

const original = fs.readFileSync(origPath, "utf-8");

const START_MARKER = "// ==== GENERATED SECTION MAP START ====";
const END_MARKER = "// ==== GENERATED SECTION MAP END ====\n";

const before = original.split(START_MARKER)[0];
const after = original.split(END_MARKER)[1];

const importLines = ["const {"];
const nets = new Set();
const consts = new Set();

const lines = ["const sectionMap = new Map(["];

for (const s of sections) {
  const key = `SEC_${s.key}`;
  const net = `NET_${s.network}`;
  consts.add(key);
  nets.add(net);

  const line = `  [${key}, { Class: ${s.className}, contractId: '${s.contractId}', web3Id: Web3.${s.network}, network: ${net}, digits: ${s.digits}, format: ${s.format}, formats: ${s.format.replace('Number', 'Numbers')} }],`;
  lines.push(line);
}

lines.push("]);");
importLines.push(...Array.from(consts).map(c => `  ${c},`));
importLines.push(...Array.from(nets).map(n => `  ${n},`));
importLines.push("} = require('../shared/constants');");

const generatedBlock = [
  START_MARKER,
  ...importLines,
  "",
  ...lines,
  END_MARKER
];

const output = [
  before.trimEnd(),
  generatedBlock.join("\n"),
  after.trimStart()
];

fs.writeFileSync(outPath, output.join("\n"), "utf-8");
console.log(`✅ TokenFactory.generated.js written → ${outPath}`);

