"use client"
import { useState, useRef, useEffect } from "react";
import {FaTools, FaExclamationCircle } from "react-icons/fa";
import { RxReset } from "react-icons/rx";
import { CgArrowsExchangeAltV, } from "react-icons/cg";
import {  BiChevronDown } from "react-icons/bi";
import { GoStack } from "react-icons/go";


import Section from "./_components/Section.jsx";
import {currencyIcons,exchangeRates, currencies} from "../assets/index.js"
import { BottomLine } from "../components/design/Hero.jsx";
import Button from "./_components/Button.jsx";
import Logo from "./_components/Logo.jsx"
import Loader from "./_components/Loader.jsx"
import Loader1 from "./_components/Loader1.jsx"

import useCryptoPrices from "./useCryptoPrices.js";
import { MdOutlineExitToApp } from "react-icons/md";
import { PiHandDepositBold } from "react-icons/pi";
import Skeleton from "react-loading-skeleton";

const Hero = () => {

  const [selling, setSelling] = useState("BTC");
  const [buying, setBuying] = useState("STX");
  const [amount, setAmount] = useState("");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [isSellingDropdownOpen, setIsSellingDropdownOpen] = useState(false);
  const [isBuyingDropdownOpen, setIsBuyingDropdownOpen] = useState(false);
  const [isDeposit, setIsDeposit] = useState(true);

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
    setIsDeposit(true)
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

  // if (!btcPrice || !stxPrice) {
  //   return (
  //     <Section className="relative h-screen flex items-center justify-center">
  //       <div className="text-white">Loading real-time prices...</div>
  //     </Section>
  //   );
  // }

  const handleSellingChange = (currency) => {
    setSelling(currency);
    setIsSellingDropdownOpen(false); // Close dropdown
  
    if (currency === "BTC" || currency === "SBTC") {
      setBuying("STX"); // Auto-set buying to STX when BTC/SBTC is selected
    } else if (currency === "STX") {
      setBuying("BTC"); // Auto-set buying to BTC when STX is selected
    }
  };
  
  const handleBuyingChange = (currency) => {
    setBuying(currency);
    setIsBuyingDropdownOpen(false); // Close dropdown
  };
  
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
      {!btcPrice || !stxPrice ? (
    <>
      <Loader1/>
    </>
  ) : (
        <Logo/>
  )}

        <div className="flex justify-between items-center mb-4 mx-2 mt-4">

      <div className="flex-1 flex justify-center">
        <span className="text-green-400 font-sans ml-20 font-semibold flex flex-row items-center gap-2 hover:cursor-pointer">
          <GoStack size={22} /> {isDeposit ? "Stacking" : "Unstacking"}
        </span>
      </div>

      <span className={`text-sm font-sans font-semibold mr-1 ${isDeposit ? "text-green-500":"text-purple-500"}`}>Mode:</span>
      <div
        className={`relative w-10 h-5 flex border-2 ${isDeposit ? "border-green-500":"border-purple-500"} items-center bg-gray-800 rounded-full px-1 cursor-pointer transition-all duration-300`}
        onClick={() => setIsDeposit(!isDeposit)}
      >
        <div
  className={`absolute w-3 h-3 ${isDeposit ? "bg-green-500" : "bg-purple-500"} rounded-full shadow-md transform transition-all duration-300 ${
    isDeposit ? "translate-x-0" : "translate-x-4"
  } ${(!btcPrice || !stxPrice) ? "opacity-50 cursor-not-allowed transition-none" : ""}`}
></div>

      </div>
    </div>
        {/* Swap Box with Dropdowns */}
        <div className="bg-gray-700 p-4 rounded-lg relative">
        {!btcPrice || !stxPrice ? (
    <>
      <Loader/>
    </>
  ) : (
    <>
      {/* Swap UI (Only shown after loading) */}
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
            className="text-white w-32 px-4 py-2 rounded-md bg-green-500/70 transition-all duration-100 flex items-center gap-2"
          >
            {currencyIcons[selling]}
            {selling}
            <BiChevronDown size={20} />
          </button>
          {isSellingDropdownOpen && (
            <div className="absolute bg-gray-900 border border-gray-600 rounded-md mt-1 w-32 z-30">
              {["BTC", "SBTC", "STX"].map((currency) => (
                <div
                  key={currency}
                  onClick={() => handleSellingChange(currency)}
                  className={`px-4 py-2 hover:bg-green-500/70 cursor-pointer flex items-center gap-2 border-b border-gray-800 rounded-md ${
                    selling === currency ? "bg-green-500/70" : ""
                  }`}
                >
                  {currencyIcons[currency]}
                  <span>{currency}</span>
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
        {amount ? <span>${calculateUSDValue(amount, selling).toFixed(4)} USD</span> : <span></span>}
      </span>
    </>
  )}
          {/* Exchange Icon with Reset Button */}
          <div className="flex justify-center items-center relative z-20 mt-8">
  <hr className="border-2 w-full rounded-full" />
  <div
    className={`bg-gray-800 rounded-full p-3 absolute -my-6 text-purple-400/90 hover:border-purple-600 hover:bg-purple-600 border-gray-900 border-2 cursor-pointer transition-all duration-150 ${(!btcPrice || !stxPrice) ? 'pointer-events-none opacity-100' : ''}`}
    onClick={handleExchange}
  >
    <div className="relative flex items-center">
      <button
        className={`transition-all duration-75 text-white cursor-pointer ${(!btcPrice || !stxPrice) ? 'cursor-not-allowed' : ''}`}
        disabled={!btcPrice || !stxPrice}
      >
        <CgArrowsExchangeAltV className="text-xl" size={20} />
      </button>
    </div>
  </div>
</div>


          {(!btcPrice || !stxPrice) ? (
            <div className="p-4">

              <Loader />
            </div>
) : (
  <>
    {/* Swap UI (Only shown after loading) */}
    <div className="flex justify-between items-center relative mt-8 text-xs font-sans">
      <span>To:</span>
    </div>

    <div className="flex flex-row items-center justify-center py-2">
      <div className="relative" ref={buyingDropdownRef}>
        <button
          onClick={() => {
            setIsBuyingDropdownOpen(!isBuyingDropdownOpen);
            setIsSellingDropdownOpen(false);
          }}
          className="text-white w-32 px-4 py-2 rounded-md bg-purple-600 hover:border-purple-600 transition-all duration-100 flex items-center gap-2"
        >
          {currencyIcons[buying]}
          {buying}
          <BiChevronDown size={20} />
        </button>

        {isBuyingDropdownOpen && (
          <div className="absolute bg-gray-900 border w-32 border-gray-600 rounded-md mt-1 z-30">
            {(selling === "BTC" || selling === "SBTC" ? ["STX"] : ["BTC", "SBTC"]).map((currency) => (
              <div
                key={currency}
                onClick={() => handleBuyingChange(currency)}
                className={`px-4 py-2 hover:bg-purple-600 cursor-pointer flex items-center gap-2 border-b border-gray-800 rounded-md ${
                  buying === currency ? "bg-purple-600" : ""
                }`}
              >
                {currencyIcons[currency]}
                <span>{currency}</span>
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
  </>
)}
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
  className={`bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-full cursor-pointer justify-end ${(!btcPrice || !stxPrice) ? 'cursor-not-allowed opacity-50' : ''}`}
  disabled={!btcPrice || !stxPrice}
>
  <RxReset />
</button>

        </div>

        {/* Connect Wallet Button */}
        <Button className={`w-full cursor-pointer flex items-center gap-2" ${(!btcPrice || !stxPrice) ? "opacity-50 cursor-not-allowed transition-none" : ""}`}>
          <div className="flex items-center gap-2 font-sans ">
         {isDeposit ? <><p>Despoit </p> <PiHandDepositBold size={20} /></>: <><p>Withdraw</p><MdOutlineExitToApp size={20} /> </>} 
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