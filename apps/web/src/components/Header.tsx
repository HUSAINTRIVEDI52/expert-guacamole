"use client";

import React, { useState } from "react";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";
import { Sidebar } from "./Sidebar";

export const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="lg:h-[110px] md:h-[90px] h-[70px] sticky top-0 z-30 w-full bg-white shadow-[0px_1px_18px_0px_#0000001a]">
      <div className="mx-auto flex h-full items-center justify-between xl:px-[80px] lg:px-[40px] px-[20px]">
        {/* Left: Logo */}
        <Logo />

        {/* Right: User Menu */}
        <UserMenu onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      {/* Sidebar / Dropdown */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </header>
  );
};
