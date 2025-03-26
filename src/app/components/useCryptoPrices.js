import { useState, useEffect } from "react";

const useCryptoPrices = () => {
  const [btcPrice, setBtcPrice] = useState(0);
  const [stxPrice, setStxPrice] = useState(0);
  const [usdcPrice, setUsdcPrice] = useState(1); 

  useEffect(() => {
    const btcSocket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@ticker");
    const stxSocket = new WebSocket("wss://stream.binance.com:9443/ws/stxusdt@ticker");
    const usdcSocket = new WebSocket("wss://stream.binance.com:9443/ws/usdcusdt@ticker");

    btcSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setBtcPrice(parseFloat(data.c));
    };

    stxSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStxPrice(parseFloat(data.c));
    };

    usdcSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setUsdcPrice(parseFloat(data.c));
      usdcSocket.close(); 
    };

    return () => {
      btcSocket.close();
      stxSocket.close();
      usdcSocket.close();
    };
  }, []);

  return { btcPrice, stxPrice, usdcPrice };
};

export default useCryptoPrices;
