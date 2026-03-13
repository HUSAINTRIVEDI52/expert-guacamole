"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PROFESSIONS = [
  "Doctor / Physician",
  "Dentist",
  "Lawyer / Attorney",
  "Financial Advisor",
  "Real Estate Agent",
  "Insurance Agent",
  "Accountant / CPA",
  "Business Owner",
  "CEO / Executive",
  "Sales Manager",
  "Software Engineer",
  "Marketing Professional",
  "Consultant",
  "Therapist / Counselor",
  "Other",
];

const LOCATIONS = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
  "Austin, TX",
  "Jacksonville, FL",
  "Fort Worth, TX",
  "Columbus, OH",
  "Charlotte, NC",
  "Indianapolis, IN",
  "San Francisco, CA",
  "Seattle, WA",
  "Denver, CO",
  "Nashville, TN",
  "Miami, FL",
  "Atlanta, GA",
  "Boston, MA",
  "Portland, OR",
  "Minneapolis, MN",
];

const TOTAL_STEPS = 2;

interface OnboardingDialogProps {
  open: boolean;
  onComplete: (data: { profession: string; location: string }) => void;
}

export function OnboardingDialog({ open, onComplete }: OnboardingDialogProps) {
  const [step, setStep] = useState(1);
  const [profession, setProfession] = useState("");
  const [location, setLocation] = useState("");

  const progress = (step / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  const handleComplete = () => {
    onComplete({ profession, location });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-[470px] w-full rounded-[16px] bg-white p-[32px] shadow-2xl border-0 [&>button]:hidden p-[24px]">
        {/* Title */}
        <div className="text-center mb-[15px]">
          <h2 className="font-lora font-semibold text-[30px] text-[#0D6363] leading-[110%] mb-[10px]">
            Welcome to SUL Local
          </h2>
          <p className="text-[#333333] text-[15px] font-noto-sans leading-[120%]">
            Tell us a bit about your work so we can show you more
            <br />
            relevant leads, insights, and recommendations.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-[15px]">
          <div className="h-[18px] w-full bg-[#F4F4F4] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#BDD8D9] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step 1: Profession */}
        {step === 1 && (
          <div className="space-y-[10px]">
            <div className="mb-[30px]">
              <h3 className="font-noto-sans font-semibold text-[18px] text-[#333333] mb-[6px]">
                What do you do?
              </h3>
              <p className="font-noto-sans text-[15px] text-[#888888] mb-[12px]">
                Select the profession that best describes you.
              </p>
              <Select onValueChange={setProfession} value={profession}>
                <SelectTrigger className="w-full h-[46px] bg-[#F4F4F4] rounded-[12px] font-noto-sans text-[15px] font-medium text-[#333333] shadow-none ring-0! ring-offset-0!">
                  <SelectValue placeholder="Profession" />
                </SelectTrigger>
                <SelectContent>
                  {PROFESSIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button
              onClick={handleNext}
              disabled={!profession}
              className="w-full h-[44px] bg-[#0D6363] hover:bg-[#0D6363]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-noto-sans font-semibold text-[15px] rounded-[10px] transition-all active:scale-[0.98] cursor-pointer"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-[10px]">
            <div className="mb-[30px]">
              <h3 className="font-noto-sans font-semibold text-[18px] text-[#333333] mb-[6px]">
                Where are you based?
              </h3>
              <p className="font-noto-sans text-[15px] text-[#888888] mb-[12px]">
                Choose your country or primary service location.
              </p>
              <Select onValueChange={setLocation} value={location}>
                <SelectTrigger className="w-full h-[46px] bg-[#F4F4F4] rounded-[12px] font-noto-sans text-[15px] font-medium text-[#333333] shadow-none ring-0! ring-offset-0!">
                  <SelectValue placeholder="Country / Location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button
              onClick={handleComplete}
              disabled={!location}
              className="w-full h-[44px] bg-[#0D6363] hover:bg-[#0D6363]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-noto-sans font-semibold text-[15px] rounded-[10px] transition-all active:scale-[0.98] cursor-pointer"
            >
              Complete Setup
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
