#!/usr/bin/env node

/**
 * generate_perl_defs.js
 *
 * Injects Perl defs into Defs.pm from section-config.js
 * Replaces the block between # ==== GENERATED PERL DEFS START ==== and END
 *
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 */

const fs = require("fs");
const path = require("path");
const config = require("./section-config");

const FILE_PATH = path.resolve(__dirname, "../perl-lib/Defs.pm");
const OUT_PATH = path.resolve(__dirname, "../perl-lib/Defs.generated.pm");

const startTag = "# ==== GENERATED PERL DEFS START ====";
const endTag = "# ==== GENERATED PERL DEFS END ====";

// --- Script map ---
const allTypes = Object.entries(config.detailType || {});
const scriptTypes = [...new Set(allTypes.map(([_, script]) => script))];
const scriptMapLines = [`# Define script mapping`, "my %script_map = ("];
scriptTypes.forEach(type => {
  const filename = `getDetail${type.charAt(0).toUpperCase() + type.slice(1)}.js`;
  scriptMapLines.push(`    '${type}' => '${filename}',`);
});
scriptMapLines.push("    'sections' => 'getSections.js',");
scriptMapLines.push(");");

// --- Detail type map ---
const detailTypeLines = [`# Define detail type mapping`, "my %detail_type_map = ("];
allTypes.forEach(([sectionKey, script]) => {
  const label = config.sections.find(s => s.key === sectionKey)?.label;
  if (label) detailTypeLines.push(`    "${label}" => "${script}",`);
});
detailTypeLines.push(");");

// --- Group type map ---
const groupTypeLines = [`# Define grouppers type`, "my %group_type_map = ("];
Object.keys(config.hasGroups || {}).forEach(sectionKey => {
  const label = config.sections.find(s => s.key === sectionKey)?.label;
  if (label) groupTypeLines.push(`    "${label}" => 1,`);
});
groupTypeLines.push(");");

// --- Explorers ---
const explorerLines = [`# Define explorers mapping`, "my %explorers = ("];
Object.entries(config.networks || {}).forEach(([net, label]) => {
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
  explorerLines.push(`    '${net}' => "${url}",`);
});
explorerLines.push(");");

// --- Chains ---
const chainsLines = [
  "my @chains = (",
  '    "EVM",',
  '    "SOL",',
  '    "TEZ"',
  ");",
  "",
  "my %net_to_chain = ("
];
const netToChain = {
  VTRU: "EVM", ETH: "EVM", BSC: "EVM", POL: "EVM", ARB: "EVM",
  OPT: "EVM", BASE: "EVM", AVAX: "EVM", SOL: "SOL", TEZ: "TEZ"
};
Object.entries(netToChain).forEach(([net, chain]) => {
  chainsLines.push(`    '${net}' => "${chain}",`);
});
chainsLines.push(");");

// --- Branding ---
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

const brandingLines = ["# Define network branding color", "my %branding = ("];
Object.entries(brandingColors).forEach(([net, [color, icon, emoji]]) => {
  brandingLines.push(`    '${net}' => {`);
  brandingLines.push(`        color => "${color}",`);
  brandingLines.push(`        icon  => "${icon}",`);
  brandingLines.push(`        emoji => '${emoji}',`);
  brandingLines.push("    },");
});
brandingLines.push(");");

const generated = [
  startTag,
  ...scriptMapLines,
  "",
  ...detailTypeLines,
  "",
  ...groupTypeLines,
  "",
  ...explorerLines,
  "",
  ...chainsLines,
  "",
  ...brandingLines,
  endTag
].join("\n");

// Inject into file
const original = fs.readFileSync(FILE_PATH, "utf8");
const updated = original.replace(
  new RegExp(`${startTag}[\\s\\S]*?${endTag}`, "g"),
  generated
);

fs.writeFileSync(OUT_PATH, updated);
console.log(`✅ Defs.generated.pm written → ${OUT_PATH}`);
