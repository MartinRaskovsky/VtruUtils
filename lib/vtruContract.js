/**
 * VtruContract.js
 * 
 * Handles the logic for interacting with smart contracts using ethers.js.
 * Provides methods to retrieve contract addresses and create contract instances.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */

const { ethers } = require("ethers");

/**
 * Represents a Vtru smart contract.
 * Provides utilities to fetch contract addresses and instances.
 */
class VtruContract {
    
    /**
     * Initializes the contract handler with a Web3 instance and contract name.
     * 
     * @param {VtruWeb3} web3 - The Vtru Web3 instance.
     * @param {string} name - The name of the contract.
     */
    constructor(web3, name) {
        this.web3 = web3;
        this.name = name;
    }

    /**
     * Retrieves the contract address for the given contract name.
     * 
     * @returns {string|null} The contract address, or null if not found.
     */
    getAddress() {
        if (!this.name) {
            console.error("❌ Contract name is not available.");
            return null;
        }

        const address = this.web3.getConfig().getContractAddress(this.name);
        if (!address) {
            console.error(`❌ Contract address for '${this.name}' does not exist.`);
            return null;
        }

        return address;
    }

    /**
     * Creates and returns an ethers.js contract instance.
     * 
     * @returns {ethers.Contract|null} The contract instance, or null if creation fails.
     */
    getContract() {
        const abi = this.web3.getConfig().getAbi(this.name);
        const address = this.getAddress();
    
        if (!abi || !address) {
            console.error("❌ Failed to create contract instance due to missing ABI or address.");
            return null;
        }
    
        try {
            const provider = this.web3.getProvider();
            return new ethers.Contract(address, abi, provider);
        } catch (error) {
            console.error("❌ Error creating contract instance:", error.message);
            return null;
        }
    }
}

module.exports = VtruContract;
