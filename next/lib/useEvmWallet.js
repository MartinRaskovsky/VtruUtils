// lib/useEvmWallet.js
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export default function useEvmWallet() {
  const [address, setAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [status, setStatus] = useState('disconnected');

  const connect = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed.");
      return;
    }

    try {
      setStatus('connecting');
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      setSigner(signer);
      setAddress(addr);
      setStatus('connected');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return { connect, signer, address, status };
}

