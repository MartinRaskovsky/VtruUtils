#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: February 2025
 *
 * Unit tests for the Web3 class.
 * These tests use mocks to simulate blockchain connection behavior.
 */

const assert = require("assert");
const sinon = require("sinon");
const { ethers } = require("ethers");

// ----------------------------------------------------------------------------
// Stub the prototype methods on ethers.JsonRpcProvider BEFORE loading Web3.
// ----------------------------------------------------------------------------

// Stub getBlockNumber to always resolve to 1234.
sinon.stub(ethers.JsonRpcProvider.prototype, "getBlockNumber").resolves(1234);

// Stub getBalance to always resolve to 1 ETH in wei.
sinon.stub(ethers.JsonRpcProvider.prototype, "getBalance").resolves(1000000000000000000n);

// Now import the Web3 class.
const { Web3 } = require("../lib/libWeb3");

console.log("Running unit tests for Web3.js...");

/**
 * Test the getters and connection check.
 * Verifies that the correct properties are set and that getLatestBlockNumber returns the stubbed value.
 */
async function testGettersAndConnection() {
  // Create a Web3 instance for the "vtru" network.
  const web3Instance = new Web3(Web3.VTRU);

  // Wait for the asynchronous connection check to complete.
  const blockNumber = await web3Instance.getLatestBlockNumber();
  assert.strictEqual(
    blockNumber,
    1234,
    `Expected block number 1234, but got ${blockNumber}`
  );

  // Verify that the getters return the expected values.
  assert.strictEqual(web3Instance.getId(), "vtru", "Expected id to be 'vtru'");
  assert.strictEqual(
    web3Instance.getRpcUrl(),
    "https://rpc.vitruveo.xyz",
    "Unexpected RPC URL for vtru"
  );
  assert.strictEqual(
    web3Instance.getJsonPath(),
    "CONFIG_JSON_FILE_PATH",
    "Unexpected JSON path for vtru"
  );

  console.log("✅ testGettersAndConnection passed.");
}

/**
 * Test getWalletRawBalance.
 * Verifies that for a given wallet address the provider’s getBalance is called
 * and that the returned balance matches the stubbed value.
 */
async function testGetWalletRawBalance() {
  // Reset call history for getBalance.
  ethers.JsonRpcProvider.prototype.getBalance.resetHistory();

  const web3Instance = new Web3(Web3.VTRU);
  await web3Instance.getLatestBlockNumber();

  const wallet = "0xWalletA";
  const balance = await web3Instance.getWalletRawBalance(wallet);

  // Verify that getBalance was called with the correct wallet address.
  sinon.assert.calledWith(ethers.JsonRpcProvider.prototype.getBalance, wallet);
  assert.strictEqual(
    balance,
    1000000000000000000n,
    `Expected balance of 1 ETH in wei, but got ${balance}`
  );

  console.log("✅ testGetWalletRawBalance passed.");
}

/**
 * Test getWalletRawBalances.
 * Verifies that an array of wallet addresses returns an array of balances.
 */
async function testGetWalletRawBalances() {
  // Reset call history.
  ethers.JsonRpcProvider.prototype.getBalance.resetHistory();

  const web3Instance = new Web3(Web3.VTRU);
  await web3Instance.getLatestBlockNumber();

  const wallets = ["0xWalletA", "0xWalletB"];
  const balances = await web3Instance.getWalletRawBalances(wallets);

  // Both wallets should return 1 ETH in wei.
  const expected = [1000000000000000000n, 1000000000000000000n];

  // Convert BigInts to strings in the error message for serialization.
  assert.deepStrictEqual(
    balances,
    expected,
    `Expected balances ${expected.map(b => b.toString())} but got ${balances.map(b => b.toString())}`
  );

  // Ensure that getBalance was called once per wallet.
  sinon.assert.callCount(ethers.JsonRpcProvider.prototype.getBalance, 2);

  console.log("✅ testGetWalletRawBalances passed.");
}

/**
 * Test error handling in getWalletRawBalance.
 * Simulate a provider error so that getWalletRawBalance returns 0n.
 */
async function testGetWalletRawBalanceError() {
  // Make the getBalance stub reject with an error.
  ethers.JsonRpcProvider.prototype.getBalance.rejects(new Error("Simulated provider error"));

  const web3Instance = new Web3(Web3.VTRU);
  await web3Instance.getLatestBlockNumber();

  const wallet = "0xWalletError";
  const balance = await web3Instance.getWalletRawBalance(wallet);
  assert.strictEqual(
    balance,
    0n,
    `Expected balance 0n on error, but got ${balance}`
  );

  console.log("✅ testGetWalletRawBalanceError passed.");

  // Reset getBalance to default behavior for further tests.
  ethers.JsonRpcProvider.prototype.getBalance.resolves(1000000000000000000n);
}

// ----------------------------------------------------------------------------
// Run all tests sequentially.
// ----------------------------------------------------------------------------
(async () => {
  try {
    await testGettersAndConnection();
    await testGetWalletRawBalance();
    await testGetWalletRawBalances();
    await testGetWalletRawBalanceError();

    console.log("🎉 All Web3 tests passed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
})();

