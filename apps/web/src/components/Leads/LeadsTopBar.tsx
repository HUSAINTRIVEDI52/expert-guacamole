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
    <div className="flex items-center justify-end flex-wrap gap-3 flex-1 md:w-auto w-full">
      {/* Right – Leads Count + Buy */}
      <div className="md:w-auto w-full flex items-center justify-between xl:gap-[70px] lg:gap-[50px] md:gap-[30px] gap-[20px] bg-[#EEEEEA] md:px-[18px] px-[12px] md:py-[12px] py-[8px] md:rounded-[20px] rounded-[10px]">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="md:text-[15px] text-[14px] text-[#333] font-noto-sans font-medium leading-[110%] capitalize mb-2">
              Available Leads
            </span>
            <span className="xl:text-[24px] lg:text-[22px] text-[18px] font-semibold text-[#0D6363] font-noto-sans leading-[110%]">
              {availableLeads}
            </span>
          </div>
        </div>
        <button
          onClick={onProceedToBuy}
          className="rounded-[10px] bg-[#0D6363] text-[#F4F4F4] font-noto-sans font-semibold md:text-[15px] text-[14px] px-[18px] py-[11px] hover:bg-[#0D6363]/90 active:scale-[0.98] transition-all cursor-pointer"
        >
          Proceed to Buy
        </button>
      </div>
    </div>
  );
}
