"use client"
import { useState, useRef, useEffect } from "react";
import {FaTools, FaExclamationCircle } from "react-icons/fa";
import { RxReset } from "react-icons/rx";
import { CgArrowsExchangeAltV, } from "react-icons/cg";
import {  BiChevronDown } from "react-icons/bi";
import { AiOutlineStock, AiOutlineSwap } from "react-icons/ai";
import Section from "./_components/Section.jsx";

import {currencyIcons,exchangeRates, currencies} from "../assets/index.js"
import { BottomLine } from "../components/design/Hero.jsx";
import Button from "./_components/Button.jsx";
import Logo from "./_components/Logo.jsx"

import useCryptoPrices from "./useCryptoPrices.js";

const Hero = () => {

  const [selling, setSelling] = useState("BTC");
  const [buying, setBuying] = useState("STX");
  const [amount, setAmount] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [isSellingDropdownOpen, setIsSellingDropdownOpen] = useState(false);
  const [isBuyingDropdownOpen, setIsBuyingDropdownOpen] = useState(false);

  const sellingDropdownRef = useRef(null);
  const buyingDropdownRef = useRef(null);

  const { btcPrice, stxPrice, usdcPrice } = useCryptoPrices();

   const calculateUSDValue = (amount, currency) => {
    if (!amount) return 0;

    switch(currency) {
      case "BTC":
      case "SBTC":
        return parseFloat(amount) * btcPrice;
      case "STX":
        return parseFloat(amount) * stxPrice;
      case "USDC":
        return parseFloat(amount);
      default:
        return parseFloat(amount) * (exchangeRates[currency]?.["USDC"] || 1);
    }
  };

 useEffect(() => {
  if (amount && !isNaN(amount) && btcPrice && stxPrice) {
    let convertedAmount;
    
    if ((selling === "BTC" || selling === "SBTC") && buying === "STX") {
      convertedAmount = (parseFloat(amount) * btcPrice / stxPrice).toFixed(4);
    } else if (selling === "STX" && (buying === "BTC" || buying === "SBTC")) {
      convertedAmount = (parseFloat(amount) * stxPrice / btcPrice).toFixed(4);
    } else if ((selling === "BTC" || selling === "SBTC") && (buying === "BTC" || buying === "SBTC")) {
      convertedAmount = parseFloat(amount).toFixed(4);
    } else {
      const rate = exchangeRates[selling][buying];
      convertedAmount = (parseFloat(amount) * rate).toFixed(4);
    }
    
    setReceivedAmount(convertedAmount);
  } else {
    setReceivedAmount("");
  }
}, [amount, selling, buying, btcPrice, stxPrice]);

  const handleReset = () => {
    setAmount(""); 
    setReceivedAmount(""); 
    setSelling("BTC");
    setBuying("STX");
  };

  const handleExchange = () => {
    const temp = selling;
    setSelling(buying);
    setBuying(temp);
    
    if (amount && !isNaN(amount)) {
      setAmount(receivedAmount);
    } else {
      setAmount("");
      setReceivedAmount("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sellingDropdownRef.current &&
        !sellingDropdownRef.current.contains(event.target) &&
        buyingDropdownRef.current &&
        !buyingDropdownRef.current.contains(event.target)
      ) {
        setIsSellingDropdownOpen(false);
        setIsBuyingDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!btcPrice || !stxPrice) {
    return (
      <Section className="relative h-screen flex items-center justify-center">
        <div className="text-white">Loading real-time prices...</div>
      </Section>
    );
  }

  const togglePoolActivation = async () => {
    try {
      const { request } = await import('@stacks/connect');

    const response = await request('stx_callContract', {
      contract:  'ST1VZ3YGJKKC8JSSWMS4EZDXXJM7QWRBEZ0ZWM64E.bit-swap',
      // contractAddress: 'ST1VZ3YGJKKC8JSSWMS4EZDXXJM7QWRBEZ0ZWM64E',
      // contractName: 'bit-swap',
      functionName: 'toggle-pool-active',
      functionArgs: [], // array of Clarity values
      network: 'testnet'
    });
    
    console.log('Transaction ID:', response.txid)
    } catch (error) {
      console.error('Wallet returned an error:', error);
    }
    
  }

  return (
    <Section
      className="relative h-screen flex items-center justify-center overflow-hidden pt-12 -mt-[5.25rem] "
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      
      {/* Swap UI - Centered */}
      <div className="w-[450px] bg-gray-800 p-8 rounded-lg shadow-lg text-white relative z-10 mt-10 ">
        <Logo/>


        <div className="flex justify-center items-center mb-4 mx-2 mt-4">
          <span className="text-green-400 font-sans font-semibold flex flex-row items-center justify-center gap-2 hover:cursor-pointer">
          <AiOutlineStock size={22} /> Trading
          </span>
        </div>

        {/* Swap Box with Dropdowns */}
        <div className="bg-gray-700 p-4 rounded-lg relative">
          <div className="flex justify-between items-center relative text-xs font-sans">
            <span>From:</span>
          </div>
          <div className="flex flex-row items-center justify-center py-2">
            <div className="relative" ref={sellingDropdownRef}>
              <button
                onClick={() => {
                  setIsSellingDropdownOpen(!isSellingDropdownOpen);
                  setIsBuyingDropdownOpen(false); 
                }}
                className=" text-white w-32 px-4 py-2 rounded-md bg-green-500/70 transition-all duration-100 flex items-center gap-2"
              >
                {currencyIcons[selling]}
                {selling}
                <BiChevronDown size={20} />
              </button>
              {isSellingDropdownOpen && (
                <div className="absolute bg-gray-900 border border-gray-600 rounded-md mt-1 w-32 z-30">
                  {currencies.map((currency) => (
                    <div
                      key={currency}
                      onClick={() => {
                        setSelling(currency);
                        setIsSellingDropdownOpen(false);
                      }}
                      className={`px-4 py-2 hover:bg-green-500/70 cursor-pointer flex items-center gap-2 border-b-2 border-gray-800 ${
                        selling === currency ? "bg-green-500/70" : ""
                      }`}
                    >
                      {currencyIcons[currency]}
                      {currency}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
               type="number"
               placeholder="0.00"
               className="w-full bg-transparent text-white text-2xl p-2 outline-none text-right"
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
               style={{
                  WebkitAppearance: "none",
                  MozAppearance: "textfield", 
                appearance: "none",     
                  margin: 0,
                  paddingRight: "1rem",      
                }}
              />
          </div>
          <span className="flex items-center justify-end text-xs text-gray-400">
          {amount ? (
              <span>
                ${calculateUSDValue(amount, selling).toFixed(4)} USD
              </span>
            ) : (
              <span></span>
            )}
          </span>

          {/* Exchange Icon with Reset Button */}
          <div className="flex justify-center items-center relative z-20 mt-8">
            <hr className="border-2 w-full rounded-full" />
            <div 
              className="bg-gray-800 rounded-full p-3 absolute -my-6 text-purple-400/90 hover:border-purple-600 hover:bg-purple-600 border-gray-900 border-2 cursor-pointer transition-all duration-150 "
              onClick={handleExchange}
            >
              <div className="relative flex items-center">
                <button className="transition-all duration-75 text-white cursor-pointer">
                  <CgArrowsExchangeAltV className="text-xl" size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center relative mt-8 text-xs font-sans">
            <span>To:</span>
          </div>
          <div className="flex flex-row items-center justify-center py-2">
            <div className="relative" ref={buyingDropdownRef}>
              <button
                onClick={() => {
                  setIsBuyingDropdownOpen(!isBuyingDropdownOpen);
                  setIsSellingDropdownOpen(false); // Close the other dropdown
                }}
                className="text-white w-32 px-4 py-2 rounded-md bg-purple-600 hover:border-purple-600 transition-all duration-100 flex items-center gap-2"
              >
                {currencyIcons[buying]}
                {buying}
                <BiChevronDown size={20} />
              </button>
              {isBuyingDropdownOpen && (
                <div className="absolute bg-gray-900 border border-gray-600 rounded-md mt-1 w-32 z-10">
                  {currencies.map((currency) => (
                    <div
                      key={currency}
                      onClick={() => {
                        setBuying(currency);
                        setIsBuyingDropdownOpen(false);
                      }}
                      className={`px-4 py-2 hover:bg-purple-600 cursor-pointer flex items-center gap-2 border-b-2 border-gray-800 ${
                        buying === currency ? "bg-purple-600" : ""
                      }`}
                    >
                      {currencyIcons[currency]}
                      {currency}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="0.00"
              className="w-full bg-transparent text-white text-2xl p-2 outline-none text-right"
              value={receivedAmount}
              readOnly
              style={{ WebkitAppearance: "none", margin: 0 }}
            />
          </div>
          <div className="flex justify-between items-center">
            {/* Left side: Additional charge message */}
            <span className="flex items-center text-xs mt-2 gap-1 text-gray-400">
              <FaExclamationCircle /> Additional 5% charge is incurred.
            </span>

            {/* Right side: Converted amount */}
            {receivedAmount ? (
              <div className="flex items-center justify-end text-xs text-gray-400">
                 <span>
        ${(
          parseFloat(receivedAmount) *
          exchangeRates[buying]["USDC"]
        ).toFixed(4)} USD
      </span>
    </div>
  ) : (
    <span></span>
            )}
          </div>
        </div>

        {/* Slippage & Routing */}
        <div className="flex justify-between items-center text-sm text-gray-400 my-3">
          <div className="flex justify-start items-center text-sm text-gray-400 my-3 gap-2">
            <span>
              <FaTools size={17} className="" />
            </span>
            :
            <span className="border rounded-full text-[10px] py-1 px-2 cursor-pointer text-amber-400/90 border-amber-400/90 hover:text-amber-300 hover:bg-orange-500/10 transition-all duration-100">
              Slippage: 0.5%
            </span>
            <span className="border rounded-full text-[10px] py-1 px-2 cursor-pointer text-amber-400/90 border-amber-400/90 hover:text-amber-300 hover:bg-orange-500/10 transition-all duration-100">
              Routing: Auto
            </span>
          </div>
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-full cursor-pointer justify-end"
          >
            <RxReset />
          </button>
        </div>

        {/* Connect Wallet Button */}
        <Button className="w-full cursor-pointer flex items-center gap-2" onClick={togglePoolActivation}>
          <div className="flex items-center gap-2 font-sans ">
          Swap <AiOutlineSwap size={20} />
          </div>
        </Button>
      </div>

      <BottomLine />

      <style jsx global>{`
        .logo-scroll-container {
          display: flex;
          position: absolute;
          animation: seamlessScroll 30s linear infinite;
          width: max-content;
        }

        @keyframes seamlessScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Remove spinner buttons from number input */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </Section>
  );
};

export default Hero;