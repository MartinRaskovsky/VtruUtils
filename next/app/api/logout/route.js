/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * API Route: /api/logout
 *
 * Logs the user out by clearing the session ID from the database and removing the session cookie.
 * This mirrors the behavior of Perl’s `logout.cgi` and is used when:
 * - User clicks logout
 * - Session becomes invalid (expired, missing, or rejected)
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { findEmailBySessionId, storeSessionId } from '../../../lib/db';

const MODULE = 'api-logout';

export async function POST() {
  const sessionId = cookies().get('vawa_session')?.value;

  if (sessionId) {
    const email = await findEmailBySessionId(sessionId);
    if (email) {
      await storeSessionId(email, ''); // Invalidate in DB
    }
    cookies().set('vawa_session', '', {
      path: '/',
      maxAge: 0, // Expire cookie
    });
  }

  return NextResponse.json({ success: true });
}
