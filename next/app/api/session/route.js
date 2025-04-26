// File: app/api/session/route.js

/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * Checks if the current user is logged in (based on the session cookie).
 * If valid, returns the user's email. Otherwise returns 401.
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { findEmailBySessionId } from '../../../lib/db';
import { debugLog } from '../../../lib/logger.js';

export async function GET() {
  const sessionId = cookies().get('vawa_session')?.value;
  debugLog('session', `Checking session ID: ${sessionId}`);
  if (!sessionId) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }

  const email = await findEmailBySessionId(sessionId);
  if (!email) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  debugLog('session', `Logged in: ${email}`);
  return NextResponse.json({ email }); // ✅ Logged in!
}

