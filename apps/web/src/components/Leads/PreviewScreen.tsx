"use client";

import React from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data based on the screenshot
const MOCK_PREVIEW_LEADS = [
  {
    id: "1",
    name: "John Smith",
    email: "jo***********@gmail.com",
    phone: "******** 7890",
    address: "******** United States",
    jobTitle: "Software Engineer",
    company: "Alpha Tech",
    yearFounded: "2012",
    employeeCount: "500-1k",
  },
  {
    id: "2",
    name: "Anika Harris",
    email: "an***********@gmail.com",
    phone: "******** 7890",
    address: "******** United States",
    jobTitle: "Software Engineer",
    company: "Alpha Tech",
    yearFounded: "2018",
    employeeCount: "1k-5k",
  },
  {
    id: "3",
    name: "Haina Cabaro",
    email: "ha***********@gmail.com",
    phone: "******** 7890",
    address: "******** United States",
    jobTitle: "Software Engineer",
    company: "Alpha Tech",
    yearFounded: "2002",
    employeeCount: "5k-10k",
  },
  {
    id: "4",
    name: "Wilson Philips",
    email: "wi***********@gmail.com",
    phone: "******** 7890",
    address: "******** United States",
    jobTitle: "Software Engineer",
    company: "Alpha Tech",
    yearFounded: "2008",
    employeeCount: "10k-15k",
  },
  {
    id: "5",
    name: "Jaylen Gouse",
    email: "ja***********@gmail.com",
    phone: "******** 7890",
    address: "******** United States",
    jobTitle: "Software Engineer",
    company: "Alpha Tech",
    yearFounded: "2016",
    employeeCount: "1k-5k",
  },
  {
    id: "6",
    name: "John Smith",
    email: "jo***********@gmail.com",
    phone: "******** 7890",
    address: "******** United States",
    jobTitle: "Software Engineer",
    company: "Alpha Tech",
    yearFounded: "2004",
    employeeCount: "5k-10k",
  },
  {
    id: "7",
    name: "Haina Cabaro",
    email: "ha***********@gmail.com",
    phone: "******** 7890",
    address: "******** United States",
    jobTitle: "Software Engineer",
    company: "Alpha Tech",
    yearFounded: "1998",
    employeeCount: "1k-5k",
  },
  {
    id: "8",
    name: "Anika Harris",
    email: "an***********@gmail.com",
    phone: "******** 7890",
    address: "******** United States",
    jobTitle: "Software Engineer",
    company: "Alpha Tech",
    yearFounded: "2015",
    employeeCount: "10k-15k",
  },
  {
    id: "9",
    name: "Wilson Philips",
    email: "wi***********@gmail.com",
    phone: "******** 7890",
    address: "******** United States",
    jobTitle: "Software Engineer",
    company: "Alpha Tech",
    yearFounded: "2011",
    employeeCount: "5k-10k",
  },
  {
    id: "10",
    name: "Wilson Philips",
    email: "wilso**********@gmail.com",
    phone: "******** 7890",
    address: "******** United States",
    jobTitle: "Software Engineer",
    company: "Alpha Tech",
    yearFounded: "2007",
    employeeCount: "1k-5k",
  },
  {
    id: "11",
    name: "Jaylen Gouse",
    email: "jayl**********@gmail.com",
    phone: "******** 7890",
    address: "******** United States",
    jobTitle: "Software Engineer",
    company: "Alpha Tech",
    yearFounded: "2020",
    employeeCount: "1k-5k",
  },
];

