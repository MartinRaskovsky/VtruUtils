/**
 * VtruStakedContract.js
 * Handles the logic for interacting with the CoreStake contract.
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 */


const { isAddress, getAddress } = require("ethers"); // Import from ethers.js

//const { scaleDownUnits } = require("./vtruUtils");
const VtruContract = require("./vtruContract");

/**
 * Class for interacting with the CoreStake contract.
 */
class VtruStakedContract extends VtruContract {
    /**
     * Constructor for VtruStakedContract.
     * @param {VtruConfig} config - The Vtru configuration instance.
     * @param {VtruWeb3} web3 - The Vtru Web3 instance.
     */
    constructor(config, web3) {
        super(config, web3, "CoreStake");
    }

    /**
     * Fetches the staked units for a given wallet.
     * @param {string} wallet - The wallet address.
     * @returns {Promise<number|null>} The scaled balance, or null on failure.
     */

    async getStakedBalance(wallet) {
        try {
            const contract = this.getContract();
            if (!contract) throw new Error("Contract instance unavailable.");
    
            // ✅ Ensure wallet is a valid Ethereum address
            if (!isAddress(wallet)) {
                throw new Error(`Invalid Ethereum address: ${wallet}`);
            }
    
            const walletAddress = getAddress(wallet); // Preserve checksum
            const result = await contract.getUserStakesInfo(walletAddress);
            const stakes = result[0];
    
            if (!Array.isArray(stakes)) throw new Error("Invalid stake data format.");

            const balance = stakes.reduce((sum, stake) => sum + (stake[4] || 0n), 0n);
            return balance;
            // ✅ Ensure returning a valid number
            //const scaledBalance = scaleDownUnits(balance);
            //return isNaN(scaledBalance) ? null : scaledBalance;
        } catch (error) {
            console.error(`Error fetching balance for wallet ${wallet}:`, error.message);
            return null;
        }
    }
    
    /**
     * Fetches the staked units for multiple wallets.
     * @param {Array<string>} wallets - List of wallet addresses.
     * @returns {Promise<Array<number>>} An array of balances, with null for failures.
     */
    async getStakedBalances(wallets) {
        try {
            if (!Array.isArray(wallets)) {
                throw new Error("Invalid wallets input.");
            }
            if (wallets.length === 0) {
                return [];
            }

            const promises = wallets.map((wallet) => this.getStakedBalance(wallet));
            return await Promise.all(promises);
        } catch (error) {
            console.error("Error fetching staked units for wallets:", error.message);
            return [];
        }
    }
}

module.exports = VtruStakedContract;

