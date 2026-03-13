"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LeadsFilterSidebar, LeadsTopBar, LeadsMap } from "@/components/Leads";
import type { LeadsFilterState } from "@/components/Leads";

const initialFilters: LeadsFilterState = {
  selectedZips: [],
  selectedProfessions: [],
  selectedNetWorth: [],
  selectedAge: [],
};

function LeadsPageContent() {
  const searchParams = useSearchParams();
  const highlightedStateFips = searchParams.get("state") || undefined;

  const [filters, setFilters] = useState<LeadsFilterState>(initialFilters);

  // Store all available zips from the map data
  const [availableZips, setAvailableZips] = useState<string[]>([]);

  // Reset zips when state changes
  useEffect(() => {
    setAvailableZips([]);
    setFilters((prev) => ({ ...prev, selectedZips: [] }));
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

  const handleProceedToBuy = useCallback(() => {
    // TODO: navigate to checkout
    console.log("Proceeding to buy with filters:", filters);
  }, [filters]);

  const handleMapDataReady = useCallback((zips: string[]) => {
    setAvailableZips(zips);
  }, []);

  // Calculate available leads (mock — just a formatted number)
  const totalSelections = filters.selectedZips.length;
  const availableLeads =
    totalSelections > 0
      ? `${(totalSelections * 247000).toLocaleString()}`
      : "12M";

  return (
    <div className="flex h-[calc(100vh-110px)] bg-[#F4F4F4] overflow-hidden p-4">
      {/* Left – Filter Sidebar */}
      <div className="w-[390px] p-4 flex flex-col h-full">
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
      <div className="flex-1 flex flex-col gap-[24px] min-w-0">
        <LeadsTopBar
          availableLeads={availableLeads}
          onProceedToBuy={handleProceedToBuy}
        />
        <div className="flex-1 px-4 pb-4">
          <LeadsMap
            highlightedStateFips={highlightedStateFips}
            selectedZips={filters.selectedZips}
            onZipsChange={handleZipsChange}
            onMapDataReady={handleMapDataReady}
          />
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
