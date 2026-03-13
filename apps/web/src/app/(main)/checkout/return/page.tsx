"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ReturnContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [sessionInfo, setSessionInfo] = useState<{
    status: string | null;
    payment_status: string | null;
    purchase_status: string | null;
    customer_email: string | null;
    payment_intent?: {
      id: string | null;
      status: string | null;
      last_payment_error: { message?: string } | null;
    };
  }>({
    status: null,
    payment_status: null,
    purchase_status: null,
    customer_email: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      fetch(`${API_BASE_URL}/payments/session-status?session_id=${sessionId}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setSessionInfo({
            status: data.status,
            payment_status: data.payment_status,
            purchase_status: data.purchase_status,
            customer_email: data.customer_email,
            payment_intent: data.payment_intent,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
        <p className="mt-4 text-zinc-600">Verifying payment status...</p>
      </div>
    );
  }

  const {
    status,
    payment_status,
    purchase_status,
    customer_email,
    payment_intent,
  } = sessionInfo;
  const isFailed =
    status === "expired" ||
    purchase_status === "failed" ||
    payment_intent?.status === "canceled" ||
    !!payment_intent?.last_payment_error;

  // SUCCESS STATE
  if (
    purchase_status === "completed" ||
    (status === "complete" && payment_status === "paid")
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-zinc-50">
        <div className="bg-emerald-100 p-6 rounded-full mb-6">
          <svg
            className="w-12 h-12 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-zinc-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-zinc-600 mb-8 max-w-md mx-auto text-lg">
          Thank you for your purchase. We&apos;ve sent a confirmation email to{" "}
          <span className="font-semibold text-zinc-900">{customer_email}</span>.
          Your leads are now available in your dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/lead-generation"
            className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 transition shadow-lg"
          >
            Main Page
          </a>
          <a
            href="/dashboard"
            className="bg-white text-zinc-900 border border-zinc-200 px-8 py-3 rounded-xl font-bold hover:bg-zinc-50 transition"
          >
            View My Leads
          </a>
        </div>
      </div>
    );
  }

  // FAILED STATE (Shown before pending if an error exists)
  if (isFailed) {
    const errorMessage =
      payment_intent?.last_payment_error?.message ||
      "Your payment could not be completed at this time.";

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-zinc-50">
        <div className="bg-red-100 p-6 rounded-full mb-6">
          <svg
            className="w-12 h-12 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-zinc-900 mb-4">
          Payment Failed
        </h1>
        <div className="bg-white border border-red-100 p-6 rounded-2xl shadow-sm mb-8 max-w-md mx-auto">
          <p className="text-zinc-900 font-semibold mb-2">Error Details:</p>
          <p className="text-red-600 italic">&quot;{errorMessage}&quot;</p>
        </div>
        <p className="text-zinc-600 mb-8 max-w-md mx-auto text-lg">
          Please try again with a different payment method or contact your bank
          for more information.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/lead-generation"
            className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 transition shadow-lg"
          >
            Try Again
          </a>
          <a
            href="/support"
            className="bg-white text-zinc-900 border border-zinc-200 px-8 py-3 rounded-xl font-bold hover:bg-zinc-50 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  // PENDING STATE
  if (status === "open" || purchase_status === "pending_payment") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-zinc-50">
        <div className="bg-amber-100 p-6 rounded-full mb-6 animate-pulse">
          <svg
            className="w-12 h-12 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-zinc-900 mb-4">
          Payment Processing
        </h1>
        <p className="text-zinc-600 mb-8 max-w-md mx-auto text-lg">
          Your payment is currently being processed by Stripe. This usually
          takes a few seconds, but can take longer for some payment methods.
        </p>
        <p className="text-zinc-500 mb-8 italic">
          We&apos;ll update your dashboard as soon as the payment is confirmed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/lead-generation"
            className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 transition shadow-lg"
          >
            Return to main page
          </a>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-zinc-900 border border-zinc-200 px-8 py-3 rounded-xl font-bold hover:bg-zinc-50 transition"
          >
            Refresh Status
          </button>
        </div>
      </div>
    );
  }

  // FALLBACK ERROR
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="bg-red-100 p-6 rounded-full mb-4">
        <svg
          className="w-12 h-12 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-zinc-600 mb-6 font-mono text-sm">
        Status: {status} | Payment: {payment_status} | PI:{" "}
        {payment_intent?.status}
      </p>
      <p className="text-zinc-600 mb-6">
        We couldn&apos;t verify your payment status. Please check your email for
        confirmation.
      </p>
      <a
        href="/lead-generation"
        className="bg-zinc-900 text-white px-6 py-2 rounded-lg"
      >
        Go Back
      </a>
    </div>
  );
}

export default function ReturnPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReturnContent />
    </Suspense>
  );
}
