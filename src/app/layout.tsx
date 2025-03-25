"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";  // Import the next/script component
import Header from "./components/Header";
import ButtonGradient from "./assets/svg/ButtonGradient";

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
        {/* Use next/script with 'beforeInteractive' strategy */}
        <link rel="icon" href="/logo.svg" />
        <title>Bitswap | Home</title>
        <Script
          src="/wallet-preload.js"
          strategy="beforeInteractive"  // Loads before the page is interactive
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Header/>
        {children}
      </body>
      <ButtonGradient/>
    </html>
  );
}
