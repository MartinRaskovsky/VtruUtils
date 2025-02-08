#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the VtruVaultDetails class.
 * These tests use mocks to simulate vault interactions.
 */

const assert = require("assert");
const sinon = require("sinon");
const VtruVaultDetails = require("../lib/vtruVaultDetails");
const VtruWalletDetails = require("../lib/vtruWalletDetails");
const { scaleUp, formatRawNumber } = require("../lib/vtruUtils");

const mockWeb3 = {
    getConfig: sinon.stub().returns({
        getAbi: sinon.stub().returns(["mocked ABI"]),
    }),
    getProvider: sinon.stub().returns({}),
};

// ✅ Create a mock vault contract
const mockVault = {
    address: "0xVault123",
    vaultBalance: sinon.stub().resolves(5000000000000000000n), // 5 ETH in wei
    getVaultWallets: sinon.stub().resolves(["0xWallet1", "0xWallet2"]),
    getName: sinon.stub().resolves("TestVault"),
    hasStakes: sinon.stub().resolves(true),
};

// ✅ Mock wallet details response (from `VtruWalletDetails`)
const mockWalletDetails = {
    held: 3000000000000000000n, // 3 ETH in wei
    staked: 1000000000000000000n, // 1 ETH in wei
    walletBalances: [1.5, 2.0],
    walletStaked: [0.5, 0.5],
    walletVibes: [10, 20],
    walletVerses: [5, 15],
    verses: 20,
    vibes: 30,
};

// ✅ Stub `VtruWalletDetails.get()` to return the mock wallet details
sinon.stub(VtruWalletDetails.prototype, "get").resolves(mockWalletDetails);

// ✅ Create the `VtruVaultDetails` instance with mocks
const vaultDetails = new VtruVaultDetails(mockWeb3, 4); // minBalance = 4 ETH

console.log("Running unit tests for VtruVaultDetails.js...");

/**
 * Test get method when the vault is above minBalance.
 */
async function testGetVaultAboveMinBalance() {
    const result = await vaultDetails.get(mockVault, 1, true);

    assert.strictEqual(result.count, 1, `❌ testGetVaultAboveMinBalance failed: Expected count 1 but got ${result.count}`);
    assert.strictEqual(result.address, mockVault.address, `❌ testGetVaultAboveMinBalance failed: Address mismatch`);
    assert.strictEqual(result.balance, formatRawNumber(5000000000000000000n), `❌ testGetVaultAboveMinBalance failed: Balance mismatch`);
    assert.strictEqual(result.hasStakes, true, `❌ testGetVaultAboveMinBalance failed: Expected hasStakes=true`);
    assert.strictEqual(result.held, formatRawNumber(mockWalletDetails.held + 5000000000000000000n, 2), `❌ testGetVaultAboveMinBalance failed: Held balance mismatch`);
    assert.strictEqual(result.staked, formatRawNumber(mockWalletDetails.staked, 2), `❌ testGetVaultAboveMinBalance failed: Staked balance mismatch`);

    console.log("✅ testGetVaultAboveMinBalance passed.");
}

/**
 * Test get method when the vault is below minBalance.
 */
async function testGetVaultBelowMinBalance() {
    // Modify mock vault to have a lower balance
    mockVault.vaultBalance.resolves(500000000000000000n); // 0.5 ETH in wei

    const result = await vaultDetails.get(mockVault, 2, true);

    assert.strictEqual(result, null, `❌ testGetVaultBelowMinBalance failed: Expected null but got ${JSON.stringify(result)}`);

    console.log("✅ testGetVaultBelowMinBalance passed.");
}

/**
 * Test getSummary method.
 */
function testGetSummary() {
    const result = vaultDetails.getSummary();

    assert.strictEqual(result.held, formatRawNumber(vaultDetails.held, 0), `❌ testGetSummary failed: Held mismatch`);
    assert.strictEqual(result.staked, formatRawNumber(vaultDetails.staked, 0), `❌ testGetSummary failed: Staked mismatch`);
    assert.strictEqual(result.totalHeld, formatRawNumber(vaultDetails.totalHeld, 0), `❌ testGetSummary failed: Total held mismatch`);
    assert.strictEqual(result.totalStaked, formatRawNumber(vaultDetails.totalStaked, 0), `❌ testGetSummary failed: Total staked mismatch`);
    assert.strictEqual(result.analyzedVaultCount, vaultDetails.analyzedVaultCount, `❌ testGetSummary failed: Analyzed vault count mismatch`);

    console.log("✅ testGetSummary passed.");
}

// Run all tests
(async () => {
    await testGetVaultAboveMinBalance();
    await testGetVaultBelowMinBalance();
    testGetSummary();
    console.log("🎉 All VtruVaultDetails tests passed successfully!");
})();

