#!/usr/bin/env node

/**
 * generate_contract_map_for_next.js
 *
 * Generates: src/next/generated/contractMap.generated.js
 * Maps section keys to contractId, network, resolved address, and isNative flag.
 *
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 */

const fs = require("fs");
const path = require("path");
const config = require("./section-config");

const OUTPUT_PATH = path.resolve(__dirname, "../next/generated/contractMap.generated.js");
const DATA_PATH = path.resolve(__dirname, "../data");

const START_TAG = "// ==== GENERATED CONTRACT MAP START ====";
const END_TAG = "// ==== GENERATED CONTRACT MAP END ====";

// Load all available contract files
function loadJson(filename) {
  const fullPath = path.join(DATA_PATH, filename);
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (e) {
    console.warn(`⚠️ Failed to load ${filename}: ${e.message}`);
    return {};
  }
}

const evm = loadJson("evm-contracts.json").contracts || {};
const vtru = loadJson("vtru-contracts.json").mainnet || {};
const sol = loadJson("sol-contracts.json") || {};
const tez = loadJson("tez-contracts.json") || {};
const bsc = loadJson("bsc-contracts.json").contracts?.["BNB Chain"] || {};
const pol = loadJson("pol-contracts.json").contracts?.["Polygon"] || {};
const eth = loadJson("eth-contracts.json").contracts?.["Ethereum"] || {};
const avax = loadJson("evm-contracts.json").contracts?.["Avalanche"] || {};
const opt = loadJson("evm-contracts.json").contracts?.["Optimism"] || {};
const base = loadJson("evm-contracts.json").contracts?.["Base"] || {};
const arb = loadJson("evm-contracts.json").contracts?.["Arbitrum"] || {};

// Normalize into one map: { network -> { contractId -> address } }
const addressMap = {
  VTRU: vtru,
  SOL: sol,
  TEZ: tez,
  BSC: bsc,
  POL: pol,
  ETH: eth,
  AVAX: avax,
  OPT: opt,
  BASE: base,
  ARB: arb,
};

// Render each section key → full metadata
const lines = [];
lines.push(`${START_TAG}`);
lines.push(`export const contractMap = {`);

for (const section of config.sections) {
  const { key, contractId, network, group } = section;
  const isNative = group === "Native Coins";

  if (!contractId || !network) continue;

  const contracts = addressMap[network];
  let address = contracts?.[contractId] || null;

  if (address && typeof address !== "string") {
    console.warn(`⚠️ Unexpected format for ${contractId} on ${network}`);
    address = null;
  }

  const safeAddress = address ? `"${address}"` : "null";
  const nativeFlag = isNative ? "true" : "false";

  lines.push(`  ${JSON.stringify(key)}: { contractId: ${JSON.stringify(contractId)}, network: ${JSON.stringify(network)}, address: ${safeAddress}, isNative: ${isNative} },`);
}

lines.push(`};`);
lines.push(`${END_TAG}`);
lines.push("");

// Ensure directory exists
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, lines.join("\n"));
console.log(`✅ contractMap.generated.js written → ${OUTPUT_PATH}`);

