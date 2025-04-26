/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * This page renders the confirmation modal where users enter the 6-digit code
 * received by email. It is the React equivalent of the Perl `/cgi-bin/confirm.cgi`
 * and works in conjunction with the API route `/api/confirm/route.js`.
 *
 * When the code is submitted and validated successfully, the session cookie
 * is set and the user is redirected back to the main dashboard.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { confirmCode } from '../../../lib/apiClient';

export default function ConfirmPage() {
  const [code, setCode] = useState('');
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cleaned = code.replace(/\D/g, '');
    setCode(cleaned);
    setIsValid(/^\d{6}$/.test(cleaned));
  }, [code]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      const res = await confirmCode(code);
      if (res && res.success !== false) {
        router.push('/'); // ✅ Go to dashboard
      } else {
        alert('Invalid or expired code. Please try again.');
      }
    } catch (err) {
      console.error('Confirm error:', err);
      alert('Server error. Please try again.');
    }
  };

  return (
    <div className="dashboard-page" id="dashboard-page">
      <div id="main-wrapper">
        <div className="logo-container">
          <img src="/images/logo.png" alt="VaWa Logo" className="vawa-logo" />
          <span className="version-text">V 0.2.0</span>
        </div>

        <div id="header">
          <button id="backBtn" className="header-btn" onClick={() => router.back()}>Back</button>
          <h1>Vault & Wallet Details</h1>
          <button id="logoutBtn" className="header-btn" disabled>log out</button>
        </div>

        <div className="box-container">
          <h2 style={{ color: 'white', textAlign: 'center' }}>Enter Confirmation Code</h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="code">Code:</label>
            <input
              type="tel"
              id="code"
              name="code"
              required
              pattern="[0-9]{6}"
              maxLength={6}
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <button
              type="submit"
              id="confirmButton"
              disabled={!isValid}
              style={{
                cursor: isValid ? 'pointer' : 'not-allowed',
                opacity: isValid ? 1 : 0.5,
              }}
            >
              Confirm
            </button>
          </form>

          <a href="/" className="cancel-link">Cancel</a>
        </div>
      </div>
    </div>
  );
}
