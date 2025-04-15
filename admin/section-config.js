#!/usr/bin/env node

/**
 * section-config.js
 *
 * Central source of truth for section constants, mappings, and metadata.
 * Used by generator scripts to build constants.js and TokenFactory.
 *
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 */

const networks = {
  VTRU: "Vitruveo",
  ETH: "Ethereum",
  BSC: "BNB Chain",
  POL: "Polygon",
  SOL: "Solana",
  TEZ: "Tezos",
  ARB: "Arbitrum",
  OPT: "Optimism",
  BASE: "Base",
  AVAX: "Avalanche"
};

const netToChain = {
  VTRU: 'EVM', ETH: 'EVM', BSC: 'EVM', POL: 'EVM',
  ARB: 'EVM', OPT: 'EVM', BASE: 'EVM', AVAX: 'EVM',
  SOL: 'SOL', TEZ: 'TEZ'
};

function isInChain(network, chainType) {
  return netToChain[network] === chainType;
};

const sections = [
  // Native Coins
  { key: "VTRU",     label: "VTRU",            className: "TokenWallet", contractId: "VTRU", network: "VTRU", digits: 2, format: "formatRawNumber", group: "Native Coins" },
  { key: "ETH",      label: "ETH",             className: "TokenWallet", contractId: "ETH",  network: "ETH",  digits: 2, format: "formatRawNumber", group: "Native Coins" },
  { key: "AVAX",     label: "AVAX",            className: "TokenWallet", contractId: "AVAX", network: "AVAX", digits: 2, format: "formatRawNumber", group: "Native Coins" },
  { key: "BNB", label: "BNB", className: "TokenWallet", contractId: "BNB", network: "BSC", digits: 2, format: "formatRawNumber", group: "Native Coins" },
  // POL is the native coin on Polygon. Formerly known as MATIC.
  { key: "POL", label: "POL", className: "TokenWallet", contractId: "POL", network: "POL", digits: 2, format: "formatRawNumber", group: "Native Coins" },
  { key: "SOL", label: "SOL", className: "TokenWalletSol", contractId: "SOL", network: "SOL", digits: 2, format: "formatSolNumber", group: "Native Coins" },
  { key: "TEZ", label: "TEZ", className: "TokenWallet", contractId: "TEZ", network: "TEZ", digits: 2, format: "formatVusdNumber", group: "Native Coins" },

    // ETH Bridged
  { key: "ETH_ARB",  label: "ETH on Arbitrum", className: "TokenWallet", contractId: "ETH",  network: "ARB",  digits: 2, format: "formatRawNumber", group: "ETH Bridged" },
  { key: "ETH_OPT",  label: "ETH on Optimism", className: "TokenWallet", contractId: "ETH",  network: "OPT",  digits: 2, format: "formatRawNumber", group: "ETH Bridged" },
  { key: "ETH_BASE", label: "ETH on Base",     className: "TokenWallet", contractId: "ETH",  network: "BASE", digits: 2, format: "formatRawNumber", group: "ETH Bridged" },
  
  // VTRU Bridged
  { key: "VTRU_ETH", label: "VTRU on Ethereum", className: "CommonEvmClass", contractId: "VTRU", network: "ETH", digits: 2, format: "formatRawNumber", group: "VTRU Bridged" },
  { key: "VTRU_BSC", label: "VTRU on BNB Chain", className: "CommonEvmClass", contractId: "VTRU", network: "BSC", digits: 2, format: "formatRawNumber", group: "VTRU Bridged" },

  // USDC
  { key: "USDC_VTRU", label: "USDC on VTRU(USDC.pol)", className: "CommonEvmClass", contractId: "USDC", network: "VTRU", digits: 2, format: "formatVusdNumber", group: "USDC" },
  { key: "USDC_ETH", label: "USDC on Ethereum", className: "TokenUsdcClass", contractId: "USDC", network: "ETH", digits: 2, format: "formatVusdNumber", group: "USDC" },
  { key: "USDC_BSC", label: "USDC on BNB Chain", className: "TokenUsdcClass", contractId: "USDC", network: "BSC", digits: 2, format: "formatRawNumber", group: "USDC" },
  { key: "USDC_POL", label: "USDC on Polygon", className: "TokenUsdcClass", contractId: "USDC", network: "POL", digits: 2, format: "formatVusdNumber", group: "USDC" },
  { key: "USDC_SOL", label: "USDC on Solana", className: "TokenUsdcSol", contractId: "USDC", network: "SOL", digits: 2, format: "formatVusdNumber", group: "USDC" },
  { key: "USDC_ARB", label: "USDC on Arbitrum", className: "TokenUsdcClass", contractId: "USDC", network: "ARB", digits: 2, format: "formatVusdNumber", group: "USDC" },
  { key: "USDC_OPT", label: "USDC on Optimism", className: "TokenUsdcClass", contractId: "USDC", network: "OPT", digits: 2, format: "formatVusdNumber", group: "USDC" },
  { key: "USDC_BASE", label: "USDC on Base", className: "TokenUsdcBase", contractId: "USDC", network: "BASE", digits: 2, format: "formatVusdNegNumber", group: "USDC" },
  { key: "USDC_AVAX", label: "USDC on Avalanche", className: "TokenUsdcClass", contractId: "USDC", network: "AVAX", digits: 2, format: "formatVusdNumber", group: "USDC" },

    // USDT
    { key: "USDT_ETH",   label: "USDT on Ethereum",  className: "TokenUsdt", contractId: "USDT", network: "ETH",   digits: 2, format: "formatVusdNumber", group: "USDT" },
    { key: "USDT_POL",   label: "USDT on Polygon",   className: "TokenUsdt", contractId: "USDT", network: "POL",   digits: 2, format: "formatVusdNumber", group: "USDT" },
    { key: "USDT_ARB",   label: "USDT on Arbitrum",  className: "TokenUsdt", contractId: "USDT", network: "ARB",   digits: 2, format: "formatVusdNumber", group: "USDT" },
    { key: "USDT_OPT",   label: "USDT on Optimism",  className: "TokenUsdt", contractId: "USDT", network: "OPT",   digits: 2, format: "formatVusdNumber", group: "USDT" },
    // not active as per 6-Spr-2025: { key: "USDT_BASE",  label: "USDT on Base",      className: "TokenUsdtBase", contractId: "USDT", network: "BASE",  digits: 2, format: "formatVusdNumber", group: "USDT" },
    { key: "USDT_AVAX",  label: "USDT on Avalanche", className: "TokenUsdt", contractId: "USDT", network: "AVAX",  digits: 2, format: "formatVusdNumber", group: "USDT" },

  // Staked
  { key: "VTRU_STAKED", label: "VTRU Staked", className: "TokenStakedVtru", contractId: "CoreStake", network: "VTRU", digits: 2, format: "formatRawNumber", group: "Staked" },
  { key: "SEVOX_STAKED", label: "SEVO-X Staked", className: "TokenStakedSevoX", contractId: "SEVOX", network: "BSC", digits: 2, format: "formatRawNumber", group: "Staked" },

  // Vitruveo Coins & Tokens
  { key: "VERSE", label: "VERSE", className: "TokenVerse", contractId: "VERSE", network: "VTRU", digits: 0, format: "formatNumber", group: "Vitruveo Coins & Tokens" },
  { key: "VIBE", label: "VIBE", className: "TokenVibe", contractId: "VIBE", network: "VTRU", digits: 0, format: "formatNumber", group: "Vitruveo Coins & Tokens" },
  { key: "VORTEX", label: "VORTEX", className: "TokenVortex", contractId: "Vortex", network: "VTRU", digits: 0, format: "formatNumber", group: "Vitruveo Coins & Tokens" },
  { key: "VTRO", label: "VTRO", className: "TokenVtro", contractId: "VTRO", network: "VTRU", digits: 2, format: "formatRawNumber", group: "Vitruveo Coins & Tokens" },
  { key: "VUSD", label: "VUSD", className: "TokenVusd", contractId: "VUSD", network: "VTRU", digits: 2, format: "formatVusdNumber", group: "Vitruveo Coins & Tokens" },
  { key: "WVTRU", label: "wVTRU", className: "CommonEvmClass", contractId: "wVTRU", network: "VTRU", digits: 2, format: "formatRawNumber", group: "Vitruveo Coins & Tokens" },

  // Sabong
  { key: "SEVO", label: "SEVO", className: "TokenSevo", contractId: "SEVO", network: "VTRU", digits: 2, format: "formatRawNumber", group: "Sabong" },
  { key: "SEVOX", label: "SEVO-X", className: "CommonEvmClass", contractId: "SEVOX", network: "BSC", digits: 2, format: "formatRawNumber", group: "Sabong" },

  // Exchange
  { key: "V3DEX", label: "V3DEX", className: "TokenV3dex", contractId: "V3DEX", network: "VTRU", digits: 2, format: "formatRawNumber", group: "Vitruveo Exchange" },
  { key: "VITDEX", label: "VITDEX", className: "TokenVitdex", contractId: "VITDEX", network: "VTRU", digits: 0, format: "formatNumber", group: "Vitruveo Exchange" }
];

