/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * API Route: /api/sets/save
 *
 * Saves (inserts or replaces) a named address set (vault + wallets) for the logged-in user.
 * Used by the "Save Set" modal in the React dashboard.
 *
 * Replaces the Perl CGI logic previously handled by: namesdb.cgi?action=set
 * 
 * Input (JSON):
 * {
 *   name:     string  - name of the set to save
 *   vault:    string  - optional vault address
 *   wallets:  array   - array of wallet addresses
 * }
 *
 * Requires a valid session cookie (`vawa_session`).
 *
 * Related frontend module:
 * - DashboardSetModals.jsx
 *
 * Related DB method:
 * - saveSetForUser(email, name, vault, wallets)
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findEmailBySessionId, saveSetForUser } from '../../../../lib/db';
import { debugLog } from '../../../../lib/logger';

const MODULE = 'sets/save';

export async function POST(request) {

  try {
    const sessionId = cookies().get('vawa_session')?.value;
    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Missing session' }, { status: 401 });
    }

    const email = await findEmailBySessionId(sessionId);
    if (!email) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
    }

    const { name, vault, wallets } = await request.json();

    if (!name || !Array.isArray(wallets)) {
      return NextResponse.json({ success: false, message: 'Invalid input' }, { status: 400 });
    }

    debugLog(MODULE, `saveSet(${email}, ${name}, ${vault?vault:'novault'}, ${wallets.length})`);

    const ok = await saveSetForUser(email, name, vault, wallets);
    return NextResponse.json({ success: ok });

  } catch (err) {
    console.error(`[${MODULE}] Error saving set:`, err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

