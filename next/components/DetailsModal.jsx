'use client';

/**
 * Author: Dr. Martín Raskovsky
 * Date: April 2025
 *
 * DetailsModal.jsx
 *
 * Displays token-level details based on JSON returned by `/api/getDetails`.
 * Converts each type (e.g., VTRU Staked, VIBE) into JSX using dedicated renderers.
 */

import { useEffect, useState } from 'react';
import {
  renderVtruStaked,
  renderVibeDetails,
  renderBscStaked,
  renderVortexDetails,
  renderSevoDetails
} from './DetailsRenderers';
import { loadSectionDetails } from '../lib/apiClient';

export default function DetailsModal({ type, grouping, vault, wallets, onClose }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSectionDetails(type, grouping, vault, wallets)
      .then(setData)
      .catch(err => {
        console.error('❌ Error loading details modal:', err);
        setError('Failed to load details.');
      });
  }, [type, grouping, vault, wallets]);

  let content;
  if (error) {
    content = <h3 style={{ color: 'red' }}>{error}</h3>;
  } else if (!data) {
    content = <h3>Loading...</h3>;
  } else {
    switch (type) {
      case 'stake':   content = renderVtruStaked(data, grouping); break;
      case 'vibe':    content = renderVibeDetails(data, grouping); break;
      case 'bsc':     content = renderBscStaked(data, grouping); break;
      case 'vortex':  content = renderVortexDetails(data, grouping); break;
      case 'sevo':    content = renderSevoDetails(data, grouping); break;
      default:
        content = <h3>Unknown detail type: {type}</h3>;
    }
  }

  return (
    <div className="modal active">
      <div className="modal-content">
        <span className="close" onClick={onClose}>×</span>
        {content}
      </div>
    </div>
  );
}

