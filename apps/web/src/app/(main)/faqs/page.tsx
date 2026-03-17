"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, X } from "lucide-react";

const FAQ_DATA = [
  {
    question: "How do I join SUL?",
    answer:
      "Joining SUL is easy! Simply click the 'Sign Up' button in the top right corner and follow the instructions to create your account.",
  },
  {
    question: "Who can sign up for SUL?",
    answer:
      "SUL is open to anyone looking for high-quality leads. Whether you're an individual agent or a large business, we have tools tailored for you.",
  },
  {
    question: "Where is SUL based?",
    answer:
      "SUL is based in the United States, providing lead generation services across various states.",
  },
  {
    question: "Where is SUL available?",
    answer:
      "Currently, SUL provides leads for several states including Texas, California, Florida, and more. We are constantly expanding our coverage.",
  },
  {
    question: "Why was SUL created?",
    answer:
      "SUL was created to bridge the gap between quality leads and professionals who need them, providing a modern, map-based interface for precise selection.",
  },
  {
    question: 'Why are we called "SUL"?',
    answer:
      "SUL stands for Smart Unified Leads, reflecting our commitment to providing intelligent and consolidated lead generation solutions.",
  },
  {
    question: "I feel good. Why use SUL?",
    answer:
      "Even if business is good, SUL helps you optimize your lead pipeline and discover new opportunities you might have missed with traditional methods.",
  },
];

export default function FAQPage() {
  return (
    <div className="bg-[#f9fafb] min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-noto-sans">
      <div className="max-w-3xl mx-auto">
        <div className="lg:mb-[60px] mb-[40px] text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#333333] mb-6 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-[#666666] text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about SUL. Can't find the answer you're
            looking for? Reach out to our team.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-[#EEEEEA] bg-white md:rounded-[16px] rounded-[10px] px-2 overflow-hidden shadow-sm transition-all hover:shadow-md"
            >
              <AccordionTrigger
                hideIcon={true}
                className="hover:no-underline py-5 px-4 group cursor-pointer flex items-center justify-between gap-4"
              >
                <span className="text-[18px] font-semibold text-[#333333] text-left leading-snug">
                  {item.question}
                </span>
                <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-[#BDD8D9]/30 group-data-[state=open]:bg-[#0D6363] transition-all duration-300">
                  <Plus className="w-4 h-4 text-[#0D6363] transition-transform group-data-[state=open]:hidden" />
                  <X className="w-4 h-4 text-white hidden group-data-[state=open]:block" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-6 text-[#666666] text-[16px] leading-[140%]">
                <div className="pt-2 border-t border-[#f4f4f4]">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-[40px] text-center bg-white border border-[#EEEEEA] md:rounded-[16px] rounded-[10px] p-8 md:p-12 shadow-sm">
          <h3 className="text-xl md:text-2xl font-semibold text-[#333333] mb-3">
            Still have questions?
          </h3>
          <p className="text-[#666666] mb-8 text-[15px] md:text-base leading-[140%] font-medium">
            Can't find the answer you're looking for? Please chat to our
            friendly team.
          </p>
          <button className="px-8 py-3 rounded-xl bg-[#0D6363] hover:bg-[#0D6363]/90 text-white font-semibold text-[15px] transition-all active:scale-95 shadow-[0px_4px_10px_0px_#0D636340] cursor-pointer">
            Get in Touch
          </button>
        </div>
      </div>
    </div>
  );
}
