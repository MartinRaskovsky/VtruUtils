#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 * 
 * Retrieves and processes details of multiple vaults, filtering by minimum balance 
 * and writing results to a JSON file. Supports optional contract name, output file naming, 
 * and processing limits via command-line arguments.
 **/

const { getFileName } = require('../lib/vtruUtils');

const { Web3 } = require("../lib/libWeb3");
const { Network } = require("../lib/libNetwork");

const VtruVaultFactory = require('../lib/vtruVaultFactory');
const VtruResultAggregator = require('../lib/vtruResultAggregator');
const VtruVaultDetails = require('../lib/vtruVaultDetails');
const fse = require('fs-extra');

async function getVaultDetails(minBalance, outputFilePath, limit, contractName = "CreatorVaultFactory", verbose = 1) {
    try {
        const network = await new Network([Web3.VTRU]);
        const vtru = await Web3.create(Web3.VTRU);
 
        const vaultFactory = new VtruVaultFactory(vtru, contractName);
        const aggregator = new VtruResultAggregator();
        const vaultDetails = new VtruVaultDetails(network, minBalance);

        await vaultFactory.processVaults(limit, async (vault, index) => {
            if (!(await vault.isBlocked())) {
                const vaultDetailsData = await vaultDetails.get(vault, index);
                if (vaultDetailsData) {
                    aggregator.add(vaultDetailsData, verbose);
                }
            }
        });

        // Summarize results and sort by "held" amount
        const summary = vaultDetails.getSummary();
        aggregator.sort("held");

        aggregator.add({ count: '', held: summary.held, staked: summary.staked });
        aggregator.add({ count: '', held: "...", staked: "..." });
        aggregator.add({ count: summary.analyzedVaultCount, held: summary.totalHeld, staked: summary.totalStaked });

        if (outputFilePath) {
            fse.writeJSONSync(outputFilePath, aggregator.get(), { spaces: 2 });
            console.log(`Written: ${outputFilePath}`);
        } else {
            console.log(aggregator.get());
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function displayUsage() {
    console.log(`Usage: getVaultsDetails.js [options]

Options:
  -c <contractName> Contract name (default: CreatorVaultFactory)
  -f <fileName>     Base file name for input/output (default: details-YYMMDD-minBalance.json)
  -m <minBalance>   Minimum balance to filter vaults (default: 4000)
  -d <date>         Specify a custom YYMMDD date string
  -l <limit>        Limit the number of vaults to process (default: no limit)
  -h                Display this usage information`);
}

function main() {
    const args = process.argv.slice(2);
    const options = {
        contractName: "CreatorVaultFactory",
        minBalance: 4000,
        limit: Infinity,
        verbose: 1,
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-c':
                options.contractName = args[i + 1];
                i++;
                break;
            case '-f':
                options.fileName = args[i + 1];
                i++;
                break;
            case '-m':
                options.minBalance = parseInt(args[i + 1], 10) || 4000;
                i++;
                break;
            case '-d':
                options.date = args[i + 1];
                i++;
                break;
            case '-l':
                options.limit = parseInt(args[i + 1], 10) || Infinity;
                i++;
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

    const outputFilePath = options.verbose?getFileName(options, 'json'): null;

    getVaultDetails(options.minBalance, outputFilePath, options.limit, options.contractName, options.verbose)
        .catch(error => console.error('Error:', error.message));
}

main();

