/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * apiCore.js
 *
 * Provides shared low-level GET and POST wrappers for all API requests.
 * Includes optional debug logging and centralized error handling.
 */

const DEBUG = false;

/**
 * Helper to log debug output.
 */
function log(...args) {
  if (DEBUG) console.log('[API]', ...args);
}

/**
 * Performs a GET request and returns parsed JSON.
 * @param {string} url
 */
export async function getJSON(url) {
  log(`GET ${url}`);
  const res = await fetch(url);
  const json = await res.json();
  const isSuccess = json && json.success !== false && !json.error;
  log(`← ${url}`, isSuccess ? '✅ success' : '❌ error');
  //log(json); // Uncomment for full response
  return json;
}

/**
 * Performs a POST request with JSON payload and returns parsed JSON.
 * @param {string} url
 * @param {object} body
 */
export async function postJSON(url, body) {
  log(`POST ${url}`, body);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  const isSuccess = json && json.success !== false && !json.error;
  log(`← ${url}`, isSuccess ? '✅ success' : '❌ error');
  //log(json); // Uncomment for full response
  return json;
}

/**
 * Performs a GET request and returns raw text (e.g., for HTML).
 * @param {string} url
 */
export async function getText(url) {
  log(`GET TEXT ${url}`);
  const res = await fetch(url);
  const text = await res.text();

  // Convention: Treat any non-200 as failure, but don't throw
  const isSuccess = res.ok && text && text.trim().length > 0;
  log(`← ${url}`, isSuccess ? `✅ ${text.length} bytes` : '❌ error or empty');
  //log(text); // Uncomment for full response
  return text;
}

