"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "../actions";

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
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 lg:text-3xl">
          Forgot password?
        </h1>
        <p className="text-[14px] text-zinc-500">
          Enter your email and we&apos;ll send you a link to reset your password
        </p>
      </div>

      {success ? (
        <div className="space-y-6">
          <div className="rounded-xl bg-green-50 p-4 text-[14px] font-medium text-green-700 border border-green-100">
            If your email is in our system, you will receive a password reset
            link shortly.
          </div>
          <Link
            href="/login"
            className="flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 px-8 text-[14px] font-bold text-white shadow-md transition-all hover:bg-zinc-800 active:scale-95"
          >
            Return to Login
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-[13px] font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-[13px] font-semibold text-zinc-700 ml-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              className="flex h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/30 px-4 text-[14px] ring-offset-white transition-all placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:border-zinc-300 shadow-sm"
              required
              disabled={isLoading}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 px-8 text-[14px] font-bold text-white shadow-md transition-all hover:bg-zinc-800 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending Link..." : "Send Reset Link"}
            </button>
          </div>

          <p className="text-center text-[13px] text-zinc-500 pt-2">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="font-bold text-zinc-950 hover:underline"
            >
              Back to login
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
