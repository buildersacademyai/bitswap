"use client"
import { useState, useEffect } from 'react';
import Button from './_components/Button';
import { BiLoaderAlt } from 'react-icons/bi';
import { bytesToUtf8, hexToBytes } from '@stacks/common';

const WalletConnector = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDisconnecting, setIsDisconnecting] = useState(false);

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
        const storedSession = localStorage.getItem('@stacks/connect');
        const hex = JSON.parse(bytesToUtf8(hexToBytes(storedSession)));
        console.log('hello session data' )
        if (storedSession) {
            setAddress(hex.addresses.stx[0].address);
            setIsConnected(true);
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
    console.log("hello connect")
    try {
      const { isConnected, connect, getLocalStorage} = await import('@stacks/connect');

      if (!isConnected()) {
        const response = await connect();
        const data = getLocalStorage();

        console.log("response", response)
        console.log("isConneted", isConnected())
        console.log("data", data);

        console.log("Data stx", data.addresses.stx[0].address)
        setAddress(data.addresses.stx.address)
        setIsConnected(true)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      setErrorMessage(`Wallet connection error: ${error.message || 'Unknown error'}`);
      setIsLoading(false);
    }
  };


  const disconnectWallet = () => {
    try {
      setIsDisconnecting(true);
      
      // Simulate delay to show loading spinner
      setTimeout( async () => {
        const { disconnect } = await import('@stacks/connect');
        
        disconnect();
        setIsConnected(false);
        setAddress(null);
        setIsDisconnecting(false);
        console.log('Wallet disconnected'); 
      }, 1000);
      
    } catch (error) {
      console.error('Error during disconnect:', error);
      setErrorMessage(`Error during disconnect: ${error.message}`);
      setIsDisconnecting(false);
    }
  };

  const togglePoolActivation = async () => {

    const { request } = await import('@stacks/connect');

    const response = await request('stx_callContract', {
      contractAddress: 'ST1VZ3YGJKKC8JSSWMS4EZDXXJM7QWRBEZ0ZWM64E',
      contractName: 'bit-swap',
      functionName: 'toggle-pool-active',
      functionArgs: [null], // array of Clarity values
      network: 'testnet'
    });
    
    console.log('Transaction ID:', response.txid)
  }

  const buttonClasses = "w-full cursor-pointer text-white flex justify-center items-center";

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
        <div className='w-full'>
          <Button className={buttonClasses} onClick={disconnectWallet}>
            <div className='flex items-center gap-2'>
              {/* {address} */}
              Disconnect
              {isDisconnecting && <BiLoaderAlt className="animate-spin ml-2" />}
            </div>
          </Button>
        </div>
      ) : (
        <Button className={buttonClasses} onClick={connectWallet}>
          <div className='flex items-center gap-2'>
            Connect Wallet
            {isLoading && <BiLoaderAlt className="animate-spin ml-2" />}
          </div>
        </Button>
      )}
    </div>
  );
};

export default WalletConnector;