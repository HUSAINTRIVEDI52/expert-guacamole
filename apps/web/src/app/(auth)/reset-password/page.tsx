"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { resetPasswordAction } from "../actions";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | null>(
    token ? null : "Missing reset token. Please check your email link.",
  );
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;

    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("token", token);

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const result = await resetPasswordAction(formData);

    setIsLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      // Auto redirect after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  }

  if (!token && !success) {
    return (
      <div className="space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-zinc-900">Invalid Link</h1>
          <p className="text-zinc-500">
            The password reset link is missing or invalid.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="inline-block text-zinc-950 font-bold hover:underline"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 lg:text-3xl">
          Set new password
        </h1>
        <p className="text-[14px] text-zinc-500">
          Choose a strong password for your account
        </p>
      </div>

      {success ? (
        <div className="space-y-6">
          <div className="rounded-xl bg-green-50 p-4 text-[14px] font-medium text-green-700 border border-green-100 text-center">
            Password reset successfully! Redirecting you to login...
          </div>
          <Link
            href="/login"
            className="flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 px-8 text-[14px] font-bold text-white shadow-md transition-all hover:bg-zinc-800"
          >
            Go to Login Now
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
              htmlFor="password"
              className="text-[13px] font-semibold text-zinc-700 ml-1"
            >
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="flex h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/30 px-4 text-[14px] ring-offset-white transition-all placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:border-zinc-300 shadow-sm"
              required
              minLength={8}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-[13px] font-semibold text-zinc-700 ml-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="flex h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/30 px-4 text-[14px] ring-offset-white transition-all placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:border-zinc-300 shadow-sm"
              required
              minLength={8}
              disabled={isLoading}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-zinc-950 px-8 text-[14px] font-bold text-white shadow-md transition-all hover:bg-zinc-800 active:scale-95 disabled:opacity-70"
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
