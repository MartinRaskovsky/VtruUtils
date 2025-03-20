/**
 * Author: Dr. Martín Raskovsky
 * Date: February 2025
 * Description: Handles execution of backend scripts for Section and Details, 
 * managing logs and running JavaScript or Shell scripts as needed.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const { SEC_VTRU_HELD, SEC_VTRU_STAKED, SEC_VUSD, SEC_VTRO_HELD, SEC_WVTRU, SEC_VERSE, SEC_VIBE, SEC_VORTEX, 
        SEC_V3DEX, SEC_VITDEX, SEC_SEVOX, SEC_VTRU_ETH, SEC_VTRU_BSC, SEC_USDC_POL, SEC_USDC_ETH, SEC_USDC_BSC, SEC_ETH, SEC_BNB 
    } = require('../shared/constants');

const logsDir = path.join(__dirname, '../public/data');

/**
 * Finds the most recent log file for a given Vault address.
 * @param {string} vaultAddress - The Vault address to search logs for.
 * @returns {string|null} - Path to the latest log file or null if not found.
 */
function findLatestLog(vaultAddress) {
    try {
        if (!fs.existsSync(logsDir)) {
            console.warn(`⚠️ Logs directory not found: ${logsDir}`);
            return null;
        }

        const files = fs.readdirSync(logsDir)
            .filter(file => file.includes(vaultAddress) && file.endsWith('.json'))
            .sort((a, b) => b.localeCompare(a)); // Sort in descending order

        return files.length > 0 ? path.join(logsDir, files[0]) : null;
    } catch (error) {
        console.error(`❌ Error reading logs:`, error);
        return null;
    }
}

/**
 * Reads the latest log file for a given Vault address.
 * @param {string} vaultAddress - The Vault address to retrieve logs for.
 * @returns {Object|null} - Parsed log data or null if not found.
 */
function readPreviousLog(vaultAddress) {
    const latestLogPath = findLatestLog(vaultAddress);
    if (!latestLogPath) return null;

    try {
        return JSON.parse(fs.readFileSync(latestLogPath, 'utf-8'));
    } catch (error) {
        console.error(`❌ Error reading log file ${latestLogPath}:`, error);
        return null;
    }
}

/**
 * Writes the current log file only if data has changed from the previous log.
 * @param {string} vaultAddress - The Vault address.
 * @param {Object} currentData - Current JSON data to log.
 * @param {Object} previousData - Previous log data for comparison.
 */
function writeCurrentLog(vaultAddress, currentData, previousData) {
    try {
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        if (previousData && JSON.stringify(previousData) === JSON.stringify(currentData)) {
            return; // Skip writing if no changes detected
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const logFilePath = path.join(logsDir, `${vaultAddress}_${timestamp}.json`);

        fs.writeFileSync(logFilePath, JSON.stringify(currentData, null, 2), 'utf-8');
    } catch (error) {
        console.error(`❌ Error writing log file:`, error);
    }
}

/**
 * Executes a script (JavaScript or Shell) with given arguments.
 * @param {string} scriptName - Name of the script to execute.
 * @param {string[]} args - Arguments to pass to the script.
 * @returns {Promise<string>} - Resolves with script output or rejects on failure.
 */
function runScript(scriptName, args = []) {
    return new Promise((resolve, reject) => {
        const binPath = path.join(__dirname, '../bin');
        const scriptPath = path.join(binPath, scriptName);

        if (!fs.existsSync(scriptPath)) {
            return reject(new Error(`Script not found: ${scriptName}`));
        }

        let script;
        if (scriptName.endsWith('.js')) {
            script = spawn('node', [`./${path.basename(scriptPath)}`, ...args], { cwd: binPath });
        } else if (scriptName.endsWith('.sh')) {
            script = spawn('/bin/sh', [`./${path.basename(scriptPath)}`, ...args], { cwd: binPath });
        } else {
            return reject(new Error('Unsupported script type'));
        }

        let output = '';
        script.stdout.on('data', (data) => {
            output += data.toString();
        });

        script.stderr.on('data', (data) => {
            reject(new Error(data.toString())); // Capture stderr as rejection
        });

        script.on('close', (code) => {
            code !== 0 ? reject(new Error(`Script exited with code ${code}`)) : resolve(output.trim());
        });
    });
}

/**
 * Runs the Section script and logs data.
 * @param {string} vault - The Vault address.
 * @param {string[]} wallets - List of wallet addresses.
 * @returns {Promise<Object>} - Resolves with current and previous log data.
 */
async function runGetSections(vault, wallets) {
    const scriptName = "getSections.js";
    const args = vault ? ["-v", vault, ...wallets] : wallets;

    try {
        const result = await runScript(scriptName, args);
        const parsedResult = JSON.parse(result);

        if (parsedResult.address) {
            const previousData = readPreviousLog(parsedResult.address);
            writeCurrentLog(parsedResult.address, parsedResult, previousData);
            return { currentData: parsedResult, previousData };
        } else {
            //console.error(`⚠️ stderr:`, `Vault address not found by ${scriptName}`);
            const dummy = { dummy: ""};
            return { currentData: parsedResult, dummy};
        }
    } catch (error) { 
        console.error("❌ Error processing vault set:", error);
        throw error;
    }
}

/**
 * Runs the Details scripts.
 * @param {string} vault - The Vault address.
 * @param {string[]} wallets - List of wallet addresses.
 * @param {string} grouping - Grouping parameter.
 * @returns {Promise<Object>} - Resolves with parsed stake contract data.
 */
async function runGetDetails(type, vault, wallets, grouping) {
    if (!wallets || wallets.length === 0) {
        throw new Error("At least one wallet address is required");
    }

    let scriptName = "";
    switch (type) {
        case "bsc":
            scriptName = "getDetailSevoXStaked.js";
            grouping = false;
            break;
        case "vibe":
            scriptName = "getDetailVibe.js";
            grouping = false;
            break;
        case "vortex":
            scriptName = "getDetailVortex.js";
            grouping = false;
            break;
        case "stake":
        default:
            scriptName = "getDetailVtruStaked.js";
            break;
    }
    const args = grouping ? ["-g", grouping, ...wallets] : wallets;

    try {
        const result = await runScript(scriptName, args);
        return JSON.parse(result);
    } catch (error) {
        console.error("❌ Error processing stake contract:", error);
        throw error;
    }
}

module.exports = { runScript, runGetSections, runGetDetails };

