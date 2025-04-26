/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * This module connects to the MySQL database using the `mysql2` client.
 * It mirrors the Perl `DBUtils.pm`, using the same schema:
 * - `users(email, confirmation_code, session_id, keep_logged_in)`
 * - `current`, `sets`, and `names` for later use.
 */

import mysql from 'mysql2/promise';
import { debugLog } from './logger.js';

const MODULE = "db";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

/**
 * Finds a user by email.
 * Returns full row { email, confirmation_code, session_id, keep_logged_in } or null.
 */
export async function findUser(email) {
  debugLog(MODULE, `findUser(${email})`);
  const [rows] = await pool.query(
    'SELECT email, confirmation_code, session_id, keep_logged_in FROM users WHERE email = ?',
    [email]
  );
  if (rows.length > 0) {
    debugLog(MODULE, `User found: ${email}`);
    return rows[0];
  }
  debugLog(MODULE, `User not found: ${email}`);
  return null;
}

/**
 * Finds an existing user or inserts them by email.
 * Used at login time to prepare a new entry if needed.
 */
export async function findOrCreateUser(email) {
  debugLog(MODULE, `findOrCreateUser(${email})`);
  const user = await findUser(email);
  if (user) {
    debugLog(MODULE, `User exists, no insert needed`);
    return email;
  }

  await pool.query(
    'INSERT INTO users (email, confirmation_code, session_id, keep_logged_in) VALUES (?, "", "", FALSE)',
    [email]
  );
  debugLog(MODULE, `User inserted: ${email}`);
  return email;
}

/**
 * Stores the confirmation code into the users table.
 */
export async function storeConfirmationCode(email, code, keepLoggedIn = false) {
  debugLog(MODULE, `storeConfirmationCode(${email}, code=${code}, keep=${keepLoggedIn})`);
  await pool.query(
    'UPDATE users SET confirmation_code = ?, keep_logged_in = ? WHERE email = ?',
    [code, keepLoggedIn ? 1 : 0, email]
  );
}

/**
 * Looks up the email associated with a confirmation code.
 * (Legacy function, used in earlier GET-based flow.)
 */
export async function findEmailByConfirmationCode(code) {
  debugLog(MODULE, `findEmailByConfirmationCode(${code})`);
  const [rows] = await pool.query(
    'SELECT email FROM users WHERE confirmation_code = ?',
    [code]
  );
  if (rows.length > 0) {
    debugLog(MODULE, `Code match → email: ${rows[0].email}`);
    return rows[0].email;
  }
  debugLog(MODULE, `No match for confirmation code`);
  return null;
}

/**
 * Stores a new session ID for the given user.
 */
export async function storeSessionId(email, sessionId) {
  debugLog(MODULE, `storeSessionId(${email}, sessionId=${sessionId.slice(0, 8)}...)`);
  await pool.query(
    'UPDATE users SET session_id = ? WHERE email = ?',
    [sessionId, email]
  );
}

/**
 * Clears the confirmation code after login is successful.
 */
export async function clearConfirmationCode(email) {
  debugLog(MODULE, `clearConfirmationCode(${email})`);
  await pool.query(
    'UPDATE users SET confirmation_code = "" WHERE email = ?',
    [email]
  );
}

/**
 * Optional: retrieves the `keep_logged_in` flag.
 * Mirrors Perl `getKeepLoggedIn()`.
 */
export async function getKeepLoggedIn(email) {
  debugLog(MODULE, `getKeepLoggedIn(${email})`);
  const [rows] = await pool.query(
    'SELECT keep_logged_in FROM users WHERE email = ?',
    [email]
  );
  if (rows.length > 0) {
    debugLog(MODULE, `Keep logged in: ${rows[0].keep_logged_in}`);
    return !!rows[0].keep_logged_in;
  }
  debugLog(MODULE, `Email not found for keep_logged_in`);
  return false;
}

/**
 * Finds the email matching a session ID.
 */
export async function findEmailBySessionId(sessionId) {
  debugLog(MODULE, `findEmailBySessionId(${sessionId.slice(0, 8)}...)`);
  const [rows] = await pool.query(
    'SELECT email FROM users WHERE session_id = ?',
    [sessionId]
  );
  if (rows.length > 0) {
    debugLog(MODULE, `Session match → email: ${rows[0].email}`);
    return rows[0].email;
  }
  debugLog(MODULE, `No session match`);
  return null;
}

/**
 * Loads the current vault/wallet set for a user.
 * Returns: { set_name, vault_address, wallet_addresses[] }
 */
