#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the VtruWalletDetails class.
 * These tests use mocks to simulate wallet detail retrieval.
 */

const assert = require("assert");
const sinon = require("sinon");
const VtruWalletDetails = require("../lib/vtruWalletDetails");
const { formatRawNumbers, formatNumbers, scaleUp } = require("../lib/vtruUtils"); // ✅ Use correct function

// ✅ Create mock instances
const mockWeb3 = {
    getProvider: sinon.stub().returns({}),
    getWalletRawBalances: sinon.stub(),
};

// ✅ Create mock contracts
const mockStakedContract = { getStakedBalances: sinon.stub() };
const mockVerseContract = { getVerseBalances: sinon.stub() };
const mockVibeContract = { getVibeBalances: sinon.stub() };

// ✅ Stub the constructors for `VtruWalletDetails` dependencies
sinon.stub(require("../lib/vtruStakedContract").prototype, "getStakedBalances").callsFake(mockStakedContract.getStakedBalances);
sinon.stub(require("../lib/vtruVerseContract").prototype, "getVerseBalances").callsFake(mockVerseContract.getVerseBalances);
sinon.stub(require("../lib/vtruVibeContract").prototype, "getVibeBalances").callsFake(mockVibeContract.getVibeBalances);

// ✅ Create the `VtruWalletDetails` instance with mocks
const walletDetails = new VtruWalletDetails(mockWeb3);

console.log("Running unit tests for VtruWalletDetails.js...");

/**
 * Test get method with valid wallets (no full data).
 */
async function testGetWalletsBasic() {
    mockWeb3.getWalletRawBalances.resolves([scaleUp(1000n), scaleUp(500n)]);
    mockStakedContract.getStakedBalances.resolves([300n, 200n]);

    const result = await walletDetails.get(["0xWallet1", "0xWallet2"]);

    // ✅ Expect correctly formatted wallet balances (BigInt in WEI, so use formatRawNumbers)
    assert.deepStrictEqual(
        result.walletBalances,
        formatRawNumbers([scaleUp(1000n), scaleUp(500n)]), 
        `❌ testGetWalletsBasic failed: Expected walletBalances but got ${JSON.stringify(result.walletBalances)}`
    );
    assert.deepStrictEqual(
        result.walletStaked,
        formatRawNumbers([300n, 200n]), 
        `❌ testGetWalletsBasic failed: Expected walletStaked but got ${JSON.stringify(result.walletStaked)}`
    );
    assert.strictEqual(result.held, scaleUp(1500n), `❌ testGetWalletsBasic failed: Expected held=1500n but got ${result.held}`);
    assert.strictEqual(result.staked, 500n, `❌ testGetWalletsBasic failed: Expected staked=500n but got ${result.staked}`);

    console.log("✅ testGetWalletsBasic passed.");
}

/**
 * Test get method with full data retrieval.
 */
async function testGetWalletsFull() {
    mockWeb3.getWalletRawBalances.resolves([scaleUp(1000n), scaleUp(500n)]);
    mockStakedContract.getStakedBalances.resolves([300n, 200n]);
    mockVerseContract.getVerseBalances.resolves([50n, 30n]);
    mockVibeContract.getVibeBalances.resolves([10n, 5n]);

    const result = await walletDetails.get(["0xWallet1", "0xWallet2"], true);

    // ✅ Use `formatRawNumbers()` for balances (BigInt in WEI)
    assert.deepStrictEqual(
        result.walletBalances,
        formatRawNumbers([scaleUp(1000n), scaleUp(500n)]), 
        `❌ testGetWalletsFull failed: Expected walletBalances but got ${JSON.stringify(result.walletBalances)}`
    );
    assert.deepStrictEqual(
        result.walletStaked,
        formatRawNumbers([300n, 200n]), 
        `❌ testGetWalletsFull failed: Expected walletStaked but got ${JSON.stringify(result.walletStaked)}`
    );

    // ✅ Use `formatNumbers()` for verses and vibes (regular numbers)
    assert.deepStrictEqual(
        result.walletVerses,
        formatNumbers([50, 30], 0), 
        `❌ testGetWalletsFull failed: Expected walletVerses but got ${JSON.stringify(result.walletVerses)}`
    );
    assert.deepStrictEqual(
        result.walletVibes,
        formatNumbers([10n, 5n], 0), 
        `❌ testGetWalletsFull failed: Expected walletVibes but got ${JSON.stringify(result.walletVibes)}`
    );

    assert.strictEqual(result.verses, 80n, `❌ testGetWalletsFull failed: Expected verses=80 but got ${result.verses}`);
    assert.strictEqual(result.vibes, 15n, `❌ testGetWalletsFull failed: Expected vibes=15 but got ${result.vibes}`);

    console.log("✅ testGetWalletsFull passed.");
}

/**
 * Test get method when contract calls fail.
 */
async function testGetWalletsFailures() {
    mockWeb3.getWalletRawBalances.rejects(new Error("Blockchain error"));
    mockStakedContract.getStakedBalances.rejects(new Error("Blockchain error"));
    mockVerseContract.getVerseBalances.rejects(new Error("Blockchain error"));
    mockVibeContract.getVibeBalances.rejects(new Error("Blockchain error"));

    const result = await walletDetails.get(["0xWallet1", "0xWallet2"], true);

    assert.deepStrictEqual(
        result.walletBalances,
        [],
        `❌ testGetWalletsFailures failed: Expected empty walletBalances but got ${JSON.stringify(result.walletBalances)}`
    );
    assert.deepStrictEqual(
        result.walletStaked,
        [],
        `❌ testGetWalletsFailures failed: Expected empty walletStaked but got ${JSON.stringify(result.walletStaked)}`
    );
    assert.deepStrictEqual(
        result.walletVerses,
        [],
        `❌ testGetWalletsFailures failed: Expected empty walletVerses but got ${JSON.stringify(result.walletVerses)}`
    );
    assert.deepStrictEqual(
        result.walletVibes,
        [],
        `❌ testGetWalletsFailures failed: Expected empty walletVibes but got ${JSON.stringify(result.walletVibes)}`
    );
    assert.strictEqual(result.held, 0n, `❌ testGetWalletsFailures failed: Expected held=0n but got ${result.held}`);
    assert.strictEqual(result.staked, 0n, `❌ testGetWalletsFailures failed: Expected staked=0n but got ${result.staked}`);
    assert.strictEqual(result.verses, 0, `❌ testGetWalletsFailures failed: Expected verses=0 but got ${result.verses}`);
    assert.strictEqual(result.vibes, 0, `❌ testGetWalletsFailures failed: Expected vibes=0 but got ${result.vibes}`);

    console.log("✅ testGetWalletsFailures passed.");
}

// Run all tests
(async () => {
    await testGetWalletsBasic();
    await testGetWalletsFull();
    await testGetWalletsFailures();
    console.log("🎉 All VtruWalletDetails tests passed successfully!");
})();

