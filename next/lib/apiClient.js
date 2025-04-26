/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * API client wrapping all business-level backend actions.
 * Centralizes endpoints and abstracts fetch calls.
 */

import { getJSON, postJSON, getText } from './apiCore';

export async function loadCurrentDashboard() {
  return getJSON('/api/dashboard');
}

export async function saveCurrentSet(name, vault, wallets) {
  return postJSON('/api/sets/current', { name, vault, wallets });
}

export async function saveNamedSet(name, vault, wallets) {
  return postJSON('/api/sets/save', { name, vault, wallets });
}

export async function deleteNamedSet(name) {
  return postJSON('/api/sets/delete', { name });
}

export async function loadNamedSet(name) {
  return postJSON('/api/sets/load', { name });
}

export async function listSavedSets() {
  return getJSON('/api/sets/list');
}

export async function getSections(vault, wallets) {
  return postJSON('/api/getSections', { vault, wallets });
}

export async function performLogin(email, keepLoggedIn) {
  return postJSON('/api/login', { email, keepLoggedIn });
}

export async function performLogout() {
  return postJSON('/api/logout', {});
}

export async function confirmCode(code) {
  return getJSON(`/api/confirm?code=${code}`);
}

export async function loadWalletNames(vault, name, wallets) {
  return postJSON('/api/name-wallets', {
    action: 'load',
    vault,
    name,
    wallets
  });
}

export async function saveWalletNames(vault, name, wallets, wallet_names) {
  return postJSON('/api/name-wallets', {
    action: 'names',
    vault,
    name,
    wallets,
    wallet_names
  });
}

export async function confirmCodeWithEmail(email, code) {
  return postJSON('/api/confirm', { email, code });
}

export async function loadSectionDetails(type, grouping, vault, wallets) {
  return postJSON('/api/getDetails', {
    type,
    grouping,
    vault,
    wallets
  });
}


