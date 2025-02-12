#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: February 2025
 *
 * Unit tests for the VtruVault class.
 * These tests use the actual class and do not rely on mocks.
 */

const { formatRawNumber } = require('../lib/vtruUtils');
const { Web3 } = require('../lib/libWeb3');

/**
 * Prints the usage message.
 */
function usage() {
  console.log(`Usage: ${process.argv[1]} [<id> ...]

  <id>    Network identifier. Must be one of: ${Web3.networkIds.join(', ')}.
          If not provided, defaults to ${Web3.VTRU}.

  Options:
    -h    Display this help message.
`);
}

/**
 * Retrieves and displays wallet balances for the specified network.
 *
 * @param {string} id - The network identifier to use when creating the Web3 instance.
 */
async function show(id) {
  try {
    console.log(`\nProcessing network: ${id}`);
    const web3 = await Web3.create(id);
    const walletsStr = web3.getConfig().get('WALLETS');
    const wallets = walletsStr.split(" ").map(item => item.trim());

    let total = 0n;
    for (const wallet of wallets) {
      const rawBalance = await web3.getWalletRawBalance(wallet);
      if (rawBalance) {
        total += rawBalance;
        const balance = formatRawNumber(rawBalance, 4);
        console.log(`${balance} ${id}\t${wallet}`);
      }
    }
    console.log(`${formatRawNumber(total, 2)} ${id}\ttotal`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

/**
 * Parses command-line arguments and processes each network identifier.
 */
async function main() {
  const args = process.argv.slice(2);
  let processedAny = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-h':
        usage();
        process.exit(0);
        break;
      default:
        // Treat any non-option argument as a network identifier.
        const id = args[i];
        if (!Web3.networkIds.includes(id)) {
          console.error(`Error: Invalid id '${id}'. Must be one of: ${Web3.networkIds.join(', ')}`);
          process.exit(1);
        }
        await show(id);
        processedAny = true;
        break;
    }
  }

  // If no network identifier was provided, use the default network.
  if (!processedAny) {
    await show(Web3.VTRU);
  }
}

main();

