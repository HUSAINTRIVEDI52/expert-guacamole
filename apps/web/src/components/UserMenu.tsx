import React from "react";

export const UserMenu: React.FC<{ onMenuToggle: () => void }> = ({
  onMenuToggle,
}) => {
  return (
    <div className="flex items-center gap-4">
      {/* Language Selector */}
      <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm cursor-pointer hover:bg-zinc-50 transition-colors">
        <svg
          className="h-4 w-4 text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
        <svg
          className="h-3 w-3 text-zinc-400"
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
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 shadow-sm cursor-pointer hover:bg-zinc-50 transition-colors">
        <span className="text-sm font-medium text-zinc-700">John Doe</span>
        <div className="relative h-6 w-6 rounded-full bg-zinc-400 overflow-hidden">
          {/* Placeholder for avatar */}
          <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-[10px] text-zinc-500 font-bold">
            JD
          </div>
        </div>
      </div>

      {/* Hamburger Menu */}
      <button
        onClick={onMenuToggle}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm hover:bg-zinc-50 transition-colors"
      >
        <svg
          className="h-6 w-6 text-zinc-600"
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
