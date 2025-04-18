/**
 * ContractProvider.js
 * 
 * Generic smart contract handler for both ethers.js and viem.
 * Retrieves contract ABI/address and exposes both ethers and viem-compatible access.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const { ethers } = require("ethers");

class ContractProvider {
    /**
     * Initializes the contract handler with a Web3 instance and contract name.
     * 
     * @param {Web3} web3 - The Web3 configuration wrapper.
     * @param {string} name - Name of the token/contract.
     */
    constructor(web3, name) {
        this.web3 = web3;
        this.name = name;
    }

    /**
     * Returns the address of the contract.
     * 
     * @returns {string|null}
     */
    getAddress() {
        if (!this.name) return null;
        return this.web3.getConfig().getContractAddress(this.name);
    }

    /**
     * Returns the ABI of the contract.
     * 
     * @returns {Array|Object|null}
     */
    getAbi() {
        return this.web3.getConfig().getAbi(this.name);
    }

    /**
     * Returns a standard ethers.js contract instance.
     * 
     * @returns {ethers.Contract|null}
     */
    getContract() {
        const abi = this.getAbi();
        const address = this.getAddress();
        if (!abi || !address) return null;

        try {
            return new ethers.Contract(address, abi, this.web3.getProvider());
        } catch (err) {
            console.error("❌ Error creating ethers contract:", err.message);
            return null;
        }
    }

}    

module.exports = ContractProvider;

