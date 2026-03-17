"use client";

const items = [
  "Demo Required",
  "Lower Cost",
  "No CRM Integration",
  "No Monthly Fees",
];

// Duplicate items to ensure smooth infinite loop
const marqueeItems = [...items, ...items, ...items, ...items];

export function AuthMarquee() {
  return (
    <div className="w-full bg-[#096C5B] 2xl:py-[18px] xl:py-[16px] lg:py-[14px] md:py-[12px] py-[10px] overflow-hidden relative z-10 flex items-center shrink-0">
      <style>{`
        @keyframes auth-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="flex whitespace-nowrap w-max"
        style={{ animation: "auth-marquee 25s linear infinite" }}
      >
        {marqueeItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center text-white 2xl:text-[24px] lg:text-[20px] md:text-[18px] text-[16px] font-medium tracking-wide font-noto-sans"
          >
            <span>{item}</span>
            <span className="mx-5 text-[#E9A421] 2xl:text-[30px] xl:text-[25px] text-[20px] leading-none">
              &bull;
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
