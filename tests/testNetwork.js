#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: February 2025
 *
 * Unit tests for the Network class.
 * These tests use mocks to simulate Web3 connections.
 */

const assert = require("assert");
const sinon = require("sinon");
const Network = require("../lib/libNetwork");
const Web3 = require("../lib/libWeb3");

// ----------------------------------------------------------------------------
// Create mock Web3 instances
// ----------------------------------------------------------------------------

/**
 * Creates a simple mock Web3 instance.
 *
 * @param {string} id - The network identifier.
 * @returns {Object} A mock Web3 instance with the expected methods.
 */
function createMockWeb3(id) {
  return {
    getId: () => id,
    // Stub getLatestBlockNumber to always resolve to 123 (for testing purposes)
    getLatestBlockNumber: sinon.stub().resolves(123),
  };
}

// Stub the static Web3.create method so that it returns our mock instance.
sinon.stub(Web3, "create").callsFake((id) => createMockWeb3(id));

console.log("Running unit tests for Network.js...");

// ----------------------------------------------------------------------------
// Test functions
// ----------------------------------------------------------------------------

/**
 * Test: Network instance creation and the 'get' method.
 */
function testNetworkCreation() {
  // Create a Network instance with two network IDs.
  const network = new Network([Web3.VTRU, Web3.BSC]);

  // Verify that Web3.create was called with the expected identifiers.
  assert(
    Web3.create.calledWith("vtru"),
    "Expected Web3.create to be called with 'vtru'"
  );
  assert(
    Web3.create.calledWith("bsc"),
    "Expected Web3.create to be called with 'bsc'"
  );

  // Retrieve each Web3 instance using the 'get' method.
  const vtruInstance = network.get(Web3.VTRU);
  const bscInstance = network.get(Web3.BSC);

  // Verify that the returned mock instances behave as expected.
  assert.strictEqual(
    vtruInstance.getId(),
    "vtru",
    "vtru instance should return 'vtru' from getId()"
  );
  assert.strictEqual(
    bscInstance.getId(),
    "bsc",
    "bsc instance should return 'bsc' from getId()"
  );

  console.log("✅ testNetworkCreation passed.");
}

/**
 * Test: 'getAll' method returns an object with all network connections.
 */
function testGetAll() {
  const network = new Network([Web3.VTRU, Web3.BSC]);
  const allNetworks = network.getAll();

  // Verify that the object contains keys for both network IDs.
  assert("vtru" in allNetworks, "Expected key 'vtru' in all networks");
  assert("bsc" in allNetworks, "Expected key 'bsc' in all networks");

  console.log("✅ testGetAll passed.");
}

/**
 * Test: Methods of the mock Web3 instance work as expected.
 */
async function testWeb3Methods() {
  const network = new Network([Web3.VTRU]);
  const vtruInstance = network.get(Web3.VTRU);

  // Since our stub for getLatestBlockNumber resolves to 123, verify that.
  const latestBlock = await vtruInstance.getLatestBlockNumber();
  assert.strictEqual(
    latestBlock,
    123,
    "Expected latest block number to be 123"
  );

  console.log("✅ testWeb3Methods passed.");
}

// ----------------------------------------------------------------------------
// Run all tests sequentially
// ----------------------------------------------------------------------------

(async () => {
  try {
    testNetworkCreation();
    testGetAll();
    await testWeb3Methods();
    console.log("🎉 All Network tests passed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
})();

