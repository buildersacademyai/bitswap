"use client"
import { useState, useRef, useEffect } from "react";
import { FaFire, FaBell, FaRecycle, FaTools, FaExclamationCircle } from "react-icons/fa";
import { ScrollParallax } from "react-just-parallax";
import { RxReset } from "react-icons/rx";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import {  BiChevronDown, BiRocket } from "react-icons/bi";

import Section from "./_components/Section.jsx";
import { BottomLine } from "../components/design/Hero.jsx";
import WalletConnector from "./Wallet.jsx"
import {currencyIcons,allTitles,allLogos,allNumbers,logos,numbers,titles,exchangeRates} from "../assets/index.js"

const Hero = () => {
  const parallaxRef = useRef(null);
  const [selling, setSelling] = useState("BTC");
  const [buying, setBuying] = useState("STX");
  const [amount, setAmount] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [isSellingDropdownOpen, setIsSellingDropdownOpen] = useState(false);
  const [isBuyingDropdownOpen, setIsBuyingDropdownOpen] = useState(false);
  const currencies = [ "BTC", "STX", "SBTC"];

  const sellingDropdownRef = useRef(null);
  const buyingDropdownRef = useRef(null);
 
  useEffect(() => {
    if (amount && !isNaN(amount)) {
      const rate = exchangeRates[selling][buying];
      const received = (parseFloat(amount) * rate *1.05).toFixed(4);
      setReceivedAmount(received);
    } else {
      setReceivedAmount("");
    }
  }, [amount, selling, buying]);

  const handleReset = () => {
    setAmount(""); 
    setReceivedAmount(""); 
    setSelling("BTC");
    setBuying("STX");
  };

  const handleExchange = () => {
    // Swap the selling and buying currencies
    const temp = selling;
    setSelling(buying);
    setBuying(temp);
    
    // Recalculate the amounts in reverse
    if (amount && !isNaN(amount)) {
      setAmount(receivedAmount);
      // The new received amount will be calculated in the useEffect
    } else {
      setAmount("");
      setReceivedAmount("");
    }
  };

  // Close dropdowns when clicking outside
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

  return (
    <Section
      className="relative h-screen flex items-center justify-center overflow-hidden pt-12 -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      {/* Background & Parallax Effect */}
      <div className="absolute inset-0 z-[-1] " ref={parallaxRef} >
        <ScrollParallax>
          <img
            src="/back.jpg"
            className="w-full absolute top-0 left-0"
            alt="Hero Background"
            width={1440}
            height={1800}
          />
        </ScrollParallax>
      </div>
      {/* Swap UI - Centered */}
      <div className="w-[450px] bg-gray-800 p-8 rounded-lg shadow-lg text-white relative z-10 mt-10 ">
        <div className="flex justify-between items-center mb-3">
          <div className="relative flex items-center bg-red-600 px-3 py-1 rounded-full text-white text-xs font-semibold">
            <FaFire className="mr-1" /> Top
            <div className="absolute right-0 top-0 h-full w-6"></div>
          </div>

          {/* Infinite Scrolling Logos with gradient parent */}
          <div className="relative w-full ml-4 overflow-hidden h-10 flex items-center justify-center">
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-gray-800 to-transparent z-10"></div>
            <div className="flex animate-scroll whitespace-nowrap logo-scroll-container gap-4">
              {allLogos.map((logo, index) => (
                <div key={index} className="flex items-center text-white">
                  <span className="text-xs text-gray-300">#{allNumbers[index]}</span>
                  <img src={logo} alt={`Logo ${index}`} className="h-6 w-4 object-contain mx-1" />
                  <span className="text-xs text-gray-200">{allTitles[index]}</span>
                </div>
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-gray-800 to-transparent z-10"></div>
          </div>
        </div>

        {/* Exchange Rate Display
        <div className="text-center text-xs text-gray-400 mb-2">
          {amount ? (
            <span>1 {selling} = {exchangeRates[selling][buying]} {buying}</span>
          ) : (
            <span>Enter an amount to see the exchange rate</span>
          )}
        </div> */}

        {/* Tabs */}
        <div className="flex justify-between mb-4 mx-2 mt-4">
          <span className="text-green-400 font-semibold flex flex-row items-center justify-center gap-2 hover:cursor-pointer">
            <BiRocket /> Instant
          </span>
          <span className="text-gray-400 flex flex-row items-center justify-center gap-2 hover:cursor-pointer hover:text-green-400">
            <FaBell /> Trigger
          </span>
          <span className="text-gray-400 flex flex-row items-center justify-center gap-2 hover:cursor-pointer hover:text-green-400">
            <FaRecycle /> Recurring
          </span>
        </div>

        {/* Swap Box with Dropdowns */}
        <div className="bg-gray-700 p-4 rounded-lg relative">
          <div className="flex justify-between items-center relative text-xs font-sans">
            <span>Selling</span>
          </div>
          <div className="flex flex-row items-center justify-center py-2">
            <div className="relative" ref={sellingDropdownRef}>
              <button
                onClick={() => {
                  setIsSellingDropdownOpen(!isSellingDropdownOpen);
                  setIsBuyingDropdownOpen(false); // Close the other dropdown
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
      ${(
        parseFloat(amount) *
        exchangeRates[selling]["USDC"]
      ).toFixed(4)} USD
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
            <span>Buying</span>
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
        <WalletConnector />
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