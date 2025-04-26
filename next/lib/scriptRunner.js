/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * scriptRunner.js
 *
 * Utility function to run command-line Node.js scripts from /bin.
 * Abstracts script invocation and output parsing for use in API routes.
 *
 * Used by:
 * - /api/getSections/route.js → for top-level balance sections
 * - /api/details/route.js → for per-token modal details
 */

import { spawn } from 'child_process';
import path from 'path';
import { debugLog } from './logger';

/**
 * Executes a Node.js script from the ../bin/ directory and optionally parses output.
 * @param {string} scriptName e.g. 'getSections.js'
 * @param {string[]} args Command-line arguments
 * @param {boolean} parseAsJSON Whether to parse output as JSON
 * @param {string} [moduleName='scriptRunner'] Module tag used for debugLog
 * @returns {Promise<object|string>} Parsed JSON or raw output
 */
export async function runNodeScript(scriptName, args = [], parseAsJSON = true, moduleName = 'scriptRunner') {
  const scriptPath = path.resolve(process.cwd(), '../bin', scriptName);
  debugLog(moduleName, `▶️ ${scriptName} ${args.join(' ')}`);

  return new Promise((resolve, reject) => {
    const proc = spawn('node', [scriptPath, ...args], {
      cwd: path.dirname(scriptPath),
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', data => (stdout += data.toString()));
    proc.stderr.on('data', data => (stderr += data.toString()));

    proc.on('close', code => {
      if (code === 0) {
        try {
          resolve(parseAsJSON ? JSON.parse(stdout) : stdout);
        } catch (err) {
          reject(new Error(`Parsing error: ${err.message}`));
        }
      } else {
        reject(new Error(stderr || `Script exited with code ${code}`));
      }
    });
  });
}


