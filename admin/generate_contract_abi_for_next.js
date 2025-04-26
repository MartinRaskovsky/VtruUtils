#!/usr/bin/env node

/**
 * generate_contract_abis_for_next.js
 *
 * Generates: src/next/generated/contractAbis.generated.js
 * Extracts the ABI for each token defined in section-config.js
 * using the correct contractId and network mapping.
 *
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 */

const fs = require("fs");
const path = require("path");
const config = require("./section-config");

const OUTPUT_PATH = path.resolve(__dirname, "../next/generated/contractAbis.generated.js");
const DATA_PATH = path.resolve(__dirname, "../data");

const START_TAG = "// ==== GENERATED CONTRACT ABIS START ====";
const END_TAG = "// ==== GENERATED CONTRACT ABIS END ====";

function loadJson(filename) {
  const fullPath = path.join(DATA_PATH, filename);
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (e) {
    console.warn(`⚠️ Failed to load ${filename}: ${e.message}`);
    return {};
  }
}

// Load all relevant contract sources
const sources = {
  VTRU: loadJson("vtru-contracts.json"),
  SOL: loadJson("sol-contracts.json"),
  TEZ: loadJson("tez-contracts.json"),
  BSC: loadJson("bsc-contracts.json"),
  POL: loadJson("pol-contracts.json"),
  ETH: loadJson("eth-contracts.json"),
  AVAX: loadJson("evm-contracts.json"), // fallback
  OPT: loadJson("evm-contracts.json"),
  BASE: loadJson("evm-contracts.json"),
  ARB: loadJson("evm-contracts.json")
};

const abis = {};
for (const section of config.sections) {
  const { key, contractId, network } = section;
  if (!contractId || !network) continue;

  const contracts = sources[network];
  if (!contracts) {
    console.warn(`⚠️ No source file for ${network}`);
    continue;
  }

  let abi = null;

  if (contracts.abi?.[contractId]) {
    abi = contracts.abi[contractId];
  } else if (Array.isArray(contracts?.[contractId])) {
    abi = contracts[contractId]; // fallback legacy format
  }

  if (abi) {
    abis[key] = abi;
  } else {
    console.warn(`⚠️ ABI not found for ${key} → ${contractId} on ${network}`);
  }
}

// Write output file
const lines = [];
lines.push(`${START_TAG}`);
lines.push(`export const contractAbis = ${JSON.stringify(abis, null, 2)};`);
lines.push(`${END_TAG}`);
lines.push("");

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, lines.join("\n"));
console.log(`✅ contractAbis.generated.js written → ${OUTPUT_PATH}`);

