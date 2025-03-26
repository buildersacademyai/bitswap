import { allLogos, allNumbers, allTitles } from '@/app/assets'
import React from 'react'
import { FaFire } from 'react-icons/fa'

const Logo = () => {
  return (
    
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
  )
}

export default Logo