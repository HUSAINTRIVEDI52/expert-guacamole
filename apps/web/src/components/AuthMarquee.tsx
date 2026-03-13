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
    <div className="w-full bg-[#096C5B] py-[18px] overflow-hidden relative z-10 flex items-center shrink-0">
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
            className="flex items-center text-white text-[24px] font-medium tracking-wide font-noto-sans"
          >
            <span>{item}</span>
            <span className="mx-5 text-[#E9A421] text-3xl leading-none">
              &bull;
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
