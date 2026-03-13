"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const US_STATES = [
  { name: "Alabama", fips: "01" },
  { name: "Alaska", fips: "02" },
  { name: "Arizona", fips: "04" },
  { name: "Arkansas", fips: "05" },
  { name: "California", fips: "06" },
  { name: "Colorado", fips: "08" },
  { name: "Connecticut", fips: "09" },
  { name: "Delaware", fips: "10" },
  { name: "Florida", fips: "12" },
  { name: "Georgia", fips: "13" },
  { name: "Hawaii", fips: "15" },
  { name: "Idaho", fips: "16" },
  { name: "Illinois", fips: "17" },
  { name: "Indiana", fips: "18" },
  { name: "Iowa", fips: "19" },
  { name: "Kansas", fips: "20" },
  { name: "Kentucky", fips: "21" },
  { name: "Louisiana", fips: "22" },
  { name: "Maine", fips: "23" },
  { name: "Maryland", fips: "24" },
  { name: "Massachusetts", fips: "25" },
  { name: "Michigan", fips: "26" },
  { name: "Minnesota", fips: "27" },
  { name: "Mississippi", fips: "28" },
  { name: "Missouri", fips: "29" },
  { name: "Montana", fips: "30" },
  { name: "Nebraska", fips: "31" },
  { name: "Nevada", fips: "32" },
  { name: "New Hampshire", fips: "33" },
  { name: "New Jersey", fips: "34" },
  { name: "New Mexico", fips: "35" },
  { name: "New York", fips: "36" },
  { name: "North Carolina", fips: "37" },
  { name: "North Dakota", fips: "38" },
  { name: "Ohio", fips: "39" },
  { name: "Oklahoma", fips: "40" },
  { name: "Oregon", fips: "41" },
  { name: "Pennsylvania", fips: "42" },
  { name: "Rhode Island", fips: "44" },
  { name: "South Carolina", fips: "45" },
  { name: "South Dakota", fips: "46" },
  { name: "Tennessee", fips: "47" },
  { name: "Texas", fips: "48" },
  { name: "Utah", fips: "49" },
  { name: "Vermont", fips: "50" },
  { name: "Virginia", fips: "51" },
  { name: "Washington", fips: "53" },
  { name: "West Virginia", fips: "54" },
  { name: "Wisconsin", fips: "55" },
  { name: "Wyoming", fips: "56" },
];

interface LeadSearchBarProps {
  onSearch: (stateFips: string) => void;
}

export function LeadSearchBar({ onSearch }: LeadSearchBarProps) {
  const [selectedState, setSelectedState] = useState("");

  return (
    <div className="w-full bg-[#EEEEEA]/50 backdrop-blur-md rounded-[20px] p-3 shadow-xl">
      <div className="flex flex-col sm:flex-row gap-[12px] items-stretch sm:items-center bg-white min-h-[160px] px-[48px] py-[24px] rounded-[20px]">
        {/* Location Select (State) */}
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0D6363] z-10 pointer-events-none" />
          <Select onValueChange={setSelectedState}>
            <SelectTrigger
              className="pl-10 bg-[#F4F4F4] border-0 shadow-sm h-16 text-[18px] rounded-[12px] font-noto-sans ring-0! ring-offset-0! cursor-pointer"
              arrow={false}
            >
              <SelectValue
                placeholder="Location (State)"
                className="placeholder:text-[#888888]!"
              />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {US_STATES.map((state) => (
                <SelectItem key={state.fips} value={state.fips}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Find Leads Button */}
        <button
          onClick={() => onSearch(selectedState)}
          disabled={!selectedState}
          className="min-w-[200px] bg-[#F7B200] hover:bg-[#F7B200]/90 disabled:bg-[#F7B200]/50 disabled:cursor-not-allowed active:scale-95 text-[#333333] font-noto-sans font-medium text-[15px] px-8 h-16 rounded-[12px] transition-all uppercase cursor-pointer"
        >
          FIND LEADS
        </button>
      </div>
    </div>
  );
}
