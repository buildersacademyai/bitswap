import React from 'react'
import { showConnect } from '@stacks/connect';
import { userSession } from './auth';
import {
  makeContractCall,
  stringUtf8CV,
  PostConditionMode,
} from '@stacks/transactions';

const blockchain = () => {
  //Stack Blockchain
  const contractAddress = 'SP3A50VHH8PMG7DARMZ7MKKJZH6XBTYYYQ0XG5KZA';
  const contractName = 'my-contract';

  const handleConnnectBlockchain = async () => {
    showConnect({

      appDetails,
    
      userSession,
    
      onFinish: () => {
    
        const user = userSession.loadUserData();
    
        const address = user.profile.stxAddress.mainnet;
    
        // 'SP1MXSZF4NFC8JQ1TTYGEC2WADMC7Y3GHVZYRX6RF'
    
      },
    
    });
    
  }

  const callWriteFunction = async () => {
    try {
      const txOptions = {
        contractAddress,
        contractName,
        functionName: 'set-value',
        functionArgs: [stringUtf8CV('Hello Blockchain!')],
        senderKey: userSession.loadUserData().appPrivateKey,
        validateWithAbi: true,
        network: 'testnet',
        postConditionMode: PostConditionMode.Allow,
      };

      const transaction = await makeContractCall(txOptions);
      setTxResult(transaction.txid());
      console.log('Transaction ID:', transaction.txid());
    } catch (error) {
      console.error('Write function error:', error);
    }
  };
}

export default blockchain
