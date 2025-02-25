#!/usr/bin/env node

/**
 * Retrieves and processes details of multiple vaults, filtering by minimum balance
 * and writing results to a JSON file. Supports optional contract name, output file naming,
 * and processing limits via command-line arguments.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const { getFileName } = require('../lib/vtruUtils');
const { Web3 } = require("../lib/libWeb3");
const { Network } = require("../lib/libNetwork");
const VtruVaultFactory = require('../lib/vtruVaultFactory');
const VtruResultAggregator = require('../lib/vtruResultAggregator');
const VtruVaultDetails = require('../lib/vtruVaultDetails');
const fse = require('fs-extra');

/**
 * Fetches and processes vault details.
 *
 * @param {Object} options - Command-line options.
 * @param {string|null} outputFilePath - File path for output (if specified).
 */
async function getVaultDetails(options, outputFilePath) {
    try {
        let web3s = [Web3.VTRU];
        if (options.bsc) web3s.push(Web3.BSC);
        if (options.eth) web3s.push(Web3.ETH);
        
        const network = new Network(web3s);
        const vtru = new Web3(Web3.VTRU);

        const vaultFactory = new VtruVaultFactory(vtru, options.contractName);
        const aggregator = new VtruResultAggregator();
        const vaultDetails = new VtruVaultDetails(network, options.minBalance, options.full);

        await vaultFactory.processVaults(options.limit, async (vault, index) => {
            if (!(await vault.isBlocked())) {
                const vaultDetailsData = await vaultDetails.get(vault, index);
                if (vaultDetailsData) {
                    aggregator.add(vaultDetailsData, options.verbose);
                }
            }
        });

        // Summarize results and sort by "totalVTRUHeld" amount
        const summary = vaultDetails.getSummary();
        const totals = vaultDetails.getTotals(summary);
        const totalSep = vaultDetails.getTotalSep(summary);
        const finals = vaultDetails.getFinals(summary);
        aggregator.sort("totalVTRUHeld"); // before adding totals
        aggregator.add(totals);
        aggregator.add(totalSep);
        aggregator.add(finals);

        if (outputFilePath) {
            fse.writeJSONSync(outputFilePath, aggregator.get(), { spaces: 2 });
            console.log(`✅ Written: ${outputFilePath}`);
        } else {
            console.log(JSON.stringify(aggregator.get(), null, 2));
        }
    } catch (error) {
        console.error("❌ Error retrieving vault details:", error.message);
    }
}

/**
 * Displays usage instructions.
 */
function displayUsage() {
    console.log(`
Usage: getVaultsDetails.js [options]

Options:
  -c <contractName> Contract name (default: CreatorVaultFactory)
  -f <fileName>     Base file name for input/output (default: details-YYMMDD-minBalance.json)
  -m <minBalance>   Minimum balance to filter vaults (default: 4000)
  -d <date>         Specify a custom YYMMDD date string
  -l <limit>        Limit the number of vaults to process (default: no limit)
  -F                Include full tokens (VERSE, VIBE, VORTEX)
  -bsc              Include Binance Smart Chain vaults
  -eth              Include Ethereum vaults
  -q                Quiet mode (reduce verbosity)
  -h                Display this usage information
`);
}

/**
 * Parses command-line arguments and initiates vault details retrieval.
 */
function main() {
    const args = process.argv.slice(2);
    const options = {
        contractName: "CreatorVaultFactory",
        minBalance: 4000,
        limit: Infinity,
        verbose: 1,
        full: false,
        bsc: false,
        eth: false, // Fixed typo ('etc' to 'eth')
        fileName: null,
        date: null
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-c':
                if (i + 1 < args.length) options.contractName = args[++i];
                else return displayUsage();
                break;
            case '-f':
                if (i + 1 < args.length) options.fileName = args[++i];
                else return displayUsage();
                break;
            case '-m':
                if (i + 1 < args.length) {
                    const minBalance = parseInt(args[++i], 10);
                    if (!isNaN(minBalance)) options.minBalance = minBalance;
                } else return displayUsage();
                break;
            case '-d':
                if (i + 1 < args.length) options.date = args[++i];
                else return displayUsage();
                break;
            case '-l':
                if (i + 1 < args.length) {
                    const limit = parseInt(args[++i], 10);
                    if (!isNaN(limit)) options.limit = limit;
                } else return displayUsage();
                break;
            case '-F':
                options.full = true;
                break;
            case '-bsc':
                options.bsc = true;
                break;
            case '-eth':
                options.eth = true;
                break;
            case '-q':
                options.verbose = 0;
                break;
            case '-h':
                displayUsage();
                process.exit(0);
            default:
                displayUsage();
                process.exit(1);
        }
    }

    const outputFilePath = options.verbose ? getFileName(options, 'json') : null;

    getVaultDetails(options, outputFilePath)
        .catch(error => console.error("❌ Unexpected error:", error.message));
}

main();
