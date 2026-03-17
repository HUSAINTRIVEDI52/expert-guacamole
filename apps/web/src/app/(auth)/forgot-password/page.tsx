"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "../actions";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await forgotPasswordAction(formData);

    setIsLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-lora mb-[10px] font-semibold tracking-wide text-[#0D6363] lg:text-3xl">
          Forgot password?
        </h1>
        <p className="text-[15px] font-noto-sans leading-[140%] text-[#888888]">
          Enter your email and we&apos;ll send you a link to reset your password
        </p>
      </div>

      {success ? (
        <div className="space-y-6">
          <div className="rounded-xl bg-green-50 p-4 text-[14px] font-noto-sans font-medium text-green-700 border border-green-100">
            If your email is in our system, you will receive a password reset
            link shortly.
          </div>
          <Link
            href="/login"
            className="flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 px-8 text-[14px] font-noto-sans font-bold text-white shadow-md transition-all hover:bg-zinc-800 active:scale-95"
          >
            Return to Login
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-[13px] font-noto-sans font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            {/* <label
              htmlFor="email"
              className="text-[13px] font-noto-sans font-semibold text-zinc-700 ml-1"
            >
              Email Address
            </label> */}
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              className="w-full font-noto-sans h-11 rounded-xl border-none bg-[#F4F4F4] px-4 text-[15px] transition-all placeholder:text-zinc-400 shadow-sm ring-0! ring-offset-0!"
              required
              disabled={isLoading}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="lex h-11 w-full items-center justify-center rounded-[12px] bg-[#0D6363] px-8 text-[15px] font-semibold font-noto-sans text-white transition-all hover:bg-[#0D6363]/90 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "Sending Link..." : "Send Reset Link"}
            </button>
          </div>

          <p className="text-center text-[15px] text-[#888888] font-noto-sans">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="text-[#0D6363] hover:underline cursor-pointer"
            >
              Back to login
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
