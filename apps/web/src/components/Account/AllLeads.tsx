"use client";

import React, { useState } from "react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MOCK_INVOICES } from "@/constants/leads";
import { ReceiptIcon } from "@/icons";

const RecieptIcon = ReceiptIcon;

// Replace this with your actual YouTube video ID
const YOUTUBE_VIDEO_ID = "nJ25yl34Uqw";

export const AllLeads: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(MOCK_INVOICES.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = MOCK_INVOICES.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (page: string) => {
    setCurrentPage(parseInt(page));
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  return (
    <div className="flex flex-col h-full bg-[#f9fafb] xl:px-[80px] lg:px-[40px] px-[20px] py-[24px] font-noto-sans">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 xl:mb-[20px] mb-[15px] text-[15px] text-[#888888] capitalize">
        <span>My Account</span>
        <span>/</span>
        <span className="font-medium text-[#333333]">All Leads</span>
      </nav>

      <div className="flex flex-col lg:flex-row lg:gap-[20px] xl:gap-[35px] items-start">
        {/* Left Column - Main Content */}
        <div className="flex flex-col flex-1 w-full">
          {/* Heading */}
          <h1 className="text-[24px] font-semibold font-noto-sans text-[#333333] xl:pb-[20px] pb-[15px] border-b-[1px] xl:mb-[20px] mb-[15px] capitalize">
            All Leads
          </h1>
          <div className=" flex flex-col gap-[1px]">
            {/* Table Header (Desktop only) */}
            <div className="hidden lg:grid grid-cols-[1.5fr_1.5fr_1fr_1.5fr_1fr_1fr] py-[14px] text-[16px] 2xl:text-[18px] leading-[120%] font-noto-sans font-medium text-[#888888]">
              <div className="capitalize px-[5px]">Invoice Date</div>
              <div className="capitalize px-[5px]">Invoice Number</div>
              <div className="capitalize px-[5px]">Lead Count</div>
              <div className="capitalize px-[5px]">Invoice Amount</div>
              <div className="text-center capitalize px-[5px]">Receipt</div>
              <div className="text-center capitalize px-[5px]">.CSV File</div>
            </div>

            {/* Table Body / Cards Body */}
            <div className="overflow-hidden mb-[10px]">
              {paginatedInvoices.map((invoice, idx) => (
                <React.Fragment key={idx}>
                  {/* Desktop View */}
                  <div
                    className={`hidden lg:grid bg-white rounded-[10px] mb-[6px] grid-cols-[1.5fr_1.5fr_1fr_1.5fr_1fr_1fr] px-[10px] xl:px-[15px] py-[13px] items-center text-[15px] leading-[120%] text-[#333333] font-noto-sans transition-colors hover:bg-[#f3f4f6]/50 ${idx !== paginatedInvoices.length - 1 ? "border-b border-[#F4F4F4]" : ""}`}
                  >
                    <div className="font-medium px-[5px]">{invoice.date}</div>
                    <div className="font-medium px-[5px]">{invoice.number}</div>
                    <div className="font-semibold px-[5px]">
                      {invoice.count}
                    </div>
                    <div className="font-semibold px-[5px]">
                      {invoice.amount}
                    </div>
                    <div className="flex justify-center px-[5px]">
                      <button className="p-2 bg-[#EEEEEA] w-[48px] h-[36px] flex items-center justify-center rounded-[8px] hover:bg-[#EEEEEA]/80 transition-colors cursor-pointer text-[#0D6363]">
                        <RecieptIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex justify-center px-[5px]">
                      <button className="p-2 bg-[#0D6363] w-[48px] h-[36px] flex items-center justify-center rounded-[8px] hover:bg-[#0a4e4e] transition-colors cursor-pointer text-white">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile/Tablet Card View */}
                  <div className="lg:hidden bg-white rounded-[10px] p-4 mb-4 shadow-sm border border-[#F4F4F4] flex flex-col gap-4 font-noto-sans">
                    <div className="flex justify-between items-start pb-3 border-b border-[#F4F4F4]">
                      <div className="flex flex-col gap-1">
                        <span className="text-[13px] text-[#888888] font-medium uppercase tracking-wider">
                          Invoice Date
                        </span>
                        <span className="text-[15px] text-[#333333] font-semibold">
                          {invoice.date}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 text-right">
                        <span className="text-[13px] text-[#888888] font-medium uppercase tracking-wider">
                          Invoice Number
                        </span>
                        <span className="text-[15px] text-[#333333] font-semibold">
                          {invoice.number}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <div className="flex flex-col gap-1">
                        <span className="text-[13px] text-[#888888] font-medium uppercase tracking-wider">
                          Lead Count
                        </span>
                        <span className="text-[18px] text-[#0D6363] font-bold">
                          {invoice.count}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 text-right">
                        <span className="text-[13px] text-[#888888] font-medium uppercase tracking-wider">
                          Invoice Amount
                        </span>
                        <span className="text-[18px] text-[#0D6363] font-bold">
                          {invoice.amount}
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-row flex-col items-center gap-3 pt-2">
                      <button className="w-full flex items-center justify-center gap-2 h-11 bg-[#EEEEEA] rounded-[10px] text-[#0D6363] hover:bg-[#EEEEEA]/80 transition-all font-semibold text-[14px] cursor-pointer">
                        <RecieptIcon className="w-5 h-5" />
                        View Receipt
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 h-11 bg-[#0D6363] rounded-[10px] text-white hover:bg-[#0a4e4e] transition-all font-semibold text-[14px] cursor-pointer">
                        <Download className="w-5 h-5" />
                        Download CSV
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Pagination Footer */}
            <div className="bg-[#EEEEEA] md:rounded-[20px] rounded-[10px] xl:px-[24px] lg:px-[20px] px-[15px] xl:py-[16px] py-[12px] flex flex-wrap sm:flex-row flex-col items-center justify-between">
              <div className="flex flex-wrap items-center gap-4 mb-[15px] sm:mb-0 sm:w-auto w-full sm:justify-start justify-between">
                <span className="font-noto-sans text-[14px] text-[#4E4F54]">
                  Leads per page:
                </span>
                <Select
                  defaultValue={itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger
                    icon={<ChevronLeft className="w-5 h-5 rotate-270" />}
                    className="bg-white xl:h-11 h-9 border-0 rounded-[4px] shadow-none ring-0! ring-offset-0!  gap-2 w-auto cursor-pointer"
                  >
                    <SelectValue placeholder={itemsPerPage.toString()} />
                  </SelectTrigger>
                  <SelectContent className="rounded-[12px]">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-6 sm:w-auto w-full sm:justify-start justify-between">
                <div className="flex items-center gap-4">
                  <Select
                    value={currentPage.toString()}
                    onValueChange={handlePageChange}
                  >
                    <SelectTrigger
                      icon={<ChevronLeft className="w-5 h-5 rotate-270" />}
                      className="bg-white xl:h-11 h-9 border-0 rounded-[4px] shadow-none ring-0! ring-offset-0!  gap-2 w-auto cursor-pointer"
                    >
                      <SelectValue placeholder={currentPage.toString()} />
                    </SelectTrigger>
                    <SelectContent className="rounded-[12px]">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="font-noto-sans text-[14px] text-[#4E4F54]">
                    of {totalPages} pages
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="p-1.5 w-[44px] xl:h-[44px] h-9 flex items-center justify-center bg-white rounded-[4px] hover:bg-[#f3f4f6] transition-colors disabled:opacity-50 text-[#666666] cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="p-1.5 w-[44px] xl:h-[44px] h-9 flex items-center justify-center bg-white rounded-[4px] hover:bg-[#f3f4f6] transition-colors disabled:opacity-50 text-[#0D6363] cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="w-full lg:w-[380px] lg:sticky lg:top-[80px] flex flex-col gap-6 xl:pt-12 sm:pt-10 pt-6">
          <div
            className="bg-white rounded-[10px] xl:p-[22px] p-[15px] shadow-[0px_26px_20px_0px_#0000001A]
 flex flex-col group transition-shadow"
          >
            {/* Video Thumbnail */}
            <div
              onClick={() => setOpen(true)}
              className="relative aspect-video rounded-[10px] overflow-hidden mb-[14px] bg-[#EEEEEA] cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=3348&auto=format&fit=crop"
                alt="How to get a foot in the door with a lead"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#333]/60 flex items-center justify-center">
                <div className="w-[48px] h-[33px] flex items-center justify-center rounded-[8px] bg-[#E12929] shadow-md group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* YouTube Video Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="p-0 border-0 bg-black max-w-4xl w-full">
                <DialogTitle className="sr-only">Video Player</DialogTitle>
                <div className="relative w-full aspect-video">
                  {open && (
                    <iframe
                      className="w-full h-full rounded-[12px]"
                      src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Video Content */}
            <div className="flex flex-col gap-[6px]">
              <h3 className="text-[18px] font-noto-sans font-bold text-[#333333] leading-[130%]">
                How to get a foot in the door with a lead
              </h3>
              <p className="text-[15px] font-noto-sans text-[#33333] leading-[140%] line-clamp-4">
                Description Text Goes here Description Text Goes here
                Description Text Goes here Description Text Goes here
                Description Text Goes here Description Text Goes here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
