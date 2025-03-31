/**
 * libLogger.js
 * 
 * Unified logger for batch and parallel execution diagnostics.
 * 
 * Author: Dr. Martín Raskovsky
 * Date: March 2025
 */

const fs = require('fs');
const path = require('path');
const Config = require('./libConfig');

const DEFAULT_LOG_DIR = path.join(__dirname, '../logs');

function resolveLogFile(filename = '') {
  const config = new Config();

  let fileNameFromEnv = null;
  if (filename === 'parallel.log') {
    fileNameFromEnv = config.get('PARALLEL_ENGINE_LOG');
  } else if (filename === 'batch.log') {
    fileNameFromEnv = config.get('BATCH_ENGINE_LOG');
  }

  const resolvedName = fileNameFromEnv || filename || 'vawa.log';
  const resolved = path.join(DEFAULT_LOG_DIR, resolvedName);

  // Ensure log directory exists
  if (!fs.existsSync(DEFAULT_LOG_DIR)) {
    fs.mkdirSync(DEFAULT_LOG_DIR, { recursive: true });
  }

  // Ensure log file exists
  if (!fs.existsSync(resolved)) {
    fs.writeFileSync(resolved, '');
  }

  return resolved;
}

function log(message, type = 'INFO', file = '') {
  const logFile = resolveLogFile(file);
  const timestamp = new Date().toISOString();
  const formatted = `[${timestamp}] [${type}] ${message}`;

  try {
    fs.appendFileSync(logFile, formatted + '\n');
  } catch (e) {
    console.error("❌ Failed to write to log file:", e.message);
  }
}

function info(msg, file) {
  log(msg, 'INFO', file);
}

function warn(msg, file) {
  log(msg, 'WARN', file);
}

function error(msg, file) {
  log(msg, 'ERROR', file);
}

function timing(label, startTime, file) {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  log(`${label} completed in ${elapsed} seconds`, 'TIME', file);
}

module.exports = {
  log,
  info,
  warn,
  error,
  timing,
  resolveLogFile,
};

