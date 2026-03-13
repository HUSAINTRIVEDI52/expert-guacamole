"use client";

interface LeadsTopBarProps {
  availableLeads: string;
  onProceedToBuy: () => void;
}

export function LeadsTopBar({
  availableLeads,
  onProceedToBuy,
}: LeadsTopBarProps) {
  return (
    <div className="flex items-center justify-end flex-wrap gap-3">
      {/* Right – Leads Count + Buy */}
      <div className="flex items-center gap-[70px] bg-[#EEEEEA] px-[18px] py-[12px] rounded-[20px]">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[15px] text-[#333] font-noto-sans font-medium leading-[110%] capitalize mb-2">
              Available Leads
            </span>
            <span className="text-[24px] font-semibold text-[#0D6363] font-noto-sans leading-[110%]">
              {availableLeads}
            </span>
          </div>
        </div>
        <button
          onClick={onProceedToBuy}
          className="rounded-[10px] bg-[#0D6363] text-[#F4F4F4] font-noto-sans font-semibold text-[15px] px-[18px] py-[11px] hover:bg-[#0D6363]/90 active:scale-[0.98] transition-all cursor-pointer"
        >
          Proceed to Buy
        </button>
      </div>
    </div>
  );
}
