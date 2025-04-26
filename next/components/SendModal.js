import React from 'react';
import { ethers } from 'ethers';
import erc20Abi from '../abi/erc20.json';
import { contractMap } from '../generated/contractMap';
import { contractAbis } from '../generated/contractAbis';

const SendModal = ({ data, onClose }) => {
  const { from, to } = data;

  const handleSubmit = async () => {
    try {
      if (!window.ethereum) {
        alert("🦊 MetaMask not found");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const connectedAddress = await signer.getAddress();
      
      if (connectedAddress.toLowerCase() !== from.address.toLowerCase()) {
        alert(`🚫 Please switch MetaMask to: ${from.address}`);
        return;
      }
      
      const amountStr = prompt(`How much ${from.symbol} to send?`, from.formattedBalance);
      if (!amountStr) return;
      
      const contractEntry = contractMap[from.symbol] || {};
      const { contractId, network, address: contractAddress, isNative } = contractEntry;
      
      const nativeBalance = await provider.getBalance(connectedAddress);
      console.log("⛽ Native Balance:", nativeBalance.toString());
      
      console.log("🪙 Token Symbol:", from.symbol);
      console.log("🆔 Contract ID:", contractId);
      console.log("🌐 Network:", network);
      console.log("🎯 Recipient:", to.address);
      console.log("  isNative:", isNative);
      
      if (!isNative && contractAddress) {
        // 🪙 ERC-20 Transfer
        console.log("📜 Contract Address:", contractAddress);
        const contractAbi = contractAbis[from.symbol];
        if (!contractAbi) {
          console.warn(`⚠️ ABI not found for ${from.symbol} — using standard ERC-20 ABI as fallback`);
        }
        
        const abiToUse = contractAbi || erc20Abi;
        console.log("📜 Contract Address:", contractAddress);
        console.log("🔍 ABI includes 'decimals':", abiToUse.some(f => f.name === 'decimals'));
        console.log("Using ABI for:", from.symbol, abiToUse);
        
        const contract = new ethers.Contract(contractAddress, abiToUse, signer);
        
        let decimals = 18; // fallback
        
        try {
          const tokenSymbol = await contract.symbol?.();
          const testBalance = await contract.balanceOf?.(connectedAddress);
          if (tokenSymbol) console.log(`🧪 Symbol: ${tokenSymbol}`);
          if (testBalance) console.log(`🧪 Your balance: ${testBalance.toString()}`);
        
          if (typeof contract.decimals === 'function') {
            decimals = await contract.decimals();
          } else {
            console.warn(`⚠️ decimals() not found in ABI for ${from.symbol}, using fallback: ${decimals}`);
          }
        } catch (e) {
          console.error(`❌ Failed to query contract for ${from.symbol}:`, e);
        }
        
        console.log(`🔢 Decimals for ${from.symbol}:`, decimals);
      
        const value = ethers.parseUnits(amountStr, decimals);
      
        if (nativeBalance < BigInt(10000000000000000)) { // ~0.01 ETH / VTRU gas buffer
          alert("❌ Insufficient gas balance for ERC-20 transfer.");
          return;
        }
      
        try {
          const tx = await contract.transfer(to.address, value);
          alert(`✅ ERC-20 Transfer Sent\nHash: ${tx.hash}`);
        } catch (err) {
          console.error("❌ ERC-20 Transfer Error:", err);
          alert(`❌ ERC-20 Transfer Failed:\n${err.reason || err.message}`);
        }
      
      } else {
        // ⛽ Native Token Transfer
        console.log("📜 Native Transfer for", from.symbol);
      
        const gasLimit = BigInt(21000);
        const gasPriceHex = await provider.send("eth_gasPrice", []);
        const gasPrice = BigInt(gasPriceHex); // convert hex string to bigint
        const estimatedGasFee = gasLimit * gasPrice;
        
        const value = ethers.parseEther(amountStr); // also bigint
        
        if (nativeBalance < value + estimatedGasFee) {
          alert(`❌ Not enough ${from.symbol} to send ${amountStr} and cover fees.`);
          return;
        }

        try {
          const tx = await signer.sendTransaction({ to: to.address, value });
          alert(`✅ Native Token Sent\nHash: ${tx.hash}`);
        } catch (err) {
          console.error("❌ Native Transfer Error:", err);
          alert(`❌ Native Transfer Failed:\n${err.reason || err.message}`);
        }
      }
      
      onClose();
      
    } catch (err) {
      console.error("❌ Unexpected Error:", err);
      alert(`❌ Error:\n${err.message}`);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'white', padding: '2rem', borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)', maxWidth: '420px'
      }}>
        <h2>Send {from.symbol}</h2>
        <p><strong>From:</strong> {from.address}</p>
        <p><strong>Balance:</strong> {from.formattedBalance} {from.symbol}</p>
        <p><strong>To:</strong> {to.address}</p>
        <button onClick={handleSubmit} style={{ marginRight: '1rem' }}>🚀 Send</button>
        <button onClick={onClose}>❌ Cancel</button>
      </div>
    </div>
  );
};

export default SendModal;

