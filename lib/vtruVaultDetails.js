/**
 * VtruVaultDetails.js
 * 
 * Handles the logic to collect and aggregate vault details.
 * Retrieves vault balances, associated wallets, and staking information,
 * ensuring efficient blockchain access and accurate summary reporting.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const { Web3 } = require('../lib/libWeb3');
const Sections = require("./libSections");
const { scaleUp, formatRawNumber } = require("./vtruUtils");

/**
 * Aggregates and processes vault details, extending wallet tracking capabilities.
 */
class VtruVaultDetails extends Sections {
    
    /**
     * Initializes the vault details aggregator.
     * 
     * @param {Object} network - The network instances.
     * @param {number} [minBalance=4000] - The minimum balance threshold.
     */
    constructor(network, minBalance = 4000, full = false) {
        super(network, full);
        this.vtru = network.get(Web3.VTRU);
        this.bsc = network.get(Web3.BSC);
        this.eth = network.get(Web3.ETH);
        this.minBalance = scaleUp(minBalance);
        this.totalVTRUHeld = 0n;
        this.totalVTRUStaked = 0n;
        this.totalHeld = 0n;
        this.totalStaked = 0n;
        this.analyzedVaultCount = 0;
    }

    /**
     * Retrieves and aggregates details for a specific vault.
     * 
     * @param {Object} vault - The Vault contract instance.
     * @param {number} index - The index of the vault being processed.
     * @returns {Promise<Object|null>} The vault details or null if below minBalance.
     */
    async get(vault, index) {
        try {
            const balance = await vault.vaultBalance();
            let wallets = await vault.getVaultWallets();

            const walletDetails = await super.get(wallets);
            const thisHeld = walletDetails.totalVTRUHeld + balance;

            this.totalHeld += thisHeld;
            this.totalStaked += walletDetails.totalVTRUStaked;
            this.analyzedVaultCount++;

            if (thisHeld >= this.minBalance) {
                this.totalVTRUHeld += thisHeld;
                this.totalVTRUStaked += walletDetails.totalVTRUStaked;

                const data = await super.get(wallets);
                data['count'] = this.analyzedVaultCount;
                data['index'] = index;
                data['address'] = vault.address,
                data['name'] = await vault.getName();
                data['balance'] = formatRawNumber(balance);
                data['hasStakes'] = await vault.hasStakes();

                super.formatTotals(data);
                data['totalVTRUHeld'] = formatRawNumber(thisHeld);

                return data;
            }

            return null;
        } catch (error) {
            console.error(`❌ Error retrieving vault details for ${vault.address}:`, error.message);
            return null;
        }
    }

    /**
     * Returns a summary of aggregated vault details.
     * 
     * @returns {Object} The summary data.
     */
    getSummary() {
        return {
            totalVTRUHeld: formatRawNumber(this.totalVTRUHeld, 0),
            totalVTRUStaked: formatRawNumber(this.totalVTRUStaked, 0),
            totalHeld: formatRawNumber(this.totalHeld, 0),
            totalStaked: formatRawNumber(this.totalStaked, 0),
            analyzedVaultCount: this.analyzedVaultCount,
        };
    }
}

module.exports = VtruVaultDetails;
