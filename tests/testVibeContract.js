#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the VtruVibeContract class.
 * These tests use mocks to simulate VIBE contract interactions.
 */

const assert = require("assert");
const sinon = require("sinon");
const VtruVibeContract = require("../lib/vtruVibeContract");

// ✅ Create mock instances
const mockConfig = { getAbi: sinon.stub().returns([]) };
const mockWeb3 = { getProvider: sinon.stub().returns({}) };

// ✅ Create a mock contract
const mockContract = {
    getVibeNFTsByOwner: sinon.stub(),
};

// ✅ Stub `VtruContract.getContract()` to return the mock contract
sinon.stub(VtruVibeContract.prototype, "getContract").returns(mockContract);

// ✅ Create the `VtruVibeContract` instance with mocks
const vibeContract = new VtruVibeContract(mockConfig, mockWeb3);

console.log("Running unit tests for VtruVibeContract.js...");

/**
 * Test getVibeBalance method with a valid wallet.
 */
async function testGetVibeBalanceValid() {
    mockContract.getVibeNFTsByOwner.resolves([
        ["id1", 300n],
        ["id2", 200n],
    ]);

    const balance = await vibeContract.getVibeBalance("0xWallet1");
    assert.strictEqual(balance, 500n, `❌ testGetVibeBalanceValid failed: Expected 500n but got ${balance}`);

    console.log("✅ testGetVibeBalanceValid passed.");
}

/**
 * Test getVibeBalance method when the wallet has no NFTs.
 */
async function testGetVibeBalanceEmpty() {
    mockContract.getVibeNFTsByOwner.resolves([]); // No NFTs

    const balance = await vibeContract.getVibeBalance("0xWallet2");
    assert.strictEqual(balance, 0n, `❌ testGetVibeBalanceEmpty failed: Expected 0n but got ${balance}`);

    console.log("✅ testGetVibeBalanceEmpty passed.");
}

/**
 * Test getVibeBalance method when contract call fails.
 */
async function testGetVibeBalanceFailure() {
    mockContract.getVibeNFTsByOwner.rejects(new Error("Contract call failed"));

    const balance = await vibeContract.getVibeBalance("0xWallet3");
    assert.strictEqual(balance, null, `❌ testGetVibeBalanceFailure failed: Expected null but got ${balance}`);

    console.log("✅ testGetVibeBalanceFailure passed.");
}

/**
 * Test getVibeBalances method with multiple wallets.
 */
async function testGetVibeBalances() {
    mockContract.getVibeNFTsByOwner.withArgs("0xWallet1").resolves([
        ["id1", 400n],
        ["id2", 100n],
    ]);
    mockContract.getVibeNFTsByOwner.withArgs("0xWallet2").resolves([]);
    mockContract.getVibeNFTsByOwner.withArgs("0xWallet3").resolves([
        ["id3", 250n],
    ]);

    const balances = await vibeContract.getVibeBalances(["0xWallet1", "0xWallet2", "0xWallet3"]);
    
    assert.deepStrictEqual(
        balances,
        [500n, 0n, 250n],
        `❌ testGetVibeBalances failed: Expected [500n, 0n, 250n] but got ${JSON.stringify(balances.map(b => b.toString()))}`
    );

    console.log("✅ testGetVibeBalances passed.");
}

/**
 * Test getVibeBalances method when all contract calls fail.
 */
async function testGetVibeBalancesFailures() {
    // ✅ Reset stubs before overriding them for failures
    mockContract.getVibeNFTsByOwner.reset();
    
    // ✅ Ensure all calls reject
    mockContract.getVibeNFTsByOwner.rejects(new Error("Contract call failed"));

    const balances = await vibeContract.getVibeBalances(["0xWallet1", "0xWallet2"]);
    
    assert.deepStrictEqual(
        balances,
        [null, null],
        `❌ testGetVibeBalancesFailures failed: Expected [null, null] but got ${JSON.stringify(balances)}`
    );

    console.log("✅ testGetVibeBalancesFailures passed.");
}

// Run all tests
(async () => {
    await testGetVibeBalanceValid();
    await testGetVibeBalanceEmpty();
    await testGetVibeBalanceFailure();
    await testGetVibeBalances();
    await testGetVibeBalancesFailures();
    console.log("🎉 All VtruVibeContract tests passed successfully!");
})();

