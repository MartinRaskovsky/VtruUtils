#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: February 2025
 * 
 * Retrieves details for one or more wallet addresses, displaying either full details 
 * or a summary based on user input. If no wallets are provided, the script exits with an error.
 **/


const { Web3 } = require("../lib/libWeb3");
const VtruWalletDetails = require('../lib/vtruWalletDetails');

async function getWalletDetails(wallets, summaryMode) {
    try {
        const vtru = await Web3.create(Web3.VTRU);
        const bsc  = await Web3.create(Web3.BSC);
  
        const walletDetails = new VtruWalletDetails(vtru, bsc);

        const details = await walletDetails.get(wallets, 1, 1);

        if (details) {
            console.log(JSON.stringify(
                summaryMode 
                    ? {
                        name: details.name,
                        held: details.held,
                        staked: details.staked,
                        verses: details.verses,
                        vibes: details.vibes,
                    } 
                    : details, 
                null, 2
            ));
        } else {
            console.error('Error: No details found.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function displayUsage() {
    console.log(`Usage: getWalletDetails.js [options] <walletAddress1> <walletAddress2> ... <walletAddressN>

Options:
  -s              Display a summary (name, held, staked, verses, vibes)
  -h              Display this usage information

Arguments:
  <walletAddress>  One or more wallet addresses to process (required)`);
}

function main() {
    const args = process.argv.slice(2);
    let walletAddresses = [];
    let summaryMode = false;

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-s':
                summaryMode = true;
                break;
            case '-h':
                displayUsage();
                process.exit(0);
            default:
                walletAddresses.push(args[i]);
                break;
        }
    }

    if (walletAddresses.length === 0) {
        console.error('Error: Missing wallet address(es).');
        displayUsage();
        process.exit(1);
    }

    getWalletDetails(walletAddresses, summaryMode).catch(error => {
        console.error('Error:', error.message);
    });
}

main();

