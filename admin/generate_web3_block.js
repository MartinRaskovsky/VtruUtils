#!/usr/bin/env node

/**
 * generate_web3_block.js
 *
 * GENERATED FILE — DO NOT EDIT BY HAND
 * Replaces Web3 constant block in libWeb3.js using section-config.js
 *
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 */

const fs = require('fs');
const path = require('path');
const config = require('./section-config');

const FILE_PATH = path.resolve(__dirname, '../lib/libWeb3.js');
const OUT_PATH = path.resolve(__dirname, '../lib/libWeb3.generated.js');

const startTag = '// ==== GENERATED WEB3 START ====';
const endTag = '// ==== GENERATED WEB3 END ====';

const netKeys = Object.keys(config.networks);

const capitalize = str => str.toUpperCase();
const lower = str => str.toLowerCase();

const capitalLines = netKeys.map(n => `    static ${capitalize(n)} = "${lower(n)}";`).join('\n');
const idList = netKeys.map(n => `Web3.${capitalize(n)}`).join(', ');

// Separate EVM, SOL, and TEZ networks
const evmNetworks = netKeys.filter(n => config.isInChain(n, 'EVM')).map(n => `Web3.${capitalize(n)}`).join(', ');
const solNetworks = netKeys.filter(n => config.isInChain(n, 'SOL')).map(n => `Web3.${capitalize(n)}`).join(', ');
const tezNetworks = netKeys.filter(n => config.isInChain(n, 'TEZ')).map(n => `Web3.${capitalize(n)}`).join(', ');

// Generate chainIdMap, currency, rpcUrls, and jsonPaths dynamically
const generateEntries = (type, data) => {
    return Object.entries(data).map(([k, v]) => `        [Web3.${k}]: ${type === 'number' ? v : `"${v}"`},`).join('\n');
};

const chainIdEntries = generateEntries('number', config.chainIdMap);
const currencyEntries = generateEntries('string', config.currency);
const rpcUrlEntries = generateEntries('string', config.rpcUrls);
const jsonPathEntries = generateEntries('string', config.jsonPaths);

// Initialize blockchain cases
const initializeBlockchainSwitch = netKeys.map(network => {
    const chain = config.netToChain[network];
    if (chain === 'EVM') {
        return `          case Web3.${network}: // EVM network\n            return new EvmBlockchain(provider);`;
    } else if (chain === 'SOL') {
        return `          case Web3.${network}: // Solana network\n            return new SolanaBlockchain(provider);`;
    } else if (chain === 'TEZ') {
        return `          case Web3.${network}: // Tezos network\n            return new TezosBlockchain(provider);`;
    }
}).join('\n');

const generatedBlock = `${startTag}
    static CHAIN_EVM = "evm";
    static CHAIN_SOL = "sol";
    static CHAIN_TEZ = "tez";

${capitalLines}

    static networkIds = [${idList}];
    static NET_EVM = [${evmNetworks}];
    static NET_SOL = [${solNetworks}];
    static NET_TEZ = [${tezNetworks}];

    static chainIdMap = {
${chainIdEntries}
    };

    static currency = {
${currencyEntries}
    };

    static rpcUrls = {
${rpcUrlEntries}
    };

    static jsonPaths = {
${jsonPathEntries}
    };

    initializeProvider(id) {
        if (!Web3.providers[id]) {
            switch (id) {
                case Web3.SOL:
                    Web3.providers[id] = new Connection(this.rpcUrl);
                    break;
                case Web3.TEZ:
                    Web3.providers[id] = new TezosToolkit(this.rpcUrl);
                    break;
                default:
                    Web3.providers[id] = new ethers.JsonRpcProvider(this.rpcUrl);
                    break;
            }
        }
    }

    initializeBlockchain(provider) {
        switch (this.id) {
${initializeBlockchainSwitch}
          default:
            throw new Error('Unsupported blockchain ID');
        }
    }
${endTag}`;

const original = fs.readFileSync(FILE_PATH, 'utf8');
const pattern = new RegExp(`^\s*${startTag}[\\s\\S]*?^\s*${endTag}`, 'm');
if (!pattern.test(original)) {
    console.error("❌ Block not found in libWeb3.js — check comment indentation");
}

const replaced = original.replace(pattern, generatedBlock);

fs.writeFileSync(OUT_PATH, replaced);
console.log(`✅ libWeb3.generated.js written → ${OUT_PATH}`);
