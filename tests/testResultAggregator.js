#!/usr/bin/env node

/**
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 *
 * Unit tests for the VtruResultAggregator class.
 * These tests use the actual class and do not rely on mocks.
 */

const assert = require("assert");
const VtruResultAggregator = require("../lib/vtruResultAggregator");

// Create the VtruResultAggregator instance
const aggregator = new VtruResultAggregator();

console.log("Running unit tests for VtruResultAggregator.js...");

/**
 * Test add method
 */
function testAdd() {
    aggregator.add({ name: "Test1", score: 10 });
    aggregator.add({ name: "Test2", score: 20 });
    
    assert.strictEqual(
        aggregator.results.length,
        2,
        `❌ testAdd failed: Expected 2 results, but got ${aggregator.results.length}`
    );

    assert.strictEqual(
        aggregator.count,
        2,
        `❌ testAdd failed: Expected count 2, but got ${aggregator.count}`
    );

    console.log("✅ testAdd passed.");
}

/**
 * Test sort method (valid case)
 */
function testSort() {
    aggregator.sort("score");

    assert.strictEqual(
        aggregator.results[0].name,
        "Test2",
        `❌ testSort failed: Expected first result to be "Test2", but got "${aggregator.results[0].name}"`
    );

    console.log("✅ testSort passed.");
}

/**
 * Test sort method with missing label
 */
function testSortMissingLabel() {
    aggregator.add({ name: "Test3" }); // No score field
    aggregator.sort("score");

    assert.strictEqual(
        aggregator.results[2].name,
        "Test3",
        `❌ testSortMissingLabel failed: Expected last result to be "Test3", but got "${aggregator.results[2].name}"`
    );

    console.log("✅ testSortMissingLabel passed.");
}

/**
 * Test get method
 */
function testGet() {
    const results = aggregator.get();

    assert.strictEqual(
        Array.isArray(results),
        true,
        "❌ testGet failed: Expected results to be an array."
    );

    assert.strictEqual(
        results.length,
        3,
        `❌ testGet failed: Expected 3 results, but got ${results.length}`
    );

    console.log("✅ testGet passed.");
}

/**
 * Test sort method with empty results
 */
function testSortEmpty() {
    const emptyAggregator = new VtruResultAggregator();
    const sorted = emptyAggregator.sort("score");

    assert.deepStrictEqual(
        sorted,
        [],
        "❌ testSortEmpty failed: Expected an empty array."
    );

    console.log("✅ testSortEmpty passed.");
}

// Run all tests
testAdd();
testSort();
testSortMissingLabel();
testGet();
testSortEmpty();

console.log("🎉 All VtruResultAggregator tests passed successfully!");

