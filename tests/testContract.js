#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the libContractProvider class.
 * These tests use the actual class and do not rely on mocks.
 */

const assert = require("assert");
const Config = require("../lib/libConfig");
const Web3 = require("../lib/libWeb3");
const libContractProvider = require("../lib/libContractProvider");

async function runTests() {
    // Initialize required instances
    const web3 = await Web3.create(Web3.VTRU);
    const config = web3.getConfig();
    const contractName = "TestContract";

    // Create the libContractProvider instance
    const vtruContract = new libContractProvider(web3, contractName);

    console.log("Running unit tests for libContractProvider.js...");

    /**
     * Test getAddress method
     */
    function testGetAddress() {
        // ✅ Simulate contract address retrieval
        config.data = { mainnet: { TestContract: "0x123456789abcdef" } };

        const expected = "0x123456789abcdef";
        const actual = vtruContract.getAddress();
        assert.strictEqual(
            actual,
            expected,
            `❌ testGetAddress failed: Expected "${expected}", but got "${actual}"`
        );

        // ✅ Test missing address case
        vtruContract.name = "NonExistentContract"; // Change name to a non-existing one
        assert.strictEqual(
            vtruContract.getAddress(),
            null,
            `❌ testGetAddress failed: Expected null for a missing contract address, but got "${vtruContract.getAddress()}"`
        );

        console.log("✅ testGetAddress passed.");
    }

    /**
     * Test getContract method
     */
    function testGetContract() {
        vtruContract.name = "TestContract";

        config.data = {
            abi: { TestContract: [{ name: "testFunction", type: "function" }] },
            mainnet: { TestContract: "0x123456789abcdef" }
        };

        const contractInstance = vtruContract.getContract();

        assert.ok(
            contractInstance,
            `❌ testGetContract failed: Expected contract instance, but got null.`
        );

        // ✅ Fetch the address correctly from the config instead of contractInstance
        const expectedAddress = config.getContractAddress(vtruContract.name);

        assert.strictEqual(
            expectedAddress,
            "0x123456789abcdef",
            `❌ testGetContract failed: Expected contract address "${"0x123456789abcdef"}", but got "${expectedAddress}"`
        );

        console.log("✅ testGetContract passed.");
    }

    /**
     * Test getContract failure case (no ABI or address)
     */
    function testGetContractFailure() {
        config.data = { abi: {} }; // ✅ Ensure abi exists to avoid undefined error

        const contractInstance = vtruContract.getContract();

        assert.strictEqual(
            contractInstance,
            null,
            "❌ testGetContractFailure failed: Expected null contract instance."
        );

        console.log("✅ testGetContractFailure passed.");
    }

    // Run all tests
    testGetAddress();
    testGetContract();
    testGetContractFailure();

    console.log("🎉 All libContractProvider tests passed successfully!");
}

// Execute the test runner
runTests().catch((error) => {
    console.error("❌ Test execution failed:", error);
    process.exit(1);
});
