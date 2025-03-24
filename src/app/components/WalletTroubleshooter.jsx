// File: app/components/WalletTroubleshooter.jsx
'use client';

import { useState, useEffect } from 'react';

const WalletTroubleshooter = () => {
  const [diagnostics, setDiagnostics] = useState({
    browserInfo: 'Checking...',
    extensionInjection: 'Checking...',
    windowExists: 'Checking...',
    cryptoExists: 'Checking...',
    localStorage: 'Checking...',
    stacksConnect: 'Checking...'
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      const results = {
        browserInfo: `${navigator.userAgent}`,
        windowExists: typeof window !== 'undefined' ? 'Yes' : 'No',
        extensionInjection: 'No',
        cryptoExists: 'No',
        localStorage: 'No',
        stacksConnect: 'Not loaded'
      };

      // Check for extension injection
      if (typeof window !== 'undefined') {
        if (window.StacksProvider) {
          results.extensionInjection = 'Yes - StacksProvider detected';
        } else if (window.BlockstackProvider) {
          results.extensionInjection = 'Yes - BlockstackProvider detected (legacy)';
        } else {
          results.extensionInjection = 'No - Neither StacksProvider nor BlockstackProvider detected';
        }

        // Check crypto object
        if (window.crypto) {
          results.cryptoExists = 'Yes';
          if (window.crypto.getRandomValues) {
            results.cryptoExists += ' (with getRandomValues)';
          } else {
            results.cryptoExists += ' (without getRandomValues)';
          }
        }

        // Check localStorage
        try {
          localStorage.setItem('test', 'test');
          localStorage.removeItem('test');
          results.localStorage = 'Yes - Working correctly';
        } catch (e) {
          results.localStorage = `No - Error: ${e.message}`;
        }
      }

      // Try to load @stacks/connect
      try {
        const stacksConnect = await import('@stacks/connect');
        const availableMethods = Object.keys(stacksConnect).join(', ');
        results.stacksConnect = `Loaded - Available methods: ${availableMethods}`;
      } catch (e) {
        results.stacksConnect = `Error loading: ${e.message}`;
      }

      setDiagnostics(results);
    };

    runDiagnostics();
  }, []);

  return (
    <div className="wallet-troubleshooter">
      <h2>Leather Wallet Connection Troubleshooter</h2>
      <div>
        <h3>Browser Information:</h3>
        <pre>{diagnostics.browserInfo}</pre>
        
        <h3>Window Object:</h3>
        <pre>{diagnostics.windowExists}</pre>
        
        <h3>Wallet Extension Detection:</h3>
        <pre>{diagnostics.extensionInjection}</pre>
        
        <h3>Crypto API:</h3>
        <pre>{diagnostics.cryptoExists}</pre>
        
        <h3>LocalStorage:</h3>
        <pre>{diagnostics.localStorage}</pre>
        
        <h3>@stacks/connect Package:</h3>
        <pre>{diagnostics.stacksConnect}</pre>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Troubleshooting Steps:</h3>
        <ol>
          <li>Make sure Leather Wallet is installed and enabled in Chrome</li>
          <li>Try restarting your browser completely</li>
          <li>Check if you have any extensions that might block scripts or the wallet</li>
          <li>Make sure your Leather Wallet is unlocked</li>
          <li>Try visiting <a href="https://wallet.hiro.so" target="_blank" rel="noopener noreferrer">wallet.hiro.so</a> to verify your wallet is working</li>
        </ol>
      </div>
    </div>
  );
};

export default WalletTroubleshooter;