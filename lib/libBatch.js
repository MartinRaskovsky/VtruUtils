/**
 * tokenCommon.js
 * 
 * Base class for handling token contracts (VIBE, VERSE, ...).
 * Provides common methods for fetching balances and details.
 * 
 * Optimized for efficient blockchain access by minimizing redundant contract calls.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

/**
 * Processes a list of items in batches, applying the provided async function to each item.
 * 
 * @param {Array<any>} items - The list of items to process.
 * @param {Function} asyncFunc - The async function to apply to each item.
 * @param {number} batchSize - Number of items to process per batch (default: 5).
 * @param {number} delayMs - Delay between batches in milliseconds (default: 1000ms).
 * @returns {Promise<Array<any>>} The processed results.
 */
async function processInBatches(items, asyncFunc, batchSize = 30, delayMs = 20) {
    const results = [];

    for (let i = 0; i < items.length; i += batchSize) {
	    //console.log(`batch from ${i} to ${i + batchSize}`);
        const batch = items.slice(i, i + batchSize);

        try {
            const batchResults = await Promise.all(batch.map(asyncFunc));
            results.push(...batchResults.filter(result => result !== null));
        } catch (error) {
            console.error(`Error processing batch:`, error);
        }

        if (i + batchSize < items.length) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    return results.flat();
}

module.exports = { 
    processInBatches, 
};
