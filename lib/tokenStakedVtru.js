/**
 * tokenStakedVtru.js
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

const TokenCommon = require("./tokenCommon");
const Web3 = require("./libWeb3");
const { executeBatch } = require('./libBatchEngine');

/**
 * Manages interactions with the CoreStake contract, providing methods
 * to fetch staked balances, stake details, and maturity calculations.
 */
class TokenStakedVtru extends TokenCommon {
    
    /**
     * Initializes the contract handler and provider instance.
     * 
     * @param {Object} web3 - Web3 provider instance.
     */
    constructor(web3) {
        super(web3, "CoreStake");
        this.provider = web3.getProvider();
        this.id = web3.getId();
    }

    /**
     * Retrieves the total staked balance for a specific wallet.
     * 
     * @param {Object} contract - The contract instance.
     * @param {string} wallet - Ethereum wallet address.
     * @returns {Promise<bigint|null>} The total staked amount or null if an error occurs.
     */
    async getBalance(wallet) {  
        const contract = this.getContract();
        const result = await contract.getUserStakesInfo(wallet);
        const stakes = result[0];

        if (!Array.isArray(stakes)) throw new Error("❌ Invalid stake data format.");

        const balance = stakes.reduce((sum, stake) => sum + (stake[4] || 0n), 0n);
        return balance;
    }

    /**
     * Retrieves detailed staking information for a specific wallet, including maturity.
     * 
     * @param {Object} contract - The contract instance.
     * @param {string} wallet - Ethereum wallet address.
     * @returns {Promise<Object[]|null>} An array of stake details, or null if an error occurs.
     */
    async getDetail(wallet) {
        const contract = this.getContract();
        const result = await contract.getUserStakesInfo(wallet);
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
    }

    /** Aliases for clarity */
    async getStakedBalance(wallet) {
        return this.getBalance(wallet);
    }

    async getStakedBalances(wallets) {
        const fetch = async (wallet) => { return await this.getBalance(wallet); };
        const batchSize = this.web3.getConfig().getBatchSize();
        return await executeBatch(wallets, fetch, batchSize);
    }

    async getStakedDetail(wallet) {
        console.log('getStakedDetail wallet=', wallet);
        return this.getDetail(wallet);
    }

    async getStakedDetails(wallets) {
        return (await this.getDetails(wallets));
    }
}

module.exports = TokenStakedVtru;

