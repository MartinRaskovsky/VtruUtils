#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 * 
 * Converts JSON-formatted vault/wallet details into CSV format.
 * Reads input from a JSON file and generates a structured CSV output.
 * Supports customizable file names and filtering options via command-line arguments.
 **/

const { Web3 } = require("../lib/libWeb3");
const { Network } = require("../lib/libNetwork");
const Sections  = require("../lib/libSections");

const fs = require('fs');
const { getFileName } = require('../lib/vtruUtils');

const explorer = "https://explorer.vitruveo.xyz/address";

function stripDecimal(strip, numberStr) {
    return strip ? numberStr.split('.')[0] : numberStr;
}

function escapeCSVField(field) {
    if (field.includes(',') || field.includes('"')) {
      field = field.replace(/"/g, '""');
      return `"${field}"`;
    }
    return field;
  }
  
function truncateAddress(address) {
    return address.substring(0, 6) + "..." + address.substring(address.length - 4);
}

// Converts JSON data to CSV format
function jsonToCsv(jsonData, options) {

    const web3s = [Web3.VTRU];
    if (options.bsc) web3s.push(Web3.BSC);
    if (options.eth) web3s.push(Web3.ETH);
    const network =  new Network(web3s);
    const sections = new Sections(network, options.full);

    const rows = [];
    let indexCounter = 0;

    // Determine the maximum number of wallets in any record for column consistency
    const maxWallets = jsonData.reduce((max, data) => {
        return data.wallets && data.wallets.length > max ? data.wallets.length : max;
    }, 0);

    // Create CSV header

    const headerTitles = sections.getSectionTitles(jsonData[0]).map((s) => s.toUpperCase());
    const sectionKeys = sections.getSectionKeys(jsonData[0]);
    const totalKeys = sections.getTotalKeys(jsonData[0]);

    let header = 'INDEX,' + headerTitles.join(',') ;
    header += ',VAULT,';
    for (let i = 1; i < maxWallets; i++) {
        const sep = (maxWallets>2)? `${i},` : ",";
        header += `WALLET${sep}`;
    }   
    header = header.slice(0, -1).replace(/VTRU /g, '').replace(/-X STAKED/g, 'X');

    rows.push(header);

    jsonData.forEach((data) => {
        indexCounter++;

        if (data[sectionKeys[0]] !== undefined) {
            let row = `${indexCounter},${totalKeys.map((key) => { 
                let v = data[key]; 
                v = v? stripDecimal(options.decimals, v) : "0"; 
                return `"${v}"`;
            })}`;
            {
               const formula = `=HYPERLINK("${explorer}/${data.wallets[0]}", "${data['name']}")`;
               const vault = escapeCSVField(formula); 
               row += `,${vault}`; 
            }     
            for (let i = 1; i < maxWallets; i++) {
                let wallet = data.wallets[i];
                if (wallet) {
                    const mini = truncateAddress(wallet);
                    const formula = `=HYPERLINK("${explorer}/${wallet}", "${mini}")`;
                    wallet = escapeCSVField(formula);
                } else {
                    wallet = "";
                }
                row += `,${wallet}`;
            }          
            rows.push(row);
        } else {
            let row = `${data['count']},${totalKeys.map((key) => { 
                let v = data[key]; 
                v = (v && v !== '...') ? stripDecimal(options.decimals, v) : v; 
                return `"${v}"`;
            })}`;
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
        bsc: false,
        eth: false,
        decimals: true,
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
            case '-bsc':
                options.bsc = true;
                break;
            case '-eth':
                options.eth = true;
                break;
            case '-D':
                options.decimals = false;
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
        const csvData = jsonToCsv(jsonData, options);

        fs.writeFileSync(outputFilePath, csvData);
        console.log(`Written: ${outputFilePath}`);
    } catch (error) {
        console.error('Error processing JSON to CSV:', error.message);
    }
}

main();

