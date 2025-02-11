/**
 * libSystem.js
 * 
 * A utility module for system operations.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 * 
 * This module includes:
 * - sleep: A function to delay execution for a given time.
 * - Additional system-related utility functions can be added here.
 */

/**
 * Delays execution for a specified number of milliseconds.
 * 
 * @param {number} millis - The number of milliseconds to sleep.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

module.exports = { sleep };
