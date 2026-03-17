"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { resetPasswordAction } from "../actions";
import { Input } from "@/components/ui/input";

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
          <h1 className="text-2xl font-noto-sans mb-[10px] font-semibold tracking-wide text-[#0D6363] lg:text-3xl">
            Invalid Link
          </h1>
          <p className="text-[15px] font-noto-sans leading-[140%] text-[#888]">
            The password reset link is missing or invalid.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="font-noto-sans text-[15px] text-[#0D6363] hover:underline cursor-pointer"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-noto-sans mb-[10px] font-bold tracking-tight text-zinc-900 lg:text-3xl">
          Set new password
        </h1>
        <p className="text-[15px] font-noto-sans leading-[140%] text-[#888]">
          Choose a strong password for your account
        </p>
      </div>

      {success ? (
        <div className="space-y-6">
          <div className="rounded-xl bg-green-50 p-4 text-[14px] font-noto-sans font-medium text-green-700 border border-green-100 text-center">
            Password reset successfully! Redirecting you to login...
          </div>
          <Link
            href="/login"
            className="flex h-11 w-full items-center justify-center rounded-[12px] bg-[#0D6363] px-8 text-[15px] font-semibold font-noto-sans text-white transition-all hover:bg-[#0D6363]/90 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            Go to Login Now
          </Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-[14px] font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="New Password"
              className="w-full font-noto-sans h-11 rounded-xl border-none bg-[#F4F4F4] px-4 text-[15px] transition-all placeholder:text-zinc-400 shadow-sm ring-0! ring-offset-0!"
              required
              minLength={8}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="w-full font-noto-sans h-11 rounded-xl border-none bg-[#F4F4F4] px-4 text-[15px] transition-all placeholder:text-zinc-400 shadow-sm ring-0! ring-offset-0!"
              required
              minLength={8}
              disabled={isLoading}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center rounded-[12px] bg-[#0D6363] px-8 text-[15px] font-semibold font-noto-sans text-white transition-all hover:bg-[#0D6363]/90 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
