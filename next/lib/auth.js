/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * This module provides authentication helpers, including generation of
 * 6-digit confirmation codes for login, matching the format used in Perl.
 */

export function generateToken() {
  return String(Math.floor(Math.random() * 900000) + 100000); // 6-digit string
}

export function generateSessionId() {
  return [...Array(64)].map(() => Math.random().toString(36)[2]).join('');
}
