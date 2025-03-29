#!/usr/bin/env node

/**
 * testUsdcSolana.js
 *
 * Batch test of USDC balances for multiple Solana wallets.
 * Treats off-curve or missing token accounts as zero balance.
 */

const { Connection, PublicKey } = require('@solana/web3.js');
const { getAssociatedTokenAddress, getAccount } = require('@solana/spl-token');

// ✅ Official USDC Mint
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(SOLANA_RPC);

// ✅ Wallets to test
const wallets = [
    'CKCPbSG7Zre8mN8Xar9NoEMjeKfozJ7Lip14cSv2BTHR',
    '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV',
    '3hqfpZ775LMcG5WUrMCQLFeY1ABRnCYD2zr2UYaQSBVF'
];

async function getUsdcBalance(walletAddress) {
    try {
        const owner = new PublicKey(walletAddress);

        // ✅ If off-curve, return 0 silently
        if (!PublicKey.isOnCurve(owner.toBytes())) {
            return 0;
        }

        const ata = await getAssociatedTokenAddress(USDC_MINT, owner);
        const info = await connection.getAccountInfo(ata);
        if (!info) {
            return 0;
        }

        const tokenAccount = await getAccount(connection, ata);
        return Number(tokenAccount.amount) / 1e6;
    } catch (_) {
        return 0;
    }
}

(async () => {
    let total = 0;
    for (let i = 0; i < wallets.length; i++) {
        const balance = await getUsdcBalance(wallets[i]);
        total += balance;

        const formatted = balance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        console.log(`${i + 1}\t${wallets[i]}\t${formatted} USDC`);
    }

    const totalFormatted = total.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    console.log(`${wallets.length}\tTotal\t${totalFormatted} USDC`);
})();

