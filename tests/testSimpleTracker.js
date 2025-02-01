#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the VtruSimpleTracker class.
 * These tests use mocks to simulate API responses.
 */

const assert = require("assert");
const sinon = require("sinon");
const axios = require("axios");
const VtruSimpleTracker = require("../lib/vtruSimpleTracker");

// Create the VtruSimpleTracker instance
const explorerApiUrl = "https://api.testnet.etherscan.io/api";
const tracker = new VtruSimpleTracker(explorerApiUrl);

console.log("Running unit tests for VtruSimpleTracker.js...");

/**
 * Reset function to clear state before each test.
 */
function reset() {
    sinon.restore();
    tracker.addressSet.clear();
}

/**
 * Test track method with a successful API response.
 */
async function testTrackSuccess() {
    reset(); // ✅ Ensure test starts fresh

    // ✅ Mock API response
    const mockResponse = {
        data: {
            status: "1",
            result: [
                { to: "0x1111111111111111111111111111111111111111", contractAddress: "", value: "100" },
                { to: "0x2222222222222222222222222222222222222222", contractAddress: "", value: "200" }
            ]
        }
    };

    const axiosStub = sinon.stub(axios, "get").resolves(mockResponse);

    await tracker.track("0xTestAddress");

    // ✅ Check if addresses were added
    const addresses = tracker.get();
    assert.deepStrictEqual(
        addresses,
        ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222"],
        `❌ testTrackSuccess failed: Expected addresses but got ${JSON.stringify(addresses)}`
    );

    axiosStub.restore();
    console.log("✅ testTrackSuccess passed.");
}

/**
 * Test track method with an empty API response.
 */
async function testTrackNoTransactions() {
    reset(); // ✅ Ensure test starts fresh

    // ✅ Mock API response with no transactions
    const axiosStub = sinon.stub(axios, "get").resolves({
        data: { status: "1", result: [] }
    });

    await tracker.track("0xTestAddress");

    const addresses = tracker.get();
    assert.deepStrictEqual(
        addresses,
        [],
        `❌ testTrackNoTransactions failed: Expected empty array but got ${JSON.stringify(addresses)}`
    );

    axiosStub.restore();
    console.log("✅ testTrackNoTransactions passed.");
}

/**
 * Test track method when API fails.
 */
async function testTrackApiFailure() {
    reset(); // ✅ Ensure test starts fresh

    // ✅ Mock API failure
    const axiosStub = sinon.stub(axios, "get").rejects(new Error("API request failed"));

    await tracker.track("0xTestAddress");

    const addresses = tracker.get();
    assert.deepStrictEqual(
        addresses,
        [],
        `❌ testTrackApiFailure failed: Expected empty array but got ${JSON.stringify(addresses)}`
    );

    axiosStub.restore();
    console.log("✅ testTrackApiFailure passed.");
}

/**
 * Test get method on empty tracker.
 */
function testGetEmpty() {
    reset(); // ✅ Ensure test starts fresh

    assert.deepStrictEqual(
        tracker.get(),
        [],
        "❌ testGetEmpty failed: Expected an empty array."
    );

    console.log("✅ testGetEmpty passed.");
}

// Run all tests
(async () => {
    await testTrackSuccess();
    await testTrackNoTransactions();
    await testTrackApiFailure();
    testGetEmpty();
    console.log("🎉 All VtruSimpleTracker tests passed successfully!");
})();

