/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * This component displays the confirmation modal after email login.
 * It mirrors the Perl `confirm.cgi` layout using `.box-container`, proper
 * `<input type="tel">`, and shows a Cancel link below the form.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { confirmCodeWithEmail } from '../lib/apiClient';

export default function ConfirmModal({ email, onSuccess }) {
  const [code, setCode] = useState('');
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  const handleInput = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    setCode(cleaned);
    setIsValid(/^\d{6}$/.test(cleaned));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      const data = await confirmCodeWithEmail(email, code);
      if (data.success) {
        if (onSuccess) onSuccess();
        else window.location.href = '/';
      } else {
        alert(data.error || 'Invalid code or expired.');
      }
    } catch (err) {
      console.error('Confirm error:', err);
      alert('Server error. Please try again.');
    }
  };

  return (
    <div className="box-container">
      <h2 style={{ color: 'white', textAlign: 'center' }}>Enter Confirmation Code</h2>

      <form onSubmit={handleSubmit}>
        <input type="hidden" name="email" value={email} />

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
          onChange={handleInput}
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
  );
}
