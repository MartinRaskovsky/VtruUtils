#!/usr/bin/env node

/**
 * generate_defs.js
 *
 * Injects config-based defs into:
 *   - Perl: src/perl-lib/Defs.generated.pm
 *   - JS:   src/next/lib/libDefs.generated.js
 *
 * Only replaces bracketed regions:
 *   - # ==== GENERATED PERL DEFS START ==== ... END
 *   - // ==== GENERATED JS DEFS START ==== ... END
 *
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 */

const fs = require("fs");
const path = require("path");
const config = require("./section-config");

// ─────────────────────────────────────────────────────────────
// Paths
// ─────────────────────────────────────────────────────────────
const PERL_PATH = path.resolve(__dirname, "../perl-lib/Defs.pm");
const PERL_OUT = path.resolve(__dirname, "../perl-lib/Defs.generated.pm");

const JS_PATH = path.resolve(__dirname, "../next/lib/libDefs.js");
const JS_OUT = path.resolve(__dirname, "../next/lib/libDefs.generated.js");

const PERL_TAG_START = "# ==== GENERATED PERL DEFS START ====";
const PERL_TAG_END = "# ==== GENERATED PERL DEFS END ====";
const JS_TAG_START = "// ==== GENERATED JS DEFS START ====";
const JS_TAG_END = "// ==== GENERATED JS DEFS END ====";

// ─────────────────────────────────────────────────────────────
// Derived Data
// ─────────────────────────────────────────────────────────────
const allTypes = Object.entries(config.detailType || {});
const scriptTypes = [...new Set(allTypes.map(([_, script]) => script))];

const netToChain = {
  VTRU: "EVM", ETH: "EVM", BSC: "EVM", POL: "EVM", ARB: "EVM",
  OPT: "EVM", BASE: "EVM", AVAX: "EVM", SOL: "SOL", TEZ: "TEZ"
};

const brandingColors = {
  BSC: ["#F3BA2F", "bsc.png", "🟡"],
  ETH: ["#627EEA", "eth.png", "💠"],
  VTRU: ["#8247E5", "vtru.png", "🟣"],
  POL: ["#282A36", "pol.png", "🔗"],
  SOL: ["#9945FF", "sol.png", "🌿"],
  TEZ: ["#2C7DF7", "tez.png", "🔷"],
  ARB: ["#28A0F0", "arb.png", "🧊"],
  OPT: ["#FF0420", "opt.png", "🚀"],
  BASE: ["#0052FF", "base.png", "🌀"],
  AVAX: ["#E84142", "avax.png", "⛰️"]
};

// ─────────────────────────────────────────────────────────────
// Perl Block
// ─────────────────────────────────────────────────────────────
const perlBlock = [
  PERL_TAG_START,
  "# Define script mapping",
  "my %script_map = (",
  ...scriptTypes.map(s => `    '${s}' => 'getDetail${s.charAt(0).toUpperCase() + s.slice(1)}.js',`),
  "    'sections' => 'getSections.js',",
  ");",
  "",
  "# Define detail type mapping",
  "my %detail_type_map = (",
  ...allTypes.map(([key, type]) => {
    const label = config.sections.find(s => s.key === key)?.label;
    return label ? `    "${label}" => "${type}",` : null;
  }).filter(Boolean),
  ");",
  "",
  "# Define grouppers type",
  "my %group_type_map = (",
  ...Object.keys(config.hasGroups || {}).map(key => {
    const label = config.sections.find(s => s.key === key)?.label;
    return label ? `    "${label}" => 1,` : null;
  }).filter(Boolean),
  ");",
  "",
  "# Define explorers mapping",
  "my %explorers = (",
  ...Object.keys(netToChain).map(net => {
    let url;
    switch (net) {
      case "ETH": url = "https://etherscan.io/address/"; break;
      case "BSC": url = "https://bscscan.com/address/"; break;
      case "POL": url = "https://polygonscan.com/address/"; break;
      case "SOL": url = "https://explorer.solana.com/address/"; break;
      case "TEZ": url = "https://tzkt.io/"; break;
      case "ARB": url = "https://arbiscan.io/address/"; break;
      case "OPT": url = "https://optimistic.etherscan.io/address/"; break;
      case "BASE": url = "https://basescan.org/address/"; break;
      case "AVAX": url = "https://snowtrace.io/address/"; break;
      case "VTRU": url = "https://explorer.vitruveo.xyz/address/"; break;
      default: url = "https://example.com/address/";
    }
    return `    '${net}' => "${url}",`;
  }),
  ");",
  "",
  "my @chains = (",
  '    "EVM",',
  '    "SOL",',
  '    "TEZ"',
  ");",
  "",
  "my %net_to_chain = (",
  ...Object.entries(netToChain).map(([net, chain]) => `    '${net}' => "${chain}",`),
  ");",
  "",
  "# Define network branding color",
  "my %branding = (",
  ...Object.entries(brandingColors).map(([net, [color, icon, emoji]]) => [
    `    '${net}' => {`,
    `        color => "${color}",`,
    `        icon  => "${icon}",`,
    `        emoji => '${emoji}',`,
    "    },"
  ].join("\n")),
  ");",
  PERL_TAG_END
].join("\n");

