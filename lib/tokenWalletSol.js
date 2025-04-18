/**
 * tokenWalletSol.js
 * 
 * Specialized subclass for Solana native balance retrieval using getMultipleAccountsInfo.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const TokenWallet = require("./tokenWallet");
const { PublicKey } = require('@solana/web3.js');
const { isPermanentError } = require('./libErrors');
const { timeoutPromise } = require('./libAsync');

const Logger = require('./libLogger');

const BATCH = "batch.log";

class tokenWalletSol extends TokenWallet {
    constructor(web3) {
        super(web3);
        this.connection = web3.getProvider();  // Assumes web3 wraps Connection
        //console.log(`tokenWalletSol id=${web3.id}`);
    }

    /**
     * Retrieves balances for multiple Solana wallets using getMultipleAccountsInfo.
     * 
     * @param {Array<string>} wallets - Wallet addresses (base58 format).
     * @returns {Promise<Array<bigint|null>>} Balances in lamports or null on failure.
     */
    async getBalances(wallets) {
        const BATCH_SIZE = 100;
        const results = [];
        const reportedErrors = new Set();
    
        for (let i = 0; i < wallets.length; i += BATCH_SIZE) {
            const batch = wallets.slice(i, i + BATCH_SIZE);
    
            const pubKeys = batch.map(addr => {
                try {
                    return new PublicKey(addr);
                } catch (e) {
                    return null;
                }
            });
    
            try {
                const accounts = await Promise.race([
                    this.connection.getMultipleAccountsInfo(pubKeys.filter(Boolean)),
                    timeoutPromise(5000, `Solana batch ${i}-${i + batch.length}`)
                ]);
    
                // accounts[] only has entries for valid pubKeys, so we track them with a separate index
                let accIndex = 0;

                for (let j = 0; j < batch.length; j++) {
                    const wallet = batch[j];
                    const label = `Solana wallet ${wallet}`;
                    let value;
    
                    try {
                        const pubKey = pubKeys[j];
                        if (!pubKey) throw new Error("Invalid public key");
    
                        const acc = accounts[accIndex++] || null;
                        value = acc ? BigInt(acc.lamports) : 0n;
                    } catch (error) {
                        const reason = error?.message || "Unknown error";
                        const shortMsg = reason.split("\n")[0];
                        const logKey = `Solana:${shortMsg}`;
    
                        if (!reportedErrors.has(logKey)) {
                            Logger.warn(`⚠️ ${label}: ${shortMsg} → only reporting once`, BATCH);
                            reportedErrors.add(logKey);
                        }
    
                        value = isPermanentError(reason) ? 0n : -1n;
                    }
    
                    results.push(value);
                }
            } catch (batchError) {
                // If the entire RPC call fails
                const reason = batchError?.message || "Unknown error";
                const shortMsg = reason.split("\n")[0];
                const logKey = `Solana:BatchFail:${shortMsg}`;
    
                if (!reportedErrors.has(logKey)) {
                    Logger.error(`🔥 Solana RPC batch failed: ${shortMsg}`, BATCH);
                    reportedErrors.add(logKey);
                }
    
                results.push(...Array(batch.length).fill(-1n));
            }
        }
    
        return results;
    }
    
}

module.exports = tokenWalletSol;

