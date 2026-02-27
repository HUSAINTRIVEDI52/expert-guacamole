"use client";

import React, { useState } from "react";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";
import { Sidebar } from "./Sidebar";

export const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
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
