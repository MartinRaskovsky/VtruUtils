#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the VtruStakedContract class.
 * These tests use mocks to simulate API responses.
 */

const assert = require("assert");
const sinon = require("sinon");
const VtruConfig = require("../lib/vtruConfig");
const VtruWeb3 = require("../lib/vtruWeb3");
const VtruStakedContract = require("../lib/vtruStakedContract");
const { getAddress } = require("ethers"); // Import getAddress for checksum matching

// Create mock instances
const config = new VtruConfig();
const web3 = new VtruWeb3();
const stakedContract = new VtruStakedContract(config, web3);

// Stub contract interaction
const mockContract = {
    getUserStakesInfo: sinon.stub(),
};

// Stub `getContract` method to return the mock contract
sinon.stub(stakedContract, "getContract").returns(mockContract);

// Mock provider and current block number
const mockProvider = {
    getBlockNumber: sinon.stub().resolves(6524767), // Simulating current block number
};
sinon.stub(stakedContract, "provider").value(mockProvider);

/**
 * Test getStakedBalance method with a valid wallet.
 */
async function testGetStakedBalance() {
    const wallet = "0x5AEDA56215B167893E80B4FE645BA6D5BAB767DE";
    const checksummedWallet = getAddress(wallet); // Ensure correct address format

    mockContract.getUserStakesInfo.withArgs(checksummedWallet).resolves([
        [{ 4: 100n }], []
    ]);

    const balance = await stakedContract.getStakedBalance(wallet);

    assert.strictEqual(
        balance,
        100n,
        `❌ testGetStakedBalance failed: Expected balance 100, got ${balance}`
    );

    console.log("✅ testGetStakedBalance passed.");
}

/**
 * Test getStakedBalances method with multiple valid wallets.
 */
async function testGetStakedBalances() {
    const wallets = [
        "0x5AEDA56215B167893E80B4FE645BA6D5BAB767DE",
        "0xAB5801A7D398351B8BE11C439E05C5B3259AEC9B"
    ];

    const checksummedWallets = wallets.map(getAddress);

    mockContract.getUserStakesInfo.withArgs(checksummedWallets[0]).resolves([
        [{ 4: 50n }], []
    ]);

    mockContract.getUserStakesInfo.withArgs(checksummedWallets[1]).resolves([
        [{ 4: 200n }], []
    ]);

    const balances = await stakedContract.getStakedBalances(wallets);

    assert.deepStrictEqual(
        balances,
        [50n, 200n],
        `❌ testGetStakedBalances failed: Expected [50n, 200n] but got ${balances}`
    );

    console.log("✅ testGetStakedBalances passed.");
}

/**
 * Test getStakedDetail method with object return type.
 */
async function testGetStakedDetail() {
    const wallet = "0x5AEDA56215B167893E80B4FE645BA6D5BAB767DE";
    const checksummedWallet = getAddress(wallet);
    mockProvider.getBlockNumber.resolves(6524767);

    mockContract.getUserStakesInfo.withArgs(checksummedWallet).resolves([
        [{ 4: 100n, 5: 10n, 6: 5n, 7: false, 3: 6529767n }], []
    ]);

    const details = await stakedContract.getStakedDetail(wallet);
    const expectedMaturity = Math.max(0, Math.floor(((6529767 - 6524767) * 5) / 86400));

    const expectedDetails = [{
        wallet: '0x5AEDA56215B167893E80B4FE645BA6D5BAB767DE',
        amount: 100n,
        unstakeAmount: 10n,
        lockedAmount: 5n,
        availableToUnstake: 0n,
        maturityDays: expectedMaturity
    }];

    assert.deepStrictEqual(details, expectedDetails);
    console.log("✅ testGetStakedDetail passed.");
}

/**
 * Test getStakedDetails method for multiple wallets, including maturity calculation.
 */
/**
 * Test getStakedDetails method for multiple wallets, including maturity calculation.
 */
async function testGetStakedDetails() {
    const wallets = [
        "0x5AEDA56215B167893E80B4FE645BA6D5BAB767DE",
        "0xAB5801A7D398351B8BE11C439E05C5B3259AEC9B"
    ];

    const checksummedWallets = wallets.map(getAddress);
    const mockCurrentBlock = 6524767;
    mockProvider.getBlockNumber.resolves(mockCurrentBlock);

    mockContract.getUserStakesInfo.withArgs(checksummedWallets[0]).resolves([
        [
            { 4: 50n, 5: 5n, 6: 2n, 7: true, 3: 6529767n } // endBlock = 6529767
        ], []
    ]);

    mockContract.getUserStakesInfo.withArgs(checksummedWallets[1]).resolves([
        [
            { 4: 200n, 5: 20n, 6: 10n, 7: false, 3: 6534767n } // endBlock = 6534767
        ], []
    ]);

    const details = await stakedContract.getStakedDetails(wallets);

    // Expected maturity calculation
    const expectedMaturity1 = Math.max(0, Math.floor(((6529767 - mockCurrentBlock) * 5) / 86400));
    const expectedMaturity2 = Math.max(0, Math.floor(((6534767 - mockCurrentBlock) * 5) / 86400));

    const expectedDetails = [
        {
            wallet: '0x5AEDA56215B167893E80B4FE645BA6D5BAB767DE',
            amount: 50n,
            unstakeAmount: 5n,
            lockedAmount: 2n,
            availableToUnstake: 2n,
            maturityDays: expectedMaturity1
        },
        {
            wallet: '0xAB5801A7D398351B8BE11C439E05C5B3259AEC9B',
            amount: 200n,
            unstakeAmount: 20n,
            lockedAmount: 10n,
            availableToUnstake: 0n,
            maturityDays: expectedMaturity2
        }
    ];

    assert.deepStrictEqual(
        details,
        expectedDetails,
        `❌ testGetStakedDetails failed: Expected ${JSON.stringify(expectedDetails, (key, value) => 
            typeof value === 'bigint' ? value.toString() : value
        )}, got ${JSON.stringify(details, (key, value) => 
            typeof value === 'bigint' ? value.toString() : value
        )}`
    );

    console.log("✅ testGetStakedDetails passed.");
}

// Run all tests
(async () => {
    await testGetStakedBalance();
    await testGetStakedBalances();
    await testGetStakedDetail();
    await testGetStakedDetails();
    console.log("🎉 All VtruStakedContract tests passed successfully!");
})();

