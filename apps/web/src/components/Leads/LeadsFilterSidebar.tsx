"use client";

import React, { useState } from "react";
import { X, Search } from "lucide-react";
import {
  ZipIcon as ZipSvg,
  ProfessionIcon as ProfessionSvg,
  DollarIcon as DollarSvg,
  AgeIcon as AgeSvg,
  CountyIcon as CountySvg,
  LeadTypeIcon as LeadTypeSvg,
  FilterIcon as FilterSvg,
  ChevronDownIcon as ChevronDownSvg,
  XIcon,
  SearchIcon,
} from "@/icons";

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
const ZipIcon = ZipSvg;
const ProfessionIcon = ProfessionSvg;
const DollarIcon = DollarSvg;
const AgeIcon = AgeSvg;
const CountyIcon = CountySvg;
const LeadTypeIcon = LeadTypeSvg;

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
          <ChevronDownSvg
            className={`h-2.5 w-2.5 text-[#888888] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>
      {open && <div className="pt-3 px-1">{children}</div>}
    </div>
  );
}

// ── Tag ───────────────────────────────────────────────────────────
function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-[#0D6363]/8 rounded-full bg-[#BDD8D9] text-[#0D6363] text-[13px] font-noto-sans px-[12px] py-[5px]">
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
            <span className="text-[15px] font-noto-sans text-[#323232]">
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
          <span className="text-[15px] font-noto-sans text-[#323232]">
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
          <FilterSvg />
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
