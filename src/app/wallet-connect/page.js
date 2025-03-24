// File: app/wallet-connect/page.js
import WalletConnector from '../components/Wallet';
import WalletTroubleshooter from '../components/WalletTroubleshooter';

export default function WalletPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Leather Wallet Connection</h1>
      
      <div className="mb-8">
        <WalletConnector />
      </div>
      
      <hr className="my-8" />
      
      <WalletTroubleshooter />
    </div>
  );
}