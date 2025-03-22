/**
 * libWeb3Timer.js
 * 
 * Provides blockchain time utilities using block timestamps.
 * Includes methods to calculate elapsed time since a specific block.
 *
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const { ethers } = require("ethers");

/**
 * Calculates real time elapsed since a given block number using block timestamps.
 * 
 * @param {Object} web3 - An object exposing `getProvider()` and `getLatestBlockNumber()` methods.
 * @param {number} stamp - The past block number to compare against the latest block.
 * @returns {Promise<Object>} Elapsed time with seconds, minutes, hours, and days.
 */
async function getTimeSinceBlock(web3, stamp) {
    const provider = web3.getProvider();
    const currentBlock = await web3.getLatestBlockNumber();

    const [current, previous] = await Promise.all([
        provider.getBlock(currentBlock),
        provider.getBlock(stamp),
    ]);

    const seconds = current.timestamp - previous.timestamp;

    return {
        currentBlock,
        stampBlock: stamp,
        seconds,
        minutes: (seconds / 60).toFixed(2),
        hours: (seconds / 3600).toFixed(2),
        days: (seconds / 86400).toFixed(2),
    };
}

/**
 * Returns the elapsed time since a given block, formatted as DD:HH:MM.
 * 
 * @param {Object} web3 - An object exposing `getProvider()` and `getLatestBlockNumber()` methods.
 * @param {number} stamp - The past block number to calculate elapsed time from.
 * @returns {Promise<string>} Elapsed time in DD:HH:MM format.
 */
async function getElapsedTimeFormatted(web3, stamp) {
    const { seconds } = await getTimeSinceBlock(web3, stamp);

    let remaining = seconds;

    const days = Math.floor(remaining / 86400);
    remaining %= 86400;

    const hours = Math.floor(remaining / 3600);
    remaining %= 3600;

    const minutes = Math.floor(remaining / 60);

    const pad = (n) => String(n).padStart(2, '0');

    return `${pad(days)}:${pad(hours)}:${pad(minutes)}`;
}

/**
 * Returns the date of a given block number in DD-MM-YY format.
 *
 * @param {Object} web3 - An object exposing `getProvider()`.
 * @param {number} stamp - Block number to fetch the timestamp from.
 * @returns {Promise<string>} - Formatted date string (e.g., "22-03-25").
 */
async function getBlockDate(web3, stamp) {
    const provider = web3.getProvider();
    const block = await provider.getBlock(stamp);

    const date = new Date(block.timestamp * 1000);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = String(date.getFullYear()).slice(-2); // Get last two digits

    return `${day}-${month}-${year}`;
}

module.exports = {
    getTimeSinceBlock,
    getElapsedTimeFormatted,
    getBlockDate
};
