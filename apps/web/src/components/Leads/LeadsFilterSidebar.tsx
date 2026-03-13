"use client";

import React, { useState } from "react";
import { X, Search } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────

const PROFESSION_LIST = [
  "Chief Executive Officer (CEO)",
  "Chief Financial Officer (CFO)",
  "Chief Operating Officer (COO)",
  "Chief Technology Officer (CTO)",
  "Chief Marketing Officer (CMO)",
  "Chief Legal Officer (CLO)",
  "Chief Information Officer (CIO)",
  "Chief Human Resources Officer (CHRO)",
  "Chief Revenue Officer (CRO)",
  "Chief Growth Officer (CGO)",
  "Chief of Staff",
  "President",
  "Executive Vice President",
  "Senior Vice President",
  "Vice President",
  "Assistant Vice President",
  "Regional Sales Vice President",
  "Executive Vice President",
  "Executive Chair",
];

const NET_WORTH_OPTIONS = [
  { label: "< $249,999", value: "0-249999" },
  { label: "$250,000 - $749,999", value: "250000-749999" },
  { label: "$750,000 - $1,499,999", value: "750000-1499999" },
  { label: "$1,500,000 - $2,999,999", value: "1500000-2999999" },
  { label: "$3,000,000 - $5,000,000", value: "3000000-5000000" },
];

const AGE_OPTIONS = [
  { label: "18 - 24", value: "18-24" },
  { label: "25 - 34", value: "25-34" },
  { label: "35 - 44", value: "35-44" },
  { label: "45 - 54", value: "45-54" },
  { label: "55 - 64", value: "55-64" },
  { label: "65+", value: "65+" },
];

// ── Icons ─────────────────────────────────────────────────────────
const ZipIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#0D6363"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ProfessionIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#0D6363"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const DollarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#0D6363"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const AgeIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#0D6363"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// ── Filter Section ────────────────────────────────────────────────
interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  badge?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
}

