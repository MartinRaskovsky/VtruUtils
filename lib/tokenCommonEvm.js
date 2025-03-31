/**
 * tokenCommonEvm.js
 * 
 * Concrete subclass of tokenCommon.js for ERC-20 compatible tokens.
 * Uses viem-based multicall to efficiently fetch balances for many wallets.
 * 
 * Only applicable to tokens with a standard `balanceOf(address)` interface.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const TokenCommon = require('./tokenCommon');
const { multicall } = require('./libMulticall'); // viem-based multicall helper

class TokenCommonEvm extends TokenCommon {

    constructor(web3, tokenName) {
        super(web3, tokenName);
        this.web3 = web3;
        this.token = tokenName;
      }
    
    /**
     * Retrieves balance for a single wallet using balanceOf().
     * 
     * @param {string} wallet - The wallet address.
     * @returns {Promise<bigint|null>} The balance or null if failed.
     */
    async getBalances(wallets) {
        const viemInfo = this.getViemContract();
        if (!viemInfo) {
          console.error("❌ getViemContract() returned null");
          return wallets.map(() => null);
        }
      
        const { address, abi, client } = viemInfo;
        const web3 = this.web3; // ✅ explicitly grab it from the class
      
        const multicallAddress = web3.getViemChain()?.contracts?.multicall3?.address;
        let canMulticall = false;
        
        if (multicallAddress) {
          canMulticall = await client.getBytecode({ address: multicallAddress })
            .then(code => code && code !== '0x')
            .catch(() => false);
        }
        
        if (canMulticall) {
          // ✅ Use multicall
          const calls = wallets.map((wallet) => ({
            address,
            abi,
            functionName: 'balanceOf',
            args: [wallet],
          }));
      
          const results = await require('./libMulticall').multicall(web3.getNumericChainId(), calls);
          return results.map((r) => r?.status === 'success' ? r.data : null);
        } else {
          // ⚠️ Fallback to individual calls
          //console.warn(`⚠️ Multicall not supported for ${this.token || 'contract'} [${address}] on ${this.web3.getViemChain()?.name || this.web3.id} — using individual readContract() fallback.`);
      
          const results = [];
          for (const wallet of wallets) {
            try {
              const value = await client.readContract({
                address,
                abi,
                functionName: 'balanceOf',
                args: [wallet],
              });
              results.push(value);
            } catch (err) {
              console.error(`❌ Error reading balance for ${wallet}:`, err.message);
              results.push(null);
            }
          }
      
          return results;
        }
      }
    }     

module.exports = TokenCommonEvm;

