#!/usr/bin/env node

/**
 * Converts JSON-formatted wallet details into CSV format.
 * Reads input from a JSON file and generates a structured CSV output.
 * Supports customizable file names and filtering options via command-line arguments.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const fs = require("fs");
const { getFileName } = require("../lib/vtruUtils");

/**
 * Adds a row if the value is not empty or zero.
 *
 * @param {Array<string>} rows - CSV rows.
 * @param {string} wallet - Wallet address.
 * @param {string} value - Wallet balance value.
 */
function add(rows, wallet, value) {
    if (value && value !== "0.00") {
        rows.push(`${wallet},"${value}"`);
    }
}

/**
 * Adds a total row for a given category.
 *
 * @param {Array<string>} rows - CSV rows.
 * @param {string} title - Category title.
 * @param {string} total - Total value.
 */
function addTotal(rows, title, total) {
    add(rows, `Total ${title}`, total);
}

/**
 * Groups data under a specific category.
 *
 * @param {Array<string>} rows - CSV rows.
 * @param {Array<string>} wallets - Wallet addresses.
 * @param {Array<string>} elements - Balance values.
 * @param {string} total - Total value.
 * @param {string} title - Section title.
 */
function group(rows, wallets, elements, total, title) {
    if (!elements || elements.length === 0) return;
    
    rows.push("");
    rows.push(title);

    let sum = 0;
    for (let i = 0; i < elements.length; i++) {
        sum += Number(elements[i]);
        add(rows, wallets[i], elements[i]);
    }

    addTotal(rows, title, total);
}

/**
 * Converts JSON data to CSV format.
 *
 * @param {Object} jsonData - JSON data.
 * @returns {string} - CSV formatted string.
 */
function jsonToCsv(jsonData) {
    if (!jsonData.wallets || jsonData.wallets.length === 0) {
        console.error("❌ Error: No wallet data found.");
        process.exit(1);
    }

    const rows = [];
    rows.push("WALLET,BALANCE");

    const wallets = jsonData.wallets;

    group(rows, wallets, jsonData.sectionVTRUHeld, jsonData.totalVTRUHeld, "Held");
    group(rows, wallets, jsonData.sectionVTRUStaked, jsonData.totalVTRUStaked, "Staked");
    group(rows, wallets, jsonData.sectionVERSE, jsonData.totalVERSE, "Verse");
    group(rows, wallets, jsonData.sectionVIBE, jsonData.totalVIBE, "Vibe");

    rows.push("");
    rows.push("Totals");
    addTotal(rows, "Held", jsonData.totalVTRUHeld);
    addTotal(rows, "Staked", jsonData.totalVTRUStaked);
    addTotal(rows, "Verse", jsonData.totalVERSE);
    addTotal(rows, "Vibe", jsonData.totalVIBE);

    return rows.join("\n");
}

/**
 * Displays usage instructions.
 */
function displayUsage() {
    console.log(`
Usage: jsonWallet2Csv.js [options]

Options:
  -f <fileName> Base file name for input/output (default: details-YYMMDD-minBalance.json/.csv)
  -d <date>     Specify a custom YYMMDD date string
  -h            Display this usage information
`);
}

/**
 * Parses command-line arguments and initiates JSON-to-CSV conversion.
 */
function main() {
    const args = process.argv.slice(2);
    const options = { fileName: null, date: null };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case "-f":
                if (i + 1 < args.length) options.fileName = args[++i];
                else return displayUsage();
                break;
            case "-d":
                if (i + 1 < args.length) options.date = args[++i];
                else return displayUsage();
                break;
            case "-h":
                displayUsage();
                process.exit(0);
            default:
                console.error(`❌ Error: Unknown option ${args[i]}`);
                displayUsage();
                process.exit(1);
        }
    }

    const inputFilePath = getFileName(options, "json", "wallets");
    const outputFilePath = getFileName(options, "csv", "wallets");

    try {
        if (!fs.existsSync(inputFilePath)) {
            console.error(`❌ Error: Input file not found: ${inputFilePath}`);
            process.exit(1);
        }

        const jsonData = JSON.parse(fs.readFileSync(inputFilePath, "utf-8"));
        const csvData = jsonToCsv(jsonData);

        fs.writeFileSync(outputFilePath, csvData);
        console.log(`✅ Written: ${outputFilePath}`);
    } catch (error) {
        console.error("❌ Error processing JSON to CSV:", error.message);
    }
}

main();
