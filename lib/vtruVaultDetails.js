/**
 * VtruVaultDetails.js
 * Handles the logic to collect vault details.
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 */

const VtruWalletDetails = require("./vtruWalletDetails");
const { scaleUp, formatNumber, formatNumbers, formatRawNumber, mergeUnique } = require("./vtruUtils");

/**
 * Class for aggregating vault details.
 */
class VtruVaultDetails extends VtruWalletDetails {
    /**
     * Constructor for VtruVaultDetails.
     * @param {Object} vtru - The vtru web3 instance.
     * @param {Object} [bsc =null] - The vsc web3 instance.
     * @param {number} [minBalance=4000] - The minimum balance threshold.
     */
    constructor(vtru, bsc = null, minBalance = 4000) {
        super(vtru, bsc);
        this.vtru = vtru;
        this.bsc = bsc;
        this.minBalance = scaleUp(minBalance);
        this.held = 0n;
        this.staked = 0n;
        this.totalHeld = 0n;
        this.totalStaked = 0n;
        this.analyzedVaultCount = 0;
    }

    /**
     * Retrieves and aggregates vault details.
     * @param {Object} vault - The Vault contract instance.
     * @param {number} index - The index of the vault in processing.
     * @param {boolean} [full=0] - Whether to fetch full details.
     * @param {Array<string>} extraWallets=[] - Possible extra wallet addresses.
     * @returns {Promise<Object|null>} The vault details or null if below minBalance.
     */
    async get(vault, index, full = 0, extraWallets = []) {
        try {
            const balance = await vault.vaultBalance();
            let wallets = await vault.getVaultWallets();
            
            // Ensure wallets list is unique
            wallets = mergeUnique(extraWallets, wallets);

            const walletDetails = await super.get(wallets, full);
            const thisHeld = walletDetails.held + balance;

            this.totalHeld += thisHeld;
            this.totalStaked += walletDetails.staked;
            this.analyzedVaultCount++;

            if (thisHeld >= this.minBalance) {
                this.held += thisHeld;
                this.staked += walletDetails.staked;

                const data = {
                    count: this.analyzedVaultCount,
                    index,
                    address: vault.address,
                    name: await vault.getName(),
                    balance: formatRawNumber(balance),
                    hasStakes: await vault.hasStakes(),
                    wallets,
                    walletBalances: formatNumbers(walletDetails.walletBalances),
                    walletStaked: formatNumbers(walletDetails.walletStaked),
                    walletVibes: full ? formatNumbers(walletDetails.walletVibes, 0) : [],
                    walletVerses: full ? formatNumbers(walletDetails.walletVerses, 0) : [],
                    held: formatRawNumber(thisHeld),                // with decimals for alignment via dot in web UI
                    staked: formatRawNumber(walletDetails.staked),  // ditto
                    verses: full ? formatNumber(walletDetails.verses, 0) : "0",
                    vibes: full ? formatNumber(walletDetails.vibes, 0) : "0",
                };
                if (this.bsc) {
                    data['sevoxs'] = formatRawNumber(walletDetails.sevoxs);
                    data['walletSevoxs'] = walletDetails.walletSevoxs;
                }
                return data;
            }

            return null;
        } catch (error) {
            console.error(`Error retrieving vault details for ${vault.address}:`, error.message);
            return null;
        }
    }

    /**
     * Returns a summary of aggregated vault details.
     * @returns {Object} The summary data.
     */
    getSummary() {
        return {
            held: formatRawNumber(this.held, 0),
            staked: formatRawNumber(this.staked, 0),
            totalHeld: formatRawNumber(this.totalHeld, 0),
            totalStaked: formatRawNumber(this.totalStaked, 0),
            analyzedVaultCount: this.analyzedVaultCount,
        };
    }
}

module.exports = VtruVaultDetails;

