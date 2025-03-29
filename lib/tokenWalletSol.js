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

        for (let i = 0; i < wallets.length; i += BATCH_SIZE) {
            const batch = wallets.slice(i, i + BATCH_SIZE);

            try {
                //console.log(`tokenWalletSol length=${batch.length}`);
                const pubKeys = batch.map(addr => new PublicKey(addr));
                const accounts = await this.connection.getMultipleAccountsInfo(pubKeys);

                for (let j = 0; j < accounts.length; j++) {
                    const acc = accounts[j];
                    results.push(acc ? BigInt(acc.lamports) : null);
                }
            } catch (error) {
                console.error(`❌ Error fetching Solana batch [${i}-${i + BATCH_SIZE}]:`, error.message);
                // Fill batch with nulls to preserve order
                results.push(...Array(batch.length).fill(null));
            }
        }

        return results;
    }
}

module.exports = tokenWalletSol;

