"use client";

import React from "react";
import Image from "next/image";
import Script from "next/script";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-white font-sans text-zinc-900 overflow-hidden">
      {/* Left Side: Branded Panel (40% width, Specific Light Cream background) */}
      <div
        className="relative hidden w-[40%] flex-col items-center justify-center lg:flex h-full"
        style={{ backgroundColor: "rgb(247, 248, 231)" }}
      >
        {/* Teal Logo on the Top Left */}
        <div className="absolute top-8 left-8 xl:top-12 xl:left-12">
          <Image
            src="/logo-full.png"
            alt="Sul Local Logo"
            width={160}
            height={50}
            className="object-contain"
          />
        </div>

        {/* Hero Image Centered with specific dimensions - Optimized for height */}
        <div className="relative h-[480px] w-[390px] xl:h-[550px] xl:w-[448px] overflow-hidden">
          <Image
            src="/auth-hero-v3.png"
            alt="SUL Local platform user"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Right Side: Auth Forms (60% width, Pure White background) */}
      <div className="flex h-full w-full flex-col bg-white lg:w-[60%] overflow-y-auto scrollbar-hide">
        {/* Mobile Header */}
        <div className="flex items-center p-6 lg:hidden">
          <Image
            src="/logo-full.png"
            alt="Sul Local Logo"
            width={120}
            height={36}
            className="object-contain"
          />
        </div>

        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
        <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
          {/* Form Card - Height-optimized padding and margins to prevent scrolling */}
          <div className="w-full max-w-[700px] rounded-3xl bg-white p-6 sm:p-10 lg:p-16 xl:p-20 shadow-[0_8px_40px_rgb(0,0,0,0.04)] ring-1 ring-zinc-100 z-10 my-4 lg:my-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
