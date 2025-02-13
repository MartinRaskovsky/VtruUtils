#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the TokenVibe class.
 * These tests use mocks to simulate VIBE contract interactions.
 */

const assert = require("assert");
const sinon = require("sinon");
const ethers = require("ethers"); // Import ethers
const TokenVibe = require("../lib/tokenVibe");

// ✅ Mock valid Ethereum addresses
const wallet1 = "0x0000000000000000000000000000000000000001";
const wallet2 = "0x0000000000000000000000000000000000000002";
const wallet3 = "0x0000000000000000000000000000000000000003";

// ✅ Stub ethers functions to bypass validation
sinon.stub(ethers, "isAddress").returns(true);
sinon.stub(ethers, "getAddress").callsFake(wallet => wallet);

// ✅ Create mock instances
const mockConfig = { getAbi: sinon.stub().returns([]) };
const mockWeb3 = { getProvider: sinon.stub().returns({}) };

// ✅ Create a mock contract
const mockContract = {
    getVibeNFTSharesByOwner: sinon.stub(),
};

// ✅ Stub `VtruContract.getContract()` to return the mock contract
sinon.stub(TokenVibe.prototype, "getContract").returns(mockContract);

// ✅ Create the `TokenVibe` instance with mocks
const vibeContract = new TokenVibe(mockConfig, mockWeb3);

console.log("Running unit tests for TokenVibe.js...");

/**
 * Test getVibeBalance method with a valid wallet.
 */
async function testGetVibeBalanceValid() {
    mockContract.getVibeNFTSharesByOwner.resolves(300n);

    const balance = await vibeContract.getVibeBalance(wallet1);
    assert.strictEqual(balance, 300n, `❌ testGetVibeBalanceValid failed: Expected 300n but got ${balance}`);

    console.log("✅ testGetVibeBalanceValid passed.");
}

/**
 * Test getVibeBalance method when the wallet has no NFTs.
 */
async function testGetVibeBalanceEmpty() {
    mockContract.getVibeNFTSharesByOwner.resolves(null);

    const balance = await vibeContract.getVibeBalance(wallet2);
    assert.strictEqual(balance, null, `❌ testGetVibeBalanceEmpty failed: Expected null but got ${balance}`);

    console.log("✅ testGetVibeBalanceEmpty passed.");
}

/**
 * Test getVibeBalance method when contract call fails.
 */
async function testGetVibeBalanceFailure() {
    mockContract.getVibeNFTSharesByOwner.rejects(new Error("Contract call failed"));

    const balance = await vibeContract.getVibeBalance(wallet3);
    assert.strictEqual(balance, null, `❌ testGetVibeBalanceFailure failed: Expected null but got ${balance}`);

    console.log("✅ testGetVibeBalanceFailure passed.");
}

/**
 * Test getVibeBalances method with multiple wallets.
 */
async function testGetVibeBalances() {
    mockContract.getVibeNFTSharesByOwner.withArgs(wallet1).resolves(400n);
    mockContract.getVibeNFTSharesByOwner.withArgs(wallet2).resolves(null);
    mockContract.getVibeNFTSharesByOwner.withArgs(wallet3).resolves(250n);
    
    const balances = await vibeContract.getVibeBalances([wallet1, wallet2, wallet3]);
    
    // Use a safe mapping that handles null values
    const mappedBalances = balances.map(b => b === null ? "null" : b.toString());
    
    assert.deepStrictEqual(
        balances,
        [400n, null, 250n],
        `❌ testGetVibeBalances failed: Expected [400n, null, 250n] but got ${JSON.stringify(mappedBalances)}`
    );

    console.log("✅ testGetVibeBalances passed.");
}

/**
 * Test getVibeBalances method when all contract calls fail.
 */
async function testGetVibeBalancesFailures() {
    // ✅ Reset stubs before overriding them for failures
    mockContract.getVibeNFTSharesByOwner.reset();
    
    // ✅ Ensure all calls reject
    mockContract.getVibeNFTSharesByOwner.rejects(new Error("Contract call failed"));

    const balances = await vibeContract.getVibeBalances([wallet1, wallet2]);
    
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
    console.log("🎉 All TokenVibe tests passed successfully!");
})();

