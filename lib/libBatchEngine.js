/**
 * libBatchEngine.js
 * 
 * Batch processor
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const Logger = require('./libLogger');
const BATCH = "batch.log";

function ErrorMessage(code, message) {
    const prefix = code ? `Error code ${code} ` : "";
    return `${prefix}${message}`;
}

async function executeBatch(items, asyncFunc, batchSize = 30, delayMs = 30, maxRetries = 10) {
    const results = [];

    const friendlyErrorMessages = {
        "-32005": "Network rate limit reached. Try again when the network is less busy.",
        "TIMEOUT": "The request timed out. Check your connection and try again."
    };

    let i = 0;

    while (i < items.length) {
        let attempts = 0;
        let success = false;
        let currentBatchSize = batchSize;
        let currentDelay = delayMs;

        const originalIndex = i;
        let batch = items.slice(i, i + currentBatchSize);

        let lastErrorCode = null;
        let lastErrorMessage = "❌ Unknown error occurred.";

        while (attempts < maxRetries) {
            try {
                const batchResults = await Promise.all(batch.map(asyncFunc));
                results.push(...batchResults);
                success = true;

                if (attempts > 0) {
                    Logger.info(`Batch [SUCCESS] ${originalIndex} - ${originalIndex + batch.length} succeeded after ${attempts} retries; batchSize = ${currentBatchSize}, delayMs = ${currentDelay}`, BATCH);
                }
                break;
            } catch (error) {
                attempts++;

                if (error?.value && Array.isArray(error.value)) {
                    const firstError = error.value[0]?.error;
                    if (firstError) {
                        lastErrorCode = firstError.code?.toString() || "UNKNOWN";
                        lastErrorMessage = ErrorMessage(lastErrorCode, firstError.message);
                    }
                } else if (error?.message) {
                    lastErrorMessage = error.message;
                }

                Logger.info(`Batch ${originalIndex} - ${originalIndex + batch.length}, Attempt ${attempts}: ${lastErrorMessage}`, BATCH);

                if (attempts < maxRetries) {
                    if (attempts > 2) {
                        currentBatchSize = Math.max(10, Math.round(currentBatchSize * 0.6));
                    } else {
                        currentBatchSize = Math.max(15, Math.round(currentBatchSize * 0.75));
                    }
                    currentDelay = Math.round(currentDelay * 1.8);

                    Logger.info(`Rate limit detected. Adjusting: Batch Size = ${currentBatchSize}, Delay = ${currentDelay}ms.`, BATCH);

                    await new Promise(resolve => setTimeout(resolve, currentDelay));
                    batch = items.slice(i, i + currentBatchSize);
                }
            }
        }

        if (!success) {
            const userMessage = friendlyErrorMessages[lastErrorCode] || ErrorMessage(lastErrorCode, lastErrorMessage);
            const finalErrorMessage = `❌ Batch processing failed after ${maxRetries} retries. ${userMessage}`;
            Logger.error(`Batch ${originalIndex} - ${originalIndex + batch.length} after ${maxRetries} retries. ${finalErrorMessage}`, BATCH);

            throw new Error(userMessage);
        }

        i += batch.length;

        if (i < items.length) {
            await new Promise(resolve => setTimeout(resolve, currentDelay));
        }
    }

    return results;
}

module.exports = { executeBatch };

