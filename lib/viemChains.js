// viemChains.js
// Defines custom chains and resolution for viem-compatible clients

const { defineChain } = require('viem');
const {
  mainnet,
  polygon,
  bsc,
  optimism,
  arbitrum,
  avalanche,
  base,
  fantom,
  gnosis,
  celo,
  moonbeam,
  moonriver
} = require('viem/chains');

// Define custom Vitruveo chain
const vitruveo = defineChain({
  id: 1490,
  name: "Vitruveo MainNet",
  nativeCurrency: {
    name: "VTRU",
    symbol: "VTRU",
    decimals: 18
  },
  rpcUrls: {
    default: { http: ["https://rpc.vitruveo.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "Vitruveo Explorer",
      url: "https://explorer.vitruveo.xyz/"
    }
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11", // 🧪 try this common address
      blockCreated: 0, // Optional: can use actual deployment block if known
    }
  }
});

// Mapping from internal labels to viem chain objects
const chainMap = {
  VTRU: vitruveo,
  ETH: mainnet,
  POL: polygon,
  BSC: bsc,
  OPT: optimism,
  ARB: arbitrum,
  AVAX: avalanche,
  BASE: base,
  FTM: fantom,
  CELO: celo,
  GLMR: moonbeam,
  MOVR: moonriver,
};

/**
 * Resolves an internal chain label (e.g., 'VTRU') to a viem chain object.
 * @param {string} key - Internal chain key.
 * @returns {object|null} - viem chain object or null if not found.
 */
function resolveViemChain(key) {
  return chainMap[key] || null;
}

/**
 * Resolves a viem chain by numeric ID (e.g., 1490 for VTRU)
 * @param {number} id - Numeric chain ID
 * @returns {object|null} - viem chain object or null if not found
 */
function resolveViemChainById(id) {
  return Object.values(chainMap).find(c => c.id === id) || null;
}

module.exports = {
  vitruveo,
  resolveViemChain,
  resolveViemChainById,
  chainMap,
};

