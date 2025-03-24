'use client';

import { useState, useEffect } from 'react';
import Button from './_components/Button';

const WalletConnector = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.crypto) {
        window.crypto = {};
      }
      if (!window.crypto.getRandomValues) {
        window.crypto.getRandomValues = (array) => {
          for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
          }
          return array;
        };
      }

      try {
        const storedSession = localStorage.getItem('stacks-session');
        if (storedSession) {
          const parsed = JSON.parse(storedSession);
          if (parsed?.profile?.stxAddress) {
            setAddress(parsed.profile.stxAddress.mainnet || parsed.profile.stxAddress.testnet);
            setIsConnected(true);
          }
        }
      } catch (error) {
        console.error('Error checking previous connection:', error);
      }

      setIsLoading(false);
    }
  }, []);

  const connectWallet = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const { showConnect } = await import('@stacks/connect');

      if (!showConnect) {
        throw new Error('Failed to load @stacks/connect module.');
      }

      showConnect({
        appDetails: { name: 'My Next.js App', icon: '/logo.svg' },
        redirectTo: '/',
        onFinish: (data) => {
          try {
            console.log('Raw Authentication Response:', data);
        
            if (!data) {
              throw new Error('Invalid response: No data received.');
            }
        
            if (!data.userSession) {
              throw new Error('Invalid response: Missing userSession.');
            }
        
            const userData = data.userSession.loadUserData();
            console.log('User Data:', userData);
        
            if (!userData.profile) {
              throw new Error('Invalid response: Missing profile.');
            }
        
            const stxAddress = userData.profile.stxAddress?.mainnet || 
                               userData.profile.stxAddress?.testnet ||
                               userData.profile?.addresses?.mainnet ||
                               userData.profile?.addresses?.testnet;
        
            if (!stxAddress) {
              throw new Error('Invalid authentication response: Missing stxAddress.');
            }
        
            localStorage.setItem('stacks-session', JSON.stringify(userData));
            setAddress(stxAddress);
            setIsConnected(true);
          } catch (err) {
            console.error('Error processing authentication:', err);
            setErrorMessage(`Error processing authentication: ${err.message}`);
          } finally {
            setIsLoading(false);
          }
        },
        onCancel: () => {
          console.log('Authentication canceled');
          setIsLoading(false);
        },
        onRejection: (rejection) => {
          console.error('Authentication rejected:', rejection);
          setErrorMessage(`Wallet rejected connection: ${rejection}`);
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error('Wallet connection error:', error);
      setErrorMessage(`Wallet connection error: ${error.message || 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    try {
      localStorage.removeItem('stacks-session');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('blockstack-') || key.startsWith('stacks-')) {
          localStorage.removeItem(key);
        }
      });
      setIsConnected(false);
      setAddress(null);
      console.log('Wallet disconnected'); 
    } catch (error) {
      console.error('Error during disconnect:', error);
      setErrorMessage(`Error during disconnect: ${error.message}`);
    }
  };

  if (isLoading) {
    return <Button className="w-full cursor-pointer">Establishing Connection...</Button>;
  }

  return (
    <div className="wallet-connector">
      {errorMessage && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {errorMessage}
          <br />
          <small>Try using a different browser or ensure Leather Wallet is installed and unlocked.</small>
        </div>
      )}

      {isConnected && address ? (
        <div>
          <p className='text-sm'>Connected: {address}</p>
          <Button className="w-full cursor-pointer" onClick={disconnectWallet}>
            Disconnect Wallet
          </Button>
        </div>
      ) : (
        <Button className="w-full cursor-pointer" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default WalletConnector;
