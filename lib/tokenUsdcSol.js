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

const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

/**
 * Maps RPC error codes to user-friendly messages.
 * 
 * @param {Error} error - The caught error object.
 * @returns {string} Friendly message string.
 */
function FriendlyMessage(error) {
    let code = error?.code?.toString?.();

    // Fallback: try to extract code from error.message (e.g., "Error: 429 Too Many Requests: { ... }")
    if (!code && typeof error.message === 'string') {
        const match = error.message.match(/"code"\s*:\s*(-?\d+)/);
        if (match) {
            code = match[1];
        } else if (error.message.includes("429 Too Many Requests")) {
            code = "429";
        } else {
            code = "UNKNOWN";
        }
    }

    const known = {
        "429": "Too Many Requests – you’ve hit the Solana rate limit.",
        "-32005": "Solana RPC node rate limit reached.",
        "TIMEOUT": "The request timed out. Try again later.",
    };

    const baseMessage = known[code] ?? error.message ?? "Unknown error";
    return `❌ Error code ${code}: ${baseMessage}`;
}

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
        try {
            const owner = new PublicKey(wallet);
            if (!PublicKey.isOnCurve(owner.toBytes())) return 0n;

            const ata = await getAssociatedTokenAddress(USDC_MINT, owner);
            const info = await this.connection.getAccountInfo(ata);
            if (!info) return 0n;

            const tokenAccount = await getAccount(this.connection, ata);
            return tokenAccount.amount;
        } catch (error) {
            const message = FriendlyMessage(error);
            throw new Error(message);
        }
    }

    /**
     * Retrieves USDC balances for multiple wallets.
     * Fails the entire request on any internal RPC error.
     */
    async getBalances(wallets) {
        const BATCH_SIZE = 100;
        const results = [];

        for (let i = 0; i < wallets.length; i += BATCH_SIZE) {
            const batch = wallets.slice(i, i + BATCH_SIZE);

            try {
                const batchResults = await Promise.all(
                    batch.map(async (wallet) => {
                        const owner = new PublicKey(wallet);
                        if (!PublicKey.isOnCurve(owner.toBytes())) return 0n;

                        const ata = await getAssociatedTokenAddress(USDC_MINT, owner);
                        const info = await this.connection.getAccountInfo(ata);
                        if (!info) return 0n;

                        const tokenAccount = await getAccount(this.connection, ata);
                        return tokenAccount.amount;
                    })
                );
                results.push(...batchResults);
            } catch (error) {
                const message = FriendlyMessage(error);
                throw new Error(message);
            }
        }

        return results;
    }
}

module.exports = TokenUsdcSol;
