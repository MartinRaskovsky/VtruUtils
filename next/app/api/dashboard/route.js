/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * Returns the current user's dashboard set by session ID.
 * Reads session cookie and resolves to a user email,
 * then queries the `current` table for the vault + wallets.
 * This matches the Perl dashboard load behavior exactly.
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { findEmailBySessionId, loadCurrentSet } from '../../../lib/db';
import { debugLog } from '../../../lib/logger';

const MODULE = 'dashboard';

export async function GET() {
  const sessionId = cookies().get('vawa_session')?.value;
  debugLog(MODULE, `Session lookup: ${sessionId?.slice(0, 16)}...`);
  if (!sessionId) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }

  const email = await findEmailBySessionId(sessionId);
  if (!email) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  debugLog(MODULE, `✅ Email from session: ${email}`);

  const set = await loadCurrentSet(email);
  if (!set) {
    return NextResponse.json({ error: 'No current set' }, { status: 404 });
  }

  debugLog(MODULE, `✅ Current set '${set.set_name}' → vault: ${set.vault_address}, ${set.wallet_addresses.length} wallets`);

  return NextResponse.json({
    email,
    setName: set.set_name,
    vault: set.vault_address,
    wallets: set.wallet_addresses, // already an array
  });
}

