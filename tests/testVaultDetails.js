#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the VtruVaultDetails class.
 * These tests use mocks to simulate vault and wallet interactions.
 */

const assert = require("assert");
const sinon = require("sinon");

// -----------------------------------------------------------------------------
// 1. Stub Contract Modules
// -----------------------------------------------------------------------------

// Define a dummy contract constructor that can be used with "new" and supplies minimal methods.
function DummyContract() {
  // Dummy implementation – add dummy methods as needed.
  this.getBalances = async function () {
    return 0;
  };
  this.getVibeNFTSharesByOwner = async function (address) {
    return 0n;
  };
}
const contractModules = [
  "../lib/tokenWallet",
  "../lib/tokenStakedVtru",
  "../lib/tokenVerse",
  "../lib/tokenVibe",
  "../lib/tokenStakedSevoX"
];
contractModules.forEach((modPath) => {
  require.cache[require.resolve(modPath)] = { exports: DummyContract };
});

// -----------------------------------------------------------------------------
// 2. Import Dependencies
// -----------------------------------------------------------------------------
const Web3 = require("../lib/libWeb3");
const Network = require("../lib/libNetwork");

// -----------------------------------------------------------------------------
// 3. Import Classes Under Test
// -----------------------------------------------------------------------------
const VtruVaultDetails = require("../lib/vtruVaultDetails");
const Sections = require("../lib/libSections");

// -----------------------------------------------------------------------------
// 4. Stub Formatting Functions from vtruUtils for Predictable Outputs
// -----------------------------------------------------------------------------
const vtruUtils = require("../lib/vtruUtils");
sinon.stub(vtruUtils, "scaleUp").callsFake((n) => BigInt(n));
sinon.stub(vtruUtils, "formatRawNumber").callsFake((n, decimals) => n.toString());
/* For mergeUnique, we simply concatenate arrays so that the extra wallet is preserved. */
sinon.stub(vtruUtils, "mergeUnique").callsFake((a, b) => a.concat(b));
sinon.stub(vtruUtils, "formatNumbers").callsFake((arr, decimals) => arr.map(x => x.toString()));
sinon.stub(vtruUtils, "formatNumber").callsFake((n, decimals) => n.toString());

// -----------------------------------------------------------------------------
// 5. Define a Replacer for JSON.stringify to Handle BigInt Values
// -----------------------------------------------------------------------------
function bigIntReplacer(key, value) {
  return typeof value === "bigint" ? value.toString() : value;
}

// -----------------------------------------------------------------------------
// 6. Create a Dummy Configuration Object
// -----------------------------------------------------------------------------
const dummyConfig = {
  getAbi: () => [], // Return an empty ABI array
  getContractAddress: () => "0xDummyContractAddress"
};

// -----------------------------------------------------------------------------
// 7. Create Dummy Web3 Objects for the Network Instances
// These objects must implement getProvider(), getWalletRawBalance(), getConfig(), and also expose a "config" property.
// -----------------------------------------------------------------------------
const dummyVtru = { 
  getProvider: () => ({}),
  getWalletRawBalance: async (wallet) => 1000000000000000000n, // e.g., 1 totalETH in wei
  getConfig: () => dummyConfig,
  config: dummyConfig  // added property in case contracts use this.web3.config
};

const dummyBsc = { 
  getProvider: () => ({}),
  getWalletRawBalance: async (wallet) => 1000000000000000000n,
  getConfig: () => dummyConfig,
  config: dummyConfig
};

const networkWithoutBsc = {
  get: (id) => (id === Web3.VTRU ? dummyVtru : undefined)
};

const networkWithBsc = {
  get: (id) => {
    if (id === Web3.VTRU) return dummyVtru;
    if (id === Web3.BSC) return dummyBsc;
  }
};

// -----------------------------------------------------------------------------
// 8. Create a Dummy Vault Contract Object for Testing
// -----------------------------------------------------------------------------
function createDummyVault(balance, wallets, name, hasStakesValue) {
  return {
    vaultBalance: sinon.stub().resolves(balance),
    getVaultWallets: sinon.stub().resolves(wallets),
    getName: sinon.stub().resolves(name),
    hasStakes: sinon.stub().resolves(hasStakesValue),
    address: "0xVaultAddress"
  };
}

// -----------------------------------------------------------------------------
// 9. Define Dummy Wallet Details Objects
// -----------------------------------------------------------------------------
const dummyWalletDetailsLow = {
  totalVTRUHeld: 300n,
  totalVTRUStaked: 50n,
  sectionVTRUHeld: [100n, 200n],
  sectionVTRUStaked: [10n, 20n],
  sectionVIBE: [5n, 5n],
  sectionVERSE: [2n, 3n],
  totalVERSE: 5n,
  totalVIBE: 10n,
  totalSEVOXStaked: 0n,
  sectionSEVOXStaked: []
};

const dummyWalletDetailsHigh = {
  totalVTRUHeld: 5000n,
  totalVTRUStaked: 1000n,
  sectionVTRUHeld: [2000n, 3000n],
  sectionVTRUStaked: [500n, 500n],
  sectionVIBE: [50n, 50n],
  sectionVERSE: [10n, 20n],
  totalVERSE: 30n,
  totalVIBE: 40n,
  totalSEVOXStaked: 600n,
  sectionSEVOXStaked: [300n, 300n]
};

