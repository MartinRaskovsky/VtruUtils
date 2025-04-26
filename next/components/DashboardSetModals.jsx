/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * DashboardSetModals.jsx
 *
 * This React component provides modal dialogs and logic for managing address sets:
 * - Save Set: opens a modal to input a name and stores the current dashboard (vault + wallets).
 * - Load Set: opens a modal listing saved sets for the user; loads the selected set into the dashboard.
 * - Delete Set: confirms and deletes a saved set.
 */

import { useState, useEffect } from 'react';
import {
  listSavedSets,
  loadNamedSet,
  saveNamedSet,
  deleteNamedSet
} from '../lib/apiClient';

export default function DashboardSetModals({
  vault,
  walletsText,
  onSetLoaded,
  onSetSaved,
  onNameChange,
}) {
  const [setList, setSetList] = useState([]);
  const [selectedSet, setSelectedSet] = useState('');
  const [saveName, setSaveName] = useState('');
  const [currentSetName, setCurrentSetName] = useState('');
  const [initialVault, setInitialVault] = useState(vault);
  const [initialWallets, setInitialWallets] = useState(walletsText);

  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    const loadBtn = document.getElementById('loadSetBtn');
    const saveBtn = document.getElementById('saveSetsBtn');

    const openLoadModal = () => {
      //console.log('[Debug] Opening Load Modal');
      setLoadModalOpen(true);
    };
    const openSaveModal = () => {
      //console.log('[Debug] Opening Save Modal');
      setSaveModalOpen(true);
    };

    if (loadBtn) loadBtn.addEventListener('click', openLoadModal);
    if (saveBtn) saveBtn.addEventListener('click', openSaveModal);

    return () => {
      if (loadBtn) loadBtn.removeEventListener('click', openLoadModal);
      if (saveBtn) saveBtn.removeEventListener('click', openSaveModal);
    };
  }, []);

  useEffect(() => {
    listSavedSets()
      .then(data => {
        if (Array.isArray(data.sets)) {
          setSetList(data.sets);
          if (data.sets.length > 0) {
            setSelectedSet(data.sets[0]);
          }
        }
      })
      .catch(err => {
        console.error('[Load Sets] Failed to load:', err);
        setSetList([]);
      });
  }, []);

  //useEffect(() => {
    //console.log('[Debug] loadModalOpen:', loadModalOpen);
  //}, [loadModalOpen]);

// Pre-fill the Save modal with the current set name when opening
useEffect(() => {
  if (saveModalOpen) {
    const cleanName = currentSetName.replace(/ \(edited\)$/, '');
    setSaveName(cleanName);
  }
}, [saveModalOpen, currentSetName]);

  const handleLoadSet = async () => {
    //console.log(`handleLoadSet ${selectedSet ? selectedSet : 'no selectedSet'}`);
    if (!selectedSet) {
      alert('No set selected.');
      return;
    }

    try {
      const data = await loadNamedSet(selectedSet);
      //console.log(`[LoadSet] Data returned:`, data);

      if (!data.success) {
        alert(data.message || 'Failed to load set.');
        return;
      }

      setInitialVault(data.vault || '');
      setInitialWallets((data.wallets || []).join('\n'));
      setCurrentSetName(data.name);

      onSetLoaded?.(data.vault || '', (data.wallets || []).join('\n'), data.name);
      setLoadModalOpen(false);
    } catch {
      alert('Error loading set.');
    }
  };

  const saveSet = async () => {
    const name = saveName.trim();

    const walletList = Array.isArray(walletsText)
      ? walletsText
      : walletsText.split(/\s+/).map(w => w.trim()).filter(Boolean);

    if (!name || (!vault && walletList.length === 0)) return;

    try {
      const data = await saveNamedSet(name, vault, walletList);
      if (data.success !== false) {
        setCurrentSetName(name);
        console.log(`saved set: ${name}`);
        onNameChange?.(name); // ✅ Inform parent so subtitle updates
        setInitialVault(vault);
        setInitialWallets(walletsText);
        setSaveModalOpen(false);
        onSetSaved?.(name);

        const updated = await listSavedSets();
        setSetList(updated.sets || []);
        setSelectedSet(name);
      } else {
        alert(data.message || 'Failed to save set');
      }
    } catch {
      alert('Error saving set.');
    }
  };

  const confirmDeleteSet = async () => {
    try {
      const data = await deleteNamedSet(selectedSet);
      if (data.success) {
        setConfirmModalOpen(false);

        const updated = await listSavedSets();
        const newList = updated.sets || [];
        setSetList(newList);

        if (selectedSet === currentSetName) setCurrentSetName('');
        if (!newList.includes(selectedSet)) {
          setSelectedSet(newList[0] || '');
        }

        setLoadModalOpen(true);
      } else {
        alert(data.message || 'Failed to delete set.');
      }
    } catch {
      alert('Error deleting set.');
    }
  };

  const showDeleteConfirmation = () => {
    console.log('[Delete Modal] Triggered');
    const loadModal = document.getElementById('LoadSetsModal');
    if (loadModal) loadModal.classList.remove('active');
    setLoadModalOpen(false);
    setConfirmModalOpen(true);
  };

  return (
    <>
      {loadModalOpen && (
        <div id="LoadSetsModal" className="modal-set active">
          <div className="box-container">
            <h2 className="load-title">Load Address Set</h2>

            <div className="select-row">
              <button
                className="icon-button"
                id="deleteSetIcon"
                title="Delete Set"
                onClick={showDeleteConfirmation}
              >
                <img src="/icons/bin.png" alt="Delete" />
              </button>

              <div className="select-wrapper">
                <select
                  id="savedSetSelect"
                  value={selectedSet}
                  onChange={e => setSelectedSet(e.target.value)}
                >
                  {setList.length === 0 ? (
                    <option disabled>(no sets found)</option>
                  ) : (
                    setList.map(name => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button onClick={handleLoadSet} disabled={!selectedSet}>Load</button>
              <button onClick={() => setLoadModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {saveModalOpen && (
        <div id="saveSetsModal" className="modal-set active">
          <div className="box-container">
            <h2 style={{ color: 'white', textAlign: 'center' }}>Save Address Set</h2>
            <label htmlFor="saveSetName">Set Name:</label>
            <input
              type="text"
              id="saveSetName"
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              autoComplete="off"
              placeholder="Enter a name for this set"
              style={{ marginTop: 10 }}
            />
            <div style={{ marginTop: 20 }}>
              <button onClick={saveSet}>Save</button>
              <button onClick={() => setSaveModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {confirmModalOpen && (
        <div
          id="confirmDeleteModal"
          className="modal-set active"
          style={{ display: 'block' }}
        >
          <div className="box-container">
            <h3 style={{ textAlign: 'center' }}>Delete Address Set</h3>
            <p style={{ textAlign: 'center', marginTop: 10 }}>
              Are you sure you want to delete <strong>{selectedSet}</strong>?
            </p>
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button onClick={confirmDeleteSet}>Yes, Delete</button>
              <button
                onClick={() => {
                  setConfirmModalOpen(false);
                  setLoadModalOpen(true);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

