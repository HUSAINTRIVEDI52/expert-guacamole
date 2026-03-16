"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const UserMenu: React.FC<{ onMenuToggle: () => void }> = ({
  onMenuToggle,
}) => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      {/* faqs */}
      <Link
        href="/faqs"
        className="bg-[#F4F4F4] min-h-[40px] flex items-center gap-[8px] rounded-[40px] px-[16px] py-[5px] text-[15px] cursor-pointer transition-colors no-underline"
      >
        <Image src="/Q-A-image.png" width={24} height={24} alt="faqs" />
        <span className="text-[15px] font-medium text-[#333333] font-noto-sans">
          FAQ's
        </span>
      </Link>

      {/* Language Selector */}
      {/* <div className="bg-[#EEEEEA] flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm shadow-sm cursor-pointer transition-colors">
        <Image src={'/flag-icon.svg'} className="" width={30} height={30} alt="flag-icon" />
        <svg
          className="h-4 w-4 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div> */}

      {/* auth buttons */}
      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={() => router.push("/login")}
          className="bg-[#fff] hover:bg-[#0D6363]/90 text-[#0D6363] hover:text-white border border-[#0D6363] px-[20px] py-[10px] rounded-lg text-[15px] font-semibold transition-all active:scale-95 font-noto-sans cursor-pointer"
        >
          Log In
        </button>
        <button
          onClick={() => router.push("/signup")}
          className="bg-[#0D6363] hover:bg-[#0D6363]/90 text-white border border-[#0D6363] px-[20px] py-[10px] rounded-lg text-[15px] font-semibold transition-all active:scale-95 font-noto-sans cursor-pointer"
        >
          Sign Up
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex items-center min-h-[40px] gap-2 rounded-[40px] bg-[#F4F4F4] pl-[16px] pr-[12px] py-[5px]  transition-colors">
        <span className="text-[15px] font-medium text-[#333333] font-noto-sans capitalize">
          John Doe
        </span>
        <div className="relative h-[30px] w-[30px] rounded-full bg-zinc-400 overflow-hidden">
          <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-[10px] text-zinc-500 font-bold">
            JD
          </div>
        </div>
      </div>

      {/* Hamburger Menu */}
      <button
        onClick={onMenuToggle}
        className="flex h-[40px] w-[48px] items-center justify-center rounded-full bg-[#0D6363] cursor-pointer transition-colors"
      >
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
};
