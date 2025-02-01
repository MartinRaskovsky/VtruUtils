#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the VtruTracker class.
 * These tests use mocks to simulate API responses.
 */

const assert = require("assert");
const sinon = require("sinon");
const VtruTransaction = require("../lib/vtruTransaction");
const VtruTracker = require("../lib/vtruTracker");

// Create the VtruTracker instance
const explorerApiUrl = "https://api.testnet.etherscan.io/api";
const tracker = new VtruTracker(explorerApiUrl);

console.log("Running unit tests for VtruTracker.js...");

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

    // ✅ Mock getTransactions() response
    const mockResponse = [
        { to: "0x1111111111111111111111111111111111111111", contractAddress: "", value: "100" },
        { to: "0x2222222222222222222222222222222222222222", contractAddress: "", value: "200" }
    ];

    const getTransactionsStub = sinon.stub(VtruTransaction.prototype, "getTransactions").resolves(mockResponse);

    await tracker.track("0xTestAddress");

    // ✅ Check if addresses were added
    const addresses = tracker.get();
    assert.deepStrictEqual(
        addresses,
        ["0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222"],
        `❌ testTrackSuccess failed: Expected addresses but got ${JSON.stringify(addresses)}`
    );

    getTransactionsStub.restore();
    console.log("✅ testTrackSuccess passed.");
}

/**
 * Test track method with an empty API response.
 */
async function testTrackNoTransactions() {
    reset(); // ✅ Ensure test starts fresh

    // ✅ Mock getTransactions() response with no transactions
    const getTransactionsStub = sinon.stub(VtruTransaction.prototype, "getTransactions").resolves([]);

    await tracker.track("0xTestAddress");

    const addresses = tracker.get();
    assert.deepStrictEqual(
        addresses,
        [],
        `❌ testTrackNoTransactions failed: Expected empty array but got ${JSON.stringify(addresses)}`
    );

    getTransactionsStub.restore();
    console.log("✅ testTrackNoTransactions passed.");
}

/**
 * Test track method when API fails.
 */
async function testTrackApiFailure() {
    reset(); // ✅ Ensure test starts fresh

    // ✅ Mock getTransactions() failure
    const getTransactionsStub = sinon.stub(VtruTransaction.prototype, "getTransactions").rejects(new Error("API request failed"));

    await tracker.track("0xTestAddress");

    const addresses = tracker.get();
    assert.deepStrictEqual(
        addresses,
        [],
        `❌ testTrackApiFailure failed: Expected empty array but got ${JSON.stringify(addresses)}`
    );

    getTransactionsStub.restore();
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

/**
 * Test recursive tracking with walk()
 */
async function testWalk() {
    reset(); // ✅ Ensure test starts fresh

    // ✅ Mock getTransactions() response
    const mockResponse = [
        { to: "0x1111111111111111111111111111111111111111", contractAddress: "", value: "100" }
    ];

    const getTransactionsStub = sinon.stub(VtruTransaction.prototype, "getTransactions").resolves(mockResponse);

    // ✅ Start tracking
    await tracker.track("0xTestAddress");

    // ✅ Walk through the addresses with level 1 recursion
    await tracker.walk(1);

    const addresses = tracker.get();
    assert.deepStrictEqual(
        addresses,
        ["0x1111111111111111111111111111111111111111"],
        `❌ testWalk failed: Expected one tracked address but got ${JSON.stringify(addresses)}`
    );

    getTransactionsStub.restore();
    console.log("✅ testWalk passed.");
}

/**
 * Test trackMultiple method.
 */
async function testTrackMultiple() {
    reset(); // ✅ Ensure test starts fresh

    // ✅ Mock getTransactions() response
    const mockResponse = [
        { to: "0x1111111111111111111111111111111111111111", contractAddress: "", value: "100" }
    ];

    const getTransactionsStub = sinon.stub(VtruTransaction.prototype, "getTransactions").resolves(mockResponse);

    await tracker.trackMultiple(["0xTestAddress1", "0xTestAddress2"]);

    const addresses = tracker.get();
    assert.deepStrictEqual(
        addresses,
        ["0x1111111111111111111111111111111111111111"],
        `❌ testTrackMultiple failed: Expected one tracked address but got ${JSON.stringify(addresses)}`
    );

    getTransactionsStub.restore();
    console.log("✅ testTrackMultiple passed.");
}

// Run all tests
(async () => {
    await testTrackSuccess();
    await testTrackNoTransactions();
    await testTrackApiFailure();
    testGetEmpty();
    await testWalk();
    await testTrackMultiple();
    console.log("🎉 All VtruTracker tests passed successfully!");
})();

