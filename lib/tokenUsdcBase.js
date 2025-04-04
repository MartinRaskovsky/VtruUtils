/**
 * tokenUsdcBase.js
 * 
 * Specialized handler for USDC on Base using manual low-level call.
 * Ensures compatibility with Base RPC quirks without affecting other chains.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 */

const TokenCommon = require("./tokenCommon");
const { ethers } = require("ethers");

class TokenUsdcBase extends TokenCommon {
  constructor(web3) {
    super(web3, "USDC");
  }

  /**
   * Retrieves the USDC balance on Base using a low-level call.
   */
  async getBalance(wallet) {
    const contract = this.getContract();
    const iface = new ethers.Interface([
      "function balanceOf(address) view returns (uint256)"
    ]);
    const data = iface.encodeFunctionData("balanceOf", [wallet]);

    const call = {
      to: contract.getAddress(),
      data
    };

    try {
      const raw = await this.web3.provider.call(call);
      if (raw === "0x") {
        //console.warn(`⚠️ USDC on Base: empty response for ${wallet}, returning 0`);
        return 0n;
      }
      return BigInt(raw);
    } catch (err) {
      console.error(`❌ Base USDC low-level call failed for ${wallet}:`, err.reason || err.message);
      return 0n;
    }
  }
}

module.exports = TokenUsdcBase;

