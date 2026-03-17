"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const YOUTUBE_VIDEO_ID = "nJ25yl34Uqw";

export function AuthVideoFaq({
  className,
  novideo = false,
}: {
  className?: string;
  novideo?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`${className}`}>
      <div className="w-full space-y-4">
        {/* Top Part: Demo Video and FAQ */}
        <div className="">
          <h3 className="text-[#333333] text-[18px] leading-[140%] font-medium mb-[12px] font-noto-sans">
            Watch our demo video and read our FAQs for more information.
          </h3>
          <div className="flex 2xl:gap-[24px] xl:gap-[20px] lg:gap-[15px] gap-[10px]">
            {/* Video Thumbnail */}
            {!novideo && (
              <div
                className="relative md:w-[184px] w-full md:h-[104px] h-[180px] rounded-[12px] overflow-hidden bg-[#721516] group cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <Image
                  src={"/preview-image.png"}
                  alt="Video Thumbnail"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors">
                  <div className="w-[37px] h-[25px] flex items-center justify-center rounded-[8px] bg-[#E52020] shadow-md group-hover:scale-110 transition-transform">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ Card */}
            <div className="relative md:w-[184px] w-full md:h-[104px] sm:h-[250px] h-[200px] rounded-[12px] overflow-hidden group cursor-pointer">
              {/* image here */}
              <Image
                src={"/faq-preview-image.png"}
                alt="FAQ Image"
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                <div className="rounded-lg flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                  <Image
                    src={"/Q-A-image.png"}
                    alt="faq icon"
                    width={32}
                    height={32}
                    className="object-contain md:w-[32px] w-[35px] md:h-[32px] h-[35px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Video Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 border-0 bg-black max-w-4xl w-full">
          <DialogTitle className="sr-only">Video Player</DialogTitle>
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
}