const detailType = {
  VTRU_STAKED: "stake",
  SEVOX_STAKED: "bsc",
  VIBE: "vibe",
  VORTEX: "vortex"
};

const hasGroups = {
  VTRU_STAKED: true,
  SEVOX_STAKED: true
};

const chainIdMap = {
  VTRU: 1490,
  ETH: 1,
  BSC: 56,
  POL: 137,
  ARB: 42161,
  OPT: 10,
  BASE: 8453,
  AVAX: 43114,
};

const currency = {
  VTRU: "VTRU",
  BSC: "BNB",
  ETH: "ETH",
  POL: "POL",
  ARB: "ETH",
  OPT: "ETH",
  BASE: "ETH",
  AVAX: "AVAX",
  SOL: "SOL",
  TEZ: "TEZ",
};

const rpcUrls = {
  VTRU: "https://rpc.vitruveo.xyz",
  BSC: "https://bsc-dataseed.binance.org",
  ETH: "https://rpc.mevblocker.io",
  POL: "https://polygon-rpc.com",
  ARB: "https://arb1.arbitrum.io/rpc",
  OPT: "https://mainnet.optimism.io",
  BASE: "https://mainnet.base.org",
  AVAX: "https://api.avax.network/ext/bc/C/rpc",
  SOL: "https://api.mainnet-beta.solana.com",
  TEZ: "https://mainnet.api.tez.ie",
};

const jsonPaths = {
  VTRU: "CONFIG_JSON_FILE_PATH",
  BSC: "CONFIG_JSON_BSC_PATH",
  ETH: "CONFIG_JSON_ETH_PATH",
  POL: "CONFIG_JSON_POL_PATH",
  ARB: "CONFIG_JSON_EVM_PATH",
  OPT: "CONFIG_JSON_EVM_PATH",
  BASE: "CONFIG_JSON_EVM_PATH",
  AVAX: "CONFIG_JSON_EVM_PATH",
  SOL: "CONFIG_JSON_SOL_PATH",
  TEZ: "CONFIG_JSON_TEZ_PATH",
};

module.exports = {
  networks,
  netToChain,
  isInChain,
  sections,
  detailType,
  hasGroups,
  chainIdMap,
  currency,
  rpcUrls,
  jsonPaths
};