function FilterSection({
  title,
  icon,
  badge,
  children,
  defaultOpen = false,
  collapsible = true,
}: FilterSectionProps) {
  const hasItems = badge !== undefined && badge > 0;
  const canToggle = collapsible || hasItems;

  // If not collapsible, it should always be open. Otherwise, use defaultOpen.
  const [open, setOpen] = useState(() => (collapsible ? defaultOpen : true));

  // Auto-expand/collapse when items are selected/deselected for non-collapsible sections
  // This effect is primarily for non-collapsible sections that might need to hide/show based on `hasItems`
  // For truly non-collapsible sections (like Zip Code), `open` is always true, and this effect might not be strictly necessary
  // but it handles the case where a non-collapsible section might conditionally hide its content if `hasItems` is false.
  const prevHasItems = React.useRef(hasItems);
  React.useEffect(() => {
    if (!collapsible) {
      setOpen(true); // Non-collapsible sections (like Zip) should stay open
    }
    prevHasItems.current = hasItems;
  }, [collapsible]);

  return (
    <div className="bg-white mb-[8px] rounded-[10px] p-[12px]">
      <button
        type="button"
        onClick={() => collapsible && setOpen(!open)}
        className={`flex w-full items-center justify-between px-1 group ${collapsible ? "cursor-pointer" : "cursor-default"}`}
      >
        <span className="flex items-center gap-2 text-[15px] font-medium text-[#333333] font-noto-sans">
          {icon}
          {title}
          {hasItems && (
            <span className="flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-[#0D6363] text-white text-[10px] font-semibold px-1">
              {badge}
            </span>
          )}
        </span>
        {canToggle && (
          <svg
            className={`h-2.5 w-2.5 text-[#888888] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            width="12"
            height="6"
            viewBox="0 0 12 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.35301 5.66533C5.40652 5.71715 5.47814 5.75951 5.56167 5.78878C5.64521 5.81804 5.73817 5.83333 5.83254 5.83333C5.92692 5.83333 6.01987 5.81804 6.10341 5.78878C6.18695 5.75951 6.25856 5.71715 6.31208 5.66533L11.5625 0.610125C11.6233 0.551818 11.6589 0.483524 11.6655 0.412663C11.6722 0.341802 11.6495 0.271085 11.6001 0.208194C11.5507 0.145304 11.4763 0.0926458 11.3852 0.055941C11.294 0.0192362 11.1895 -0.000111348 11.083 4.82054e-07H0.582131C0.475865 0.000293065 0.371729 0.0198895 0.280922 0.0566822C0.190114 0.0934749 0.116072 0.146072 0.0667562 0.208817C0.0174408 0.271562 -0.00528143 0.342081 0.00103305 0.41279C0.00734752 0.483499 0.0424598 0.551723 0.102594 0.610125L5.35301 5.66533Z"
              fill="#333333"
            />
          </svg>
        )}
      </button>
      {open && <div className="pt-3 px-1">{children}</div>}
    </div>
  );
}

// ── Tag ───────────────────────────────────────────────────────────
function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-[#0D6363]/8 rounded-full bg-[#BDD8D9] text-[#0D6363] text-[13px] font-noto-sans px-[14px] py-[6px]">
      {label}
      <button
        onClick={onRemove}
        className="w-[16px] h-[16px] bg-[#0D6363] text-white flex items-center justify-center rounded-full transition-colors cursor-pointer"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

// ── Inline Checkbox List ──────────────────────────────────────────
function InlineCheckboxList({
  options,
  selected,
  onToggle,
  searchable = false,
  searchPlaceholder = "Search...",
}: {
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
}) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div>
      {searchable && (
        <div className="flex items-center gap-2 rounded-lg bg-[#F4F4F4] px-2.5 py-1.5 mb-2">
          <Search className="h-3.5 w-3.5 text-[#888888] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="bg-transparent text-[12px] font-noto-sans text-[#333333] placeholder:text-[#888888] outline-none w-full"
          />
        </div>
      )}
      <div className="overflow-y-auto max-h-[180px] custom-scrollbar">
        {filtered.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2.5 px-1 py-1.5 cursor-pointer hover:bg-[#F4F4F4] rounded-lg transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
              className="h-3.5 w-3.5 rounded border-[#ccc] text-[#0D6363] accent-[#0D6363] cursor-pointer"
            />
            <span className="text-[13px] font-noto-sans text-[#333333]">
              {opt}
            </span>
          </label>
        ))}
        {filtered.length === 0 && (
          <p className="px-1 py-3 text-[12px] text-[#888888] font-noto-sans text-center">
            No results found
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export interface LeadsFilterState {
  selectedZips: string[];
  selectedProfessions: string[];
  selectedNetWorth: string[];
  selectedAge: string[];
}

interface LeadsFilterSidebarProps {
  filters: LeadsFilterState;
  onFiltersChange: (filters: LeadsFilterState) => void;
  onApply: () => void;
  onClearAll: () => void;
  availableZips?: string[];
  onSelectAllZips?: () => void;
  stateSelected?: boolean;
}

export function LeadsFilterSidebar({
  filters,
  onFiltersChange,
  onApply,
  onClearAll,
  availableZips = [],
  onSelectAllZips,
  stateSelected = false,
}: LeadsFilterSidebarProps) {
  const update = (patch: Partial<LeadsFilterState>) =>
    onFiltersChange({ ...filters, ...patch });

  const toggleInArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  return (
    <div className="flex flex-col h-full rounded-[16px] border-2 border-[#EEEEEA] pt-4 bg-[#F4F4F4] overflow-auto">
      {/* Header */}
      <div className="mb-[14px] px-4">
        <h2 className="flex items-center gap-2 text-[18px] font-medium text-[#333333] font-noto-sans">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="#333333"
            stroke="#333333"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filter
        </h2>
      </div>

      {/* Scrollable Filters */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
        {/* Zip Code */}
        <FilterSection
          title="Zip Code"
          icon={<ZipIcon />}
          badge={filters.selectedZips.length}
          collapsible={false}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[15px] font-noto-sans text-[#888888]">
              No Zip Code Selected.
            </span>
            {/* {availableZips.length > 0 && onSelectAllZips && (
                            <button
                                onClick={onSelectAllZips}
                                className="text-[12px] text-[#0D6363] font-medium hover:underline"
                            >
                                {filters.selectedZips.length === availableZips.length ? "Deselect All" : "Select All"}
                            </button>
                        )} */}
          </div>
          {filters.selectedZips.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {filters.selectedZips.map((z) => (
                <Tag
                  key={z}
                  label={z}
                  onRemove={() =>
                    update({
                      selectedZips: filters.selectedZips.filter((x) => x !== z),
                    })
                  }
                />
              ))}
            </div>
          )}
          {availableZips.length === 0 && (
            <div className="py-2 text-[13px] text-[#888888] font-noto-sans italic">
              {stateSelected
                ? "Loading zip codes..."
                : "Select a location first"}
            </div>
          )}
          {/* {availableZips.length > 0 ? (
                        <div className="mt-2 text-[#333333]">
                            <InlineCheckboxList
                                options={availableZips}
                                selected={filters.selectedZips}
                                onToggle={(z) => update({ selectedZips: toggleInArray(filters.selectedZips, z) })}
                                searchable
                                searchPlaceholder="Search zip code..."
                            />
                        </div>
                    ) : (
                        <div className="py-2 text-[13px] text-[#888888] font-noto-sans italic">
                            {stateSelected ? "Loading zip codes..." : "Select a location first"}
                        </div>
                    )} */}
        </FilterSection>

        {/* Profession / Job Title */}
        <FilterSection
          title="Profession/Job Title"
          icon={<ProfessionIcon />}
          badge={filters.selectedProfessions.length}
        >
          {filters.selectedProfessions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {filters.selectedProfessions.map((p) => (
                <Tag
                  key={p}
                  label={p}
                  onRemove={() =>
                    update({
                      selectedProfessions: filters.selectedProfessions.filter(
                        (x) => x !== p,
                      ),
                    })
                  }
                />
              ))}
            </div>
          )}
          <InlineCheckboxList
            options={PROFESSION_LIST}
            selected={filters.selectedProfessions}
            onToggle={(p) =>
              update({
                selectedProfessions: toggleInArray(
                  filters.selectedProfessions,
                  p,
                ),
              })
            }
            searchable
            searchPlaceholder="Search profession/job title..."
          />
        </FilterSection>

        {/* Net Worth */}
        <FilterSection
          title="Net Worth"
          icon={<DollarIcon />}
          badge={filters.selectedNetWorth.length}
        >
          {filters.selectedNetWorth.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {filters.selectedNetWorth.map((v) => (
                <Tag
                  key={v}
                  label={
                    NET_WORTH_OPTIONS.find((o) => o.value === v)?.label ?? v
                  }
                  onRemove={() =>
                    update({
                      selectedNetWorth: filters.selectedNetWorth.filter(
                        (x) => x !== v,
                      ),
                    })
                  }
                />
              ))}
            </div>
          )}
          <div className="flex flex-col gap-1">
            {NET_WORTH_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2.5 cursor-pointer rounded-lg px-1 py-1.5 hover:bg-[#F4F4F4] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.selectedNetWorth.includes(opt.value)}
                  onChange={() =>
                    update({
                      selectedNetWorth: toggleInArray(
                        filters.selectedNetWorth,
                        opt.value,
                      ),
                    })
                  }
                  className="h-3.5 w-3.5 rounded border-[#ccc] text-[#0D6363] accent-[#0D6363] cursor-pointer"
                />
                <span className="text-[13px] font-noto-sans text-[#333333]">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Age */}
        <FilterSection
          title="Age"
          icon={<AgeIcon />}
          badge={filters.selectedAge.length}
        >
          {filters.selectedAge.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {filters.selectedAge.map((v) => (
                <Tag
                  key={v}
                  label={AGE_OPTIONS.find((o) => o.value === v)?.label ?? v}
                  onRemove={() =>
                    update({
                      selectedAge: filters.selectedAge.filter((x) => x !== v),
                    })
                  }
                />
              ))}
            </div>
          )}
          <div className="flex flex-col gap-1">
            {AGE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2.5 cursor-pointer rounded-lg px-1 py-1.5 hover:bg-[#F4F4F4] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.selectedAge.includes(opt.value)}
                  onChange={() =>
                    update({
                      selectedAge: toggleInArray(
                        filters.selectedAge,
                        opt.value,
                      ),
                    })
                  }
                  className="h-3.5 w-3.5 rounded border-[#ccc] text-[#0D6363] accent-[#0D6363] cursor-pointer"
                />
                <span className="text-[13px] font-noto-sans text-[#333333]">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Footer */}
      <div className="py-4 px-4">
        <button
          onClick={onApply}
          className="w-full rounded-[10px] bg-[#0D6363] text-[#F4F4F4] font-noto-sans font-semibold text-[15px] py-[11px] hover:bg-[#0D6363]/90 active:scale-[0.98] transition-all cursor-pointer"
        >
          Apply Filters
        </button>
        <button
          onClick={onClearAll}
          className="w-full mt-3 text-[13px] text-[#888888] font-noto-sans hover:text-[#333333] transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
