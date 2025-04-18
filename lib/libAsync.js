/**
 * libAsync.js
 * 
 * Async utility helpers: timeout wrapper and timeout-only promise.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 */

// Forces a rejection after ms unless the asyncFunc resolves first
function timeoutWrapper(asyncFunc, timeoutMs, label = "") {
    return async (item) =>
        Promise.race([
            asyncFunc(item),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error(`⏱️ Timeout after ${timeoutMs}ms (${label})`)), timeoutMs)
            )
        ]);
}

// Just a timeout-based promise that always rejects after ms
function timeoutPromise(ms, label = "") {
    return new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`⏱️ Timeout after ${ms}ms (${label})`)), ms)
    );
}

module.exports = { timeoutWrapper, timeoutPromise };
