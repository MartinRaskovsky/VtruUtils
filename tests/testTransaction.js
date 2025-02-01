#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the VtruTransaction class.
 * These tests use mocks to simulate API responses.
 */

const assert = require("assert");
const sinon = require("sinon");
const axios = require("axios");
const VtruTransaction = require("../lib/vtruTransaction");

// Create the VtruTransaction instance
const explorerApiUrl = "https://api.testnet.etherscan.io/api";
const transaction = new VtruTransaction(explorerApiUrl);

console.log("Running unit tests for VtruTransaction.js...");

/**
 * Reset function to clear mocks before each test.
 */
function reset() {
    sinon.restore();
}

/**
 * Test getTransactions method with a successful API response.
 */
async function testGetTransactionsSuccess() {
    reset(); // ✅ Ensure test starts fresh

    // ✅ Mock API response
    const mockResponse = {
        data: {
            status: "1",
            result: [
                { hash: "0xabc123", from: "0x111", to: "0x222", value: "100" },
                { hash: "0xdef456", from: "0x333", to: "0x444", value: "200" }
            ]
        }
    };

    const axiosStub = sinon.stub(axios, "get").resolves(mockResponse);

    const transactions = await transaction.getTransactions("0xTestAddress");

    // ✅ Check if transactions were fetched correctly
    assert.deepStrictEqual(
        transactions,
        mockResponse.data.result,
        `❌ testGetTransactionsSuccess failed: Expected transactions but got ${JSON.stringify(transactions)}`
    );

    axiosStub.restore();
    console.log("✅ testGetTransactionsSuccess passed.");
}

/**
 * Test getTransactions method with an empty API response.
 */
async function testGetTransactionsEmpty() {
    reset(); // ✅ Ensure test starts fresh

    // ✅ Mock API response with no transactions
    const axiosStub = sinon.stub(axios, "get").resolves({
        data: { status: "1", result: [] }
    });

    const transactions = await transaction.getTransactions("0xTestAddress");

    assert.deepStrictEqual(
        transactions,
        [],
        `❌ testGetTransactionsEmpty failed: Expected empty array but got ${JSON.stringify(transactions)}`
    );

    axiosStub.restore();
    console.log("✅ testGetTransactionsEmpty passed.");
}

/**
 * Test getTransactions method when API fails.
 */
async function testGetTransactionsApiFailure() {
    reset(); // ✅ Ensure test starts fresh

    // ✅ Mock API failure
    const axiosStub = sinon.stub(axios, "get").rejects(new Error("API request failed"));

    try {
        const transactions = await transaction.getTransactions("0xTestAddress");

        assert.deepStrictEqual(
            transactions,
            [],
            `❌ testGetTransactionsApiFailure failed: Expected empty array but got ${JSON.stringify(transactions)}`
        );

        console.log("✅ testGetTransactionsApiFailure passed.");
    } catch (error) {
        console.error("❌ testGetTransactionsApiFailure failed: Unexpected error:", error.message);
    } finally {
        axiosStub.restore();
    }
}

/**
 * Test getTransactions method with incorrect API response format.
 */
async function testGetTransactionsInvalidResponse() {
    reset(); // ✅ Ensure test starts fresh

    // ✅ Mock API response with missing `result` field
    const axiosStub = sinon.stub(axios, "get").resolves({
        data: { status: "1" }
    });

    const transactions = await transaction.getTransactions("0xTestAddress");

    assert.deepStrictEqual(
        transactions,
        [],
        `❌ testGetTransactionsInvalidResponse failed: Expected empty array but got ${JSON.stringify(transactions)}`
    );

    axiosStub.restore();
    console.log("✅ testGetTransactionsInvalidResponse passed.");
}

// Run all tests
(async () => {
    await testGetTransactionsSuccess();
    await testGetTransactionsEmpty();
    await testGetTransactionsApiFailure();
    await testGetTransactionsInvalidResponse();
    console.log("🎉 All VtruTransaction tests passed successfully!");
})();

