#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: February 2025
 *
 * Unit tests for the VtruWalletDetails class.
 * These tests use mocks to simulate contract interactions.
 */

const assert = require("assert");
const sinon = require("sinon");

// Import the class under test and its dependencies.
const VtruWalletDetails = require("../lib/VtruWalletDetails");
const GenericDetails = require("../lib/libGenericDetails");

// The following contract classes are instantiated internally by VtruWalletDetails.
// For these tests we do not need to simulate their inner workings.
const VtruWalletContract = require("../lib/vtruWalletContract");
const VtruStakedContract = require("../lib/vtruStakedContract");
const VtruVerseContract = require("../lib/vtruVerseContract");
const VtruVibeContract = require("../lib/vtruVibeContract");
const BscStakedContract = require("../lib/bscStakedContract");

// Create dummy vtru and bsc web3 instances with a dummy getProvider function.
const dummyVtru = {
    getProvider: () => ({})
};
const dummyBsc = {
    getProvider: () => ({})
};

console.log("Running unit tests for VtruWalletDetails.js...");

/**
 * Test the get() method when no BSC instance is provided and full details are not requested.
 */
async function testGetWithoutFullAndWithoutBsc() {
    // Prepare a dummy output for GenericDetails.get.
    const expectedOutput = { result: "basic" };

    // Stub GenericDetails.prototype.get so that it returns the expected output.
    const genericGetStub = sinon.stub(GenericDetails.prototype, "get").resolves(expectedOutput);

    // Create an instance of VtruWalletDetails with only the vtru instance.
    const walletDetails = new VtruWalletDetails(dummyVtru, null);
    const wallets = ["0xWallet1", "0xWallet2"];

    // Call the get method with full = false and formatOutput = false.
    const output = await walletDetails.get(wallets, false, false);

    // Verify that GenericDetails.get was called with the provided wallet addresses.
    sinon.assert.calledWith(genericGetStub, wallets);

    // Compare the actual output with the expected output.
    assert.deepStrictEqual(
        output,
        expectedOutput,
        `❌ testGetWithoutFullAndWithoutBsc failed: Expected ${JSON.stringify(expectedOutput)} but got ${JSON.stringify(output)}`
    );

    console.log("✅ testGetWithoutFullAndWithoutBsc passed.");

    // Restore the stub for the next test.
    genericGetStub.restore();
}

/**
 * Test the get() method when both full details and a BSC instance are provided.
 */
async function testGetWithFullAndWithBsc() {
    const expectedOutput = { result: "full" };

    // Stub GenericDetails.prototype.get for the full details scenario.
    const genericGetStub = sinon.stub(GenericDetails.prototype, "get").resolves(expectedOutput);

    // Create an instance of VtruWalletDetails with both vtru and bsc instances.
    const walletDetails = new VtruWalletDetails(dummyVtru, dummyBsc);
    const wallets = ["0xWallet1", "0xWallet2", "0xWallet3"];

    // Call get() with full = true and formatOutput = true.
    const output = await walletDetails.get(wallets, true, true);

    // Verify that GenericDetails.get was called with the correct wallet addresses.
    sinon.assert.calledWith(genericGetStub, wallets);

    // Verify that the output is as expected.
    assert.deepStrictEqual(
        output,
        expectedOutput,
        `❌ testGetWithFullAndWithBsc failed: Expected ${JSON.stringify(expectedOutput)} but got ${JSON.stringify(output)}`
    );

    console.log("✅ testGetWithFullAndWithBsc passed.");

    genericGetStub.restore();
}

/**
 * Test that the constructor enforces the presence of a vtru instance.
 */
function testConstructorValidation() {
    // Expect an error when a vtru instance is not provided.
    assert.throws(
        () => {
            new VtruWalletDetails(null);
        },
        /A vtru instance is required/,
        "❌ testConstructorValidation failed: Expected error when no vtru instance is provided"
    );
    console.log("✅ testConstructorValidation passed.");
}

// Run all tests sequentially.
(async () => {
    try {
        await testGetWithoutFullAndWithoutBsc();
        await testGetWithFullAndWithBsc();
        testConstructorValidation();
        console.log("🎉 All VtruWalletDetails tests passed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Test failed:", error);
        process.exit(1);
    }
})();

