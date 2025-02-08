#!/usr/bin/env node

/**
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 *
 * Unit tests for the vtruSystem utility module.
 * These tests ensure correct behavior of sleep().
 */

const assert = require("assert");
const { sleep } = require("../lib/vtruSystem");

console.log("Running unit tests for vtruSystem.js...");

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

// Run all tests
(async () => {
    await testSleepShort();
    await testSleepLong();
    console.log("🎉 All vtruSystem tests passed successfully!");
})();

