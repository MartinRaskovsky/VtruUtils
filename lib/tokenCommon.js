/**
* tokenCommon.js
* 
* Abstract base class for accessing Vtru token balances and details.
* 
* Subclasses must implement:
*   - getBalance(wallet): retrieve balance for one wallet
*   - getDetail(wallet): retrieve detail for one wallet
* 
* This class provides common support for:
*   - Batching wallet calls using `executeBatch`
*   - Filtering null results
*   - Chain-specific optimizations via `web3.getId()`
* 
* Subclasses typically fall into two categories:
*   - ERC-20 style tokens: use `tokenCommonEvm.js` with multicall for efficiency
*   - NFT/custom logic tokens: override `getBalance(wallet)` individually
* 
* Usage pattern:
*   - For single-wallet queries, use subclass implementation of getBalance/getDetail
*   - For multi-wallet queries, call getBalances(wallets) or getDetails(wallets)
* 
* Author: Dr. Martín Raskovsky
* Date: March 2025
*/

const libContractProvider = require("./libContractProvider");
const { executeBatch } = require("./libBatchEngine");
const Web3 = require("./libWeb3");

/**
 * Base class for Vtru token contracts.
 * Supports querying balances and details for single and multiple wallets.
 */
class TokenCommon extends libContractProvider {
    
    /**
     * Initializes the token contract instance.
     * 
     * @param {Object} web3 - The Web3 instance.
     * @param {string} tokenType - The type of token (e.g., "VIBE", "VERSE", ...).
     */
    constructor(web3, tokenType) {
        super(web3, tokenType);
        this.web3 = web3;
        this.id = web3.getId();
        this.tokenType = tokenType;
        if (new.target === TokenCommon) {
            throw new Error("Cannot instantiate abstract class TokenCommon directly.");
        }
    }

    /**
     * Abstract method to retrieve the token balance for a given wallet.
     * Subclasses must implement this method.
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<number|bigint|null>} The token balance, or null if retrieval fails.
     */
    async getBalance(wallet) {
        throw new Error("Abstract method getBalance(wallet) must be implemented in subclass.");
    }

    /**
     * Abstract method to fetch details from the contract for a given wallet.
     * Subclasses must implement this method.
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<Object|null>} The token details, or null if retrieval fails.
     */
    async getDetail(wallet) {
        throw new Error("Abstract method getDetail(wallet) must be implemented in subclass.");
    }

    /**
     * Retrieves token balances for multiple wallets in parallel.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<number|bigint|null>>} An array of token balances.
     */
    async getBalances(wallets) {
        const fetch = async (wallet) => await this.getBalance(wallet);
        const batchSize = this.web3.getConfig().getBatchSize();
        //console.log(`tokenCommon::getBalances(ID=${this.id} batchSize=${batchSize} #wallets=${wallets.length})`);
        const balances = await executeBatch(wallets, fetch, batchSize);
        return balances.filter(balance => balance !== null);
    }

    /**
     * Retrieves token details for multiple wallets in parallel.
     * 
     * @param {Array<string>} wallets - The wallet addresses.
     * @returns {Promise<Array<Object|null>>} An array of token details.
     */
    async getDetails(wallets) {
        const fetch = async (wallet) => await this.getDetail(wallet);
        const batchSize = this.web3.getConfig().getBatchSize();
        const details = await executeBatch(wallets, fetch, batchSize);
        return details.filter(detail => detail !== null).flat();
    }
}

module.exports = TokenCommon;

