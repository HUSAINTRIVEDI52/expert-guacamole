"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MyLeadsIcon, ProfileIcon, LogoutIcon } from "@/icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuItems = [
    {
      label: "My Leads",
      href: "/my-account/all-leads",
      icon: <MyLeadsIcon className="h-5 w-5" />,
    },
    {
      label: "Profile",
      href: "/my-account/profile",
      icon: <ProfileIcon className="h-5 w-5" />,
    },
  ];

  const logoutItem = {
    label: "Logout",
    href: "/",
    icon: <LogoutIcon className="h-5 w-5" />,
    className: "text-red-600",
  };

  return (
    <>
      {/* MOBILE: Sheet (Right-to-Left) */}
      {isMobile && (
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="p-0 border-none w-[300px] sm:w-[400px] flex flex-col h-full gap-0">
              <SheetHeader className="bg-zinc-50 px-6 py-3 border-b border-zinc-100 text-left">
                <SheetTitle className="font-noto-sans text-[18px] font-semibold text-[#333333] tracking-wider uppercase">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col flex-1 overflow-y-auto">
                {/* User Profile for Mobile */}
                <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-zinc-100">
                  <div className="relative h-[45px] w-[45px] rounded-full bg-zinc-400 overflow-hidden">
                    <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-[14px] text-zinc-500 font-bold">
                      JD
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[16px] font-semibold text-[#333333] font-noto-sans capitalize">
                      John Doe
                    </span>
                    <span className="text-[13px] text-zinc-500 font-noto-sans">
                      john.doe@example.com
                    </span>
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  {/* FAQ's consistently at top of list */}
                  <Link
                    href="/faqs"
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 font-noto-sans text-[16px] font-medium transition-colors hover:bg-zinc-50 cursor-pointer no-underline ${
                      pathname === "/faqs"
                        ? "bg-[#0D6363]/8 text-[#0D6363] font-semibold"
                        : "text-[#333333] hover:text-[#0D6363]"
                    }`}
                  >
                    <Image
                      src="/Q-A-image.png"
                      width={24}
                      height={24}
                      alt="faqs"
                      className="shrink-0"
                    />
                    <span>FAQ's</span>
                  </Link>

                  {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <button
                        key={item.label}
                        onClick={() => {
                          router.push(item.href);
                          onClose();
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-noto-sans text-[16px] font-medium transition-colors hover:bg-zinc-50 cursor-pointer ${
                          isActive
                            ? "bg-[#0D6363]/8 text-[#0D6363] font-semibold"
                            : "text-[#333333] hover:text-[#0D6363]"
                        }`}
                      >
                        <span
                          className={
                            isActive ? "text-[#0D6363]" : "text-[#0D6363]!"
                          }
                        >
                          {item.icon}
                        </span>
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Auth Actions at the Bottom */}
              <div className="mt-auto p-4 border-t border-zinc-100 bg-white">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    onClick={() => {
                      router.push("/login");
                      onClose();
                    }}
                    className="bg-[#fff] hover:bg-[#0D6363]/5 text-[#0D6363] border border-[#0D6363] py-[8px] rounded-lg text-[15px] font-semibold transition-all active:scale-95 font-noto-sans cursor-pointer"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      router.push("/signup");
                      onClose();
                    }}
                    className="bg-[#0D6363] hover:bg-[#0D6363]/90 text-white border border-[#0D6363] py-[8px] rounded-lg text-[15px] font-semibold transition-all active:scale-95 font-noto-sans cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>

                <button
                  onClick={() => {
                    router.push(logoutItem.href);
                    onClose();
                  }}
                  className="flex w-full items-center justify-center gap-3 rounded-xl px-0 py-3 font-noto-sans text-[16px] font-medium transition-colors hover:bg-red-50 cursor-pointer text-[#333333] hover:text-red-600"
                >
                  <span className="text-[#888888]!">{logoutItem.icon}</span>
                  {logoutItem.label}
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* DESKTOP: Original Dropdown Menu */}
      <div className="hidden md:block">
        {/* Backdrop for Desktop Dropdown */}
        <div
          className={`fixed inset-0 z-40 bg-zinc-900/10 backdrop-blur-[1px] transition-opacity duration-300 ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
        />
        <div
          className={`fixed right-[80px] top-24 z-50 w-64 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-200 transition-all duration-300 transform ${
            isOpen
              ? "translate-y-0 opacity-100 scale-100"
              : "-translate-y-4 opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-100 text-left">
            <h2 className="font-noto-sans text-[15px] font-semibold text-[#333333] tracking-wider uppercase">
              Menu
            </h2>
          </div>
          <nav className="p-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-noto-sans text-[15px] font-medium transition-colors hover:bg-zinc-50 cursor-pointer ${
                    isActive
                      ? "bg-[#0D6363]/8 text-[#0D6363] font-semibold"
                      : "text-[#333333] hover:text-[#0D6363]"
                  }`}
                >
                  <span
                    className={isActive ? "text-[#0D6363]" : "text-[#0D6363]!"}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
            <div className="mx-4 my-2 border-t border-[#888888]/30" />
            <button
              onClick={() => {
                router.push(logoutItem.href);
                onClose();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-noto-sans text-[15px] font-medium transition-colors hover:bg-red-50 cursor-pointer text-[#333333] hover:text-red-600"
            >
              <span className="text-[#888888]!">{logoutItem.icon}</span>
              {logoutItem.label}
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};
