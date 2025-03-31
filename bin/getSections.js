#!/usr/bin/env node

/**
 * getSections.js
 *
 * Retrieves details from a vault and/or a list of wallets.
 * Splits by chain and runs each in parallel using runChainsInParallel.
 *
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const Web3 = require("../lib/libWeb3");
const VtruVault = require("../lib/vtruVault");
const { categorizeAddresses } = require("../lib/addressCategorizer");
const { prettyfier2 } = require("../lib/libPrettyfier");
const { runChainsInParallel } = require("../lib/libParallelEngine");
const { groupSectionsByChain } = require("../lib/libTokenFactoryGroup");

const Logger = require("../lib/libLogger");
const PARALLEL = 'parallel.log';

function abort(message) {
  console.error(`❌ Error: ${message}`);
  process.exit(1);
}

/**
 * Merges data for a specific chain group.
 */
async function mergeData(chainId, networks, data, wallets, formatOutput, toLower) {
  if (wallets.length === 0) return 0;
  const Network = require("../lib/libNetwork");
  const WalletSections = require("../lib/libWalletSections");

  const network = new Network(networks);
  const walletSections = new WalletSections(network);
  const start = Date.now();
  const result = await walletSections.get(wallets, toLower);
  Logger.timing(`Chain ${chainId} processing`, start, PARALLEL);

  if (result && typeof result === 'object') {
    data[chainId] = result;

    if (result.errors) {
      data.errorList.push({ source: chainId, message: result.errors });
    }

    if (formatOutput) {
      const sectionTitles = walletSections.getSectionTitles(); 
      const totalKeys = walletSections.getTotalKeys(); 
      const keys = walletSections.getSectionKeys(); 
      const columns = ['wallet', 'balance'];

      console.log(chainId, networks);
      keys.forEach((key, index) => {
        prettyfier2(result['wallets'], result[key], result[totalKeys[index]], sectionTitles[index], columns);
      });
    }
  }
}

async function getSections(vaultAddress, wallets, formatOutput) {
  try {
    const vtru = new Web3(Web3.VTRU);

    if (!vaultAddress && wallets.length === 0) {
      vaultAddress = vtru.getConfig().get("VAULT_ADDRESS") || "";
      wallets = (vtru.getConfig().get("WALLETS") || "")
        .split(/\s+/)
        .map((addr) => addr.trim())
        .filter((addr) => addr.length > 0);
    }

    if (!vaultAddress && wallets.length === 0) {
      abort("No vault or wallets provided.");
    }

    const { merged, vault } = await VtruVault.mergeWallets(vtru, vaultAddress, wallets);
    const { evm, sol, tez, invalid } = categorizeAddresses(merged);

    const data = {};
    data.errorList = [];

    if (invalid.length > 0) {
        data.errorList.push({ source: "validation", message: `Invalid wallet addresses: ${invalid.join("<br>")}` });
    }

    const chainGroups = await groupSectionsByChain({ evm, sol, tez });
    await runChainsInParallel(chainGroups, mergeData, data, formatOutput);

    // Store the first error (if any) for backward compatibility
    if (data.errorList.length > 0) {
      data.errors = data.errorList[0].message;
    }

    if (Object.keys(data).length === 1 && data.errorList.length === 0) {
      abort("No wallets data found.");
    }

    if (formatOutput) {
      if (data.errorList.length > 0) {
        console.error("❌ Errors:");
        data.errorList.forEach(err => console.error(`${err.source}: ${err.message}`));
      }
    } else {
      console.log(
        JSON.stringify(
          {
            address: vault ? vault.address : "",
            name: vault ? await vault.getName() : "",
            wallets: merged,
            ...data,
          },
          null,
          2
        )
      );
    }
  } catch (error) {
    console.log(
      JSON.stringify(
        {
          address: vaultAddress,
          wallets,
          errors: error.message,
        }, null, 2
      )
    );
  }
}

function displayUsage() {
  console.log(`
Usage: getSections.js [options] [wallet1] [wallet2] ...

Options:
  -v <vaultAddress>  Specify a vault address to retrieve associated wallets.
  -f                 Format output as an aligned table.
  -h                 Display this usage information.

Arguments:
  <vaultAddress>  Optional address of a vault
  [wallets]       Optional list of wallet addresses
  `);
}

function main() {
  const args = process.argv.slice(2);
  let vaultAddress = null;
  let wallets = [];
  let formatOutput = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "-v":
        if (i + 1 < args.length) {
          vaultAddress = args[++i];
        } else {
          abort("Missing vault address after '-v'.");
        }
        break;
      case "-f":
        formatOutput = true;
        break;
      case "-h":
        displayUsage();
        process.exit(0);
        break;
      default:
        wallets.push(args[i]);
        break;
    }
  }

  getSections(vaultAddress, wallets, formatOutput).catch((error) => {
    abort(error.message);
  });
}

main();

