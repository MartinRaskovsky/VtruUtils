/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * Handles confirmation of the 6-digit code after login.
 * Validates both email and code, sets a session cookie, and responds with success.
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { findEmailBySessionId, storeSessionId, clearConfirmationCode, findUser } from '../../../lib/db';
import { generateSessionId } from '../../../lib/auth';
import { debugLog } from '../../../lib/logger.js';

const MODULE = "confirm";

export async function POST(req) {
  try {
    const { email, code } = await req.json();
    debugLog("confirm", `🔍 Received confirm:, ${email} ${code}`);

    if (!email || !code || !/^\d{6}$/.test(code)) {
      console.log('❌ Invalid format');
      return NextResponse.json({ error: 'Invalid or missing email/code' }, { status: 400 });
    }

    const user = await findUser(email);
    debugLog("confirm", `🔍 DB user: ${user}`);

    if (!user || user.confirmation_code !== code) {
      console.log('❌ Mismatch or not found');
      return NextResponse.json({ error: 'Invalid code or email' }, { status: 401 });
    }

    const sessionId = generateSessionId();
    await storeSessionId(email, sessionId);
    await clearConfirmationCode(email);

    cookies().set('vawa_session', sessionId, {
      httpOnly: true,
      secure: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 14,
    });

    debugLog(MODULE, '✅ Login success, session set.');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Confirm error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

