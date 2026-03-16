"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LeadsFilterSidebar, LeadsTopBar, LeadsMap } from "@/components/Leads";
import type { LeadsFilterState } from "@/components/Leads";
import { ChevronLeft, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const initialFilters: LeadsFilterState = {
  selectedZips: [],
  selectedCounties: [],
  selectedLeadType: "",
  selectedProfessions: [],
  selectedNetWorth: "",
  selectedAge: "",
};

function LeadsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightedStateFips = searchParams.get("state") || undefined;

  const [filters, setFilters] = useState<LeadsFilterState>(initialFilters);
  const [selectionMode, setSelectionMode] = useState<"zip" | "county">("zip");

  // Store all available zips from the map data
  const [availableZips, setAvailableZips] = useState<string[]>([]);

  // Reset zips when state changes
  useEffect(() => {
    setAvailableZips([]);
    setFilters((prev) => ({ ...prev, selectedZips: [], selectedCounties: [] }));
  }, [highlightedStateFips]);

  const handleClearAll = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const handleSelectAllZips = useCallback(() => {
    if (filters.selectedZips.length === availableZips.length) {
      setFilters((prev) => ({ ...prev, selectedZips: [] }));
    } else {
      setFilters((prev) => ({ ...prev, selectedZips: [...availableZips] }));
    }
  }, [availableZips, filters.selectedZips.length]);

  const handleZipsChange = useCallback((zips: string[]) => {
    setFilters((prev) => ({ ...prev, selectedZips: zips }));
  }, []);

  const handleCountiesChange = useCallback((counties: string[]) => {
    setFilters((prev) => ({ ...prev, selectedCounties: counties }));
  }, []);

  const handleProceedToBuy = useCallback(() => {
    console.log("Proceeding to buy with filters:", filters);
    router.push("/preview-screen");
  }, [router, filters]);

  const handleMapDataReady = useCallback((zips: string[]) => {
    setAvailableZips(zips);
  }, []);

  // Calculate available leads (mock — just a formatted number)
  const totalSelections =
    filters.selectedZips.length + filters.selectedCounties.length * 10; // Mock: counties have more leads
  const availableLeads =
    totalSelections > 0
      ? `${(totalSelections * 24700).toLocaleString()}`
      : "12M";

  return (
    <div className="flex flex-col h-[calc(100vh-110px)] bg-[#F4F4F4] overflow-hidden p-4">
      {/* Back button */}
      <div className="flex flex-wrap items-center lg:gap-[40px] gap-[20px] xl:mb-[20px] mb-[15px] w-full">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 lg:px-4 px-3 lg:py-2 py-1.5 text-[16px] font-noto-sans font-medium text-[#333] bg-[#EEEEEA] hover:bg-[#EEEEEA]/80 transition-colors rounded-full cursor-pointer"
        >
          <ChevronLeft className="w-5.5 h-5.5" />
          Back
        </button>
        <div className="flex flex-wrap items-center gap-2 text-[#888] lg:text-[18px] text-[16px] font-noto-sans font-medium capitalize">
          <span>Showing Result:</span>{" "}
          <span className="font-semibold text-[#0D6363]">Texas</span>
        </div>

        {/* Responsive Filter Drawer for medium/small screens */}
        <div className="lg:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 px-6 py-2 bg-[#0D6363] text-white rounded-full font-noto-sans font-medium hover:bg-[#0D6363]/90 transition-all cursor-pointer shadow-md">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </SheetTrigger>
            <SheetContent className="w-[350px] sm:w-[400px] p-0 border-l-0">
              <div className="h-full bg-[#F4F4F4] px-2 py-4 overflow-y-auto">
                <LeadsFilterSidebar
                  filters={filters}
                  availableZips={availableZips}
                  onFiltersChange={setFilters}
                  onApply={() => console.log("Apply", filters)}
                  onClearAll={handleClearAll}
                  onSelectAllZips={handleSelectAllZips}
                  stateSelected={!!highlightedStateFips}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="flex-1 h-full overflow-auto flex lg:flex-row flex-col w-full lg:flex-wrap bg-white xl:p-[24px] p-[20px] xl:gap-[24px] gap-[20px] shadow-[0px_26px_20px_0px_#0000001A] rounded-[20px]">
        {/* Left – Filter Sidebar */}
        <div className="hidden lg:flex xl:w-[350px] lg:w-[300px] flex flex-col h-full">
          <LeadsFilterSidebar
            filters={filters}
            availableZips={availableZips}
            onFiltersChange={setFilters}
            onApply={() => console.log("Apply", filters)}
            onClearAll={handleClearAll}
            onSelectAllZips={handleSelectAllZips}
            stateSelected={!!highlightedStateFips}
          />
        </div>

        {/* Right – Top Bar + Map */}
        <div className="flex-1 flex flex-col xl:gap-[24px] lg:gap-[20px] gap-[15px] min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 bg-[#EEEEEA] p-1.5 rounded-[12px]">
              <button
                onClick={() => setSelectionMode("zip")}
                className={`px-4 py-2 rounded-[8px] text-[14px] font-noto-sans font-medium transition-all cursor-pointer ${
                  selectionMode === "zip"
                    ? "bg-[#0D6363] text-white shadow-sm"
                    : "text-[#333333] hover:bg-black/5"
                }`}
              >
                Select by Zip Code
              </button>
              <button
                onClick={() => setSelectionMode("county")}
                className={`px-4 py-2 rounded-[8px] text-[14px] font-noto-sans font-medium transition-all cursor-pointer ${
                  selectionMode === "county"
                    ? "bg-[#0D6363] text-white shadow-sm"
                    : "text-[#333333] hover:bg-black/5"
                }`}
              >
                Select by County
              </button>
            </div>
            <LeadsTopBar
              availableLeads={availableLeads}
              onProceedToBuy={handleProceedToBuy}
            />
          </div>
          <div className="flex-1">
            <LeadsMap
              highlightedStateFips={highlightedStateFips}
              selectionMode={selectionMode}
              selectedZips={filters.selectedZips}
              selectedCounties={filters.selectedCounties}
              onZipsChange={handleZipsChange}
              onCountiesChange={handleCountiesChange}
              onMapDataReady={handleMapDataReady}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <svg
              className="animate-spin h-5 w-5 text-[#0D6363]"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-sm text-[#888888] font-noto-sans">
              Loading Leads...
            </span>
          </div>
        </div>
      }
    >
      <LeadsPageContent />
    </Suspense>
  );
}
