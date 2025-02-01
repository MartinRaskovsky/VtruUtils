#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 * 
 * Converts JSON-formatted wallet details into CSV format.
 * Reads input from a JSON file and generates a structured CSV output.
 * Supports customizable file names and filtering options via command-line arguments.
 **/

const fs = require('fs');
const { getFileName } = require('../lib/vtruUtils');

// Adds a row if the value is not empty or zero
function add(rows, wallet, value) {
    if (value && value !== "0.00") {
        rows.push(`${wallet},"${value}"`);
    }
}

// Adds a total row for a given category
function addTotal(rows, title, total) {
    add(rows, `Total ${title}`, total);
}

// Groups data under a specific category
function group(rows, wallets, elements, total, title) {
    rows.push('');
    rows.push(title);

    let sum = 0;
    for (let i = 0; i < elements.length; i++) {
        sum += Number(elements[i]);
        add(rows, wallets[i], elements[i]);
    }

    addTotal(rows, title, total);
}

// Converts JSON data to CSV format
function jsonToCsv(jsonData) {
    const rows = [];
    
    rows.push('WALLET,BALANCE');

    const wallets = jsonData.wallets;
    
    if (wallets && wallets.length > 0) {
        group(rows, wallets, jsonData.walletBalances, jsonData.held, 'Held');
        group(rows, wallets, jsonData.walletStaked, jsonData.staked, 'Staked');
        group(rows, wallets, jsonData.walletVerses, jsonData.verses, 'Verse');
        group(rows, wallets, jsonData.walletVibes, jsonData.vibes, 'Vibe'); 

        rows.push('');
        rows.push('Totals');
        addTotal(rows, 'Held', jsonData.held);
        addTotal(rows, 'Staked', jsonData.staked);
        addTotal(rows, 'Verse', jsonData.verses);
        addTotal(rows, 'Vibe', jsonData.vibes);
    } else {
        console.error('Error: No wallet data found.');
    }

    return rows.join('\n');
}

function displayUsage() {
    console.log(`Usage: jsonWallet2Csv.js [options]

Options:
  -f <fileName> Base file name for input/output (default: details-YYMMDD-minBalance.json/.csv)
  -d <date>     Specify a custom YYMMDD date string
  -h            Display this usage information`);
}

function main() {
    const args = process.argv.slice(2);
    const options = {};

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-f':
                options.fileName = args[i + 1];
                i++;
                break;
            case '-d':
                options.date = args[i + 1];
                i++;
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

    const inputFilePath = getFileName(options, 'json', 'wallets');
    const outputFilePath = getFileName(options, 'csv', 'wallets');

    try {
        const jsonData = JSON.parse(fs.readFileSync(inputFilePath, 'utf-8'));
        const csvData = jsonToCsv(jsonData);

        fs.writeFileSync(outputFilePath, csvData);
        console.log(`Written: ${outputFilePath}`);
    } catch (error) {
        console.error('Error processing JSON to CSV:', error.message);
    }
}

main();

