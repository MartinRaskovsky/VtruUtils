#!/usr/bin/env node

/**
 * showWeb3.js
 * Unit test for the Web3 class.
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 *
 * This test connects to both VTRU and BSC networks,
 * retrieves latest block numbers, and checks wallet balances.
 */

const Web3 = require("../lib/libWeb3");
const { scaleDown, formatNumber, formatRawNumber, logJson } = require("../lib/vtruUtils");

const TokenStakedSevo = require("../lib/tokenStakedSevo");


// Define test wallet addresses (configure accordingly)
const testWallets = {
    vtru: "0xa857dFB740396db406d91aEA65256da4d21721e4", // Replace with a valid wallet
    bsc: "0xa857dFB740396db406d91aEA65256da4d21721e4"  // Replace with a valid wallet
};

async function formatStamp(bsc, stamp) {
    const block = await bsc.getProvider().getBlock(stamp);

    const timestamp = block.timestamp * 1000; // Convert seconds to milliseconds
    const date = new Date(timestamp);

    // Get day, month, and year
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed (January is 0)
    const year = date.getFullYear();
    return (`${day}-${month}-${year}`);
}

async function testNetworkConnection(network) {
    console.log(`\nTesting connection to ${network.toUpperCase()}...`);
    const web3 = await Web3.create(network);  // Use the factory method
    const latestBlock = web3.getLatestBlockNumber();
    console.log(`Latest block on ${network.toUpperCase()}: ${latestBlock}`);
}

async function testWalletBalances(network) {
    console.log(`\nTesting wallet balance retrieval on ${network.toUpperCase()}...`);
    const web3 = await Web3.create(network);  // Use the factory method
    const wallet = testWallets[network];
    
    if (!wallet || wallet === "0x0000000000000000000000000000000000000000") {
        console.error(`❌ No valid wallet address configured for ${network.toUpperCase()}`);
        return;
    }
    
    const balance = await web3.getWalletRawBalance(wallet);
    const scaled = scaleDown(balance);
    console.log(`Wallet balance for ${wallet} on ${network.toUpperCase()}: ${balance} WEI; scaled ${scaled}`);
}

async function testStakedContract(network) {
    console.log(`\nTesting staked contract balance retrieval on ${network.toUpperCase()}...`);
    const web3 = await Web3.create(network);  // Use the factory method
    const tokenStakedVtru = new TokenStakedSevo(web3);
    const inWallet = testWallets[network];
    
    if (!inWallet || inWallet === "0x0000000000000000000000000000000000000000") {
        console.error(`❌ No valid wallet address configured for ${network.toUpperCase()}`);
        return;
    }
    
    const data = await tokenStakedVtru.getStakedDetail(inWallet);
    const {wallet, stamp, locked} = data[0];
    const amount = formatNumber(scaleDown(locked));
    const date = await formatStamp(web3, stamp);
    console.log(`Locked balance for ${wallet} on ${network.toUpperCase()}: ${amount}`);
    console.log(`Staked date    for ${wallet} on ${network.toUpperCase()}: ${date}`);
    
}

async function runTests() {
    await testNetworkConnection(Web3.VTRU);
    await testWalletBalances(Web3.VTRU);
    
    await testNetworkConnection(Web3.BSC);
    await testWalletBalances(Web3.BSC);

    await testStakedContract(Web3.BSC);
    
    console.log("\n🎉 All Web3 tests completed!");
}

runTests().catch(error => console.error("❌ Test execution failed:", error));

