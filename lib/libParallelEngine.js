/**
 * libParallelEngine.js
 * 
 * Executes blockchain groups in parallel.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const Logger = require('./libLogger');
const PARALLEL = "parallel.log";

/**
 * Executes multiple blockchain sections in parallel.
 *
 * @param {Array<Object>} chainGroups - Each item is an object with keys:
 *   - chainId: string
 *   - networks: Array<string>
 *   - wallets: Array<string>
 *   - toLower: boolean
 * @param {Function} mergeDataFn - The function to call for each chain group.
 * @param {Object} data - Shared result data object to populate.
 * @param {boolean} formatOutput - Whether to format output in tables.
 */
async function runChainsInParallel(chainGroups, mergeDataFn, data, formatOutput) {
  const start = Date.now();

  await Promise.all(
    chainGroups.map(async (group) => {
      try {
        await mergeDataFn(
          group.chainId,
          group.networks,
          data,
          group.wallets,
          formatOutput,
          group.toLower
        );
      } catch (error) {
        Logger.error(`Chain ${group.chainId} failed: ${error.message}`, PARALLEL);
      }
    })
  );

  Logger.timing("Parallel chain processing", start, PARALLEL);
}

module.exports = { runChainsInParallel };

