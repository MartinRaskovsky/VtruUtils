#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the VtruStakedContract class.
 * These tests use mocks to simulate API responses.
 */

const assert = require("assert");
const sinon = require("sinon");
const VtruConfig = require("../lib/vtruConfig");
const VtruWeb3 = require("../lib/vtruWeb3");
const VtruStakedContract = require("../lib/vtruStakedContract");
const { getAddress } = require("ethers"); // Import getAddress for checksum matching

// Create mock instances
const config = new VtruConfig();
const web3 = new VtruWeb3();
const stakedContract = new VtruStakedContract(config, web3);

// Stub contract interaction
const mockContract = {
    getUserStakesInfo: sinon.stub(),
};

// Stub `getContract` method to return the mock contract
sinon.stub(stakedContract, "getContract").returns(mockContract);

/**
 * Test getBalance method with a valid wallet.
 */
async function testGetBalance() {
    const wallet = "0x5AEDA56215B167893E80B4FE645BA6D5BAB767DE";
    const checksummedWallet = getAddress(wallet); // ✅ Ensure we match the exact address format

    mockContract.getUserStakesInfo.withArgs(checksummedWallet).resolves([
        [{ 4: 100n }], // ✅ Fix incorrect nesting
        []
    ]);

    const result = await mockContract.getUserStakesInfo(checksummedWallet);
    const balance = await stakedContract.getStakedBalance(wallet);

    assert.strictEqual(
        balance,
        100n,
        `❌ testGetBalance failed: Expected balance 100, got ${balance}`
    );

    console.log("✅ testGetBalance passed.");
}

/**
 * Test getBalances method with multiple valid wallets.
 */
async function testGetBalances() {
    const wallets = [
        "0x5AEDA56215B167893E80B4FE645BA6D5BAB767DE",
        "0xAB5801A7D398351B8BE11C439E05C5B3259AEC9B"
    ];

    const checksummedWallets = wallets.map(getAddress); // ✅ Ensure checksummed addresses

    // ✅ Fix: Ensure correct mock response format with checksummed addresses
    mockContract.getUserStakesInfo.withArgs(checksummedWallets[0]).resolves([
        [{ 4: 50n }], []
    ]);

    mockContract.getUserStakesInfo.withArgs(checksummedWallets[1]).resolves([
        [{ 4: 200n }], []
    ]);

    const balances = await stakedContract.getStakedBalances(wallets);

    assert.deepStrictEqual(
        balances.filter((b) => b !== null),
        [50n, 200n],
        `❌ testGetBalances failed: Expected [50, 200] but got ${balances}`
    );

    console.log("✅ testGetBalances passed.");
}

// Run all tests
(async () => {
    await testGetBalance();
    await testGetBalances();
    console.log("🎉 All VtruStakedContract tests passed successfully!");
})();

