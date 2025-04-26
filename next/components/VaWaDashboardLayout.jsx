import Head from 'next/head';
import { performLogout } from '../lib/apiClient';
import { useDashboardSession } from '../lib/DashboardSessionContext';
import DetailsModal from './DetailsModal';
import { useState, useEffect } from 'react';

export default function VaWaDashboardLayout({ children }) {
  const { stage } = useDashboardSession();
  const canGoBack = stage === 'details';
  const isLoggedIn = stage === 'dashboard' || stage === 'details';

  const [modalState, setModalState] = useState(null);

  useEffect(() => {
    window.VaWaModal = {
      open: (type, grouping, vault, wallets) => {
        setModalState({ type, grouping, vault, wallets });
      }
    };
  }, []);

  const handleBack = () => {
    if (canGoBack) window.location.href = '/';
  };

  const handleLogout = async () => {
    try {
      await performLogout();
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Logout failed');
    }
  };

  return (
    <div id="main-wrapper">
      <div className="logo-container">
        <img src="/images/logo.png" alt="VaWa Logo" className="vawa-logo" />
        <span className="version-text"></span>
      </div>

      <div id="header">
        <button
          id="backBtn"
          className={`header-btn ${!canGoBack ? 'button-disabled' : ''}`}
          disabled={!canGoBack}
          onClick={handleBack}
        >
          Back
        </button>

        <h1>Vault & Wallet Details</h1>

        <button
          id="logoutBtn"
          className={`header-btn ${!isLoggedIn ? 'button-disabled' : ''}`}
          disabled={!isLoggedIn}
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>

      <div id="content">{children}</div>

      {modalState && modalState.type && (
        <DetailsModal
          type={modalState.type}
          grouping={modalState.grouping}
          vault={modalState.vault}
          wallets={modalState.wallets}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  );
}

