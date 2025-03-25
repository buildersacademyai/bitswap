"use client"
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { navigation } from "../../constants/index.js";
import Button from "./_components/Button.jsx";
import MenuSvg from "../assets/svg/MenuSvg.jsx";
import { HamburgerMenu } from "./design/Header.jsx";
import { useState } from "react";
import { usePathname } from "next/navigation.js";
import WalletConnector from "./Wallet.jsx";

const Header = () => {
  const pathname = usePathname();
  const [openNavigation, setOpenNavigation] = useState(false);
  
  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bn-n-8/90 bg-gray-900/80 lg:backdrop-blur-sm ${
          openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
        }`}
      >
        <div className="flex items-center justify-between px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
          {/* Left Section: Logo and Navigation */}
          <div className="flex items-center">
            <a className="block w-[120px] mr-6" href="/">
              <img src="/trading.svg" width={80} height={50} alt="Brainwave" className="w-[120px] h-[80px]" />
            </a>
            
            
          </div>
          
          {/* Center Section: Search Bar
          <div className="hidden lg:flex flex-1 justify-center items-center mx-2">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search token or address..."
                className="w-full font-semibold text-xs font-sans bg-gray-900/60 text-gray-200 py-3 px-4 pl-10 border-2 border-gray-700 rounded-full focus:outline-none focus:border-purple-500 focus:ring-purple-500 "
                />
              <FiSearch size={18} className="absolute left-3 top-3  text-gray-400" />
            </div>
          </div> */}
          
          {/* Right Section: Settings and Connect Wallet */}
          <div className="flex items-center">
          <nav
              className={`${
                openNavigation ? "flex" : "hidden"
              } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:bg-transparent`}
            >
              <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
                {navigation.map((item) => (
                 <a
                 key={item.id}
                 href={item.url}
                 onClick={handleClick}
                 className={`block relative font-code text-2xl uppercase transition-colors font-sans px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                   item.onlyMobile ? "lg:hidden" : ""
                 } ${
                   item.url === pathname || (pathname === "/" && item.url === "/trading")
                     ? "text-white" // Active link (white color)
                     : "text-gray-400"
                 } hover:text-white lg:leading-5 xl:px-8`}
               >
                 {item.title}
               </a>
               
                ))}
              </div>
              <HamburgerMenu />
            </nav>
            <span className="px-3 text-lg text-gray-500 hidden lg:block">|</span>
            <WalletConnector/>
            <Button
              className="ml-auto lg:hidden "
              px="px-3"
              onClick={toggleNavigation}
            >
              <MenuSvg openNavigation={openNavigation} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;