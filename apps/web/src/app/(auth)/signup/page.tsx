"use client";

import { useState } from "react";
import Link from "next/link";
import { SocialLogin } from "@/components/auth/SocialLogin";
import { signupAction } from "../actions";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signupAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 lg:text-3xl">
          Get Started
        </h1>
        <p className="text-[14px] text-zinc-500">
          Create your free account to start exploring leads
        </p>
      </div>

      <SocialLogin />

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-[13px] font-medium text-red-600 border border-red-100">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="first-name"
              className="text-[13px] font-semibold text-zinc-700 ml-1"
            >
              First Name
            </label>
            <input
              id="first-name"
              name="firstName"
              type="text"
              placeholder="John"
              className="flex h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/30 px-4 text-[14px] ring-offset-white transition-all placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:border-zinc-300 shadow-sm"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="last-name"
              className="text-[13px] font-semibold text-zinc-700 ml-1"
            >
              Last Name
            </label>
            <input
              id="last-name"
              name="lastName"
              type="text"
              placeholder="Doe"
              className="flex h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/30 px-4 text-[14px] ring-offset-white transition-all placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:border-zinc-300 shadow-sm"
              required
              disabled={isLoading}
            />
          </div>
        </div>

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
          <label
            htmlFor="password"
            className="text-[13px] font-semibold text-zinc-700 ml-1"
          >
            Password
          </label>
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
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </form>

      <p className="text-center text-[13px] text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-zinc-950 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
