/**
 * VtruStakedContract.js
 * 
 * Handles interaction with the CoreStake contract, providing methods
 * to retrieve staked balances and stake details for individual and
 * multiple wallets, including maturity calculation.
 * 
 * Optimized for blockchain efficiency by reducing redundant contract calls
 * and utilizing batch processing where applicable.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const { isAddress, getAddress } = require("ethers");
const VtruContract = require("./vtruContract");

/**
 * Manages interactions with the CoreStake contract, providing methods
 * to fetch staked balances, stake details, and maturity calculations.
 */
class VtruStakedContract extends VtruContract {
    
    /**
     * Initializes the contract handler and provider instance.
     * 
     * @param {Object} web3 - Web3 provider instance.
     */
    constructor(web3) {
        super(web3, "CoreStake");
        this.provider = web3.getProvider(); // Assign provider at construction
    }

    /**
     * Retrieves the total staked balance for a specific wallet.
     * 
     * @param {string} wallet - Ethereum wallet address.
     * @returns {Promise<bigint|null>} The total staked amount or null if an error occurs.
     */
    async getStakedBalance(wallet) {
        try {
            if (!isAddress(wallet)) throw new Error(`Invalid Ethereum address: ${wallet}`);

            const contract = this.getContract();
            if (!contract) throw new Error("❌ Contract instance unavailable.");

            const walletAddress = getAddress(wallet);
            const result = await contract.getUserStakesInfo(walletAddress);
            const stakes = result[0];

            if (!Array.isArray(stakes)) throw new Error("❌ Invalid stake data format.");

            return stakes.reduce((sum, stake) => sum + (stake[4] || 0n), 0n);
        } catch (error) {
            console.error(`❌ Error fetching staked balance for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    /**
     * Retrieves staked balances for multiple wallets in parallel.
     * 
     * @param {string[]} wallets - Array of Ethereum wallet addresses.
     * @returns {Promise<bigint[]>} Array of staked balances corresponding to each wallet.
     */
    async getStakedBalances(wallets) {
        try {
            if (!Array.isArray(wallets) || wallets.length === 0) throw new Error("Expected a non-empty array of wallets.");
            
            return await Promise.all(wallets.map(wallet => this.getStakedBalance(wallet)));
        } catch (error) {
            console.error("❌ Error fetching staked balances for wallets:", error.message);
            return [];
        }
    }

    /**
     * Retrieves detailed staking information for a specific wallet, including maturity.
     * 
     * @param {string} wallet - Ethereum wallet address.
     * @returns {Promise<Object[]|null>} An array of stake details, or null if an error occurs.
     */
    async getStakedDetail(wallet) {
        try {
            if (!isAddress(wallet)) throw new Error(`Invalid Ethereum address: ${wallet}`);

            const contract = this.getContract();
            if (!contract) throw new Error("❌ Contract instance unavailable.");

            const walletAddress = getAddress(wallet);
            const result = await contract.getUserStakesInfo(walletAddress);
            const stakes = result[0];

            if (!Array.isArray(stakes)) throw new Error("❌ Invalid stake data format.");

            // Fetch the current block number once (optimized for efficiency)
            const currentBlock = Number(await this.provider.getBlockNumber());

            return stakes.map(stake => {
                const endBlock = Number(stake[3]); // Convert from BigInt
                const maturitySeconds = Math.max(0, (endBlock - currentBlock) * 5);
                const maturityDays = Math.floor(maturitySeconds / 86400); // Convert seconds to days

                return {
                    wallet,
                    amount: stake[4],
                    unstakeAmount: stake[5],
                    lockedAmount: stake[6],
                    availableToUnstake: stake[7] ? stake[6] : 0n, // If eligible, unstakeable amount = lockedAmount
                    maturityDays
                };
            });
        } catch (error) {
            console.error(`❌ Error fetching staking details for wallet ${wallet}:`, error.message);
            return null;
        }
    }

    /**
     * Retrieves staking details for multiple wallets in parallel.
     * 
     * @param {string[]} wallets - Array of Ethereum wallet addresses.
     * @returns {Promise<Object[]>} Combined array of staking details for all wallets.
     */
    async getStakedDetails(wallets) {
        try {
            if (!Array.isArray(wallets) || wallets.length === 0) throw new Error("Expected a non-empty array of wallets.");

            const detailsArray = await Promise.all(wallets.map(wallet => this.getStakedDetail(wallet)));
            return detailsArray.flat();
        } catch (error) {
            console.error("❌ Error fetching staking details for wallets:", error.message);
            return [];
        }
    }

    /**
     * Alias for getStakedBalances, used for consistency.
     * 
     * @param {string[]} wallets - Array of Ethereum wallet addresses.
     * @returns {Promise<bigint[]>} Array of staked balances.
     */
    async getBalances(wallets) {
        return await this.getStakedBalances(wallets);
    }
}

module.exports = VtruStakedContract;
