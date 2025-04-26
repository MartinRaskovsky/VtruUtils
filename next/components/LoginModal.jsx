/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * This component displays the login modal used to submit an email address.
 * It matches the Perl `login.cgi` layout using `.box-container`, identical
 * HTML structure, and validation behavior.
 */

import { useState, useEffect } from 'react';

export default function LoginModal({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);

  useEffect(() => {
    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
    setIsValid(isValidEmail);
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit?.(email.trim(), keepLoggedIn);
  };

  return (
    <div className="box-container">
      <h2 style={{ color: 'white', textAlign: 'center' }}>Login</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="checkbox-container">
          <input
            type="checkbox"
            id="keepLoggedIn"
            name="keepLoggedIn"
            checked={keepLoggedIn}
            onChange={(e) => setKeepLoggedIn(e.target.checked)}
          />
          <label htmlFor="keepLoggedIn">Keep me logged in</label>
        </div>

        <button
          type="submit"
          id="loginButton"
          disabled={!isValid}
          style={{
            cursor: isValid ? 'pointer' : 'not-allowed',
            opacity: isValid ? 1 : 0.5,
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

