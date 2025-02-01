#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the vtruUtils utility module.
 * These tests verify correct behavior for all utility functions.
 */

const assert = require("assert");
const {
    scaleUp,
    scaleDown,
    formatNumber,
    formatNumbers,
    formatRawNumber,
    formatRawNumbers,
    getDateSuffix,
    getFileName,
} = require("../lib/vtruUtils");

console.log("Running unit tests for vtruUtils.js...");

/**
 * Test scaleUp function.
 */
function testScaleUp() {
    const number = 5;
    const expected = 5000000000000000000n; // 5 * 10^18
    const actual = scaleUp(number);

    assert.strictEqual(
        actual,
        expected,
        `❌ testScaleUp failed: Expected ${expected}, but got ${actual}`
    );

    console.log("✅ testScaleUp passed.");
}

/**
 * Test scaleDown function.
 */
function testScaleDown() {
    const bigValue = 5000000000000000000n; // 5 ether in wei
    const expected = 5.0;
    const actual = scaleDown(bigValue);

    assert.strictEqual(
        actual,
        expected,
        `❌ testScaleDown failed: Expected ${expected}, but got ${actual}`
    );

    console.log("✅ testScaleDown passed.");
}

/**
 * Test testerFormatNumber function.
 */
function testerFormatNumber(number, expected) {
    const actual = formatNumber(number);

    assert.strictEqual(
        actual,
        expected,
        `❌ testFormatNumber failed: Expected "${expected}", but got "${actual}"`
    );
}
/**
 * Test formatNumber function.
 */
function testFormatNumber() {
    testerFormatNumber(1234567.8912, "1,234,567.89");
    testerFormatNumber(12345678912n, "12,345,678,912.00");

    console.log("✅ testFormatNumber passed.");
}

/**
 * Test formatNumbers function.
 */
function testFormatNumbers() {
    const numbers = [1000.123, 2000.456];
    const expected = ["1,000.12", "2,000.46"];
    const actual = formatNumbers(numbers);

    assert.deepStrictEqual(
        actual,
        expected,
        `❌ testFormatNumbers failed: Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`
    );

    console.log("✅ testFormatNumbers passed.");
}

/**
 * Test formatRawNumber function.
 */
function testFormatRawNumber() {
    const bigValue = 5000000000000000000n; // 5 ether in wei
    const expected = "5.00";
    const actual = formatRawNumber(bigValue);

    assert.strictEqual(
        actual,
        expected,
        `❌ testFormatRawNumber failed: Expected "${expected}", but got "${actual}"`
    );

    console.log("✅ testFormatRawNumber passed.");
}

/**
 * Test formatRawNumbers function.
 */
function testFormatRawNumbers() {
    const bigValues = [5000000000000000000n, 2500000000000000000n]; // 5 & 2.5 ether in wei
    const expected = ["5.00", "2.50"];
    const actual = formatRawNumbers(bigValues);

    assert.deepStrictEqual(
        actual,
        expected,
        `❌ testFormatRawNumbers failed: Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`
    );

    console.log("✅ testFormatRawNumbers passed.");
}

/**
 * Test getDateSuffix function.
 */
function testGetDateSuffix() {
    const today = new Date();
    const expected = `${String(today.getFullYear()).slice(-2)}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
    const actual = getDateSuffix();

    assert.strictEqual(
        actual,
        expected,
        `❌ testGetDateSuffix failed: Expected "${expected}", but got "${actual}"`
    );

    console.log("✅ testGetDateSuffix passed.");
}

/**
 * Test getFileName function.
 */
function testGetFileName() {
    const options = { fileName: "myFile", date: "240101", minBalance: 5000 };
    const expected = "myFile.json";
    const actual = getFileName(options, "json");

    assert.strictEqual(
        actual,
        expected,
        `❌ testGetFileName failed: Expected "${expected}", but got "${actual}"`
    );

    console.log("✅ testGetFileName passed.");
}

// Run all tests
(() => {
    testScaleUp();
    testScaleDown();
    testFormatNumber();
    testFormatNumbers();
    testFormatRawNumber();
    testFormatRawNumbers();
    testGetDateSuffix();
    testGetFileName();
    console.log("🎉 All vtruUtils tests passed successfully!");
})();

