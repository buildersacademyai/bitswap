// File: app/components/Wallet.jsx
'use client';

import { useState, useEffect } from 'react';
import Button from './_components/Button';

// Create a component that safely integrates with the Leather wallet
const WalletConnector = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Add a crypto shim directly in the component
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Ensure global.crypto exists for libraries that use it
      if (!global.crypto) {
        global.crypto = {};
      }
      
      // Ensure window.crypto exists
      if (!window.crypto) {
        window.crypto = {};
      }
      
      // Add getRandomValues if needed
      if (!window.crypto.getRandomValues) {
        window.crypto.getRandomValues = function(array) {
          for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
          }
          return array;
        };
      }
      
      // Check for previous connection
      try {
        const storedSession = localStorage.getItem('stacks-session');
        if (storedSession) {
          const parsed = JSON.parse(storedSession);
          if (parsed && parsed.profile && parsed.profile.stxAddress) {
            setAddress(parsed.profile.stxAddress.mainnet);
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
      // Wrap in try-catch to handle potential errors
      const connect = async () => {
        try {
          // Dynamic import with explicit error handling
          const stacksConnectModule = await import('@stacks/connect');
          if (!stacksConnectModule || !stacksConnectModule.showConnect) {
            throw new Error('Failed to load @stacks/connect module');
          }
          
          return stacksConnectModule.showConnect;
        } catch (err) {
          console.error('Error importing @stacks/connect:', err);
          throw new Error(`Import error: ${err.message}`);
        }
      };
      
      // Get the connect function
      const showConnect = await connect();
      
      // Use the connect function with full error handling
      showConnect({
        appDetails: {
          name: 'My Next.js App',
          icon: '/logo.svg',
        },
        redirectTo: '/',
        onFinish: (data) => {
          try {
            console.log('Authentication successful', data);
            localStorage.setItem('stacks-session', JSON.stringify(data));
            setAddress(data.profile.stxAddress.mainnet);
            setIsConnected(true);
          } catch (err) {
            setErrorMessage(`Error processing authentication: ${err.message}`);
          } finally {
            setIsLoading(false);
          }
        },
        onCancel: () => {
          console.log('Authentication canceled');
          setIsLoading(false);
        },
        // Handle any errors in the connect process
        onRejection: (rejection) => {
          console.error('Authentication rejected', rejection);
          setErrorMessage(`Wallet rejected connection: ${rejection}`);
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error('Connection error details:', error);
      setErrorMessage(`Wallet connection error: ${error.message || 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    try {
      localStorage.removeItem('stacks-session');
      // Clean up any other stored data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('blockstack-') || key.startsWith('stacks-')) {
          localStorage.removeItem(key);
        }
      });
      setIsConnected(false);
      setAddress(null);
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
          <p>Connected: {address}</p>
          <Button className="w-full cursor-pointer" onClick={disconnectWallet}>Disconnect Wallet</Button>
        </div>
      ) : (
        <Button className="w-full cursor-pointer"  onClick={connectWallet}>Connect  Wallet</Button>
      )}
    </div>
  );
};

export default WalletConnector;