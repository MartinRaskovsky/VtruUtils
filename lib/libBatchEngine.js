/**
 * libBatchEngine.js
 * 
 * Batch processor
 * 
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 */

const { isPermanentError, extractReason } = require('./libErrors');
const { timeoutWrapper } = require('./libAsync');

const Logger = require('./libLogger');
const BATCH = "batch.log";

async function executeBatch(id, items, asyncFunc, batchSize = 30, minBatchSize = 2, delayMs = 30, maxRetries = 10, timeoutMs = 5000) {
    const results = [];
    const reportedErrors = new Set();
    let i = 0;

    while (i < items.length) {
        const originalIndex = i;
        let attempts = 0;
        let success = false;
        let currentBatchSize = batchSize;
        let currentDelay = delayMs;
        let batch = items.slice(i, i + currentBatchSize);

        while (attempts < maxRetries) {
            attempts++;

            try {
                const batchResults = await Promise.all(
                    batch.map((item, idx) =>
                        handleBatchItem(item, asyncFunc, timeoutMs, id, originalIndex + idx, reportedErrors)
                    )
                );

                results.push(...batchResults);
                success = true;

                if (attempts > 1) {
                    Logger.info(`Batch [SUCCESS] ${originalIndex}-${originalIndex + batch.length} after ${attempts} retries`, BATCH);
                }

                break;
            } catch (batchError) {
                Logger.warn(`🔥 Batch wrapper failed for ${originalIndex}-${originalIndex + batch.length}: ${batchError.message}`, BATCH);

                if (attempts < maxRetries) {
                    currentBatchSize = Math.max(minBatchSize, Math.round(currentBatchSize * 0.75));
                    currentDelay = Math.round(currentDelay * 1.8);
                    Logger.info(`Rate limit detected in ${id}. Adjusting: Batch Size = ${currentBatchSize}, Delay = ${currentDelay}ms.`, BATCH);

                    await new Promise(resolve => setTimeout(resolve, currentDelay));
                    batch = items.slice(i, i + currentBatchSize);
                }
            }
        }

        if (!success) {
            Logger.error(`❌ Batch ${originalIndex}-${originalIndex + batch.length} failed after ${maxRetries} retries`, BATCH);
            results.push(...Array(batch.length).fill(-1n));
        }

        i += batch.length;

        if (i < items.length) {
            await new Promise(resolve => setTimeout(resolve, currentDelay));
        }
    }

    return results;
}

async function handleBatchItem(item, asyncFunc, timeoutMs, id, idx, reportedErrors) {
    const label = `${id} ${idx}`;
    const wrapped = timeoutWrapper(asyncFunc, timeoutMs, label);

    try {
        return await wrapped(item);
    } catch (error) {
        const reason = extractReason(error);
        const isPermanent = isPermanentError(reason);
        const shortMsg = reason.split("\n")[0];

        const logKey = `${id}:${shortMsg}`;
        if (!reportedErrors.has(logKey)) {
            Logger.warn(`⚠️ ${id}: ${shortMsg} → only reporting once`, BATCH);
            reportedErrors.add(logKey);
        }

        return isPermanent ? 0n : -1n;
    }
}


module.exports = { executeBatch };

