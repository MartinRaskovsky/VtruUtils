/**
 * libTokenFactoryGroup.js
 *
 * Groups token sections by chain for parallel processing.
 *
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const Web3 = require("./libWeb3");

const Logger = require("./libLogger");
const PARALLEL = "parallel.log";

/**
 * Returns chain groups for section execution, grouping by chain ID.
 *
 * @param {Object} categorizedWallets - { evm, sol, tez }
 * @returns {Array<Object>} - Array of chain group objects
 */
function groupSectionsByChain(categorizedWallets) {
  const groups = [];

  if (categorizedWallets.evm && categorizedWallets.evm.length > 0) {
    groups.push({
      chainId: Web3.CHAIN_EVM,
      networks: Web3.NET_EVM,
      wallets: categorizedWallets.evm,
      toLower: true,
      logFile: PARALLEL,
    });
  }
  if (categorizedWallets.sol && categorizedWallets.sol.length > 0) {
    groups.push({
      chainId: Web3.CHAIN_SOL,
      networks: Web3.NET_SOL,
      wallets: categorizedWallets.sol,
      toLower: false,
      logFile: PARALLEL,
    });
  }
  if (categorizedWallets.tez && categorizedWallets.tez.length > 0) {
    groups.push({
      chainId: Web3.CHAIN_TEZ,
      networks: Web3.NET_TEZ,
      wallets: categorizedWallets.tez,
      toLower: false,
      logFile: PARALLEL,
    });
  }

  return groups;
}

module.exports = {
  groupSectionsByChain
};

