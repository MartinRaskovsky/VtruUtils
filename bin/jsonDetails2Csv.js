#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 * 
 * Converts JSON-formatted vault/wallet details into CSV format.
 * Reads input from a JSON file and generates a structured CSV output.
 * Supports customizable file names and filtering options via command-line arguments.
 **/

const fs = require('fs');
const { getFileName } = require('../lib/vtruUtils');

function stripDecimal(numberStr) {
    return numberStr.split('.')[0];
}

// Converts JSON data to CSV format
function jsonToCsv(jsonData, full) {
    const rows = [];
    let indexCounter = 0;

    // Determine the maximum number of wallets in any record for column consistency
    const maxWallets = jsonData.reduce((max, data) => {
        return data.wallets && data.wallets.length > max ? data.wallets.length : max;
    }, 0);

    // Create CSV header
    let header = 'INDEX,HELD,STAKED';
    if (full) header += ',VERSE,VIBE,VORTEX';
    header += ',NAME,VAULT,BALANCE';
    for (let i = 0; i < maxWallets; i++) {
        header += `,WALLET/${i},BALANCE/${i},STAKED/${i}`;
        if (full) header += `,VERSE/${i},VIBE/${i},VORTEX/${i}`;
    }
    rows.push(header);

    // Convert each JSON entry into a CSV row
    jsonData.forEach((data) => {
        indexCounter++;

        let { count, address, name, balance, wallets, 
            sectionVTRUHeld, 
            sectionVTRUStaked, 
            sectionVERSE, 
            sectionVIBE, 
            sectionVORTEX,
            totalVTRUHeld,  
            totalVTRUStaked,
            totalVERSE,
            totalVIBE,
            totalVORTEX
        } = data;
        totalVTRUHeld = stripDecimal(totalVTRUHeld);
        totalVTRUStaked = stripDecimal(totalVTRUStaked);

        if (balance !== undefined) {
            let row = `${indexCounter},"${totalVTRUHeld}","${totalVTRUStaked}"`;
            if (full) row += `,"${totalVERSE}","${totalVIBE}","${totalVORTEX}"`;
            row += `,"${name}","${address}","${balance}"`;

            if (wallets && wallets.length > 0) {
                wallets.forEach((wallet, j) => {
                    row += `,"${wallet}","${sectionVTRUHeld[j]}","${sectionVTRUStaked[j]}"`;
                    if (full) row += `,"${sectionVERSE[j]}","${sectionVIBE[j]}","${sectionVORTEX[j]}"`;
                });
            }

            rows.push(row);
        } else {
            let row = `${count},"${totalVTRUHeld}","${totalVTRUStaked}"`;
            if (full) row += `,"${totalVERSE}","${totalVIBE}","${totalVORTEX}"`;
            rows.push(row);
        }
    });

    return rows.join('\n');
}

function displayUsage() {
    console.log(`Usage: jsonDetails2Csv.js [options]

Options:
  -c <contractName> Contract name (default: CreatorVaultFactory)
  -f <fileName>     Base file name for input/output (default: details-YYMMDD-minBalance.json/.csv)
  -m <minBalance>   Minimum balance to include in file name (default: 4000)
  -d <date>         Specify a custom YYMMDD date string
  -F                Full ( includes tokens VERSE, VIBE, VORTEX )
  -h                Display this usage information`);
}

function main() {
    const args = process.argv.slice(2);
    const options = {
        contractName: "CreatorVaultFactory",
        minBalance: 4000,
        full: false,
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
            case '-F':
                options.full = true;
                break;
            case '-h':
                displayUsage();
                process.exit(0);
                break;
            default:
                console.error(`Error: Unknown option ${args[i]}`);
                displayUsage();
                process.exit(1);
        }
    }

    const inputFilePath = getFileName(options, 'json');
    const outputFilePath = getFileName(options, 'csv');

    try {
        const jsonData = JSON.parse(fs.readFileSync(inputFilePath, 'utf-8'));
        const csvData = jsonToCsv(jsonData, options.full);

        fs.writeFileSync(outputFilePath, csvData);
        console.log(`Written: ${outputFilePath}`);
    } catch (error) {
        console.error('Error processing JSON to CSV:', error.message);
    }
}

main();

