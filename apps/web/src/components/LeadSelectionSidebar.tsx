"use client";

import React from "react";

interface LeadSelectionSidebarProps {
  selectedZips: string[];
  selectedCounties: { value: string; label: string }[];
  onRemoveZip: (zip: string) => void;
  onRemoveCounty: (fips: string) => void;
  onClearAll: () => void;
  onFindResults: () => void;
}

export const LeadSelectionSidebar: React.FC<LeadSelectionSidebarProps> = ({
  selectedZips,
  selectedCounties,
  onRemoveZip,
  onRemoveCounty,
  onClearAll,
  onFindResults,
}) => {
  const totalSelected = selectedZips.length + selectedCounties.length;

  return (
    <aside className="flex flex-col gap-6 w-full max-w-[320px]">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Selected Geography
        </h3>

        <div className="flex flex-col gap-4">
          {/* Counties Section */}
          <section>
            <h4 className="mb-3 text-sm font-medium text-zinc-900 flex items-center justify-between">
              Counties
              <span className="text-xs font-normal text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                {selectedCounties.length}
              </span>
            </h4>
            <div className="flex flex-col gap-2 max-h-[164px] overflow-y-auto pr-1 custom-scrollbar">
              {selectedCounties.length === 0 ? (
                <p className="text-sm text-zinc-400 italic">
                  No counties selected
                </p>
              ) : (
                selectedCounties.map((county) => (
                  <div
                    key={county.value}
                    className="group flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/50 px-3 py-2 transition-all hover:bg-zinc-50"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-zinc-700">
                        {county.label}
                      </span>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-tight">
                        FIPS: {county.value}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveCounty(county.value)}
                      className="text-zinc-300 hover:text-red-500 transition-colors"
                      aria-label={`Remove ${county.label}`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <hr className="border-zinc-100" />

          {/* ZIP Codes Section */}
          <section>
            <h4 className="mb-3 text-sm font-medium text-zinc-900 flex items-center justify-between">
              ZIP Codes
              <span className="text-xs font-normal text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                {selectedZips.length}
              </span>
            </h4>
            <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar leading-none">
              {selectedZips.length === 0 ? (
                <p className="col-span-2 text-sm text-zinc-400 italic">
                  No ZIPs selected
                </p>
              ) : (
                selectedZips.map((zip) => (
                  <div
                    key={zip}
                    className="group flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50/50 px-2 py-1.5 transition-all hover:bg-zinc-50"
                  >
                    <span className="text-xs font-medium text-zinc-600">
                      {zip}
                    </span>
                    <button
                      onClick={() => onRemoveZip(zip)}
                      className="text-zinc-300 hover:text-red-500 transition-colors"
                      aria-label={`Remove ${zip}`}
                    >
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Footer Action Area */}
        <div className="mt-6 border-t border-zinc-100 pt-6">
          <div className="mb-4 flex items-center justify-between px-1">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-zinc-900">
                {totalSelected} Areas Selected
              </span>
              <span className="text-[10px] text-zinc-500">
                Across {selectedCounties.length} counties
              </span>
            </div>
            <button
              onClick={onClearAll}
              className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 hover:text-red-500 transition-colors"
            >
              Clear All
            </button>
          </div>

          <button
            onClick={onFindResults}
            disabled={totalSelected === 0}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
          >
            <svg
              className={`h-4 w-4 transition-transform group-hover:scale-110 ${totalSelected === 0 ? "opacity-20" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Find Results
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10 transition-all group-hover:h-full group-hover:bg-white/5" />
          </button>

          <p className="mt-3 text-center text-[10px] text-zinc-400">
            Based on your age and income filters
          </p>
        </div>
      </div>
    </aside>
  );
};