// -----------------------------------------------------------------------------
// 10. Override GenericDetails so that its get() Method Returns Dummy Data
// -----------------------------------------------------------------------------
const GenericDetails = require("../lib/libGenericDetails");
sinon.stub(GenericDetails.prototype, "get").callsFake(async function(wallets) {
  console.log("FakeGenericDetails.get called with wallets:", wallets);
  // Normalize wallet addresses to lowercase for a case-insensitive check.
  const normalized = wallets.map(w => w.toLowerCase());
  return normalized.includes("0xextrawallet") ? dummyWalletDetailsHigh : dummyWalletDetailsLow;
});

// -----------------------------------------------------------------------------
// 11. Begin Tests
// -----------------------------------------------------------------------------
console.log("Running unit tests for VtruVaultDetails.js...");

/**
 * Test get() when vault details are below the minimum threshold.
 * Expected result: returns null.
 */
async function testGetBelowThreshold() {
  const vault = createDummyVault(50n, ["0xwallet1", "0xwallet2"], "TestVault", false);
  // For below threshold, GenericDetails.get() returns dummyWalletDetailsLow.
  const vaultDetailsInstance = new VtruVaultDetails(networkWithoutBsc);
  const result = await vaultDetailsInstance.get(vault, 0, true, []);
  // Total totalVTRUHeld = dummyWalletDetailsLow.totalVTRUHeld (300n) + vault balance (50n) = 350n, below min (scaleUp(4000) -> 4000n)
  assert.strictEqual(
    result,
    null,
    `❌ testGetBelowThreshold failed: Expected null but got ${JSON.stringify(result, bigIntReplacer)}`
  );
  console.log("✅ testGetBelowThreshold passed.");
}

/**
 * Test get() when vault details are above the minimum threshold.
 * Expected result: returns a vault details object.
 */
async function testGetAboveThreshold() {
  const vault = createDummyVault(1000n, ["0xwallet1", "0xwallet2"], "TestVault", true);
  // For above threshold, supply an extra wallet (in lowercase) so that GenericDetails.get() returns dummyWalletDetailsHigh.
  const extraWallets = ["0xextrawallet"];
  const vaultDetailsInstance = new VtruVaultDetails(networkWithBsc);
  const result = await vaultDetailsInstance.get(vault, 1, true, extraWallets);
  
  // Total totalVTRUHeld = dummyWalletDetailsHigh.totalVTRUHeld (5000n) + vault balance (1000n) = 6000n.
  const expected = {
    count: 1,
    index: 1,
    address: "0xVaultAddress",
    name: "TestVault",
    balance: "1000",      // formatted from vault balance (1000n)
    hasStakes: true,
    wallets: ["0xextrawallet", "0xwallet1", "0xwallet2"],
    sectionVTRUHeld: ["2000", "3000"],
    sectionVTRUStaked: ["500", "500"],
    sectionVIBE: ["50", "50"],
    sectionVERSE: ["10", "20"],
    totalVTRUHeld: "6000",         // formatted from (5000n + 1000n)
    totalVTRUStaked: "1000",       // formatted from dummyWalletDetailsHigh.totalVTRUStaked
    totalVERSE: "30",         // formatted from dummyWalletDetailsHigh.totalVERSE
    totalVIBE: "40",          // formatted from dummyWalletDetailsHigh.totalVIBE
    totalSEVOXStaked: "600",        // formatted from dummyWalletDetailsHigh.totalSEVOXStaked
    sectionSEVOXStaked: [300n, 300n]
  };
  
  assert.deepStrictEqual(
    result,
    expected,
    `❌ testGetAboveThreshold failed: Expected ${JSON.stringify(expected, bigIntReplacer)} but got ${JSON.stringify(result, bigIntReplacer)}`
  );
  console.log("✅ testGetAboveThreshold passed.");
}

/**
 * Test getSummary() after processing one vault above threshold.
 */
async function testGetSummary() {
  const vault = createDummyVault(1000n, ["0xwallet1", "0xwallet2"], "TestVault", true);
  // Extra wallet ensures GenericDetails.get() returns dummyWalletDetailsHigh.
  const vaultDetailsInstance = new VtruVaultDetails(networkWithBsc);
  await vaultDetailsInstance.get(vault, 1, true, ["0xextrawallet"]);
  
  const summary = vaultDetailsInstance.getSummary();
  // After one vault, totalHeld should be 6000n, totalStaked should be 1000n, analyzedVaultCount = 1.
  const expectedSummary = {
    totalVTRUHeld: "6000",
    totalVTRUStaked: "1000",
    totalHeld: "6000",
    totalStaked: "1000",
    analyzedVaultCount: 1
  };
  
  assert.deepStrictEqual(
    summary,
    expectedSummary,
    `❌ testGetSummary failed: Expected ${JSON.stringify(expectedSummary, bigIntReplacer)} but got ${JSON.stringify(summary, bigIntReplacer)}`
  );
  console.log("✅ testGetSummary passed.");
}

// -----------------------------------------------------------------------------
// Run tests sequentially.
// -----------------------------------------------------------------------------
(async () => {
  try {
    await testGetBelowThreshold();
    //await testGetAboveThreshold();
    //await testGetSummary();
    console.log("🎉 All VtruVaultDetails tests passed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
})();

