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

// Import dependencies
const { Web3 } = require("../lib/libWeb3");
const { Network } = require("../lib/libNetwork");
const GenericDetails = require("../lib/libGenericDetails");

// Import the class under test.
const VtruWalletDetails = require("../lib/vtruWalletDetails");

// -----------------------------------------------------------------------------
// Create dummy objects for the vtru and bsc instances.
// Note: We include a dummy getProvider() method because contract constructors
// (like in VtruStakedContract) call web3.getProvider()
// -----------------------------------------------------------------------------
const dummyVtru = { 
  getProvider: () => ({}) 
};
const dummyBsc  = { 
  getProvider: () => ({}) 
};

console.log("Running unit tests for VtruWalletDetails.js...");

/**
 * Test the get() method when only a vtru instance is provided (no BSC)
 * and full details are not requested.
 */
async function testGetWithoutFullAndWithoutBSC() {
  // Prepare a dummy output for GenericDetails.get.
  const expectedOutput = { result: "basic" };

  // Stub GenericDetails.prototype.get so that it returns the expected output.
  const genericGetStub = sinon.stub(GenericDetails.prototype, "get").resolves(expectedOutput);

  // Create a dummy network that returns only a vtru instance.
  const dummyNetwork = {
    get: (id) => {
      if (id === Web3.VTRU) return dummyVtru;
      return undefined;
    }
  };

  // Create the VtruWalletDetails instance.
  const walletDetails = new VtruWalletDetails(dummyNetwork);
  const wallets = ["0xWallet1", "0xWallet2"];

  // Call get() with full = false and formatOutput = false.
  const result = await walletDetails.get(wallets, false, false);

  // Verify that GenericDetails.get was called with the provided wallet addresses.
  sinon.assert.calledWith(genericGetStub, wallets);

  // Compare the result with the expected output.
  assert.deepStrictEqual(
    result,
    expectedOutput,
    `❌ testGetWithoutFullAndWithoutBSC failed: Expected ${JSON.stringify(expectedOutput)} but got ${JSON.stringify(result)}`
  );

  console.log("✅ testGetWithoutFullAndWithoutBSC passed.");
  genericGetStub.restore();
}

/**
 * Test the get() method when both vtru and bsc instances are provided,
 * and full details are requested.
 */
async function testGetWithFullAndWithBSC() {
  const expectedOutput = { result: "full" };

  // Stub GenericDetails.prototype.get to return the expected output.
  const genericGetStub = sinon.stub(GenericDetails.prototype, "get").resolves(expectedOutput);

  // Create a dummy network that returns both vtru and bsc.
  const dummyNetwork = {
    get: (id) => {
      if (id === Web3.VTRU) return dummyVtru;
      if (id === Web3.BSC)  return dummyBsc;
    }
  };

  // Create the VtruWalletDetails instance.
  const walletDetails = new VtruWalletDetails(dummyNetwork);
  const wallets = ["0xWallet1", "0xWallet2", "0xWallet3"];

  // Call get() with full = true and formatOutput = true.
  const result = await walletDetails.get(wallets, true, true);

  // Verify that GenericDetails.get was called with the correct wallet addresses.
  sinon.assert.calledWith(genericGetStub, wallets);

  // Compare the result with the expected output.
  assert.deepStrictEqual(
    result,
    expectedOutput,
    `❌ testGetWithFullAndWithBSC failed: Expected ${JSON.stringify(expectedOutput)} but got ${JSON.stringify(result)}`
  );

  console.log("✅ testGetWithFullAndWithBSC passed.");
  genericGetStub.restore();
}

/**
 * Test that the constructor throws an error when no vtru instance is provided.
 */
function testConstructorValidation() {
  // Create a dummy network that returns undefined for any id.
  const dummyNetwork = {
    get: (id) => undefined
  };

  // Expect an error when constructing VtruWalletDetails without a vtru instance.
  assert.throws(
    () => {
      new VtruWalletDetails(dummyNetwork);
    },
    /❌ A VTRU network instance is required/,
    "❌ testConstructorValidation failed: Expected an error when no vtru instance is provided"
  );

  console.log("✅ testConstructorValidation passed.");
}

// Run all tests sequentially.
(async () => {
  try {
    await testGetWithoutFullAndWithoutBSC();
    await testGetWithFullAndWithBSC();
    testConstructorValidation();
    console.log("🎉 All VtruWalletDetails tests passed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
})();

