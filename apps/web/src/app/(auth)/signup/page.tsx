"use client";

import { useState } from "react";
import Link from "next/link";
import { SocialLogin } from "@/components/auth/SocialLogin";
import { Input } from "@/components/ui/input";
import { signupAction } from "../actions";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const result = await signupAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="md:space-y-8 space-y-6">
      <div className="space-y-1">
        <h1 className="xl:text-[40px] lg:text-[34px] text-[30px] leading-[110%] font-semibold tracking-[0.2px] text-[#0D6363] mb-[8px] font-lora">
          Welcome to SUL Local
        </h1>
        <p className="xl:text-[15px] text-[14px] text-[#333333] leading-[130%] font-noto-sans">
          Create your free account and run list criteria before purchasing any
          leads.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-[13px] font-medium text-red-600 border border-red-100">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 md:gap-4 gap-2.5">
          <div className="space-y-1.5">
            <Input
              id="first-name"
              name="firstName"
              type="text"
              placeholder="First Name"
              className="font-noto-sans h-11 rounded-xl border-none bg-[#F4F4F4] px-4 text-[14px] transition-all placeholder:text-zinc-400 shadow-sm ring-0! ring-offset-0!"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-1.5">
            <Input
              id="last-name"
              name="lastName"
              type="text"
              placeholder="Last Name"
              className="font-noto-sans h-11 rounded-xl border-none bg-[#F4F4F4] px-4 text-[14px] transition-all placeholder:text-zinc-400 shadow-sm ring-0! ring-offset-0!"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            className="font-noto-sans h-11 rounded-xl border-none bg-[#F4F4F4] px-4 text-[14px] transition-all placeholder:text-zinc-400 shadow-sm ring-0! ring-offset-0!"
            required
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-2 md:gap-4 gap-2.5">
          <div className="space-y-1.5">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="font-noto-sans h-11 rounded-xl border-none bg-[#F4F4F4] px-4 text-[15px] transition-all placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm ring-0! ring-offset-0!"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-1.5">
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="font-noto-sans h-11 rounded-xl border-none bg-[#F4F4F4] px-4 text-[15px] transition-all placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm ring-0! ring-offset-0!"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-11 w-full items-center justify-center rounded-[12px] bg-[#0D6363] px-8 text-[15px] font-semibold font-noto-sans text-white transition-all hover:bg-[#0D6363]/90 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </form>

      <SocialLogin />

      <div className="text-center text-[15px] text-[#888888] font-noto-sans">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#0D6363] hover:underline cursor-pointer"
        >
          Log in
        </Link>
      </div>

      <div className="px-[16px] py-[10px] bg-[#F4F4F4] rounded-[10px] text-[13px] text-[#888888] font-noto-sans xl:mt-[50px] lg:mt-[40px] md:mt-[30px] mt-[20px]">
        By signing in or creating an account, you agree with our{" "}
        <Link href={"/"} className="underline text-[#333333] font-medium">
          {" "}
          Terms & Conditions{" "}
        </Link>{" "}
        and{" "}
        <Link href={"/"} className="underline text-[#333333] font-medium">
          {" "}
          Privacy Statement
        </Link>
        .
      </div>
    </div>
  );
}
