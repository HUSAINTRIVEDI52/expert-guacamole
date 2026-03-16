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
    width="16"
    height="16"
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
    width="18"
    height="18"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_361_1053)">
      <path
        d="M7.33816 14.0003H6.4035C4.0135 14.0003 2.81883 14.0003 2.07616 13.2437C1.3335 12.487 1.3335 11.2697 1.3335 8.83366C1.3335 6.39833 1.3335 5.18033 2.07616 4.42366C2.81883 3.66699 4.0135 3.66699 6.4035 3.66699H8.93883C11.3288 3.66699 12.5242 3.66699 13.2668 4.42366C13.8382 5.00566 13.9695 5.86099 14.0002 7.33366"
        stroke="#0D6363"
        strokeWidth="1.28"
        strokeLinecap="round"
      />
      <path
        d="M13.3442 13.3495L14.6662 14.6675M14.0349 11.6849C14.0401 11.3728 13.9832 11.0628 13.8674 10.773C13.7516 10.4831 13.5793 10.2192 13.3604 9.99669C13.1416 9.77414 12.8807 9.59739 12.5928 9.47674C12.305 9.35608 11.996 9.29395 11.6839 9.29395C11.3717 9.29395 11.0627 9.35608 10.7749 9.47674C10.4871 9.59739 10.2261 9.77414 10.0073 9.99669C9.78844 10.2192 9.6161 10.4831 9.50031 10.773C9.38452 11.0628 9.3276 11.3728 9.33285 11.6849C9.34324 12.3015 9.5955 12.8894 10.0353 13.3219C10.475 13.7543 11.0671 13.9966 11.6839 13.9966C12.3006 13.9966 12.8927 13.7543 13.3324 13.3219C13.7722 12.8894 14.0245 12.3015 14.0349 11.6849Z"
        stroke="#0D6363"
        strokeWidth="1.28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.667 3.66732L10.6003 3.46065C10.2703 2.43398 10.1057 1.92065 9.71299 1.62732C9.31966 1.33398 8.79833 1.33398 7.75366 1.33398H7.57833C6.53499 1.33398 6.01299 1.33398 5.62033 1.62732C5.22699 1.92065 5.06233 2.43398 4.73233 3.46065L4.66699 3.66732"
        stroke="#0D6363"
        strokeWidth="1.28"
      />
    </g>
    <defs>
      <clipPath id="clip0_361_1053">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const DollarIcon = () => (
  <svg
    width="16"
    height="16"
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
    width="16"
    height="16"
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

const CountyIcon = () => (
  <svg
    width="16"
    height="16"
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

const LeadTypeIcon = () => (
  <svg
    width="20"
    height="17"
    viewBox="0 0 20 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.0703 8.86609H15.1126C14.8461 8.86609 14.5882 8.9025 14.3427 8.96945C13.8584 8.01742 12.8696 7.36328 11.7303 7.36328H8.26973C7.13039 7.36328 6.14164 8.01742 5.65734 8.96945C5.40645 8.90088 5.14752 8.86612 4.88742 8.86609H2.92969C1.31426 8.86609 0 10.1804 0 11.7958V14.9254C0 15.8946 0.788555 16.6832 1.75781 16.6832H18.2422C19.2114 16.6832 20 15.8946 20 14.9254V11.7958C20 10.1804 18.6857 8.86609 17.0703 8.86609ZM5.34004 10.293V15.5114H1.75781C1.43473 15.5114 1.17188 15.2485 1.17188 14.9254V11.7958C1.17188 10.8266 1.96043 10.038 2.92969 10.038H4.88742C5.04648 10.038 5.20051 10.0596 5.34715 10.0994C5.34265 10.1639 5.34028 10.2284 5.34004 10.293ZM13.4881 15.5114H6.51191V10.293C6.51191 9.32375 7.30047 8.5352 8.26973 8.5352H11.7303C12.6995 8.5352 13.4881 9.32375 13.4881 10.293V15.5114ZM18.8281 14.9254C18.8281 15.2485 18.5653 15.5114 18.2422 15.5114H14.66V10.293C14.6597 10.2284 14.6573 10.1638 14.6529 10.0994C14.8027 10.0586 14.9573 10.038 15.1126 10.038H17.0703C18.0396 10.038 18.8281 10.8265 18.8281 11.7958V14.9254Z"
      fill="#0D6363"
      stroke="#0D6363"
      strokeWidth="0.2"
    />
    <path
      d="M3.90829 3.33301C2.47278 3.33301 1.30493 4.50086 1.30493 5.93637C1.30489 7.37187 2.47278 8.53973 3.90829 8.53973C5.34376 8.53973 6.51165 7.37187 6.51165 5.93637C6.51165 4.50086 5.3438 3.33301 3.90829 3.33301ZM3.90825 7.36785C3.11892 7.36785 2.47677 6.7257 2.47677 5.93637C2.47677 5.14703 3.11892 4.50488 3.90825 4.50488C4.69759 4.50488 5.33974 5.14703 5.33974 5.93637C5.33974 6.7257 4.69759 7.36785 3.90825 7.36785ZM9.9997 0.0996094C8.08188 0.0996094 6.52165 1.65984 6.52165 3.57766C6.52165 5.49547 8.08188 7.0557 9.9997 7.0557C11.9175 7.0557 13.4777 5.49547 13.4777 3.57766C13.4777 1.65988 11.9175 0.0996094 9.9997 0.0996094ZM9.9997 5.88383C8.72806 5.88383 7.69352 4.8493 7.69352 3.57766C7.69352 2.30605 8.72806 1.27148 9.9997 1.27148C11.2713 1.27148 12.3059 2.30602 12.3059 3.57766C12.3059 4.8493 11.2713 5.88383 9.9997 5.88383ZM16.0911 3.33301C14.6556 3.33301 13.4877 4.50086 13.4877 5.93637C13.4878 7.37187 14.6556 8.53973 16.0911 8.53973C17.5266 8.53973 18.6945 7.37187 18.6945 5.93637C18.6945 4.50086 17.5266 3.33301 16.0911 3.33301ZM16.0911 7.36785C15.3018 7.36785 14.6596 6.7257 14.6596 5.93637C14.6597 5.14703 15.3018 4.50488 16.0911 4.50488C16.8804 4.50488 17.5226 5.14703 17.5226 5.93637C17.5226 6.7257 16.8804 7.36785 16.0911 7.36785Z"
      fill="#0D6363"
      stroke="#0D6363"
      strokeWidth="0.2"
    />
  </svg>
);

const LEAD_TYPE_OPTIONS = [
  { label: "Final Expense", value: "final_expense" },
  { label: "Medicare", value: "medicare" },
  { label: "Life Insurance", value: "life_insurance" },
  { label: "Health Insurance", value: "health_insurance" },
  { label: "Auto Insurance", value: "auto_insurance" },
  { label: "Mortgage Refinance", value: "mortgage_refinance" },
];

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

interface ListOption {
  label: string;
  value: string;
}

// ── Inline Checkbox List ──────────────────────────────────────────
function InlineCheckboxList({
  options,
  selected,
  onToggle,
  searchable = false,
  searchPlaceholder = "Search...",
}: {
  options: ListOption[];
  selected: string[];
  onToggle: (val: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
}) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase()),
      )
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
            key={opt.value}
            className="flex items-center gap-2.5 px-1 py-1.5 cursor-pointer hover:bg-[#F4F4F4] rounded-lg transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => onToggle(opt.value)}
              className="h-3.5 w-3.5 rounded border-[#ccc] text-[#0D6363] accent-[#0D6363] cursor-pointer"
            />
            <span className="text-[13px] font-noto-sans text-[#333333]">
              {opt.label}
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

// ── Inline Radio List ─────────────────────────────────────────────
function InlineRadioList({
  options,
  selected,
  name,
  onChange,
}: {
  options: ListOption[];
  selected: string;
  name: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2.5 cursor-pointer rounded-lg px-1 py-1.5 hover:bg-[#F4F4F4] transition-colors"
        >
          <input
            type="radio"
            name={name}
            checked={selected === opt.value}
            onChange={() => onChange(opt.value)}
            className="h-3.5 w-3.5 rounded-full border-[#ccc] text-[#0D6363] accent-[#0D6363] cursor-pointer"
          />
          <span className="text-[13px] font-noto-sans text-[#333333]">
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export interface LeadsFilterState {
  selectedZips: string[];
  selectedCounties: string[];
  selectedLeadType: string;
  selectedProfessions: string[];
  selectedNetWorth: string;
  selectedAge: string;
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
  const [availableCounties, setAvailableCounties] = useState<
    { label: string; value: string }[]
  >([]);
  const [countiesLoading, setCountiesLoading] = useState(false);

  React.useEffect(() => {
    setCountiesLoading(true);
    fetch("/api/geo/counties-list")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setAvailableCounties(data);
        setCountiesLoading(false);
      })
      .catch(() => setCountiesLoading(false));
  }, []);

  const update = (patch: Partial<LeadsFilterState>) =>
    onFiltersChange({ ...filters, ...patch });

  const toggleInArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  return (
    <div className="flex flex-col h-full rounded-[16px] lg:border-2 border-[#EEEEEA] lg:pt-4 bg-[#F4F4F4] overflow-auto">
      {/* Header */}
      <div className="mb-[14px] lg:px-4 px-2">
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
      <div className="flex-1 overflow-y-auto custom-scrollbar lg:px-4 px-2">
        {/* Zip Code */}
        <FilterSection
          title="Zip Code"
          icon={<ZipIcon />}
          badge={filters.selectedZips.length}
          collapsible={true}
        >
          <div className="flex items-center justify-between mb-2">
            {filters.selectedZips.length === 0 && (
              <span className="text-[15px] font-noto-sans text-[#888888]">
                No Zip Code Selected.
              </span>
            )}
            {/* {availableZips.length > 0 && onSelectAllZips && (
              <button
                onClick={onSelectAllZips}
                className="text-[12px] text-[#0D6363] font-medium hover:underline cursor-pointer"
              >
                {filters.selectedZips.length === availableZips.length
                  ? "Deselect All"
                  : "Select All"}
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
                options={availableZips.map((z) => ({ label: z, value: z }))}
                selected={filters.selectedZips}
                onToggle={(z) =>
                  update({
                    selectedZips: toggleInArray(filters.selectedZips, z),
                  })
                }
                searchable
                searchPlaceholder="Search zip code..."
              />
            </div>
          ) : (
            <div className="py-2 text-[13px] text-[#888888] font-noto-sans italic">
              {stateSelected
                ? "Loading zip codes..."
                : "Select a location first"}
            </div>
          )} */}
        </FilterSection>
        {/* County */}
        <FilterSection
          title="County"
          icon={<CountyIcon />}
          badge={filters.selectedCounties.length}
          collapsible={true}
        >
          {filters.selectedCounties.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {filters.selectedCounties.map((c) => (
                <Tag
                  key={c}
                  label={
                    availableCounties.find((x) => x.value === c)?.label ?? c
                  }
                  onRemove={() =>
                    update({
                      selectedCounties: filters.selectedCounties.filter(
                        (x) => x !== c,
                      ),
                    })
                  }
                />
              ))}
            </div>
          )}
          {countiesLoading ? (
            <div className="py-2 text-[13px] text-[#888888] font-noto-sans italic">
              Loading counties...
            </div>
          ) : (
            <InlineCheckboxList
              options={availableCounties}
              selected={filters.selectedCounties}
              onToggle={(val) => {
                update({
                  selectedCounties: toggleInArray(
                    filters.selectedCounties,
                    val,
                  ),
                });
              }}
              searchable
              searchPlaceholder="Search county..."
            />
          )}
        </FilterSection>
        {/* Lead Type */}
        <FilterSection
          title="Lead Type"
          icon={<LeadTypeIcon />}
          // badge={filters.selectedLeadType ? 1 : 0}
          collapsible={true}
        >
          {/* {filters.selectedLeadType && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              <Tag
                key={filters.selectedLeadType}
                label={LEAD_TYPE_OPTIONS.find((o) => o.value === filters.selectedLeadType)?.label ?? filters.selectedLeadType}
                onRemove={() => update({ selectedLeadType: "" })}
              />
            </div>
          )} */}
          <InlineRadioList
            options={LEAD_TYPE_OPTIONS}
            selected={filters.selectedLeadType}
            name="leadType"
            onChange={(val) => update({ selectedLeadType: val })}
          />
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
            options={PROFESSION_LIST.map((p) => ({ label: p, value: p }))}
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
          // badge={filters.selectedNetWorth ? 1 : 0}
        >
          {/* {filters.selectedNetWorth && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              <Tag
                key={filters.selectedNetWorth}
                label={NET_WORTH_OPTIONS.find((o) => o.value === filters.selectedNetWorth)?.label ?? filters.selectedNetWorth}
                onRemove={() => update({ selectedNetWorth: "" })}
              />
            </div>
          )} */}
          <InlineRadioList
            options={NET_WORTH_OPTIONS}
            selected={filters.selectedNetWorth}
            name="netWorth"
            onChange={(val) => update({ selectedNetWorth: val })}
          />
        </FilterSection>

        {/* Age */}
        <FilterSection
          title="Age"
          icon={<AgeIcon />}
          // badge={filters.selectedAge ? 1 : 0}
        >
          {/* {filters.selectedAge && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              <Tag
                key={filters.selectedAge}
                label={AGE_OPTIONS.find((o) => o.value === filters.selectedAge)?.label ?? filters.selectedAge}
                onRemove={() => update({ selectedAge: "" })}
              />
            </div>
          )} */}
          <InlineRadioList
            options={AGE_OPTIONS}
            selected={filters.selectedAge}
            name="age"
            onChange={(val) => update({ selectedAge: val })}
          />
        </FilterSection>
      </div>

      {/* Footer */}
      <div className="pt-4 lg:pb-4 lg:px-4 px-2">
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
