'use client';

/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * Main entry point for the VaWa React app.
 * It handles login, session detection, confirmation, and dashboard rendering.
 */

import { useState } from 'react';
import LoginModal from '../components/LoginModal';
import ConfirmModal from '../components/ConfirmModal';
import VaWaDashboardLayout from '../components/VaWaDashboardLayout';
import DashboardInputForm from '../components/DashboardInputForm';
import DashboardWithNames from '../components/DashboardWithNames';
import SectionRenderer from '../components/SectionRenderer';
import DashboardSetModals from '../components/DashboardSetModals';
import { DashboardSessionProvider, useDashboardSession } from '../lib/DashboardSessionContext';
import { performLogin } from '../lib/apiClient';

export default function HomePage() {
  return (
    <DashboardSessionProvider>
      <DashboardContent />
    </DashboardSessionProvider>
  );
}

function DashboardContent() {
  const { stage, setStage, dashboardData, setDashboardData } = useDashboardSession();
  const [email, setEmail] = useState(null);
  const [sectionData, setSectionData] = useState(null);

  const handleLogin = async (email, keepLoggedIn) => {
    try {
      const data = await performLogin(email, keepLoggedIn);
      if (data.success) {
        setEmail(email);
        setStage('confirm');
      } else {
        alert('Login failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login error');
    }
  };

  const handleDataLoaded = (result) => {
    setSectionData(result);
    setStage('details');
  };

  if (stage === 'checking') {
    return <p style={{ color: 'white' }}>🔄 Checking session...</p>;
  }

  if (stage === 'login') {
    return (
      <VaWaDashboardLayout>
        <LoginModal onSubmit={handleLogin} />
      </VaWaDashboardLayout>
    );
  }

  if (stage === 'confirm') {
    return (
      <VaWaDashboardLayout>
        <ConfirmModal email={email} />
      </VaWaDashboardLayout>
    );
  }

  if ((stage === 'dashboard' || stage === 'details') && dashboardData) {
    return (
      <VaWaDashboardLayout>
        {!sectionData && (
          <DashboardInputForm
            initialVault={dashboardData.vault}
            initialWallets={dashboardData.wallets}
            initialSetName={dashboardData.setName}
            onDataLoaded={handleDataLoaded}
          />
        )}
        {sectionData && (
          <DashboardWithNames data={sectionData}>
            <SectionRenderer data={sectionData} />
          </DashboardWithNames>
        )}
        <DashboardSetModals
          vault={dashboardData.vault}
          walletsText={dashboardData.wallets}
          onSetLoaded={(vault, wallets, name) => {
            console.log('[Set Loaded] vault:', vault, 'wallets:', wallets, 'name:', name);
            setDashboardData({
              vault,
              wallets: wallets.split(/\s+/).filter(Boolean),
              setName: name,
            });
          }}
          onSetSaved={(name) => {
            console.log('[Set Saved]', name);
            setDashboardData(prev => ({ ...prev, setName: name }));
          }}
          onNameChange={(newName) => {
            console.log('[Set Name Changed]', newName);
            setDashboardData(prev => ({ ...prev, setName: newName }));
          }}          
        />
      </VaWaDashboardLayout>
    );
  }

  return null;
}

