#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 *
 * Unit tests for the libSystem utility module.
 * These tests ensure correct behavior of sleep() and connectTo().
 */

const assert = require("assert");
const { sleep, connectTo } = require("../lib/libSystem");
const sinon = require("sinon");

console.log("Running unit tests for libSystem.js...");

/**
 * Test sleep function with a short delay.
 */
async function testSleepShort() {
    const delay = 100; // 100ms
    const startTime = Date.now();

    await sleep(delay);

    const elapsedTime = Date.now() - startTime;
    assert(
        elapsedTime >= delay,
        `❌ testSleepShort failed: Expected at least ${delay}ms delay, but got ${elapsedTime}ms`
    );

    console.log("✅ testSleepShort passed.");
}

/**
 * Test sleep function with a longer delay.
 */
async function testSleepLong() {
    const delay = 500; // 500ms
    const startTime = Date.now();

    await sleep(delay);

    const elapsedTime = Date.now() - startTime;
    assert(
        elapsedTime >= delay,
        `❌ testSleepLong failed: Expected at least ${delay}ms delay, but got ${elapsedTime}ms`
    );

    console.log("✅ testSleepLong passed.");
}

/**
 * Test connectTo function with mock dependencies.
 */
function testConnectTo() {
    const mockConfig = sinon.stub().returns({});
    const mockWeb3 = sinon.stub().returns({});
    
    const VtruConfig = require("../lib/vtruConfig");
    const VtruWeb3 = require("../lib/vtruWeb3");

    sinon.stub(VtruConfig.prototype, "constructor").callsFake(mockConfig);
    sinon.stub(VtruWeb3.prototype, "constructor").callsFake(mockWeb3);
    
    const networks = ["vtru", "bsc"];
    networks.forEach(network => {
        const { config, web3 } = connectTo(network);
        assert(config, `❌ testConnectTo failed: config should not be null for ${network}`);
        assert(web3, `❌ testConnectTo failed: web3 should not be null for ${network}`);
        console.log(`✅ testConnectTo passed for ${network}.`);
    });

    sinon.restore();
}

// Run all tests
(async () => {
    await testSleepShort();
    await testSleepLong();
    testConnectTo();
    console.log("🎉 All libSystem tests passed successfully!");
})();

