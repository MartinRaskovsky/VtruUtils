/**
 * libGrouper.js
 * 
 * Generic grouping utility for blockchain detail scripts.
 * Supports grouping by date (day, month, year) or other custom keys.
 *
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const { getBlockTimestamp } = require("./libWeb3Timer");

/**
 * Returns a grouping key (string) for a given Date object and group type.
 *
 * @param {Date} date - The JavaScript Date object.
 * @param {string} groupBy - 'day' | 'month' | 'year'
 * @returns {string} - Formatted group key.
 */
function getGroupKey(date, groupBy) {
    if (!date || !(date instanceof Date)) return "Invalid Date";
    if (groupBy === "year") return date.getFullYear().toString();
    if (groupBy === "month") return `${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear().toString().slice(-2)}`;
}

/**
 * Groups and aggregates rows based on a dynamic date field.
 *
 * @param {Array<Object>} rows - The input data rows.
 * @param {Object} options - Configuration options.
 * @param {Object} options.web3 - A Web3 instance with getProvider().
 * @param {string} options.groupBy - 'day' | 'month' | 'year'.
 * @param {Function} options.dateFromRow - async (row) => Date.
 * @param {Array<string>} options.fieldsToSum - Fields to sum as BigInt.
 * @param {Function} [options.initGroup] - Function to return custom group shape.
 * @param {Function} [options.computeFields] - Optional async (row) => additional fields to include.
 * @returns {Promise<Object>} - Grouped data object.
 */
async function groupRowsByDate(rows, {
    web3,
    groupBy,
    dateFromRow,
    fieldsToSum,
    initGroup = () => ({}),
    computeFields = async () => ({})
}) {
    const grouped = {};

    for (const row of rows) {
        const date = await dateFromRow(row);
        const key = getGroupKey(date, groupBy);
        const computed = await computeFields(row);
        const extendedRow = { ...row, ...computed };

        if (!grouped[key]) {
            grouped[key] = {
                ...initGroup(row),
                date: key
            };
            for (const field of fieldsToSum) grouped[key][field] = 0n;
        }

        for (const field of fieldsToSum) {
            //console.log(`typeof grouped[${key}][${field}]=${typeof grouped[key][field]}`);
            //console.log(`typeof extendedRow[${field}]=${typeof extendedRow[field]}`);
            grouped[key][field] += extendedRow[field];
        }
    }

    return grouped;
}

module.exports = {
    getGroupKey,
    groupRowsByDate,
    getBlockTimestamp // also re-exported for convenience
};
