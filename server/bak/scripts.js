const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const VtruConfig = require('../lib/vtruConfig');

const logsDir = path.join(__dirname, '../public/data');

function findLatestLog(vaultAddress) {
    try {
        if (!fs.existsSync(logsDir)) {
            console.warn(`⚠️ Logs directory not found: ${logsDir}`);
            return null;
        }

        const files = fs.readdirSync(logsDir)
            .filter(file => file.includes(vaultAddress) && file.endsWith('.json'))
            .sort((a, b) => b.localeCompare(a)); // Sort descending by name (timestamped)

        if (files.length === 0) {
            //console.warn(`⚠️ No log files found for Vault: ${vaultAddress}`);
            return null;
        }

        return path.join(logsDir, files[0]); // Return latest log file path
    } catch (error) {
        console.error(`❌ Error reading logs:`, error);
        return null;
    }
}

function readPreviousLog(vaultAddress) {
    const latestLogPath = findLatestLog(vaultAddress);
    if (!latestLogPath) return null;

    try {
        const data = fs.readFileSync(latestLogPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`❌ Error reading log file ${latestLogPath}:`, error);
        return null;
    }
}

function writeCurrentLog(vaultAddress, currentData, previousData) {
    try {
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        if (previousData && JSON.stringify(previousData) === JSON.stringify(currentData)) {
            return;
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const logFilePath = path.join(logsDir, `${vaultAddress}_${timestamp}.json`);

        fs.writeFileSync(logFilePath, JSON.stringify(currentData, null, 2), 'utf-8');
    } catch (error) {
        console.error(`❌ Error writing log file:`, error);
    }
}

function runScript(scriptName, args = []) {
    return new Promise((resolve, reject) => {
        const binPath = path.join(__dirname, '../bin');
        let scriptPath = path.join(binPath, scriptName);

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
            console.error(`⚠️ stderr:`, data.toString());
        });

        script.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Script exited with code ${code}`));
            } else {
                resolve(output.trim());
            }
        });
    });
}

async function runVaultSet(vault, wallets) {
    if (!vault || vault.length === 0) {
        const config = new VtruConfig();
        vault = config.get('VAULT_ADDRESS');
    }
    if (!vault || vault.length === 0) {
        console.error(`⚠️ stderr:`, 'Vault address is required');
    }

    vault = vault.toLowerCase();
    const args = [vault, ...wallets];
    const scriptName = "getVaultSet.js";

    try {

        const previousData = readPreviousLog(vault);
        const result = await runScript(scriptName, args);
        const parsedResult = JSON.parse(result);
        writeCurrentLog(vault, parsedResult, previousData);
        return { currentData: parsedResult, previousData };
    } catch (error) {
        console.error("❌ Error processing vault set:", error);
        throw error;
    }
}

async function runStakeContract(wallets) {
    if (!wallets || wallets.length === 0) throw new Error("At least one wallet address is required");

    const scriptName = "getStakedContract.js";

    try {
        const result = await runScript(scriptName, wallets);
        return JSON.parse(result);
    } catch (error) {
        console.error("❌ Error processing stake contract:", error);
        throw error;
    }
}

module.exports = { runScript, runVaultSet, runStakeContract };


