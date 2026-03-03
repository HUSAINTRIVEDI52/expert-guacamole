"use client";

import { useState } from "react";
import Link from "next/link";
import { SocialLogin } from "@/components/auth/SocialLogin";
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
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 lg:text-3xl">
          Welcome back
        </h1>
        <p className="text-[14px] text-zinc-500">
          Sign in to your account to continue
        </p>
      </div>

      <SocialLogin />

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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <label
              htmlFor="password"
              className="text-[13px] font-semibold text-zinc-700"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[12px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
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
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </form>

      <p className="text-center text-[13px] text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-bold text-zinc-950 hover:underline"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
