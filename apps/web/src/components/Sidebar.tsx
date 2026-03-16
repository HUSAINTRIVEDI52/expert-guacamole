"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const menuItems = [
    {
      label: "My Leads",
      href: "/my-account/all-leads",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      label: "Profile",
      href: "/my-account/profile",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      label: "Logout",
      href: "/",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      ),
      className: "text-red-600",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-zinc-900/10 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      {/* Sidebar Content */}
      <div
        className={`fixed right-4 top-20 z-50 w-64 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-200 transition-all duration-300 transform ${
          isOpen
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-4 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-100">
          <h2 className="font-noto-sans text-[15px] font-semibold text-[#333333] tracking-wider uppercase">
            Menu
          </h2>
        </div>
        <nav className="p-2">
          {menuItems.map((item) => (
            <React.Fragment key={item.label}>
              {item.label === "Logout" && (
                <div className="mx-4 my-2 border-t border-[#888888]/30" />
              )}
              <button
                onClick={() => {
                  router.push(item.href);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-noto-sans text-[15px] font-medium transition-colors text-[#333333] hover:text-[#0D6363] hover:bg-zinc-50 cursor-pointer ${
                  item.className || "text-[#333333]"
                } ${item.label === "Logout" ? "text-[#333333]! hover:text-red-600!" : ""}`}
              >
                <span
                  className={
                    item.label === "Logout"
                      ? "text-[#888888]!"
                      : "text-[#0D6363]!"
                  }
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </nav>
      </div>
    </>
  );
};
