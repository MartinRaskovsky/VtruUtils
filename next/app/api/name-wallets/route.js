// src/next/app/api/name-wallets/route.js

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findEmailBySessionId, loadWalletNameMap, saveWalletNames } from '../../../lib/db';
import { debugLog } from '../../../lib/logger';

const MODULE = 'name-wallets';

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

    const body = await request.json();
    const { action, vault = '', name = '', wallets = [], wallet_names = {} } = body;
    debugLog(MODULE, `POST action=${action} from ${email} #wallets=${wallets.length} #${wallet_names}`);

    if (action === 'load') {
      const result = {};
      const nameMap = await loadWalletNameMap(); // Load full map once from DB
    
      for (const w of wallets) {
        result[w] = nameMap[w?.toLowerCase()] || ''; // Normalize to lowercase just in case
      }
    
      return NextResponse.json(result);
    }    

    if (action === 'names') {
      const lowerMap = {};
      const seen = new Set();

      for (const [addr, rawName] of Object.entries(wallet_names)) {
        const name = rawName.trim();
        if (!name) continue;
        const lowered = name.toLowerCase();
        if (seen.has(lowered)) {
          return NextResponse.json({ success: false, message: 'Duplicate names not allowed' });
        }
        seen.add(lowered);
        lowerMap[addr.toLowerCase()] = name;
      }

      await saveWalletNames(lowerMap);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });

  } catch (err) {
    console.error('[name-wallets] API error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

