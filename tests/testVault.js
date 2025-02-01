#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the VtruVault class.
 * These tests use mocks to simulate contract interactions.
 */

const assert = require("assert");
const sinon = require("sinon");
const { ethers } = require("ethers");
const VtruVault = require("../lib/vtruVault");

// Create mock instances
const mockAddress = "0x1234567890abcdef1234567890abcdef12345678";
const mockConfig = { getAbi: sinon.stub().returns([]) };
const mockWeb3 = { getProvider: sinon.stub().returns({}) };

// ✅ Create a proper mock contract object
const mockContract = {
    isBlocked: sinon.stub().resolves(false),
    vaultBalance: sinon.stub().resolves(1000000000000000000n), // 1 ETH in wei
    getVaultWallets: sinon.stub().resolves(["0xWallet1", "0xWallet2"]),
    hasStakes: sinon.stub().resolves(true),
    name: sinon.stub().resolves("TestVault"),
};

// ✅ Stub `ethers.Contract` to return a new instance of the mock contract
sinon.stub(ethers, "Contract").callsFake(() => mockContract);

// ✅ Create the `VtruVault` instance
const vault = new VtruVault(mockAddress, mockConfig, mockWeb3);

// ✅ Manually assign the mock contract (ensuring it's properly linked)
vault.contract = mockContract;

console.log("Running unit tests for VtruVault.js...");

/**
 * Test isBlocked method.
 */
async function testIsBlocked() {
    const result = await vault.isBlocked();
    assert.strictEqual(result, false, `❌ testIsBlocked failed: Expected false but got ${result}`);
    console.log("✅ testIsBlocked passed.");
}

/**
 * Test vaultBalance method.
 */
async function testVaultBalance() {
    const result = await vault.vaultBalance();
    assert.strictEqual(
        result,
        1000000000000000000n,
        `❌ testVaultBalance failed: Expected 1 ETH in wei but got ${result}`
    );
    console.log("✅ testVaultBalance passed.");
}

/**
 * Test getVaultWallets method.
 */
async function testGetVaultWallets() {
    const result = await vault.getVaultWallets();
    assert.deepStrictEqual(
        result,
        ["0xWallet1", "0xWallet2"],
        `❌ testGetVaultWallets failed: Expected wallet array but got ${JSON.stringify(result)}`
    );
    console.log("✅ testGetVaultWallets passed.");
}

/**
 * Test hasStakes method.
 */
async function testHasStakes() {
    const result = await vault.hasStakes();
    assert.strictEqual(result, true, `❌ testHasStakes failed: Expected true but got ${result}`);
    console.log("✅ testHasStakes passed.");
}

/**
 * Test getName method.
 */
async function testGetName() {
    const result = await vault.getName();
    assert.strictEqual(result, "TestVault", `❌ testGetName failed: Expected "TestVault" but got ${result}`);
    console.log("✅ testGetName passed.");
}

/**
 * Test getAddress method.
 */
function testGetAddress() {
    const result = vault.getAddress();
    assert.strictEqual(result, mockAddress, `❌ testGetAddress failed: Expected ${mockAddress} but got ${result}`);
    console.log("✅ testGetAddress passed.");
}

// Run all tests
(async () => {
    await testIsBlocked();
    await testVaultBalance();
    await testGetVaultWallets();
    await testHasStakes();
    await testGetName();
    testGetAddress();
    console.log("🎉 All VtruVault tests passed successfully!");
})();