// ─────────────────────────────────────────────────────────────
// JS Block
// ─────────────────────────────────────────────────────────────
const scriptMap = {};
scriptTypes.forEach(s => {
  scriptMap[s] = `getDetail${s.charAt(0).toUpperCase() + s.slice(1)}.js`;
});
scriptMap.sections = "getSections.js";

const detailTypeMap = {};
allTypes.forEach(([key, script]) => {
  const label = config.sections.find(s => s.key === key)?.label;
  if (label) detailTypeMap[label] = script;
});

const groupTypeMap = {};
Object.keys(config.hasGroups || {}).forEach(key => {
  const label = config.sections.find(s => s.key === key)?.label;
  if (label) groupTypeMap[label] = true;
});
const groupTypeByType = {};
Object.entries(detailTypeMap).forEach(([label, type]) => {
  groupTypeByType[type] = !!groupTypeMap[label];
});

const explorers = {};
Object.keys(netToChain).forEach(net => {
  switch (net) {
    case "ETH": explorers[net] = "https://etherscan.io/address/"; break;
    case "BSC": explorers[net] = "https://bscscan.com/address/"; break;
    case "POL": explorers[net] = "https://polygonscan.com/address/"; break;
    case "SOL": explorers[net] = "https://explorer.solana.com/address/"; break;
    case "TEZ": explorers[net] = "https://tzkt.io/"; break;
    case "ARB": explorers[net] = "https://arbiscan.io/address/"; break;
    case "OPT": explorers[net] = "https://optimistic.etherscan.io/address/"; break;
    case "BASE": explorers[net] = "https://basescan.org/address/"; break;
    case "AVAX": explorers[net] = "https://snowtrace.io/address/"; break;
    case "VTRU": explorers[net] = "https://explorer.vitruveo.xyz/address/"; break;
    default: explorers[net] = "https://example.com/address/";
  }
}

);

const branding = {};
Object.entries(brandingColors).forEach(([net, [color, icon, emoji]]) => {
  branding[net] = { color, icon, emoji };
});

const jsBlock = [
  JS_TAG_START,
  "",
  `export const scriptMap = ${JSON.stringify(scriptMap, null, 2)};`,
  `export const detailTypeMap = ${JSON.stringify(detailTypeMap, null, 2)};`,
  `export const groupTypeMap = ${JSON.stringify(groupTypeMap, null, 2)};`,
  `export const groupTypeByType = ${JSON.stringify(groupTypeByType, null, 2)};`,
  `export const explorers = ${JSON.stringify(explorers, null, 2)};`,
  `export const netToChain = ${JSON.stringify(netToChain, null, 2)};`,
  `export const branding = ${JSON.stringify(branding, null, 2)};`,
  `export const chainList = ["evm", "sol", "tez"];`,
  "",
  JS_TAG_END
].join("\n");

// ─────────────────────────────────────────────────────────────
// Inject into source files
// ─────────────────────────────────────────────────────────────
function injectAndWrite(inputPath, outputPath, tagStart, tagEnd, block) {
  const input = fs.readFileSync(inputPath, "utf8");
  const updated = input.replace(
    new RegExp(`${tagStart}[\\s\\S]*?${tagEnd}`, "g"),
    block
  );
  fs.writeFileSync(outputPath, updated);
  console.log(`✅ generate_defs.js written → ${outputPath}`);
}

injectAndWrite(PERL_PATH, PERL_OUT, PERL_TAG_START, PERL_TAG_END, perlBlock);
injectAndWrite(JS_PATH, JS_OUT, JS_TAG_START, JS_TAG_END, jsBlock);

