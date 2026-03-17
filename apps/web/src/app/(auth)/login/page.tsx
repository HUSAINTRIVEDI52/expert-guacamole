"use client";

import { useState } from "react";
import Link from "next/link";
import { SocialLogin } from "@/components/auth/SocialLogin";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { loginAction } from "../actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

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
            {error.includes("Google") && (
              <div className="mt-2">
                <Link
                  href="/forgot-password"
                  className="text-zinc-950 font-bold hover:underline"
                >
                  Click here to set a password
                </Link>
              </div>
            )}
          </div>
        )}
        <div className="space-y-1.5">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            className="font-noto-sans h-11 rounded-xl border-none bg-[#F4F4F4] px-4 text-[15px] transition-all placeholder:text-zinc-400 shadow-sm ring-0! ring-offset-0!"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-1.5">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            className="font-noto-sans h-11 rounded-xl border-none bg-[#F4F4F4] px-4 text-[15px] transition-all placeholder:text-zinc-400 shadow-sm ring-0! ring-offset-0!"
            required
            disabled={isLoading}
          />
        </div>

        {/* remember my password  */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            name="remember"
            className="border-[#888888] text-white data-[state=checked]:bg-[#0D6363] data-[state=checked]:border-[#0D6363] rounded-[4px]"
          />
          <label
            htmlFor="remember"
            className="text-[15px] font-noto-sans text-[#888888] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Remember my password
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-11 w-full items-center justify-center rounded-[12px] bg-[#0D6363] px-8 text-[15px] font-semibold font-noto-sans text-white transition-all hover:bg-[#0D6363]/90 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? "Logging In..." : "Log In"}
          </button>
        </div>
        <div className="pt-2">
          <Link
            href="/forgot-password"
            className="text-[15px] text-[#888888] hover:text-[#0D6363] transition-colors font-noto-sans"
          >
            Forgot password?
          </Link>
        </div>
      </form>

      <SocialLogin />

      <div className="text-center text-[15px] text-[#888888] font-noto-sans">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-[#0D6363] hover:underline cursor-pointer"
        >
          Create account
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
