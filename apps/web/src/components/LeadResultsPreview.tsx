"use client";

import React, { useState } from "react";
import {
  ArrowLeftIcon,
  UsersIcon,
  AlertCircleIcon,
  LoadingIcon,
  CartIcon,
} from "@/icons";

interface LeadResultsPreviewProps {
  onBack: () => void;
  leadCount: number;
}

const MOCK_LEADS = [
  {
    id: "1",
    firstName: "John",
    lastName: "D.",
    age: 45,
    income: "$150k",
    email: "j***@example.com",
    phone: "(***) ***-4521",
    address: "123 ******* St",
    city: "Denver",
    state: "CO",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "W.",
    age: 32,
    income: "$250k",
    email: "s***@gmail.com",
    phone: "(***) ***-8890",
    address: "942 ******* Ave",
    city: "Boulder",
    state: "CO",
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "B.",
    age: 58,
    income: "$500k",
    email: "m***@outlook.com",
    phone: "(***) ***-1122",
    address: "15 ******* Ln",
    city: "Aspen",
    state: "CO",
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "R.",
    age: 29,
    income: "$120k",
    email: "e***@yahoo.com",
    phone: "(***) ***-3344",
    address: "777 ******* Dr",
    city: "Vail",
    state: "CO",
  },
  {
    id: "5",
    firstName: "Robert",
    lastName: "K.",
    age: 63,
    income: "$1.2M+",
    email: "r***@company.io",
    phone: "(***) ***-9900",
    address: "50 ******* Ct",
    city: "Golden",
    state: "CO",
  },
];

export const LeadResultsPreview: React.FC<LeadResultsPreviewProps> = ({
  onBack,
  leadCount,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pricePerLead = 2.5;
  const totalPriceNumber = leadCount * pricePerLead;
  const totalPrice = totalPriceNumber.toLocaleString();

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const response = await fetch(
        `${API_BASE_URL}/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            total_amount: totalPriceNumber,
            lead_count: leadCount,
          }),
        },
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.detail || "Failed to initialize checkout");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned from server");
      }
    } catch (err: unknown) {
      console.error("Purchase error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={loading}
          className="group flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 disabled:opacity-50"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Filters
        </button>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            Results Ready
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-lg">
              <UsersIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {leadCount.toLocaleString()} Matching Leads
              </h2>
              <p className="text-sm text-zinc-500">
                Based on your geographic and demographic criteria
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 shadow-sm dark:border-emerald-900/30 dark:bg-emerald-950/20">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Estimated Pricing
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
              ${totalPrice}
            </span>
            <span className="text-sm text-emerald-600/70 dark:text-emerald-400/70">
              total
            </span>
          </div>
          <div className="mt-1 text-[10px] text-emerald-600/60 dark:text-emerald-400/60">
            Approx. ${pricePerLead.toFixed(2)} per lead
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2">
            <AlertCircleIcon className="h-5 w-5" />
            {error}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/50">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Masked Preview
          </h3>
          <p className="text-xs text-zinc-500">
            Purchase to unlock full PII data including email and phone numbers.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-6 py-4 font-medium text-zinc-500">
                  First Name
                </th>
                <th className="px-6 py-4 font-medium text-zinc-500">
                  Last Name
                </th>
                <th className="px-6 py-4 font-medium text-zinc-500">Age</th>
                <th className="px-6 py-4 font-medium text-zinc-500">Income</th>
                <th className="px-6 py-4 font-medium text-zinc-500">Email</th>
                <th className="px-6 py-4 font-medium text-zinc-500">Phone</th>
                <th className="px-6 py-4 font-medium text-zinc-500">City</th>
                <th className="px-6 py-4 font-medium text-zinc-500">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
              {MOCK_LEADS.map((lead) => (
                <tr
                  key={lead.id}
                  className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                    {lead.firstName}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    {lead.lastName}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    {lead.age}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {lead.income}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-zinc-400 selection:bg-zinc-900/10">
                      {lead.email}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-zinc-300 selection:bg-zinc-900/10 italic">
                      {lead.phone}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    {lead.city}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                    {lead.state}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-zinc-50/50 p-6 flex flex-col items-center justify-center border-t border-zinc-100 dark:bg-zinc-800/30 dark:border-zinc-800">
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="group relative flex items-center gap-2 rounded-xl bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white shadow-xl transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
          >
            {loading ? (
              <>
                <LoadingIcon className="animate-spin h-4 w-4 mr-2" />
                Preparing Checkout...
              </>
            ) : (
              <>
                <CartIcon className="h-4 w-4" />
                Purchase Full Lead Data
              </>
            )}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10 transition-all group-hover:h-full group-hover:bg-white/5" />
          </button>
          <p className="mt-4 text-[10px] text-zinc-400">
            Secure checkout via Stripe
          </p>
        </div>
      </div>
    </div>
  );
};
