// libDefs.js
// JS port of Defs.pm — non-generated portions
// Author: Dr. Martín Raskovsky
// Date: April 2025

// ==== GENERATED JS DEFS START ====

export const scriptMap = {
  "stake": "getDetailVtruStaked.js",
  "bsc": "getDetailSevoXStaked.js",
  "vibe": "getDetailVibe.js",
  "vortex": "getDetailVortex.js",
  "sevo": "getDetailSevo.js",
  "sections": "getSections.js"
};
export const detailTypeMap = {
  "VTRU Staked": "stake",
  "SEVO-X Staked": "bsc",
  "VIBE": "vibe",
  "VORTEX": "vortex",
  "SEVO": "sevo"
};
export const groupTypeMap = {
  "VTRU Staked": true,
  "SEVO-X Staked": true
};
export const groupTypeByType = {
  "stake": true,
  "bsc": true,
  "vibe": false,
  "vortex": false,
  "sevo": false
};
export const explorers = {
  "VTRU": "https://explorer.vitruveo.xyz/address/",
  "ETH": "https://etherscan.io/address/",
  "BSC": "https://bscscan.com/address/",
  "POL": "https://polygonscan.com/address/",
  "ARB": "https://arbiscan.io/address/",
  "OPT": "https://optimistic.etherscan.io/address/",
  "BASE": "https://basescan.org/address/",
  "AVAX": "https://snowtrace.io/address/",
  "SOL": "https://explorer.solana.com/address/",
  "TEZ": "https://tzkt.io/"
};
export const netToChain = {
  "VTRU": "EVM",
  "ETH": "EVM",
  "BSC": "EVM",
  "POL": "EVM",
  "ARB": "EVM",
  "OPT": "EVM",
  "BASE": "EVM",
  "AVAX": "EVM",
  "SOL": "SOL",
  "TEZ": "TEZ"
};
export const branding = {
  "BSC": {
    "color": "#F3BA2F",
    "icon": "bsc.png",
    "emoji": "🟡"
  },
  "ETH": {
    "color": "#627EEA",
    "icon": "eth.png",
    "emoji": "💠"
  },
  "VTRU": {
    "color": "#8247E5",
    "icon": "vtru.png",
    "emoji": "🟣"
  },
  "POL": {
    "color": "#282A36",
    "icon": "pol.png",
    "emoji": "🔗"
  },
  "SOL": {
    "color": "#9945FF",
    "icon": "sol.png",
    "emoji": "🌿"
  },
  "TEZ": {
    "color": "#2C7DF7",
    "icon": "tez.png",
    "emoji": "🔷"
  },
  "ARB": {
    "color": "#28A0F0",
    "icon": "arb.png",
    "emoji": "🧊"
  },
  "OPT": {
    "color": "#FF0420",
    "icon": "opt.png",
    "emoji": "🚀"
  },
  "BASE": {
    "color": "#0052FF",
    "icon": "base.png",
    "emoji": "🌀"
  },
  "AVAX": {
    "color": "#E84142",
    "icon": "avax.png",
    "emoji": "⛰️"
  }
};
export const chainList = ["evm", "sol", "tez"];

// ==== GENERATED JS DEFS END ====

/**
 * Maps script types to render function names
 */
export const renderFunctionMap = {
  sections: 'renderSections',
  stake: 'renderVtruStaked',
  bsc: 'renderBscStaked',
  vibe: 'renderVibeDetails',
  vortex: 'renderVortexDetails',
  sevo: 'renderSevoDetails',
};

/**
 * Returns script file for a given type
 * @param {string} type
 * @returns {string}
 */
export function getScriptForType(type) {
  const script = scriptMap?.[type];
  if (!script) throw new Error(`Unknown script type: ${type}`);
  return script;
}

/**
 * Maps detail label → type
 * @param {string} label
 * @returns {string}
 */
export function getDetailType(label) {
  return detailTypeMap?.[label] || '';
}

/**
 * Returns true if the detail label is a "grouper"
 * @param {string} label
 * @returns {boolean}
 */
export function getIsGrouperType(label) {
  return !!groupTypeMap?.[label];
}

export function getIsGrouperTypeByType(type) {
  return !!groupTypeByType[type];
}

/**
 * Returns true if the chain is recognized
 * @param {string} chain
 * @returns {boolean}
 */
export function isChain(chain) {
  if (!chain) return false;
  return ['EVM', 'SOL', 'TEZ'].includes(chain.toUpperCase());
}

/**
 * Returns the chain category for a given network
 * @param {string} net
 * @returns {string}
 */
export function getNetworkChain(net) {
  return netToChain?.[net] || 'EVM';
}

/**
 * Returns the explorer URL prefix for a network
 * @param {string} net
 * @returns {string}
 */
export function getExplorer(net) {
  return explorers?.[net] || '';
}

/**
 * Returns render function name for a given type
 * @param {string} type
 * @returns {string}
 */
export function getRenderFunction(type) {
  const fn = renderFunctionMap?.[type];
  if (!fn) throw new Error(`Unknown render function for type: ${type}`);
  return fn;
}

/**
 * Returns icon/emoji/color marker for a chainId
 * @param {string} chainId
 * @param {string} [prefer='icon']
 * @returns {string} HTML
 */
export function getChainMarker(chainId, prefer = 'icon') {

  if (!chainId) return '';
  const entry = branding?.[chainId];
  if (!entry) return '';

  if (prefer === 'icon' && entry.icon) {
    return `<img src="/icons/${entry.icon}" alt="${chainId}" width="16" height="16" style="display:inline-block;vertical-align:middle;">`;
  } else if (prefer === 'emoji' && entry.emoji) {
    return `<span style="font-size:16px;">${entry.emoji}</span>`;
  } else if (entry.color) {
    return `<div style="width: 16px; height: 16px; background-color: ${entry.color}; border-radius: 50%; display: inline-block;"></div>`;
  }
  return '';
}
