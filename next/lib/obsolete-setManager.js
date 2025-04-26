// src/next/lib/setManager.js

/**
 * Author: Dr Martín Raskovsky
 * Date: April 2025
 *
 * This module provides async functions for managing address sets
 * (Load, Save, Delete, List) using the legacy CGI back end.
 *
 * Used inside React modals, it replaces the DOM-based dashboard-sets.js.
 */

export async function saveSet(name, vault, wallets) {
    if (!name || (wallets.length === 0 && !vault)) return { success: false, message: 'Missing input' };
  
    const res = await fetch('/cgi-bin/namesdb.cgi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'set', name, vault, wallets }),
    });
  
    return await res.json();
  }
  
  export async function loadSet(name) {
    const res = await fetch(`/cgi-bin/loadset.cgi?name=${encodeURIComponent(name)}`);
    return await res.json(); // expected: { name, vault, wallets }
  }
  
  export async function deleteSet(name) {
    const res = await fetch(`/cgi-bin/deleteset.cgi?name=${encodeURIComponent(name)}`);
    return await res.json(); // expected: { success: true/false }
  }
  
  export async function listSets() {
    const res = await fetch('/cgi-bin/listsets.cgi');
    const json = await res.json();
    return json.sets || []; // expected: { sets: [name, name, ...] }
  }
  