export const PreviewScreen: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-[#f9fafb] xl:px-[80px] lg:px-[40px] px-[20px] py-[24px] font-noto-sans overflow-y-auto">
      {/* Back button */}
      <div className="xl:mb-[35px] lg:mb-[32px] mb-[20px]">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 lg:px-4 px-3 lg:py-2 py-1.5 lg:text-[18px] text-[16px] font-noto-sans font-medium text-[#333] bg-[#EEEEEA] hover:bg-[#EEEEEA]/80 transition-colors rounded-full cursor-pointer"
        >
          <ChevronLeft className="w-5.5 h-5.5" />
          Back to Search
        </button>
      </div>

      {/* Summary Header */}
      <div className="bg-white rounded-[20px] border border-[#F4F4F4] shadow-sm px-[24px] py-[14px] mb-6 flex flex-wrap items-center justify-between gap-8">
        <div className="flex flex-col">
          <span className="font-noto-sans text-[15px] font-medium text-[#333333] mb-1">
            Available Leads
          </span>
          <span className="text-[24px] font-semibold text-[#0D6363]">50K</span>
        </div>

        <div className="flex items-center gap-[100px] ml-auto">
          <div className="flex flex-col">
            <span className="font-noto-sans text-[15px] font-medium text-[#333333] mb-1">
              Download Format
            </span>
            <span className="text-[24px] font-semibold text-[#0D6363]">
              .CSV
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-noto-sans text-[15px] font-medium text-[#333333] mb-1">
              Estimated Price
            </span>
            <span className="text-[24px] font-semibold text-[#0D6363]">
              $199.00
            </span>
          </div>

          <button className="flex items-center gap-2 px-[24px] py-[11px] bg-[#0D6363] text-white rounded-[12px] hover:bg-[#0a4e4e] transition-all shadow-md active:scale-95 cursor-pointer">
            <ShoppingCart className="w-4 h-4" />
            <span className="font-noto-sans text-[15px] font-semibold text-[#F4F4F4] capitalize">
              Buy All Leads
            </span>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="max-h-[540px] relative bg-white rounded-[16px] border border-[#F4F4F4] shadow-sm overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="custom-scrollbar flex-1 overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white z-10 border-b border-[#F4F4F4]">
              <tr>
                <th className="px-6 py-4 text-left text-[13px] font-noto-sans text-[#888888] capitalize">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-[#333]">
                    User Name <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-[13px] font-noto-sans text-[#888888] capitalize">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-[#333]">
                    Email <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-[13px] font-noto-sans text-[#888888] capitalize">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-[13px] font-noto-sans text-[#888888] capitalize">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-[#333]">
                    Address <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-[13px] font-noto-sans text-[#888888] capitalize">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-[#333]">
                    Job Title <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-[13px] font-noto-sans text-[#888888] capitalize">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-[#333]">
                    Company <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-[13px] font-noto-sans text-[#888888] capitalize">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-[#333]">
                    Year Founded <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-[13px] font-noto-sans text-[#888888] capitalize whitespace-nowrap">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-[#333]">
                    Employee Count <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F4]">
              {MOCK_PREVIEW_LEADS.map((lead, idx) => (
                <tr
                  key={lead.id}
                  className={`${idx % 2 === 1 ? "bg-[#fcfcfc]" : "bg-white"} hover:bg-[#f3f4f6] transition-colors cursor-default`}
                >
                  <td className="px-6 py-4 text-sm text-[#333] font-noto-sans font-medium whitespace-nowrap">
                    <span className="blur-[4.5px] select-none">
                      {lead.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#444] whitespace-nowrap font-noto-sans">
                    {lead.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#444] whitespace-nowrap font-noto-sans">
                    {lead.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#444] whitespace-nowrap font-noto-sans">
                    {lead.address}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666] whitespace-nowrap font-noto-sans">
                    {lead.jobTitle}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666] whitespace-nowrap font-noto-sans">
                    {lead.company}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666] whitespace-nowrap font-noto-sans">
                    {lead.yearFounded}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#666] whitespace-nowrap font-noto-sans">
                    {lead.employeeCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* White Blurry Overlay & Action Button */}
        <div className="absolute h-[90%] bg-gradient-to-t from-white via-white/90 to-transparent inset-x-0 bottom-0 flex items-end justify-center pb-8 pointer-events-none z-20">
          <div className="pointer-events-auto">
            <button className="relative flex items-center justify-center gap-3 px-[40px] py-[11px] bg-[#0D6363] text-white rounded-[12px] hover:bg-[#0a4e4e] transition-all shadow-xl active:scale-95 overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <ShoppingCart className="w-5 h-5" />
              <span className="text-[15px] font-noto-sans font-semibold text-[#F4F4F4] capitalize">
                Buy 50K Leads for $199
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
