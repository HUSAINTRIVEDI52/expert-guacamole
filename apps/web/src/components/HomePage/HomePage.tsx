"use client";

import React, { useState } from "react";
import { AuthVideoFaq } from "../AuthVideoFaq";
import { AuthMarquee } from "../AuthMarquee";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TextSlider } from "./TextSlider";

// Replace this with your actual YouTube video ID
const YOUTUBE_VIDEO_ID = "nJ25yl34Uqw";

const COMPETITORS = ["Name 1", "Name 2", "Name 3", "Name 4", "Name 5"];

export const HomePage: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col lg:h-[calc(100dvh-110px)] md:h-[calc(100dvh-90px)] h-[calc(100dvh-70px)]">
      <div className="px-[15px] 2xl:py-[80px] xl:py-[60px] lg:py-[50px] md:py-[50px] py-[40px] h-full overflow-auto xl:px-[80px] lg:px-[40px] px-[20px]">
        <div className="flex flex-wrap items-center xl:gap-[70px] lg:gap-[50px] md:gap-[40px] gap-[20px]">
          <div className="md:w-[55%] w-full flex-1">
            <h1 className="font-lora font-bold 2xl:text-[64px] xl:text-[52px] lg:text-[48px] md:text-[40px] sm:text-[32px] text-[28px] leading-[110%] text-[#0D6363] mb-[16px]">
              Data-Driven Leads Tailored to Your Services
            </h1>
            <p className="text-[#888888] text-[15px] leading-[140%] font-noto-sans mb-[22px]">
              We provide leads for professionals to grow their businesses the
              old-school, tried-and-true way: by trusting themselves over
              technology automation. No one is better than you at growing and
              serving clients. Stop letting tech salespeople convince you
              otherwise.
            </p>

            <div className="lg:mb-[65px] md:mb-[50px] mb-[40px]">
              <div className="flex flex-wrap items-center mb-[30px]">
                <h3 className="lg:text-[24px] md:text-[22px] text-[20px] font-medium font-noto-sans text-[#333333] mr-[10px]">
                  Why us versus
                </h3>
                {/* competitor name slider */}
                <TextSlider
                  items={COMPETITORS}
                  interval={2000}
                  className="lg:text-[24px] md:text-[22px] text-[20px]"
                />
              </div>
              <button className="bg-[#0D6363] hover:bg-[#0D6363]/90 text-white px-[20px] py-[11px] rounded-lg text-[15px] font-semibold transition-all active:scale-95 font-noto-sans cursor-pointer capitalize">
                Get Started
              </button>
            </div>

            <div className="">
              <AuthVideoFaq className="bg-[transparent] px-0!" novideo={true} />
            </div>
          </div>
          <div className="md:w-[45%] w-full flex flex-col rounded-[12px] overflow-hidden">
            <div
              className="relative aspect-16/9 rounded-[12px] overflow-hidden bg-[#721516] group cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <Image
                src={"/preview-image.png"}
                alt="Video Thumbnail"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors">
                <div className="xl:w-[71px] xl:h-[49px] lg:w-[60px] lg:h-[40px] md:w-[50px] md:h-[35px] w-[45px] h-[35px] flex items-center justify-center rounded-[8px] bg-[#E12929] shadow-md group-hover:scale-110 transition-transform">
                  <svg
                    className="xl:w-9 xl:h-9 lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <AuthMarquee />
      </div>

      {/* YouTube Video Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 border-0 bg-black max-w-4xl w-full">
          <div className="relative w-full aspect-video">
            {open && (
              <iframe
                className="w-full h-full rounded-[12px]"
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
