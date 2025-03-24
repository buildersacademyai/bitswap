

 import discordBlack from "./socials/discord.svg";
 import facebook from "./socials/facebook.svg";
 import instagram from "./socials/instagram.svg";
 import telegram from "./socials/telegram.svg";
 import twitter from "./socials/twitter.svg";
 import github from "./socials/github.svg";
 import { FaBitcoin } from "react-icons/fa";
 import { SiTether } from "react-icons/si";
export {
   discordBlack,
   facebook,
   instagram,
   telegram,
   twitter,
  github,
 };

 export const exchangeRates = {
   USDC: {
     STX: 13.5,      
     SBTC: 0.00035,   
     BTC: 0.000018,   
     USDC: 1          
   },
   STX: {
     USDC: 0.074,     
     SBTC: 0.00003,   
     BTC: 0.0000015,  
     STX: 1           
   },
   SBTC: {
     USDC: 3000,      
     STX: 42000,     
     BTC: 0.06,     
     SBTC: 1          
   },
   BTC: {
     USDC: 63000,     
     STX: 810000,     
     SBTC: 22,       
     BTC: 1           
   }
 };


  export const logos = ["/bc.svg", "/sbtc.svg", "/stx.svg" ];
  export const numbers = ["1", "2", "3"];
  export const titles = ["Bitcoin", "SBTC", "STX"];

  // Repeat the arrays to create a seamless loop
  export const allLogos = [...logos, ...logos, ...logos, ...logos];
  export const allNumbers = [...numbers, ...numbers, ...numbers, ...numbers];
  export const allTitles = [...titles, ...titles, ...titles, ...titles];

   export const currencyIcons = {
      USDC: <SiTether className="text-blue-400" />,
      SBTC: <img src="/sbtc.svg" alt="SBTC" className="w-4 h-4"/>,
      STX: <img src="/stx.svg" alt="STX" className="w-4 h-4"/>,
      BTC: <FaBitcoin className="text-yellow-500" />,
    };

