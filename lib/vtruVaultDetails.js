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

const Sections = require("./libSections");
const { scaleUp } = require("./vtruUtils");

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
  
        this.minBalance = scaleUp(minBalance);
        this.full = full;
        this.totals = { analyzedVaultCount: 0 };
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
            let wallets = [vault.getAddress(), ...await vault.getVaultWallets()];
            const walletDetails = await super.get(wallets);

            super.finalsAdd(this.totals, walletDetails);
            this.totals.analyzedVaultCount++;

            if (walletDetails.totalVTRUHeld >= this.minBalance) {
                walletDetails['count'] = this.totals.analyzedVaultCount;
                walletDetails['index'] = index;
                walletDetails['name'] = await vault.getName();

                super.totalsAdd(this.totals, walletDetails);
                super.formatTotals(walletDetails);
                return walletDetails;
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
        super.totalsClose(this.totals);
        super.finalsClose(this.totals);
        return this.totals;
    }

    getTotals(summary)   { return super.getTotals(summary); }
    getTotalSep(summary) { return super.getTotalSep(summary); }
    getFinals(summary)   { return super.getFinals(summary); }

}

module.exports = VtruVaultDetails;
