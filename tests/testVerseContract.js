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
const ethers = require("ethers"); // Import ethers
const VtruVerseContract = require("../lib/vtruVerseContract");

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
    getVerseNFTByOwner: sinon.stub(),
};

// ✅ Stub `VtruContract.getContract()` to return the mock contract
sinon.stub(VtruVerseContract.prototype, "getContract").returns(mockContract);

// ✅ Create the `VtruVerseContract` instance with mocks
const verseContract = new VtruVerseContract(mockConfig, mockWeb3);

console.log("Running unit tests for VtruVerseContract.js...");

async function testGetVerseBalanceValid() {
    mockContract.getVerseNFTByOwner.resolves(["id", "owner", 500]); // Mock NFT structure

    const balance = await verseContract.getVerseBalance(wallet1);
    assert.strictEqual(balance, 500, `❌ testGetVerseBalanceValid failed: Expected 500 but got ${balance}`);

    console.log("✅ testGetVerseBalanceValid passed.");
}

async function testGetVerseBalanceFailure() {
    mockContract.getVerseNFTByOwner.rejects(new Error("Contract call failed"));

    const balance = await verseContract.getVerseBalance(wallet2);
    assert.strictEqual(balance, null, `❌ testGetVerseBalanceFailure failed: Expected null but got ${balance}`);

    console.log("✅ testGetVerseBalanceFailure passed.");
}

async function testGetVerseBalances() {
    mockContract.getVerseNFTByOwner.withArgs(wallet1).resolves(["id", "owner", 500]);
    mockContract.getVerseNFTByOwner.withArgs(wallet2).resolves(["id", "owner", 300]);
    mockContract.getVerseNFTByOwner.withArgs(wallet3).resolves(["id", "owner", 0]);

    const balances = await verseContract.getVerseBalances([wallet1, wallet2, wallet3]);
    
    assert.deepStrictEqual(
        balances,
        [500, 300, 0],
        `❌ testGetVerseBalances failed: Expected [500, 300, 0] but got ${JSON.stringify(balances)}`
    );

    console.log("✅ testGetVerseBalances passed.");
}

async function testGetVerseBalancesFailures() {
    mockContract.getVerseNFTByOwner.reset();
    mockContract.getVerseNFTByOwner.rejects(new Error("Contract call failed"));

    const balances = await verseContract.getVerseBalances([wallet1, wallet2]);
    
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

