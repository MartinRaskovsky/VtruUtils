// app/api/sets/list/route.js

/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * This API route returns the list of saved address set names for the logged-in user.
 * It uses the session ID cookie to determine the user's email and queries the database.
 *
 * Related DB function:
 *   - listSavedSets(email)
 * Related front-end modules:
 *   - DashboardSetModals.jsx
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findEmailBySessionId, listSavedSets } from '../../../../lib/db';
import { debugLog } from '../../../../lib/logger';

const MODULE = 'api/sets/list';

export async function GET() {
  const sessionId = cookies().get('vawa_session')?.value;

  if (!sessionId) {
    return NextResponse.json({ sets: [], error: 'No session' }, { status: 401 });
  }

  try {
    const email = await findEmailBySessionId(sessionId);
    if (!email) {
      return NextResponse.json({ sets: [], error: 'Invalid session' }, { status: 401 });
    }

    debugLog(MODULE, `Listing sets for ${email}`);
    const result = await listSavedSets(email);
    return NextResponse.json({ sets: result || [] });
  } catch (err) {
    console.error('[sets/list] DB error:', err);
    return NextResponse.json({ sets: [], error: 'DB error' }, { status: 500 });
  }
}
