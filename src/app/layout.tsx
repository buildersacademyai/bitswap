"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "./components/Header";
import ButtonGradient from "./assets/svg/ButtonGradient";
import {ParallaxBackground} from "../app/components/Parallax"; // Optional import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>Bitswap | Home</title>
        <Script
          src="/wallet-preload.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {/* Optional: Add ParallaxBackground here if you want it on all pages */}
        <ParallaxBackground />
        
        <Header/>
        {children}
        <ButtonGradient/>
      </body>
    </html>
  );
}