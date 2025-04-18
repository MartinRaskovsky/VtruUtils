#!/usr/bin/env node

/**
 * miniFriendlyTest.js
 * 
 * Simulates common blockchain errors and tests FriendlyErrorMessage output.
 */

const { FriendlyErrorMessage } = require('../lib/libFriendly');
const Logger = require('../lib/libLogger');

const label = "TestWallet";
const LOG = "test-friendly.log";

function simulateErrorCase(errorObj) {
    const message = FriendlyErrorMessage(errorObj);
    Logger.error(`❌ ${label} failed: ${message}. Substituting -1n`, LOG);
}

// Simulated errors
const simulatedErrors = [
    { code: -32005, message: "Too many RPC calls" },
    { message: '429 Too Many Requests: {"code":429,"message":"rate limit"}' },
    { message: "Public key is off curve" },
    { message: "Invalid address: not base58" },
    { message: "Something else entirely" },
    { code: "TIMEOUT", message: "The request timed out." },
    {}
];

console.log("🧪 Testing FriendlyErrorMessage...\n");

simulatedErrors.forEach((err, index) => {
    console.log(`Test ${index + 1}:`);
    simulateErrorCase(err);
});

