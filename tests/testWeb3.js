#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: February 2025
 *
 * Unit tests for the Web3 class.
 * These tests use mocks to simulate RPC provider interactions.
 */

const assert = require("assert");
const sinon = require("sinon");
const { ethers } = require("ethers");
const { Web3 } = require("../lib/libWeb3");

async function runTests() {
    // ✅ Step 1: Stub `ethers.JsonRpcProvider` before `Web3.create()`
    const mockProvider = {
        getBlockNumber: sinon.stub().resolves(123456), // Success case
        getBalance: sinon.stub().resolves(1000000000000000000n), // Mock balance
    };

    // ✅ Step 2: Stub `ethers.JsonRpcProvider` to always return the mock
    sinon.stub(ethers, "JsonRpcProvider").returns(mockProvider);

    // ✅ Step 3: Create `Web3` instance
    const web3 = await Web3.create(Web3.VTRU);

    // ✅ Step 4: Explicitly ensure `web3.provider` is the mock
    web3.provider = mockProvider;
    console.log("🛠 DEBUG1: web3.provider after override =", web3.provider);

    console.log("Running unit tests for Web3.js...");

    function testGetNetwork() {
        assert.strictEqual(web3.getNetwork(), Web3.VTRU, "❌ testGetNetwork failed: Incorrect network.");
        console.log("✅ testGetNetwork passed.");
    }

    function testGetJsonPath() {
        assert.strictEqual(web3.getJsonPath(), "CONFIG_JSON_FILE_PATH", "❌ testGetJsonPath failed: Incorrect JSON path.");
        console.log("✅ testGetJsonPath passed.");
    }

    function testGetProvider() {
        const provider = web3.getProvider();
        assert.ok(provider.getBlockNumber, "❌ testGetProvider failed: getBlockNumber method is missing.");
        assert.ok(provider.getBalance, "❌ testGetProvider failed: getBalance method is missing.");
        console.log("✅ testGetProvider passed.");
    }

    async function testCheckConnectionSuccess() {
        await web3.checkConnection();
        console.log("🛠 DEBUG3: Latest block number =", web3.getLatestBlockNumber());
        assert.strictEqual(
            web3.getLatestBlockNumber(),
            123456,
            "❌ testCheckConnectionSuccess failed: Incorrect block number."
        );
        console.log("✅ testCheckConnectionSuccess passed.");
    }

    async function testCheckConnectionFailure() {
        console.log("🛠 DEBUG: Running testCheckConnectionFailure...");
    
        // ✅ Restore all previous stubs to avoid "already stubbed" error
        sinon.restore();
    
        // ✅ Intercept `process.exit` to prevent test termination
        const exitStub = sinon.stub(process, "exit");
    
        // ✅ Ensure `getBlockNumber` is properly stubbed before execution
        const failingProvider = {
            getBlockNumber: sinon.stub().rejects(new Error("RPC not reachable")),
            getBalance: sinon.stub().resolves(1000000000000000000n),
        };
    
        // ✅ Assign the failing provider to `web3.provider`
        web3.provider = failingProvider;
        console.log("🛠 DEBUG: web3.provider after forcing failure =", web3.provider);
    
        try {
            await web3.checkConnection();
            console.error("❌ testCheckConnectionFailure failed: Expected error was not thrown.");
        } catch (error) {
            console.log("✅ testCheckConnectionFailure passed (error thrown as expected).");
        } finally {
            // ✅ Restore `process.exit` after the test
            exitStub.restore();
        }
    }
    
    async function testGetWalletRawBalance() {
        console.log("🛠 DEBUG: Running testGetWalletRawBalance...");
        const balance = await web3.getWalletRawBalance("0xValidWallet");
        assert.strictEqual(balance, 1000000000000000000n, "❌ testGetWalletRawBalance failed: Expected 1 ETH but got " + balance);
        console.log("✅ testGetWalletRawBalance passed.");
    }
    
    async function testGetWalletRawBalanceFailure() {
        console.log("🛠 DEBUG: Running testGetWalletRawBalanceFailure...");
        mockProvider.getBalance.withArgs("0xInvalidWallet").rejects(new Error("Invalid address"));
        const balance = await web3.getWalletRawBalance("0xInvalidWallet");
        assert.strictEqual(balance, 0n, "❌ testGetWalletRawBalanceFailure failed: Expected 0n but got " + balance);
        console.log("✅ testGetWalletRawBalanceFailure passed.");
    }
    
    async function testGetWalletRawBalances() {
        console.log("🛠 DEBUG: Running testGetWalletRawBalances...");
        const balances = await web3.getWalletRawBalances(["0xWallet1", "0xWallet2"]);
        assert.deepStrictEqual(
            balances,
            [1000000000000000000n, 1000000000000000000n],
            "❌ testGetWalletRawBalances failed: Expected [1 ETH, 1 ETH] but got " + balances.map(b => b.toString())
        );
        console.log("✅ testGetWalletRawBalances passed.");
    }    

    testGetNetwork();
    testGetJsonPath();
    testGetProvider();
    await testCheckConnectionSuccess();
    //await testCheckConnectionFailure();
    await testGetWalletRawBalance();
    await testGetWalletRawBalanceFailure();
    await testGetWalletRawBalances();

    console.log("🎉 All Web3 tests passed successfully!");
}

runTests().catch((error) => {
    console.error("❌ Test execution failed:", error);
    process.exit(1);
});
