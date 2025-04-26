/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * Logging utility for backend diagnostics.
 * - Logs are written to ../logs/next-debug.log
 * - Module tags are padded/truncated to 8 characters for alignment
 * - Creates log file and directory automatically if missing
 */

import fs from 'fs';
import path from 'path';

const logPath = path.resolve(process.cwd(), '../logs/next-debug.log');

function initLogFile() {
  const logDir = path.dirname(logPath);
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  if (!fs.existsSync(logPath)) fs.writeFileSync(logPath, '');
}

initLogFile();

/**
 * Appends a debug log message to the file.
 * @param {string} module
 * @param {string} message
 */
export function debugLog(module, message) {
  const padded = module.padEnd(8).slice(0, 8);
  const timestamp = new Date().toISOString();
  const final = `[${timestamp}] [${padded}]\t${message}`;
  try {
    fs.appendFileSync(logPath, final + '\n');
  } catch (err) {
    console.error(`[logger] Failed to write log: ${err.message}`);
  }
}

/**
 * Appends an error log message to the file (marked ❌).
 * @param {string} message
 */
export function logError(message) {
  const timestamp = new Date().toISOString();
  const final = `[${timestamp}] [ERROR   ]\t❌ ${message}`;
  try {
    fs.appendFileSync(logPath, final + '\n');
  } catch (err) {
    console.error(`[logger] Failed to write error: ${err.message}`);
  }
}

