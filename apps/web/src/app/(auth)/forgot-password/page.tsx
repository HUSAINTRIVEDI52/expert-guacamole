"use client";

import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 lg:text-4xl">
          Reset Password
        </h1>
        <p className="text-zinc-500">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium text-zinc-700 ml-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="flex h-12 w-full rounded-full border border-zinc-200 bg-white px-5 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>

        <button className="flex h-12 w-full items-center justify-center rounded-full bg-zinc-950 px-8 text-sm font-medium text-white transition-opacity hover:opacity-90 active:scale-95">
          Send Reset Link
        </button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-zinc-950 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
