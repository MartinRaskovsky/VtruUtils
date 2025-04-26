/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * loginServer.js
 *
 * Provides session-based user lookup for API routes (server-side only).
 * Now relies on sessionUtils.js for cookie extraction.
 */

import { getSessionId } from './sessionUtils.js';
import { findEmailBySessionId } from './db.js';
import { debugLog } from './logger.js';

const MODULE = 'loginServer';

/**
 * Resolves the logged-in email from session cookies.
 * @returns {Promise<string|null>} - The user email or null
 */
export async function getSessionEmail() {
  const sessionId = getSessionId();
  if (!sessionId) return null;

  const email = await findEmailBySessionId(sessionId);
  debugLog(MODULE, `Session resolved → ${email || 'none'}`);
  return email;
}

