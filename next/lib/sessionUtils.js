/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * sessionUtils.js
 *
 * Provides helper functions for working with user sessions.
 * - Retrieves the session ID from cookies
 * - Ensures consistency across all server-side route handlers
 *
 * Used by:
 * - loginServer.js
 * - API route modules needing user lookup
 */

import { cookies } from 'next/headers';

/**
 * Retrieves the session ID from cookies.
 * Returns null if not found.
 */
export function getSessionId() {
  return cookies().get('vawa_session')?.value || null;
}
