import './globals.css';

export const metadata = {
  title: 'Vault & Wallet Details',
  description: 'Vitruveo Web3 App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
