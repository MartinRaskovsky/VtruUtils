#!/usr/bin/env node

const { Connection, PublicKey, isOnCurve } = require('@solana/web3.js');
const { getAssociatedTokenAddress, getAccount } = require('@solana/spl-token');

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // ✅ Official USDC

async function getUsdcBalance(walletAddress) {
    const connection = new Connection(SOLANA_RPC);

    try {
        const owner = new PublicKey(walletAddress);

        // ✅ Check *before* calling getAssociatedTokenAddress()
        if (!PublicKey.isOnCurve(owner.toBytes())) {
            console.log(`⛔ Off-curve address: ${walletAddress}`);
            return null;
        }

        const ata = await getAssociatedTokenAddress(USDC_MINT, owner);

        //console.log(`🔍 Checking ATA for ${walletAddress}: ${ata.toBase58()}`);
        const info = await connection.getAccountInfo(ata);
        if (!info) {
            console.log(`🔍 No USDC account found for ${walletAddress}`);
            return null;
        }

        const tokenAccount = await getAccount(connection, ata);
        //const balance = Number(tokenAccount.amount) / 1e6;
        //console.log(`USDC Balance for ${walletAddress}: ${balance}`);
	console.log(`Wallet:  ${walletAddress}`);
    	console.log(`Balance: ${tokenAccount.amount} lamports`);
        //return balance;
    } catch (error) {
        console.error(`❌ Error fetching for ${walletAddress}:`, error.message);
        return null;
    }    
}

//getUsdcBalance('CKCPbSG7Zre8mN8Xar9NoEMjeKfozJ7Lip14cSv2BTHR');
getUsdcBalance('7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV');
//getUsdcBalance('3hqfpZ775LMcG5WUrMCQLFeY1ABRnCYD2zr2UYaQSBVF');

