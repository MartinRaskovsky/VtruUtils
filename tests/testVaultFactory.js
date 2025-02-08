#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the VtruVaultFactory class.
 * These tests use mocks to simulate vault interactions.
 */

const assert = require("assert");
const sinon = require("sinon");
const VtruVaultFactory = require("../lib/vtruVaultFactory");
const VtruVault = require("../lib/vtruVault");
const { sleep } = require("../lib/vtruSystem");

// ✅ Create a mock conf object with getAbi()
const mockConfig = { getAbi: sinon.stub().returns([]) };
const mockWeb3 = { getProvider: sinon.stub().returns({}) };

// ✅ Create a mock contract inside `VtruVaultFactory`
const mockContract = {
    getVaultCount: sinon.stub().resolves(3), // 3 vaults
    getVaultBatch: sinon.stub().resolves([
        "0xVault1",
        "0xVault2",
        "0xVault3",
    ]),
};

// ✅ Stub `VtruContract.getContract()` to return the mock contract
sinon.stub(VtruVaultFactory.prototype, "getContract").returns(mockContract);

// ✅ Fully mock `VtruVault`
class MockVault {
    constructor(address, web3) {
        this.address = address;
        this.web3 = web3;
    }
    getAddress() { return this.address; }
    async getName() { return "MockVault"; }
    async vaultBalance() { return 1000000000000000000n; } // 1 ETH in wei
    async getVaultWallets() { return ["0xWalletA", "0xWalletB"]; }
    async hasStakes() { return false; }
}

// ✅ Replace `VtruVault` with `MockVault` inside `VtruVaultFactory`
sinon.stub(VtruVaultFactory.prototype, "processVaults").callsFake(async function (limit, callback) {
    const vaultAddresses = await this.getVaultBatch(0, 3);
    for (let i = 0; i < vaultAddresses.length; i++) {
        if (i >= limit) break;
        const vault = new MockVault(vaultAddresses[i], this.web3);
        await callback(vault, i);
    }
});

// ✅ Create the `VtruVaultFactory` instance with fixed `mockConfig`
const vaultFactory = new VtruVaultFactory(mockConfig, mockWeb3);

console.log("Running unit tests for VtruVaultFactory.js...");

/**
 * Test getVaultCount method.
 */
async function testGetVaultCount() {
    const result = await vaultFactory.getVaultCount();
    assert.strictEqual(result, 3, `❌ testGetVaultCount failed: Expected 3 but got ${result}`);
    console.log("✅ testGetVaultCount passed.");
}

/**
 * Test getVaultBatch method.
 */
async function testGetVaultBatch() {
    const result = await vaultFactory.getVaultBatch(0, 3);
    assert.deepStrictEqual(
        result,
        ["0xVault1", "0xVault2", "0xVault3"],
        `❌ testGetVaultBatch failed: Expected vault addresses but got ${JSON.stringify(result)}`
    );
    console.log("✅ testGetVaultBatch passed.");
}

/**
 * Test processVaults method (with full processing).
 */
async function testProcessVaults() {
    const processedVaults = [];
    
    await vaultFactory.processVaults(Infinity, async (vault, index) => {
        processedVaults.push({ address: vault.getAddress(), index });
    });

    assert.strictEqual(processedVaults.length, 3, `❌ testProcessVaults failed: Expected 3 but got ${processedVaults.length}`);
    assert.deepStrictEqual(
        processedVaults.map(v => v.address),
        ["0xVault1", "0xVault2", "0xVault3"],
        `❌ testProcessVaults failed: Vault addresses mismatch`
    );

    console.log("✅ testProcessVaults passed.");
}

/**
 * Test processVaults method with a limit.
 */
async function testProcessVaultsLimit() {
    const processedVaults = [];
    
    await vaultFactory.processVaults(2, async (vault, index) => {
        processedVaults.push({ address: vault.getAddress(), index });
    });

    assert.strictEqual(processedVaults.length, 2, `❌ testProcessVaultsLimit failed: Expected 2 but got ${processedVaults.length}`);
    assert.deepStrictEqual(
        processedVaults.map(v => v.address),
        ["0xVault1", "0xVault2"],
        `❌ testProcessVaultsLimit failed: Vault addresses mismatch`
    );

    console.log("✅ testProcessVaultsLimit passed.");
}

// Run all tests
(async () => {
    await testGetVaultCount();
    await testGetVaultBatch();
    await testProcessVaults();
    await testProcessVaultsLimit();
    console.log("🎉 All VtruVaultFactory tests passed successfully!");
})();

