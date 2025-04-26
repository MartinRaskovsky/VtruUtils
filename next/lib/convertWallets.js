// src/next/lib/convertWallets.js
// Converts VaWa-style vault JSON (from getSections.js) into a wallet map
// suitable for rendering in the React UI

export default function convertWallets(raw) {
  console.log('[convertWallets] raw =', JSON.stringify(raw, null, 2));
  const wallets = raw.evm.wallets;
  const sections = Object.entries(raw.evm).filter(([key]) => key.startsWith('section'));

  const walletMap = {};

  wallets.forEach((address, idx) => {
    const tokens = sections.map(([sectionKey, balances]) => {
      const symbol = sectionKey.replace(/^section/, '');
      return {
        symbol,
        formattedBalance: balances[idx]
      };
    });

    walletMap[address] = { tokens };
  });

  return walletMap;
}

