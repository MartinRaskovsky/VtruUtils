/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * API Route: /api/sets/load
 *
 * Loads a saved address set (vault + wallets) for the current user.
 * Replaces the Perl version: cgi-bin/loadset.cgi
 * Used by: DashboardSetModals.jsx (Load modal)
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findEmailBySessionId, loadSavedSet } from '../../../../lib/db';
import { debugLog } from '../../../../lib/logger';

const MODULE = 'sets/load';

export async function POST(request) {
  const sessionId = cookies().get('vawa_session')?.value;
  if (!sessionId) {
    return NextResponse.json({ success: false, message: 'Missing session' }, { status: 401 });
  }

  const email = await findEmailBySessionId(sessionId);
  if (!email) {
    return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
  }

  const { name } = await request.json();
  debugLog(MODULE, `loadSet(${name}, ${email})`);

  const set = await loadSavedSet(email, name);
  if (!set) {
    return NextResponse.json({ success: false, message: 'Set not found' }, { status: 404 });
  }

  debugLog(MODULE, `loadSet=${set.set_name} with ${set.wallet_addresses.length} wallets`);
  return NextResponse.json({
    success: true,
    name: set.set_name,
    vault: set.vault_address,
    wallets: set.wallet_addresses,
  });
}
