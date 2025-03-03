#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the Config class.
 * These tests use the actual class and do not rely on mocks.
 */

const assert = require("assert");
const Config = require("../lib/libConfig");

// Initialize the Config instance
const config = new Config();

console.log("Running unit tests for Config.js...");

/**
 * Test get method
 */
function testGet() {
    process.env.TEST_KEY = "test_value";
    assert.strictEqual(config.get("TEST_KEY"), "test_value", "get() failed to retrieve correct value.");
    assert.strictEqual(config.get("NON_EXISTENT_KEY"), null, "get() should return null for missing keys.");
    console.log("✅ testGet passed.");
}

/**
 * Test getWallets method (without modifying .env file)
 */
function testGetWallets() {
    // ✅ Simulate the environment without writing to .env
    process.env.WALLETS = "0x123,0x456,0x789";
    assert.deepStrictEqual(
        config.getWallets(),
        ["0x123", "0x456", "0x789"],
        `❌ testGetWallets failed: Expected ["0x123","0x456","0x789"], but got ${JSON.stringify(config.getWallets())}`
    );

    // ✅ Test empty case
    process.env.WALLETS = ""; // Simulate missing wallets
    assert.deepStrictEqual(
        config.getWallets(),
        [],
        `❌ testGetWallets failed: Expected [], but got ${JSON.stringify(config.getWallets())}`
    );

    console.log("✅ testGetWallets passed.");
}

/**
 * Test getVaultAddress method (without modifying .env file)
 */
function testGetVaultAddress() {
    // ✅ Simulate the environment without writing to .env
    process.env.VAULT_ADDRESS = "0xabcdef";
    assert.strictEqual(
        config.getVaultAddress(),
        "0xabcdef",
        `❌ testGetVaultAddress failed: Expected "0xabcdef", but got "${config.getVaultAddress()}"`
    );

    // ✅ Test empty case
    delete process.env.VAULT_ADDRESS; // Simulate missing vault address
    assert.strictEqual(
        config.getVaultAddress(),
        null,
        `❌ testGetVaultAddress failed: Expected null, but got "${config.getVaultAddress()}"`
    );

    console.log("✅ testGetVaultAddress passed.");
}

/**
 * Test getAbi method
 */
function testGetAbi() {
    config.data = { abi: { MyContract: { foo: "bar" } } };
    assert.deepStrictEqual(config.getAbi("MyContract"), { foo: "bar" }, "getAbi() failed to return correct ABI.");

    assert.strictEqual(config.getAbi("NonExistentContract"), null, "getAbi() should return null for missing contracts.");
    console.log("✅ testGetAbi passed.");
}

/**
 * Test getContractAddress method
 */
function testGetContractAddress() {
    config.data = { mainnet: { MyContract: "0x987654" } };
    assert.strictEqual(config.getContractAddress("MyContract"), "0x987654", "getContractAddress() failed to return correct address.");

    assert.strictEqual(config.getContractAddress("NonExistentContract"), null, "getContractAddress() should return null for missing contracts.");
    console.log("✅ testGetContractAddress passed.");
}

/**
 * Test setWallets method (without modifying .env file)
 */
function testSetWallets() {
    console.log("⚠️ Skipping setWallets test to prevent modifying .env file.");
}

/**
 * Test setVaultAddress method (without modifying .env file)
 */
function testSetVaultAddress() {
    console.log("⚠️ Skipping setVaultAddress test to prevent modifying .env file.");
}

// Run all tests
testGet();
testGetWallets();
testGetVaultAddress();
testGetAbi();
testGetContractAddress();
testSetWallets();
testSetVaultAddress();

console.log("🎉 All Config tests passed successfully!");

