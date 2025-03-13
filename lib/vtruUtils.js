/**
 * vtruUtils.js
 * 
 * A utility module for common operations, including unit conversions,
 * number formatting, date suffix generation, file naming, and array merging.
 * 
 * Optimized for performance and robustness, ensuring proper handling of
 * BigInt values, formatted output, and efficient merging of arrays.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 */
/**
 * Constants for unit conversions and formatting.
 * @type {bigint}
 */
const WEI_TO_ETHER = 1000000000000000000n; // 1e18 (BigInt)
const FRACTIONAL_SCALE = 1000000000n; // Scale for fractional part
const DECIMAL_PART_SCALE = 100n; // Fixed-point formatting scale
const VUSD_SCALE = 1000000n; // Scale factor for VUSD

/**
 * Converts an ether value to wei.
 * 
 * @param {number} number - The ether value to scale up.
 * @returns {bigint} The scaled-up value in wei.
 */
function scaleUp(number) {
    return BigInt(number) * WEI_TO_ETHER;
}

/**
 * Converts a wei value to ether.
 * 
 * @param {bigint} units - The value in wei.
 * @returns {number} The scaled-down value as a floating-point number.
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
 * 
 * @param {number} units - The number to format.
 * @param {number} [fractional=2] - The number of decimal places.
 * @returns {string} The formatted number as a string.
 */
function formatNumber(units, fractional = 2) {
    return units.toLocaleString('en-US', { minimumFractionDigits: fractional, maximumFractionDigits: fractional });
}

/**
 * Formats a VUSD BigInt value with commas and decimal places.
 * 
 * @param {bigint} units - The BigInt value to format.
 * @param {number} [fractional=2] - The number of decimal places.
 * @returns {string} The formatted number.
 */
function formatVusdNumber(units, fractional = 2) {
    if (typeof units !== "bigint") {
        console.error(`❌ formatVusdNumber failed: Expected BigInt but got ${typeof units}`);
        return "NaN";
    }
    return formatNumber(Number(units) / Number(VUSD_SCALE), fractional);
}

/**
 * Formats a BigInt (WEI) value with commas and decimal places.
 * 
 * @param {bigint} units - The BigInt value to format.
 * @param {number} [fractional=2] - The number of decimal places.
 * @returns {string} The formatted number.
 */
function formatRawNumber(units, fractional = 2) {
    if (typeof units !== "bigint") {
        console.error(`❌ formatRawNumber failed: Expected BigInt but got ${typeof units}`);
        return "NaN";
    }
    return formatNumber(scaleDown(units), fractional);
}

/**
 * Formats an array of numbers with commas and a fixed number of decimal places.
 * 
 * @param {Array<number>} numbers - The numbers to format.
 * @returns {Array<string>} The array of formatted numbers.
 */
function formatNumbers(numbers, fractional = 2) {
    if (!Array.isArray(numbers)) {
        console.error("❌ formatNumbers failed: Expected an array.");
        return [];
    }
    return numbers.map(num => (num ? formatNumber(num, fractional) : "0"));
}

function formatVusdNumbers(numbers, fractional = 2) {
    if (!Array.isArray(numbers)) {
        console.error("❌ formatVusdNumbers failed: Expected an array.");
        return [];
    }
    return numbers.map(num => formatVusdNumber(num, fractional));
}

/**
 * Formats a BigInt (WEI) value with commas and decimal places.
 * 
 * @param {bigint} units - The BigInt value to format.
 * @param {number} [fractional=2] - The number of decimal places.
 * @returns {string} The formatted number.
 */
function formatRawNumber(units, fractional = 2) {
    if (typeof units !== "bigint") {
        console.error(`❌ formatRawNumber failed: Expected BigInt but got ${typeof units}`);
        return "NaN";
    }
    return formatNumber(scaleDown(units), fractional);
}

/**
 * Formats an array of BigInt (WEI) values with commas and decimal places.
 * 
 * @param {Array<bigint>} numbers - The BigInt values to format.
 * @returns {Array<string>} The array of formatted numbers.
 */
function formatRawNumbers(numbers, fractional = 2) {
    if (!Array.isArray(numbers)) {
        console.error("❌ formatRawNumbers failed: Expected an array.");
        return [];
    }
    return numbers.map(num => formatRawNumber(num, fractional));
}

/**
 * Generates a date suffix in YYMMDD format.
 * 
 * @returns {string} The date in YYMMDD format.
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
 * 
 * @param {Object} options - Options including fileName, date, minBalance, and contractName.
 * @param {string} extension - The desired file extension (e.g., 'json', 'csv').
 * @param {string} [name='details'] - The base filename.
 * @returns {string} The generated filename.
 */
function getFileName(options, extension, name = "details") {
    if (typeof options !== "object" || !extension) {
        console.error("❌ getFileName failed: Invalid parameters.");
        return "";
    }

    const date = options.date || getDateSuffix();
    const minBalance = options.minBalance || 4000;
    const contractName = options.contractName ? `-${options.contractName}` : "";
    const baseName = options.fileName || `${name}-${date}-${minBalance}${contractName}`;

    return baseName.endsWith(`.${extension}`) ? baseName : `${baseName}.${extension}`;
}

/**
 * Merges two arrays while ensuring unique values (case insensitive).
 * 
 * @param {Array<string>} arr1 - First array.
 * @param {Array<string>} arr2 - Second array.
 * @returns {Array<string>} The merged array with unique values.
 */
function mergeUnique(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        throw new Error("Invalid input: Expected two arrays.");
    }

    const seen = new Set();
    const merged = [];

    for (const member of [...arr1, ...arr2]) {
        const lower = member.toLowerCase();
        if (lower.length > 0 && !seen.has(lower)) {
            seen.add(lower);
            merged.push(lower);
        }
    }

    return merged;
}

/**
 * Groups elements by wallet and kind, collecting IDs.
 * 
 * @param {Array} elements - The array of objects with { wallet, kind, id }.
 * @return {Array} - An array of [wallet, kind, ids[]] tuples.
 */
function groupByWalletAndKind(elements) {
    const groupedMap = new Map();

    elements.forEach(({ wallet, kind, id }) => {
        const key = `${wallet}-${kind}`;
        if (!groupedMap.has(key)) {
            groupedMap.set(key, []);
        }
        groupedMap.get(key).push(id);
    });

    return Array.from(groupedMap.entries()).map(([key, ids]) => {
        const [wallet, kind] = key.split("-");
        return {wallet, kind, ids};
    });
}

/**
 * Recursively converts BigInt values in an object or array to strings.
 * 
 * @param {Object|Array|bigint} obj - The object or array to process.
 * @returns {Object|Array|string} The processed object with BigInt values converted.
 */
function convertBigIntToString(obj) {
    if (Array.isArray(obj)) {
        return obj.map(item => convertBigIntToString(item));
    } else if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, convertBigIntToString(value)]));
    } else if (typeof obj === 'bigint') {
        return obj.toString();
    }
    return obj;
}

/**
 * Logs a JSON object to the console, ensuring BigInt values are converted to strings.
 * 
 * @param {Object} json - The JSON object to log.
 */
function logJson(json) {
    console.log(JSON.stringify(convertBigIntToString(json), null, 2));
}

module.exports = {
    scaleUp,
    scaleDown,
    formatNumber,
    formatNumbers,
    formatVusdNumber,
    formatVusdNumbers,
    formatRawNumber,
    formatRawNumbers,
    getDateSuffix,
    getFileName,
    mergeUnique,
    groupByWalletAndKind,
    convertBigIntToString,
    logJson,
};
