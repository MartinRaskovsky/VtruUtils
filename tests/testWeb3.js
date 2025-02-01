#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the VtruWeb3 class.
 * These tests use mocks to simulate RPC provider interactions.
 */

const assert = require("assert");
const sinon = require("sinon");
const { ethers } = require("ethers");
const VtruWeb3 = require("../lib/vtruWeb3");

// ✅ Step 1: Stub `ethers.JsonRpcProvider` BEFORE creating `VtruWeb3`
const mockProvider = {
    getBlockNumber: sinon.stub().resolves(123456), // Simulate a connected provider
    getBalance: sinon.stub().resolves(1000000000000000000n), // Always return 1 ETH
};

// ✅ Step 2: Stub `ethers.JsonRpcProvider` to return our mock provider
sinon.stub(ethers, "JsonRpcProvider").returns(mockProvider);

// ✅ Step 3: Create `VtruWeb3` BEFORE overriding its provider
const web3 = new VtruWeb3({});

// ✅ Step 4: Force `web3.getProvider()` to return our mocked provider
sinon.stub(web3, "getProvider").returns(mockProvider);

console.log("Running unit tests for VtruWeb3.js...");

/**
 * Test getRPC method.
 */
function testGetRPC() {
    assert.strictEqual(web3.getRPC(), "https://rpc.vitruveo.xyz", "❌ testGetRPC failed: RPC URL mismatch");
    console.log("✅ testGetRPC passed.");
}

/**
 * Test getProvider method by checking the required methods exist.
 */
function testGetProvider() {
    const provider = web3.getProvider();
    assert.ok(provider.getBlockNumber, "❌ testGetProvider failed: getBlockNumber method is missing.");
    assert.ok(provider.getBalance, "❌ testGetProvider failed: getBalance method is missing.");
    
    console.log("✅ testGetProvider passed.");
}

/**
 * Test checkConnection method when the RPC is reachable.
 */
async function testCheckConnectionSuccess() {
    await web3.checkConnection();
    console.log("✅ testCheckConnectionSuccess passed.");
}

/**
 * Test checkConnection method when the RPC is unreachable.
 */
async function testCheckConnectionFailure() {
    mockProvider.getBlockNumber.rejects(new Error("RPC not reachable"));
    await web3.checkConnection();
    console.log("✅ testCheckConnectionFailure passed (handled gracefully).");
}

/**
 * Test getWalletRawBalance method with a valid wallet.
 */
async function testGetWalletRawBalance() {
    console.log("🛠 Running testGetWalletRawBalance...");
    const balance = await web3.getWalletRawBalance("0xValidWallet");
    console.log(`🛠 Received balance: ${balance}`);
    assert.strictEqual(balance, 1000000000000000000n, `❌ testGetWalletRawBalance failed: Expected 1 ETH but got ${balance}`);
    console.log("✅ testGetWalletRawBalance passed.");
}

/**
 * Test getWalletRawBalance method when RPC call fails.
 */
async function testGetWalletRawBalanceFailure() {
    mockProvider.getBalance.withArgs("0xInvalidWallet").rejects(new Error("Invalid address"));
    const balance = await web3.getWalletRawBalance("0xInvalidWallet");
    assert.strictEqual(balance, 0n, `❌ testGetWalletRawBalanceFailure failed: Expected 0n but got ${balance}`);
    console.log("✅ testGetWalletRawBalanceFailure passed.");
}

/**
 * Test getWalletRawBalances method with multiple wallets.
 */
async function testGetWalletRawBalances() {
    const balances = await web3.getWalletRawBalances(["0xWallet1", "0xWallet2"]);

    // ✅ Convert BigInt to string for logging
    assert.deepStrictEqual(
        balances,
        [1000000000000000000n, 1000000000000000000n], // Expecting 1 ETH each
        `❌ testGetWalletRawBalances failed: Expected [1 ETH, 1 ETH] but got [${balances.map(b => b.toString())}]`
    );

    console.log("✅ testGetWalletRawBalances passed.");
}

/**
 * Test getWalletRawBalances method when some RPC calls fail.
 */
async function testGetWalletRawBalancesPartialFailure() {
    mockProvider.getBalance.withArgs("0xWallet2").rejects(new Error("RPC error"));

    const balances = await web3.getWalletRawBalances(["0xWallet1", "0xWallet2"]);

    // ✅ Convert BigInt to string for logging
    assert.deepStrictEqual(
        balances,
        [1000000000000000000n, 0n],
        `❌ testGetWalletRawBalancesPartialFailure failed: Expected [1 ETH, 0n] but got [${balances.map(b => b.toString())}]`
    );

    console.log("✅ testGetWalletRawBalancesPartialFailure passed.");
}

// Run all tests
(async () => {
    testGetRPC();
    testGetProvider();
    await testCheckConnectionSuccess();
    await testCheckConnectionFailure();
    await testGetWalletRawBalance();
    await testGetWalletRawBalanceFailure();
    await testGetWalletRawBalances();
    await testGetWalletRawBalancesPartialFailure();
    console.log("🎉 All VtruWeb3 tests passed successfully!");
})();

