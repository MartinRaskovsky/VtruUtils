/**
 * VtruWalletDetails.js
 * Handles the logic to collect wallet details.
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 */

const { formatRawNumber, formatNumber, formatNumbers, formatRawNumbers } = require("./vtruUtils");
const VtruStakedContract = require("./vtruStakedContract");
const VtruVerseContract = require("./vtruVerseContract");
const VtruVibeContract = require("./vtruVibeContract");

/**
 * Class for aggregating wallet details.
 */
class VtruWalletDetails {
    /**
     * Constructor for VtruWalletDetails.
     * @param {Object} config - The configuration instance.
     * @param {Object} web3 - The Web3 instance.
     */
    constructor(config, web3) {
        this.config = config;
        this.web3 = web3;
        
        this.stakedContract = new VtruStakedContract(config, web3);
        this.verseContract = new VtruVerseContract(config, web3);
        this.vibeContract = new VtruVibeContract(config, web3);
    }

    /**
     * Retrieves wallet details including balances, stakes, verses, and vibes.
     * @param {Array<string>} wallets - The wallet addresses.
     * @param {boolean} [full=false] - Whether to fetch VERSE and VIBE balances.
     * @param {boolean} [format=false] - Whether to format numerical outputs.
     * @returns {Promise<Object>} The wallet details.
     */
    async get(wallets, full = false, format = false) {
        try {
            const [
                walletBalances,
                walletStaked,
                walletVerses,
                walletVibes
            ] = await Promise.all([
                this.web3.getWalletRawBalances(wallets),
                this.stakedContract.getStakedBalances(wallets),
                full ? this.verseContract.getVerseBalances(wallets) : [],
                full ? this.vibeContract.getVibeBalances(wallets) : []
            ]);

            const thisHeld = walletBalances.reduce((sum, balance) => sum + (balance || 0n), 0n);
            const thisStaked = walletStaked.reduce((sum, balance) => sum + (balance || 0n), 0n);
            const thisVerses = walletVerses.reduce((sum, balance) => sum + (balance || 0n), 0n);
            const thisVibes = walletVibes.reduce((sum, balance) => sum + (balance || 0n), 0n);

            return {
                wallets,
                walletBalances: formatRawNumbers(walletBalances),
                walletStaked: formatRawNumbers(walletStaked),
                walletVerses: formatNumbers(walletVerses),
                walletVibes: formatNumbers(walletVibes),
                held: format ? formatRawNumber(thisHeld) : thisHeld,
                staked: format ? formatRawNumber(thisStaked) : thisStaked,
                verses: format ? formatNumber(thisVerses) : thisVerses,
                vibes: format ? formatNumber(thisVibes) : thisVibes,
            };
        } catch (error) {
            console.error("Error fetching wallet details:", error.message);
            return {
                wallets,
                walletBalances: [],
                walletStaked: [],
                walletVerses: [],
                walletVibes: [],
                held: format ? formatRawNumber(0n) : 0n,
                staked: format ? formatRawNumber(0n) : 0n,
                verses: format ? formatNumber(0) : 0,
                vibes: format ? formatNumber(0) : 0,
            };
        }
    }
}

module.exports = VtruWalletDetails;

