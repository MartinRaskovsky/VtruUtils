/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * API Route: /api/sets/delete
 *
 * Deletes a saved address set for the current user based on the provided name.
 * Replaces the legacy `deleteset.cgi` Perl backend.
 * 
 * Input: expects a JSON body with `{ name }` (set name to delete).
 * Requires a valid session cookie (`vawa_session`).
 * 
 * Related frontend module:
 * - DashboardSetModals.jsx
 *
 * Related DB method:
 * - deleteSetByName(email, name)
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findEmailBySessionId, deleteSetByName } from '../../../../lib/db';
import { debugLog } from '../../../../lib/logger';

const MODULE = 'api-delete-set';

export async function POST(request) {
  debugLog(MODULE, 'Incoming POST request');

  try {
    const sessionId = cookies().get('vawa_session')?.value;
    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Missing session' }, { status: 401 });
    }

    const email = await findEmailBySessionId(sessionId);
    if (!email) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
    }

    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ success: false, message: 'Missing set name' }, { status: 400 });
    }

    const deleted = await deleteSetByName(email, name);
    return NextResponse.json({ success: deleted });

  } catch (err) {
    console.error(`[${MODULE}] Error deleting set:`, err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

