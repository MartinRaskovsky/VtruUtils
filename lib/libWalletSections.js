/**
 * LibWalletSections.js
 * 
 * Handles the logic to collect and aggregate wallet details.
 * Retrieves wallet balances,
 * ensuring efficient blockchain access and accurate summary reporting.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

//const Web3 = require('../lib/libWeb3');
const Sections = require("./libSections");
const { mergeUnique } = require("./vtruUtils");

/**
 * Aggregates and processes wallet details.
 */
class WalletSections extends Sections {
    
    /**
     * Initializes the wallet details aggregator.
     * 
     * @param {Object} network - The network instances.
     */
    constructor(network) {
        super(network, true);
    }

    /**
     * Retrieves and aggregates details from wallets.
     * 
     * @param {Array<string>} wallets - Wallet addresses.
     * @returns {Promise<Object|null>} The wallets details or null if below minBalance.
     */
    async get(wallets, toLower = 1) {
        try {  
            wallets = mergeUnique([], wallets, toLower);
            const data = await super.get(wallets);

            super.formatTotals(data);
            data['networkKeys']   = super.getNetworkKeys();
            data['sectionTitles'] = super.getSectionTitles();
            data['sectionKeys']   = super.getSectionKeys();
            data['totalKeys']     = super.getTotalKeys();
            data['decimals']      = super.getDecimals();
            return data;

        } catch (error) {
            console.error(`❌ Error retrieving wallet details:`, error.message);
            return null;
        }
    }

}

module.exports = WalletSections;
