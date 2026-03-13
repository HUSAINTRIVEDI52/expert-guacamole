"use client";

import React from "react";
import Image from "next/image";
import Script from "next/script";
import { AuthVideoFaq } from "@/components/AuthVideoFaq";
import { AuthMarquee } from "@/components/AuthMarquee";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-white font-sans text-zinc-900">
      {/* Left Side: Branded Panel (40% width) */}
      <div className="relative hidden w-[50%] flex-col lg:flex h-full z-20 shrink-0">
        {/* Top Green Section */}
        <div className="relative flex-1 bg-[#096d59] w-full flex flex-col items-center pt-[50px] px-[80px] pb-[50px]">
          {/* Logo on the Top Left */}
          <div className="text-white mb-[58px] w-full">
            {/* Note: Invert filter creates white logo from standard logo-full.png */}
            <Image
              src="/logo-full.png"
              alt="Sul Local Logo"
              width={160}
              height={50}
              className="object-contain invert brightness-0"
            />
            <p className="text-white text-[18px] mt-2 font-medium tracking-wide font-noto-sans">
              Quality Leads for Professionals.
            </p>
          </div>

          {/* Hero Image Section with Blurry Overlay */}
          <div className="w-full flex-1 relative rounded-[20px] overflow-hidden mt-auto">
            <Image
              src="/auth-hero-v4.jpg"
              alt="SUL Local platform user"
              fill
              className="absolute top-0 left-0 object-cover z-10"
              priority
            />
            {/* Yellow Blurry Overlay Box */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[25px] w-[90%] mx-auto bg-gradient-to-r from-[#fff]/20 to-[#fff]/20 backdrop-blur-[45px] rounded-[20px] p-[20px] z-20">
              <p className="text-white font-lora font-semibold text-[24px] 2xl:text-[30px] leading-[120%] text-center">
                Stop renting leads from tech platforms. Own better leads, pay
                less, and grow your business your way.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full bg-[#EAECEF] px-[80px] py-[35px] flex flex-col justify-center">
          {/* Gray Info Section (Video, FAQ, Chat) */}
          <AuthVideoFaq className="mb-[28px]" />

          {/* Chat Part */}
          <div className="">
            <h3 className="text-[#333333] text-[15px] font-medium mb-[16px] font-noto-sans">
              Or chat below with Sully.
            </h3>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="w-[45px] h-[45px] rounded-full bg-white flex items-center justify-center">
                  <Image
                    src="/chat-logo.png"
                    alt="Sully Logo Icon"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <button className="bg-[#0D6363] hover:bg-[#0D6363]/90 text-white px-[20px] py-[11px] rounded-lg text-[15px] font-semibold transition-all active:scale-95 font-noto-sans cursor-pointer">
                  Start Chat
                </button>
              </div>
              <h3 className="text-[#333] text-[15px] mt-[10px] font-noto-sans">
                1.2k+ Solutions provided last month
              </h3>
            </div>
          </div>
        </div>

        {/* Bottom Marquee */}
        <AuthMarquee />
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
          <div className="w-full max-w-[650px] bg-white p-6 sm:p-10 lg:p-16 xl:p-20 z-10 my-4 lg:my-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
