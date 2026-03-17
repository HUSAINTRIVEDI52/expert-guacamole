import Image from "next/image";
import React from "react";

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo-full.png"
        alt="Sul Local Logo"
        width={150}
        height={55}
        className="object-contain md:w-[150px] w-[120px] md:h-[55px] h-[40px]"
      />
      {/* <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-zinc-500"
      >
        <path
          d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5ZM20 8C26.6274 8 32 13.3726 32 20C32 26.6274 26.6274 32 20 32C13.3726 32 8 26.6274 8 20C8 13.3726 13.3726 8 20 8Z"
          fill="currentColor"
        />
        <path
          d="M20 12C15.5817 12 12 15.5817 12 20C12 24.4183 15.5817 28 20 28C24.4183 28 28 24.4183 28 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 20C16 17.7909 17.7909 16 20 16C22.2091 16 24 17.7909 24 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="text-xl font-bold text-zinc-800">Sul</span>
        <span className="text-xl font-bold text-zinc-800 -mt-1">Local</span>
      </div> */}
    </div>
  );
};
