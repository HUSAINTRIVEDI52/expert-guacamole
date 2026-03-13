"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LeadSearchBar } from "./LeadSearchBar";
import { RecommendedLeads } from "./RecommendedLeads";
import { OnboardingDialog } from "./OnboardingDialog";

export const MainHomePage: React.FC = () => {
  // Dialog auto-opens on first visit; closes after "Complete Setup"
  const [onboardingOpen, setOnboardingOpen] = useState(true);
  const router = useRouter();

  const handleSearch = (stateFips: string) => {
    if (stateFips) {
      router.push(`/leads?state=${stateFips}`);
    }
  };

  const handleRecommendedSelect = (category: string) => {
    // Fallback for recommended, simply route to leads for now without state
    console.log("Selected category:", category);
    router.push("/leads");
  };

  const handleOnboardingComplete = (data: {
    profession: string;
    location: string;
  }) => {
    console.log("Onboarding complete:", data);
    // TODO: persist data to user profile / API
    setOnboardingOpen(false);
  };

  return (
    <div
      className="relative flex flex-col h-[calc(100vh-110px)] overflow-auto bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/main-home-page-bg.png')" }}
    >
      {/* Onboarding Dialog */}
      <OnboardingDialog
        open={onboardingOpen}
        onComplete={handleOnboardingComplete}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-[15px] pt-[100px] pb-[50px]">
        {/* Heading */}
        <div className="mb-[30px]">
          <h1 className="mb-[10px] text-white font-noto-sans font-bold text-[46px] leading-[110%]">
            Search and explore leads to grow your business
          </h1>
          <h2 className="text-[20px] leading-[110%] font-noto-sans font-medium text-white/80">
            Find and Engage High-Potential Accounts
          </h2>
        </div>

        {/* Search Bar */}
        <div className="mb-[70px]">
          <LeadSearchBar onSearch={handleSearch} />
        </div>

        {/* Recommended Leads */}
        <div className="max-w-2xl mx-auto">
          <RecommendedLeads onSelect={handleRecommendedSelect} />
        </div>
      </div>
    </div>
  );
};
