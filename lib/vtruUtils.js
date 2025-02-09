/**
 * vtruUtils.js
 * A utility module for common operations.
 * Author: Dr Martín Raskovsky
 * Date: January 2025
 */

/**
 * Constants for unit conversions and formatting.
 * @type {bigint}
 */
const WEI_TO_ETHER = 1000000000000000000n; // 1e18 (BigInt)
const FRACTIONAL_SCALE = 1000000000n; // Scale for fractional part
const DECIMAL_PART_SCALE = 100n; // Fixed-point formatting scale

/**
 * Scales up a value from ether to wei.
 * @param {number} number - The ether value to scale up.
 * @returns {bigint} - The scaled-up value in wei.
 */
function scaleUp(number) {
    return BigInt(number) * WEI_TO_ETHER;
}

/**
 * Scales down a value from wei to ether.
 * @param {bigint} units - The value in wei.
 * @returns {number} - The scaled-down value as a floating-point number.
 */
function scaleDown(units) {
    if (typeof units !== "bigint") {
        console.error(`❌ scaleDown failed: Expected BigInt but got ${typeof units}`);
        return NaN;
    }

    const integerPart = units / WEI_TO_ETHER;
    const fractionalPart = (units % WEI_TO_ETHER) * FRACTIONAL_SCALE / WEI_TO_ETHER;

    return Number(integerPart) + Number(fractionalPart) / Number(FRACTIONAL_SCALE);
}

/**
 * Formats a number with commas and a fixed number of decimal places.
 * @param {number} units - The number to format.
 * @param {number} [fractional=2] - The number of decimal places.
 * @returns {string} - The formatted number as a string.
 */
function formatNumber(units, fractional = 2) {
    return units.toLocaleString('en-US', { minimumFractionDigits: fractional, maximumFractionDigits: fractional });
}

/**
 * Formats an array of numbers with commas and a fixed number of decimal places.
 * @param {Array<number>} numbers - The numbers to format.
 * @returns {Array<string>} - The array of formatted numbers.
 */
function formatNumbers(numbers, fractional = 2) {
    if (!Array.isArray(numbers)) {
        console.error("❌ formatNumbers failed: Expected an array.");
        return [];
    }
    return numbers.map((num) => num? formatNumber(num, fractional): 0);
}

/**
 * Formats a BigInt (WEI) with commas and exactly two decimal places as a string.
 * @param {bigint} units - The BigInt value to format.
 * @param {number} [fractional=2] - The number of decimal places.
 * @returns {string} - The formatted number.
 */
function formatRawNumber(units, fractional = 2) {
    if (typeof units !== "bigint") {
        console.error(`❌ formatRawNumber failed: Expected BigInt but got ${typeof units}`);
        return "NaN";
    }
    if (!units) units = 0n;
    return formatNumber(scaleDown(units), fractional);
}

/**
 * Formats an array of BigInt (WEI) values with commas and two decimal places as strings.
 * @param {Array<bigint>} numbers - The BigInt values to format.
 * @returns {Array<string>} - The array of formatted numbers.
 */
function formatRawNumbers(numbers, fractional = 2) {
    if (!Array.isArray(numbers)) {
        console.error("❌ formatRawNumbers failed: Expected an array.");
        return [];
    }
    return numbers.map((num) => formatRawNumber(num, fractional));
}

/**
 * Generates a date suffix in YYMMDD format.
 * @returns {string} - The date in YYMMDD format.
 */
function getDateSuffix() {
    const today = new Date();
    const year = String(today.getFullYear()).slice(-2);
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
}

/**
 * Generates a filename based on provided options and extension.
 * @param {Object} options - Options including fileName, date, minBalance and contractName.
 * @param {string} extension - The desired file extension (e.g., 'json', 'csv').
 * @param {string} [name='details'] - The base filename.
 * @returns {string} - The generated filename.
 */
function getFileName(options, extension, name = "details") {
    if (typeof options !== "object" || !extension) {
        console.error("❌ getFileName failed: Invalid parameters.");
        return "";
    }

    const date = options.date || getDateSuffix();
    const minBalance = options.minBalance || 4000;
    let contractName = '';
    if (options.contractName) {
        contractName = `-${options.contractName}`;
    }
    const baseName = options.fileName || `${name}-${date}-${minBalance}${contractName}`;

    return baseName.endsWith(`.${extension}`) ? baseName : `${baseName}.${extension}`;
}

/**
 * Merges two arrays while ensuring unique values (case insensitive).
 * @param {Array<string>} arr1 - First array.
 * @param {Array<string>} arr2 - Second array.
 * @returns {Array<string>} - The merged array with unique values.
 */
function mergeUnique(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        throw new Error("Invalid input: Expected two arrays.");
    }

    const seen = new Set();
    const merged = [];

    for (const member of [...arr1, ...arr2]) {
        const lower = member.toLowerCase();
        if (!seen.has(lower)) {
            seen.add(lower);
            merged.push(lower);
        }
    }

    return merged;
}

function convertBigIntToString(obj) {
    if (Array.isArray(obj)) {
        // If it's an array, process each element
        return obj.map(item => convertBigIntToString(item));
    } else if (typeof obj === 'object' && obj !== null) {
        // If it's an object, process each property
        const result = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                result[key] = convertBigIntToString(obj[key]);
            }
        }
        return result;
    } else if (typeof obj === 'bigint') {
        // If it's a BigInt, convert it to a string
        return obj.toString();
    }
    // If it's neither an array nor an object nor BigInt, return it as-is
    return obj;
}

function logJson(json) {
    const convertedJson = convertBigIntToString(json);
    console.log(JSON.stringify(convertedJson, null, 2));
}

module.exports = {
    scaleUp,
    scaleDown,
    formatNumber,
    formatNumbers,
    formatRawNumber,
    formatRawNumbers,
    getDateSuffix,
    getFileName,
    mergeUnique,
    convertBigIntToString,
    logJson,
};

