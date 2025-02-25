#!/usr/bin/env node

/**
 * Converts JSON-formatted vault/wallet details into CSV format.
 * Reads input from a JSON file and generates a structured CSV output.
 * Supports customizable file names and filtering options via command-line arguments.
 *
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const Web3 = require("../lib/libWeb3");
const Network = require("../lib/libNetwork");
const Sections = require("../lib/libSections");
const fs = require("fs");
const { getFileName } = require("../lib/vtruUtils");

const explorer = "https://explorer.vitruveo.xyz/address";

/**
 * Removes decimals from numbers if the `strip` option is enabled.
 *
 * @param {boolean} strip - Whether to strip decimals.
 * @param {string} numberStr - Number as a string.
 * @returns {string} - Processed number string.
 */
function stripDecimal(strip, numberStr) {
    return strip ? numberStr.split(".")[0] : numberStr;
}

/**
 * Escapes a CSV field by enclosing it in quotes if necessary.
 *
 * @param {string} field - Field value.
 * @returns {string} - Escaped field.
 */
function escapeCSVField(field) {
    return field.includes(",") || field.includes('"') ? `"${field.replace(/"/g, '""')}"` : field;
}

/**
 * Truncates wallet addresses for better readability.
 *
 * @param {string} address - Full address.
 * @returns {string} - Truncated address.
 */
function truncateAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Converts JSON data to CSV format.
 *
 * @param {Object[]} jsonData - JSON data.
 * @param {Object} options - Command-line options.
 * @returns {string} - CSV formatted string.
 */
function jsonToCsv(jsonData, options) {
    const web3s = [Web3.VTRU];
    if (options.bsc) web3s.push(Web3.BSC);
    if (options.eth) web3s.push(Web3.ETH);
    
    const network = new Network(web3s);
    const sections = new Sections(network, options.full);

    const rows = [];
    let indexCounter = 0;

    // Determine the maximum number of wallets in any record for column consistency
    const maxWallets = jsonData.reduce((max, data) => (data.wallets?.length > max ? data.wallets.length : max), 0);

    // Create CSV header
    const headerTitles = sections.getSectionTitles(jsonData[0]).map(s => s.toUpperCase());
    const sectionKeys = sections.getSectionKeys(jsonData[0]);
    const totalKeys = sections.getTotalKeys(jsonData[0]);

    let header = `INDEX,${headerTitles.join(",")},VAULT,`;
    for (let i = 1; i < maxWallets; i++) {
        header += `WALLET${maxWallets > 2 ? `${i},` : ","}`;
    }
    header = header.slice(0, -1).replace(/VTRU /g, "").replace(/-X STAKED/g, "X");
    rows.push(header);

    jsonData.forEach(data => {
        indexCounter++;

        if (data[sectionKeys[0]] !== undefined) {
            let row = `${indexCounter},${totalKeys.map(key => {
                let v = data[key] ? stripDecimal(options.decimals, data[key]) : "0";
                return `"${v}"`;
            })}`;

            // Vault hyperlink
            const formula = `=HYPERLINK("${explorer}/${data.wallets[0]}", "${data["name"]}")`;
            row += `,${escapeCSVField(formula)}`;

            for (let i = 1; i < maxWallets; i++) {
                let wallet = data.wallets[i];
                row += `,${wallet ? escapeCSVField(`=HYPERLINK("${explorer}/${wallet}", "${truncateAddress(wallet)}")`) : ""}`;
            }

            rows.push(row);
        } else {
            let row = `${data["count"]},${totalKeys.map(key => {
                let v = data[key] && data[key] !== "..." ? stripDecimal(options.decimals, data[key]) : data[key];
                return `"${v}"`;
            })}`;
            rows.push(row);
        }
    });

    return rows.join("\n");
}

/**
 * Displays usage instructions.
 */
function displayUsage() {
    console.log(`
Usage: jsonDetails2Csv.js [options]

Options:
  -c <contractName> Contract name (default: CreatorVaultFactory)
  -f <fileName>     Base file name for input/output (default: details-YYMMDD-minBalance.json/.csv)
  -m <minBalance>   Minimum balance to include in file name (default: 4000)
  -d <date>         Specify a custom YYMMDD date string
  -F                Include full tokens (VERSE, VIBE, VORTEX)
  -bsc              Include Binance Smart Chain vaults
  -eth              Include Ethereum vaults
  -D                Strip decimal places from numbers
  -h                Display this usage information
`);
}

/**
 * Parses command-line arguments and initiates JSON-to-CSV conversion.
 */
function main() {
    const args = process.argv.slice(2);
    const options = {
        contractName: "CreatorVaultFactory",
        minBalance: 4000,
        full: false,
        bsc: false,
        eth: false,
        decimals: true,
        fileName: null,
        date: null,
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case "-c":
                if (i + 1 < args.length) options.contractName = args[++i];
                else return displayUsage();
                break;
            case "-f":
                if (i + 1 < args.length) options.fileName = args[++i];
                else return displayUsage();
                break;
            case "-m":
                if (i + 1 < args.length) options.minBalance = parseInt(args[++i], 10) || 4000;
                else return displayUsage();
                break;
            case "-d":
                if (i + 1 < args.length) options.date = args[++i];
                else return displayUsage();
                break;
            case "-F":
                options.full = true;
                break;
            case "-bsc":
                options.bsc = true;
                break;
            case "-eth":
                options.eth = true;
                break;
            case "-D":
                options.decimals = false;
                break;
            case "-h":
                displayUsage();
                process.exit(0);
                break;
            default:
                console.error(`❌ Error: Unknown option ${args[i]}`);
                displayUsage();
                process.exit(1);
        }
    }

    const inputFilePath = getFileName(options, "json");
    const outputFilePath = getFileName(options, "csv");

    try {
        const jsonData = JSON.parse(fs.readFileSync(inputFilePath, "utf-8"));
        const csvData = jsonToCsv(jsonData, options);

        fs.writeFileSync(outputFilePath, csvData);
        console.log(`✅ Written: ${outputFilePath}`);
    } catch (error) {
        console.error("❌ Error processing JSON to CSV:", error.message);
    }
}

main();
