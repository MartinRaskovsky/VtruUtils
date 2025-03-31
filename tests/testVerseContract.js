#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the TokenVerse class.
 * These tests use mocks to simulate VERSE contract interactions.
 */

const assert = require("assert");
const sinon = require("sinon");
const ethers = require("ethers"); // Import ethers
const TokenVerse = require("../lib/tokenVerse");

// ✅ Mock valid Ethereum addresses
const wallet1 = "0x0000000000000000000000000000000000000001";
const wallet2 = "0x0000000000000000000000000000000000000002";
const wallet3 = "0x0000000000000000000000000000000000000003";

// ✅ Stub ethers functions to bypass validation
sinon.stub(ethers, "isAddress").returns(true);
sinon.stub(ethers, "getAddress").callsFake(wallet => wallet);

// ✅ Create mock instances
const mockConfig = { 
    getAbi: sinon.stub().returns([]), 
    getId: () => 0,//Web3.VTRU,
};
const mockWeb3 = { getProvider: sinon.stub().returns({}) };

// ✅ Create a mock contract
const mockContract = {
    getVerseNFTByOwner: sinon.stub(),
};

// ✅ Stub `libContractProvider.getContract()` to return the mock contract
sinon.stub(TokenVerse.prototype, "getContract").returns(mockContract);

// ✅ Create the `TokenVerse` instance with mocks
const tokenVerse = new TokenVerse(mockConfig, mockWeb3);

console.log("Running unit tests for TokenVerse.js...");

async function testGetVerseBalanceValid() {
    mockContract.getVerseNFTByOwner.resolves(["id", "owner", 500]); // Mock NFT structure

    const balance = await tokenVerse.getVerseBalance(wallet1);
    assert.strictEqual(balance, 500, `❌ testGetVerseBalanceValid failed: Expected 500 but got ${balance}`);

    console.log("✅ testGetVerseBalanceValid passed.");
}

async function testGetVerseBalanceFailure() {
    mockContract.getVerseNFTByOwner.rejects(new Error("Contract call failed"));

    const balance = await tokenVerse.getVerseBalance(wallet2);
    assert.strictEqual(balance, null, `❌ testGetVerseBalanceFailure failed: Expected null but got ${balance}`);

    console.log("✅ testGetVerseBalanceFailure passed.");
}

async function testGetVerseBalances() {
    mockContract.getVerseNFTByOwner.withArgs(wallet1).resolves(["id", "owner", 500]);
    mockContract.getVerseNFTByOwner.withArgs(wallet2).resolves(["id", "owner", 300]);
    mockContract.getVerseNFTByOwner.withArgs(wallet3).resolves(["id", "owner", 0]);

    const balances = await tokenVerse.getVerseBalances([wallet1, wallet2, wallet3]);
    
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

    const balances = await tokenVerse.getVerseBalances([wallet1, wallet2]);
    
    assert.deepStrictEqual(
        balances,
        [],
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
    console.log("🎉 All TokenVerse tests passed successfully!");
})();

