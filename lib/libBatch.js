/**
 * libBatch.js
 * 
 * Batch processor
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const fs = require('fs');

/**
 * Processes a list of items in batches, applying the provided async function to each item.
 * 
 * @param {Array<any>} items - The list of items to process.
 * @param {Function} asyncFunc - The async function to apply to each item.
 * @param {number} batchSize - Number of items to process per batch (default: 30).
 * @param {number} delayMs - Delay between batches in milliseconds (default: 30ms).
 * @param {number} maxRetries - Number of retries before failing (default: 3).
 * @returns {Promise<Array<any>>} The processed results.
 */

async function processInBatches(items, asyncFunc, batchSize = 30, delayMs = 30, maxRetries = 10) {
    const results = [];
    const logFile = "batch.log";

    // Define friendly error messages for known codes
    const friendlyErrorMessages = {
        "-32005": "Network rate limit reached. Try again when the network is less busy.",
        "TIMEOUT": "The request timed out. Check your connection and try again."
    };

    for (let i = 0; i < items.length; i += batchSize) {
        let attempts = 0;
        let success = false;
        let currentBatchSize = batchSize;
        let currentDelay = delayMs;
        const batch = items.slice(i, i + currentBatchSize);
        let lastErrorCode = null;
        let lastErrorMessage = "❌ Unknown error occurred."; // Default

        while (attempts < maxRetries) {
            try {
                const batchResults = await Promise.all(batch.map(asyncFunc));
                results.push(...batchResults);
                success = true;

                if (attempts > 0) {
                    fs.appendFileSync(logFile, `[SUCCESS] Batch ${i} - ${i + currentBatchSize} succeeded after ${attempts} retries; batchSize = ${currentBatchSize}, delayMs = ${currentDelay}\n`);
                }
                break; // Exit retry loop on success
            } catch (error) {
                attempts++;

                // **Extract meaningful error messages and codes**
                if (error?.value && Array.isArray(error.value)) {
                    const firstError = error.value[0]?.error;
                    if (firstError) {
                        lastErrorCode = firstError.code?.toString() || "UNKNOWN";
                        lastErrorMessage = `Error Code ${lastErrorCode}: ${firstError.message}`;
                    }
                } else if (error?.message) {
                    lastErrorMessage = error.message;
                }

                fs.appendFileSync(logFile, `[ERROR] Batch ${i} - ${i + currentBatchSize}, Attempt ${attempts}: ${lastErrorMessage}\n`);

                if (attempts < maxRetries) {
                    if (attempts > 2) {
                        currentBatchSize = Math.max(10, Math.round(currentBatchSize * 0.6)); // Reduce batch size by 40%
                    } else {
                        currentBatchSize = Math.max(15, Math.round(currentBatchSize * 0.75)); // Reduce batch size by 25%
                    }
                    currentDelay = Math.round(currentDelay * 1.8);
                    fs.appendFileSync(logFile, `Rate limit detected. Adjusting: Batch Size = ${currentBatchSize}, Delay = ${currentDelay}ms.\n`);
                    await new Promise(resolve => setTimeout(resolve, currentDelay));
                }
            }
        }

        if (!success) {
            // **Use friendly message if available, else show full error code**
            const userMessage = friendlyErrorMessages[lastErrorCode] || `Error Code ${lastErrorCode}: ${lastErrorMessage}`;
            const finalErrorMessage = `❌ Batch processing failed after ${maxRetries} retries. ${userMessage}`;
            
            // **Log the full error message for debugging**
            fs.appendFileSync(logFile, `[FAILED] Batch ${i} - ${i + currentBatchSize} after ${maxRetries} retries. ${finalErrorMessage}\n`);
            
            // **Throw only the user-friendly message**
            throw new Error(userMessage);
        }

        if (i + currentBatchSize < items.length) {
            await new Promise(resolve => setTimeout(resolve, currentDelay));
        }
    }

    return results;
}


module.exports = { processInBatches };

