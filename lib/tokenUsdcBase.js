/**
 * tokenUsdcBase.js
 * 
 * Specialized handler for USDC on Base using ABI-based call to ensure compatibility
 * with Base RPC behavior.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 */

const TokenCommon = require("./tokenCommon");
const { ethers } = require("ethers");

class TokenUsdcBase extends TokenCommon {
  #resolvedAddress = null;

  constructor(web3) {
    super(web3, "USDC");
  }

  /**
   * Retrieves the USDC balance on Base using an ABI contract call.
   * If the call fails, returns 0n. The UI may choose to mark this as “unavailable.”
   * 
   * @param {string} wallet - The wallet address to query.
   * @returns {Promise<bigint>} - Balance in raw units (or -1n if failed).
   */
  async getBalance(wallet) {
      const abi = ["function balanceOf(address) view returns (uint256)"];

      if (!this.#resolvedAddress) {
        this.#resolvedAddress = await this.getContract().getAddress();
      }

      const contract = new ethers.Contract(this.#resolvedAddress, abi, this.web3.provider);

      const result = await contract.balanceOf(wallet);
      return BigInt(result);
    }
}

module.exports = TokenUsdcBase;
