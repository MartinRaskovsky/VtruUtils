/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * API Route: /api/sets/current
 *
 * Updates the current vault + wallets + name set for the user.
 * This is a side-effect endpoint called whenever the user changes the dashboard set.
 *
 * Frontend: Called by DashboardInputForm.
 * 
 * Related DB method:
 * - saveCurrentSet(email, name, vault, wallets)
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findEmailBySessionId, saveCurrentSet } from '../../../../lib/db';
import { debugLog } from '../../../../lib/logger';

const MODULE = 'setCurrent';

async function getEmailFromCookie() {
  const sessionId = cookies().get('vawa_session')?.value;
  if (!sessionId) return null;
  return await findEmailBySessionId(sessionId);
}

async function parseInput(request) {
  try {
    const { name, vault, wallets } = await request.json();
    if (!vault && (!wallets || wallets.length === 0)) {
      throw new Error('Empty vault and wallet list');
    }
    return { name: name || 'current', vault: vault || '', wallets };
  } catch {
    throw new Error('Invalid input');
  }
}

export async function POST(request) {
  debugLog(MODULE, 'POST entered');

  try {
    const email = await getEmailFromCookie();
    if (!email) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
    }

    const { name, vault, wallets } = await parseInput(request);
    await saveCurrentSet(email, name, vault, wallets);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`[${MODULE}] Error:`, err);
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

