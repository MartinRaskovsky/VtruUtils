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

const { Web3 } = require('../lib/libWeb3');
const Sections = require("./libSections");
const { formatNumber, formatNumbers, formatRawNumber, mergeUnique } = require("./vtruUtils");

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
        super(network);
        this.vtru = network.get(Web3.VTRU);
        this.bsc = network.get(Web3.BSC);
        this.eth = network.get(Web3.ETH);
    }

    /**
     * Retrieves and aggregates details from wallets.
     * 
     * @param {Array<string>} wallets - Wallet addresses.
     * @returns {Promise<Object|null>} The wallets details or null if below minBalance.
     */
    async get(wallets) {
        try {  
            wallets = mergeUnique([], wallets);

            const walletDetails = await super.get(wallets, true);
 
                const data = {
                    sectionVTRUHeld: formatNumbers(walletDetails.sectionVTRUHeld),
                    sectionVTRUStaked: formatNumbers(walletDetails.sectionVTRUStaked),
                    sectionVERSE: formatNumbers(walletDetails.sectionVERSE, 0),
                    sectionVIBE: formatNumbers(walletDetails.sectionVIBE, 0),                   
                    sectionVORTEX: formatNumbers(walletDetails.sectionVORTEX, 0),
                    sectionETH: this.eth ? formatNumbers(walletDetails.sectionETH, 0) : [],
                    sectionBNB: this.bsc ? formatNumbers(walletDetails.sectionBNB, 0) : [],                    
                    sectionSEVOX: this.bsc ? walletDetails.sectionSEVOX : [],
                    held: formatRawNumber(walletDetails.held),
                    staked: formatRawNumber(walletDetails.staked),
                    verses: formatNumber(walletDetails.verses, 0),
                    vibes: formatNumber(walletDetails.vibes, 0),
                    vortexs: formatNumber(walletDetails.vortexs, 0),
                    eths: this.eth ? formatRawNumber(walletDetails.eths) : "0",
                    bscs: this.bsc ? formatRawNumber(walletDetails.bscs) : "0",
                    sevoxs: this.bsc ? formatRawNumber(walletDetails.sevoxs) : "0",
                };

                return data;
        

        } catch (error) {
            console.error(`❌ Error retrieving wallet details:`, error.message);
            return null;
        }
    }

}

module.exports = WalletSections;
