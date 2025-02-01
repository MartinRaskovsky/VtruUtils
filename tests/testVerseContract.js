#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the VtruVerseContract class.
 * These tests use mocks to simulate VERSE contract interactions.
 */

const assert = require("assert");
const sinon = require("sinon");
const VtruVerseContract = require("../lib/vtruVerseContract");

// ✅ Create mock instances
const mockConfig = { getAbi: sinon.stub().returns([]) };
const mockWeb3 = { getProvider: sinon.stub().returns({}) };

// ✅ Create a mock contract
const mockContract = {
    getVerseNFTByOwner: sinon.stub(),
};

// ✅ Stub `VtruContract.getContract()` to return the mock contract
sinon.stub(VtruVerseContract.prototype, "getContract").returns(mockContract);

// ✅ Create the `VtruVerseContract` instance with mocks
const verseContract = new VtruVerseContract(mockConfig, mockWeb3);

console.log("Running unit tests for VtruVerseContract.js...");

/**
 * Test getVerseBalance method with a valid wallet.
 */
async function testGetVerseBalanceValid() {
    mockContract.getVerseNFTByOwner.resolves(["id", "owner", 500]); // Mock NFT structure

    const balance = await verseContract.getVerseBalance("0xWallet1");
    assert.strictEqual(balance, 500, `❌ testGetVerseBalanceValid failed: Expected 500 but got ${balance}`);

    console.log("✅ testGetVerseBalanceValid passed.");
}

/**
 * Test getVerseBalance method when contract call fails.
 */
async function testGetVerseBalanceFailure() {
    mockContract.getVerseNFTByOwner.rejects(new Error("Contract call failed"));

    const balance = await verseContract.getVerseBalance("0xWallet2");
    assert.strictEqual(balance, null, `❌ testGetVerseBalanceFailure failed: Expected null but got ${balance}`);

    console.log("✅ testGetVerseBalanceFailure passed.");
}

/**
 * Test getVerseBalances method with multiple wallets.
 */
async function testGetVerseBalances() {
    mockContract.getVerseNFTByOwner.withArgs("0xWallet1").resolves(["id", "owner", 500]);
    mockContract.getVerseNFTByOwner.withArgs("0xWallet2").resolves(["id", "owner", 300]);
    mockContract.getVerseNFTByOwner.withArgs("0xWallet3").resolves(["id", "owner", 0]);

    const balances = await verseContract.getVerseBalances(["0xWallet1", "0xWallet2", "0xWallet3"]);
    
    assert.deepStrictEqual(
        balances,
        [500, 300, 0],
        `❌ testGetVerseBalances failed: Expected [500, 300, 0] but got ${JSON.stringify(balances)}`
    );

    console.log("✅ testGetVerseBalances passed.");
}

/**
 * Test getVerseBalances method when all contract calls fail.
 */
async function testGetVerseBalancesFailures() {
    // ✅ Reset stubs before overriding them for failures
    mockContract.getVerseNFTByOwner.reset();
    
    // ✅ Ensure all calls reject
    mockContract.getVerseNFTByOwner.rejects(new Error("Contract call failed"));

    const balances = await verseContract.getVerseBalances(["0xWallet1", "0xWallet2"]);
    
    assert.deepStrictEqual(
        balances,
        [null, null],
        `❌ testGetVerseBalancesFailures failed: Expected [null, null] but got ${JSON.stringify(balances)}`
    );

    console.log("✅ testGetVerseBalancesFailures passed.");
}

// Run all tests
(async () => {
    await testGetVerseBalanceValid();
    await testGetVerseBalanceFailure();
    await testGetVerseBalances();
    await testGetVerseBalancesFailures();
    console.log("🎉 All VtruVerseContract tests passed successfully!");
})();

