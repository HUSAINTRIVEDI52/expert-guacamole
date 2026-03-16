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
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="xl:text-4xl lg:text-3xl text-2xl font-bold font-noto-sans text-[#333333] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-[#666666] font-noto-sans xl:text-lg text-md leading-[140%]">
            Find answers to common questions about SUL and our services.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-0 bg-[#F4F4F4] rounded-[16px] px-2 overflow-hidden shadow-sm"
            >
              <AccordionTrigger
                hideIcon={true}
                className="hover:no-underline py-4 px-4 group cursor-pointer flex items-center"
              >
                <span className="text-[18px] font-semibold text-[#333333] font-noto-sans text-left">
                  {item.question}
                </span>
                <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded-lg bg-[#0D6363] group-data-[state=open]:bg-[#0D6363] transition-colors">
                  <Plus className="w-5 h-5 text-white group-data-[state=open]:hidden" />
                  <X className="w-5 h-5 text-white hidden group-data-[state=open]:block" />
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-[#444444] font-noto-sans text-[16px] leading-[150%]">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
