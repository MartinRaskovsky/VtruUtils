#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: January 2025
 *
 * Active test for the VtruVaultDetails class.
 */

const { Web3 } = require("../lib/libWeb3");
const VtruVibeContract = require("../lib/vtruVibeContract");
const { formatRawNumber, formatNumber } = require("../lib/vtruUtils");

async function getVibeDetails(wallet) {
    try {
        const web3 = await Web3.create(Web3.VTRU);
        const vibeContract = new VtruVibeContract(web3);

        
        const { balance, noTokens, claimed, unclaimed } = await vibeContract.getVibeDetail(wallet);
        console.log(`Wallet: ${wallet}`);
        console.log(`Vibe Balance: ${formatNumber(balance, 0)}`);
        console.log(`Vibe #Tokens: ${typeof noTokens} ${noTokens}`);
        console.log(`Vibe Claimed: ${formatRawNumber(claimed)}`);
        console.log(`Vibe Unclaimed: ${formatRawNumber(unclaimed)}`);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    const wallet = process.argv[2];
    if (!wallet) {
        console.error("Usage: showVibeContract.js <wallet_address>");
        process.exit(1);
    }

    try {
        await getVibeDetails(wallet);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
