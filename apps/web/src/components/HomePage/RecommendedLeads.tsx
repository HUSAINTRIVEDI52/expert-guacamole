"use client";

import { MoveUpRight, Star } from "lucide-react";

interface LeadCategory {
  category: string;
  jobTitle: string;
}

const RECOMMENDED_LEADS: LeadCategory[] = [
  { category: "Medical/Dental", jobTitle: "Dentist" },
  {
    category: "Professional Leadership",
    jobTitle: "Chief Executive Officer (CEO)",
  },
  { category: "Owners & Entrepreneurs", jobTitle: "Small Business Owner" },
  { category: "Legal", jobTitle: "Corporate Attorney" },
  { category: "Financial Services", jobTitle: "Financial Advisor" },
  { category: "Real Estate", jobTitle: "Real Estate Agent" },
];

interface RecommendedLeadsProps {
  onSelect: (category: string, jobTitle: string) => void;
}

export function RecommendedLeads({ onSelect }: RecommendedLeadsProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 py-3 px-5 mb-[20px]">
        <Star className="h-4 w-4 text-[#E5A800] fill-[#E5A800]" />
        <span className="text-white text-[18px] font-noto-sans font-medium tracking-wide">
          Recommended Leads &amp; Professions/Job Title
        </span>
      </div>

      {/* Items */}
      <div className="divide-y divide-white/10">
        {RECOMMENDED_LEADS.map(({ category, jobTitle }) => (
          <button
            key={`${category}-${jobTitle}`}
            onClick={() => onSelect(category, jobTitle)}
            className="w-full flex items-center justify-between px-5 py-3 bg-[#FFFFFF]/20 hover:bg-[#FFFFFF]/30 border border-[#EEEEEA]/50 hover:scale-[1.02] transition-all cursor-pointer group text-left rounded-[10px] mb-[10px]"
          >
            <span className="text-white font-noto-sans text-[18px]">
              <span className="font-semibold">{category}</span>
              <span className="text-white/60 mx-2">|</span>
              <span>{jobTitle}</span>
            </span>
            <MoveUpRight
              absoluteStrokeWidth
              className="h-5 w-5 text-white/70 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-3"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
