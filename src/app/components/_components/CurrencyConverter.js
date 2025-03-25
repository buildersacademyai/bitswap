
"use client"
import { useEffect, useState } from 'react';

const CurrencyConverter = () => {
  const [btcPrice, setBtcPrice] = useState(null);
  const [stxPrice, setStxPrice] = useState(null);

  useEffect(() => {
    const btcSocket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
    const stxSocket = new WebSocket('wss://stream.binance.com:9443/ws/stxusdt@ticker');

    btcSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setBtcPrice(data.c); // 'c' is the current price from Binance WebSocket
    };

    stxSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStxPrice(data.c); // 'c' is the current price from Binance WebSocket
    };

    // Clean up the WebSocket connections on component unmount
    return () => {
      btcSocket.close();
      stxSocket.close();
    };
  }, []);

  if (!btcPrice || !stxPrice) return <p>Loading...</p>;

  return (
    <div>
      <h1>Currency Conversion</h1>
      <p>Bitcoin (BTC) Price: ${btcPrice}</p>
      <p>Stacks (STX) Price: ${stxPrice}</p>
      <div>
        {/* Add currency conversion logic here */}
      </div>
    </div>
  );
};

export default CurrencyConverter;
