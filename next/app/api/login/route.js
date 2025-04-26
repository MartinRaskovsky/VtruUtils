/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * This API route replicates `login.cgi` from the legacy Perl backend.
 * It accepts an email via POST, generates a login token, stores it in the
 * database, and sends a confirmation link via email. Unlike the SMTP version,
 * this version uses the system's `sendmail` utility, which matches the current
 * Perl deployment and avoids the need for SMTP credentials.
 */

import { NextResponse } from 'next/server';
import { findEmailBySessionId, findOrCreateUser, storeConfirmationCode } from '../../../lib/db';
import { generateToken } from '../../../lib/auth';
import nodemailer from 'nodemailer';
import { debugLog } from '../../../lib/logger.js';

const MODULE = 'login';

export async function POST(request) {
  const body = await request.json();
  const { email, keepLoggedIn } = body;
  debugLog(MODULE, `Login: ${email}, ${keepLoggedIn}`);

  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const token = generateToken();

  try {
    await findOrCreateUser(email);
    await storeConfirmationCode(email, token, keepLoggedIn);

    const confirmLink = `${process.env.BASE_URL}/confirm?code=${token}`;
    await sendConfirmationEmail(email, confirmLink);

    debugLog(MODULE, `Confirmation email sent: ${email}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * Sends an email using the system's sendmail utility.
 * For local dev, logs the link to console since macOS mail delivery is unreliable.
 */
async function sendConfirmationEmail(to, code) {
  const transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail',
  });

  const html = `
  <html>
  <head>
    <title>VaWa App Login Code</title>
    <style>
      body {
          font-family: Arial, sans-serif;
          line-height: 1.5;
      }
      h1, h2, h3 {
          color: #4B0082;
      }
      .code-box {
          font-size: 20px;
          color: red;
          font-weight: bold;
      }
      .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 0px;
      }
      .logo-container img {
          height: 64px;
      }
    </style>
  </head>
  <body>
    <div class="logo-container">
      <img src="https://about.martinr.com/images/logo-purple.png" alt="VaWa Logo" />
    </div>
    <h1>VaWa App Login Code</h1>
    <p><strong>Your confirmation code:</strong></p>
    <p class="code-box">${code}</p>

    <h2>What is VaWa?</h2>
    <p><b>VaWa</b> (Vault and Wallet Tracker) is a multi-network, multi-wallet tool that provides a unified view of your assets, eliminating the need to check multiple blockchain explorers individually.</p>

    <h2>Key Features</h2>
    <ul>
      <li>View details of your Vitruveo Vault and linked wallets.</li>
      <li>Track all your Vitruveo tokens and coins across multiple wallets in a single dashboard.</li>
      <li>Find out exactly <i>Where are my tokens?</i> without checking multiple explorers.</li>
      <li>Discover hidden or forgotten tokens and coins.</li>
      <li>Monitor SEVO-X on BSC alongside your Vitruveo holdings.</li>
      <ul class="about-bullets">
        <li>Supports multiple networks:
          <ul class="about-bullets">
            <li><b>Native Coins</b>: VTRU, ETH, BNB, POL, AVAX, SOL, TEZ.</li>
            <li><b>ETH Bridged</b>: ETH on Arbitrum, Optimism, Base.</li>
            <li><b>VTRU Bridged</b>: VTRU on ETH and BSC.</li>
            <li><b>USDC</b>: On VTRU, ETH, BSC, POL, SOL, ARB, OPT, BASE, AVAX.</li>
            <li><b>Staked</b>: VTRU Staked, SEVO-X Staked (BSC).</li>
            <li><b>Vitruveo Coins & Tokens</b>: VERSE, VIBE, VORTEX, VTRO, VUSD, wVTRU.</li>
            <li><b>Sabong</b>: SEVO and SEVO-X (BSC).</li>
            <li><b>Vitruveo Exchange</b>: V3DEX and VITDEX.</li>
          </ul>
        </li>
      </ul>
    </ul>

    <h2>How to Use Your Login Code</h2>
    <p>To access your VaWa account, enter the confirmation code provided above. This code is valid for a limited time and should not be shared with anyone.</p>

    <h2>Security Notes</h2>
    <ul>
      <li>VaWa will never ask for your private keys or passwords.</li>
      <li>Always make sure you are using the official VaWa website.</li>
      <li>If you did not request this login code, please ignore this email.</li>
    </ul>

    <p>For more information, visit: <a href="https://about.martinr.com/vawa_notes.html" target="_blank">VaWa Notes</a></p>
    <p>Need help? Contact us at <a href="mailto:vawa2025@gmail.com">vawa2025@gmail.com</a></p>
    <p><i>Thank you for choosing VaWa!</i></p>
  </body>
  </html>
  `;

  debugLog(MODULE, `Confirmation code for ${to}: ${code}`);

  await transporter.sendMail({
    from: 'VaWa <no-reply@martinr.com>',
    to,
    subject: 'Your VaWa App Login Code',
    html,
  });
}