export async function loadCurrentSet(email) {
  debugLog(MODULE, `loadCurrentSet(${email})`);

  const [rows] = await pool.query(
    'SELECT set_name, vault_address, wallet_addresses FROM current WHERE email = ?',
    [email]
  );

  if (rows.length === 0) return null;

  const set = rows[0];
  set.wallet_addresses = set.wallet_addresses.split(',').map(s => s.trim());
  return set;
}

export async function saveCurrentSet(email, name, vault, wallets) {
  debugLog(MODULE, `saveCurrentSet(${email}, ${name}, vault=${vault ? 'yes' : 'no'}, #wallets=${wallets.length})`);

  await pool.query(
    'REPLACE INTO current (email, set_name, vault_address, wallet_addresses) VALUES (?, ?, ?, ?)',
    [email, name, vault, wallets.join(',')]
  );
}

/**
 * Loads the map of wallet addresses to names.
 * Returns: { [walletAddress: string]: name }
 */
export async function loadWalletNameMap() {
  const [rows] = await pool.query(`SELECT wallet_address, name FROM names`);
  const map = {};
  for (const row of rows) {
    if (row.wallet_address) {
      map[row.wallet_address.toLowerCase()] = row.name || '';
    }
  }
  return map;
}

/**
 * Saves wallet names to the `names` table.
 * Deletes names that are empty, inserts or replaces the rest.
 */
export async function saveWalletNames(nameMap) {
  const MODULE = 'db';
  debugLog(MODULE, `saveWalletNames(${Object.keys(nameMap).length} entries)`);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const insertQuery = 'REPLACE INTO names (wallet_address, name) VALUES (?, ?)';
    const deleteQuery = 'DELETE FROM names WHERE wallet_address = ?';

    const insertStmt = await conn.prepare(insertQuery);
    const deleteStmt = await conn.prepare(deleteQuery);

    for (const [wallet, name] of Object.entries(nameMap)) {
      if (!name || name.trim() === '') {
        await deleteStmt.execute([wallet]);
      } else {
        await insertStmt.execute([wallet, name]);
      }
    }

    await insertStmt.close();
    await deleteStmt.close();
    await conn.commit();
    debugLog(MODULE, `✅ saveWalletNames committed`);

  } catch (err) {
    await conn.rollback();
    console.error(`[${MODULE}] DB error in saveWalletNames:`, err);
    throw err;
  } finally {
    conn.release();
  }
}

export async function listSavedSets(email) {
  debugLog(MODULE, `listSavedSets(${email})`);
  const [rows] = await pool.query(
    'SELECT set_name FROM sets WHERE email = ?',
    [email]
  );
  debugLog(MODULE, `listSavedSets=#rows=${rows.length}`);
  return rows.map(row => row.set_name);
}

/**
 * Loads a saved address set by name for the given user.
 * Returns: { set_name, vault_address, wallet_addresses[] } or null
 */
export async function loadSavedSet(email, name) {
  debugLog(MODULE, `loadSavedSet(${email}, ${name})`);
  const [rows] = await pool.query(
    'SELECT set_name, vault_address, wallet_addresses FROM sets WHERE email = ? AND set_name = ?',
    [email, name]
  );
  if (rows.length === 0) return null;

  const set = rows[0];
  set.wallet_addresses = (set.wallet_addresses || '').split(',').map(s => s.trim());
  return set;
}

/**
 * Deletes a saved vault/wallet set by set name and user email.
 * @param {string} email - The user's email.
 * @param {string} setName - The name of the set to delete.
 * @returns {Promise<boolean>} - True if a row was deleted.
 */
export async function deleteSetByName(email, setName) {
  debugLog(MODULE, `deleteSetByName(${email}, ${setName})`);

  const [result] = await pool.query(
    'DELETE FROM sets WHERE email = ? AND set_name = ?',
    [email, setName]
  );

  debugLog(MODULE, `deleteSetByName → affectedRows=${result.affectedRows}`);
  return result.affectedRows > 0;
}

/**
 * Save (insert or update) a set of vault and wallets for a user.
 * @param {string} email - user's email
 * @param {string} name - name of the address set
 * @param {string} vault - vault address (optional)
 * @param {string[]} wallets - list of wallet addresses
 * @returns {Promise<boolean>}
 */
export async function saveSetForUser(email, name, vault, wallets) {
  debugLog(MODULE, `saveSetForUser(${email}, ${name}, vault=${vault ? 'yes' : 'no'}, #wallets=${wallets.length})`);

  await pool.query(
    'REPLACE INTO sets (email, set_name, vault_address, wallet_addresses) VALUES (?, ?, ?, ?)',
    [email, name, vault, wallets.join(',')]
  );

  return true;
}


