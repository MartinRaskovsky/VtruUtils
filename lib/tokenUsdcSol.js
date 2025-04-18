/**
 * tokenUsdcSol.js
 * 
 * Solana-specific implementation of USDC balance retrieval.
 * Overrides the getBalance and getBalances methods from tokenUsdc.js
 * to use Solana's SPL token API with ATA pattern and batched access.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const TokenUsdc = require("./tokenUsdc");
const { PublicKey, Connection } = require("@solana/web3.js");
const {
    getAssociatedTokenAddress,
    getAccount,
} = require("@solana/spl-token");
const { executeBatch } = require('./libBatchEngine');

const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

class TokenUsdcSol extends TokenUsdc {
    constructor(web3) {
        super(web3);
        this.connection = new Connection(web3.getRpcUrl());
    }

    /**
     * Retrieves the USDC SPL balance for a single Solana wallet.
     * Off-curve or missing token account returns 0n.
     * Any real RPC error throws.
     */
    async getBalance(wallet) {
        const owner = new PublicKey(wallet);
        if (!PublicKey.isOnCurve(owner.toBytes())) return 0n;

        const ata = await getAssociatedTokenAddress(USDC_MINT, owner);
        const info = await this.connection.getAccountInfo(ata);
        if (!info) return 0n;

        const tokenAccount = await getAccount(this.connection, ata);
        return tokenAccount.amount;
    }

    /**
     * Retrieves USDC balances for multiple Solana wallets.
     * 
     * @param {Array<string>} wallets
     * @returns {Promise<Array<bigint|null>>}
     */
    async getBalances(wallets) {
        const batchSize = this.web3.getConfig().getBatchSize?.() || 100;
        const minBatchSize = this.web3.getConfig().getMinBatchSize?.() || 10;
        const delayMs = 30;
        const timeoutMs = 5000;

        return await executeBatch(
            "SolanaUSDC",
            wallets,
            this.getBalance.bind(this),
            batchSize,
            minBatchSize,
            delayMs,
            timeoutMs
        );
    }
}

module.exports = TokenUsdcSol;
