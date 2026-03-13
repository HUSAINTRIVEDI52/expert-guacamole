"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface LeadSearchRequest {
  networth_min?: number;
  networth_max?: number;
  age_min?: number;
  age_max?: number;
  recently_moved?: boolean;
  zip_codes: string[];
  county_fips_codes: string[];
  suppress_person_ids: string[];
  limit: number;
  offset: number;
}

interface LeadSearchResponse {
  count: number;
  documents: Record<string, unknown>[];
}

const defaultRequest: LeadSearchRequest = {
  zip_codes: [],
  county_fips_codes: [],
  suppress_person_ids: [],
  limit: 10,
  offset: 0,
};

const AGE_MIN = 0;
const AGE_MAX = 120;
const NETWORTH_MIN = 0;
const NETWORTH_MAX = 10_000_000;
const NETWORTH_STEP = 100_000;

const formatNetworth = (v: number) =>
  v >= 1_000_000
    ? `$${v / 1_000_000}M`
    : v >= 1_000
      ? `$${v / 1_000}k`
      : `$${v}`;

import { RangeSlider } from "@/components/RangeSlider";

export default function LeadSearchPage() {
  const [req, setReq] = useState<LeadSearchRequest>(defaultRequest);
  const [networthMin, setNetworthMin] = useState(NETWORTH_MIN);
  const [networthMax, setNetworthMax] = useState(NETWORTH_MAX);
  const [ageMin, setAgeMin] = useState(AGE_MIN);
  const [ageMax, setAgeMax] = useState(AGE_MAX);
  const [recentlyMoved, setRecentlyMoved] = useState(false);
  const [zipInput, setZipInput] = useState("");
  const [countyInput, setCountyInput] = useState("");
  const [suppressInput, setSuppressInput] = useState("");
  const [result, setResult] = useState<LeadSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const parseList = (s: string) =>
    s
      .split(/[\s,]+/)
      .map((x) => x.trim())
      .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    const body: LeadSearchRequest = {
      ...defaultRequest,
      zip_codes: parseList(zipInput),
      county_fips_codes: parseList(countyInput),
      suppress_person_ids: parseList(suppressInput),
      limit: req.limit,
      offset: req.offset,
    };

    if (networthMin > NETWORTH_MIN || networthMax < NETWORTH_MAX) {
      body.networth_min = networthMin;
      body.networth_max = networthMax;
    }
    if (ageMin > AGE_MIN || ageMax < AGE_MAX) {
      body.age_min = ageMin;
      body.age_max = ageMax;
    }

    if (recentlyMoved) body.recently_moved = true;

    try {
      const res = await fetch(`${API_BASE}/api/lead-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail),
        );
        return;
      }
      setResult(data as LeadSearchResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const keyFields = [
    "person_id",
    "first_name",
    "last_name",
    "city",
    "state",
    "zip",
  ];

  return (
    <div className="min-h-screen bg-zinc-50 p-6 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Lead Search
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Age range: {ageMin} – {ageMax}
              </span>
              <RangeSlider
                min={AGE_MIN}
                max={AGE_MAX}
                step={1}
                valueMin={ageMin}
                valueMax={ageMax}
                onMinChange={(v) => setAgeMin(Math.min(v, ageMax - 1))}
                onMaxChange={(v) => setAgeMax(Math.max(v, ageMin + 1))}
                ariaLabelMin="Age minimum"
                ariaLabelMax="Age maximum"
              />
            </div>
            <div className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Net worth range: {formatNetworth(networthMin)} –{" "}
                {formatNetworth(networthMax)}
              </span>
              <RangeSlider
                min={NETWORTH_MIN}
                max={NETWORTH_MAX}
                step={NETWORTH_STEP}
                valueMin={networthMin}
                valueMax={networthMax}
                onMinChange={(v) =>
                  setNetworthMin(Math.min(v, networthMax - NETWORTH_STEP))
                }
                onMaxChange={(v) =>
                  setNetworthMax(Math.max(v, networthMin + NETWORTH_STEP))
                }
                ariaLabelMin="Net worth minimum"
                ariaLabelMax="Net worth maximum"
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <input
                id="recently_moved"
                type="checkbox"
                checked={recentlyMoved}
                onChange={(e) => setRecentlyMoved(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:checked:bg-zinc-600"
                aria-label="Filter to people who recently moved"
              />
              <label
                htmlFor="recently_moved"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
                Recently moved
              </label>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="zip_codes"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Zip codes (comma or space separated)
              </label>
              <input
                id="zip_codes"
                type="text"
                placeholder="e.g. 98101, 98102"
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="county_fips"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                County (FIPS codes, comma or space separated)
              </label>
              <input
                id="county_fips"
                type="text"
                placeholder="e.g. 53033"
                value={countyInput}
                onChange={(e) => setCountyInput(e.target.value)}
                className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="suppress_ids"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Exclude person IDs (comma or space separated)
              </label>
              <input
                id="suppress_ids"
                type="text"
                placeholder="e.g. 800378494527"
                value={suppressInput}
                onChange={(e) => setSuppressInput(e.target.value)}
                className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label
                htmlFor="limit"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Limit
              </label>
              <input
                id="limit"
                type="number"
                min={1}
                max={400}
                value={req.limit}
                onChange={(e) =>
                  setReq((r) => ({
                    ...r,
                    limit: parseInt(e.target.value, 10) || 10,
                  }))
                }
                className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label
                htmlFor="offset"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Offset
              </label>
              <input
                id="offset"
                type="number"
                min={0}
                max={4000}
                value={req.offset}
                onChange={(e) =>
                  setReq((r) => ({
                    ...r,
                    offset: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {loading ? "Searching…" : "Search"}
            </button>
          </div>
        </form>

        {error && (
          <div
            className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
            role="alert"
          >
            {error}
          </div>
        )}

        {result && (
          <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="border-b border-zinc-200 p-4 font-medium text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
              Total: {result.count} (showing {result.documents.length})
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
                    {keyFields.map((k) => (
                      <th
                        key={k}
                        className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300"
                      >
                        {k.replace(/_/g, " ")}
                      </th>
                    ))}
                    <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.documents.map((doc) => {
                    const id = String(doc.person_id ?? "");
                    return (
                      <tr
                        key={id}
                        className="border-b border-zinc-100 dark:border-zinc-800"
                      >
                        {keyFields.map((k) => (
                          <td
                            key={k}
                            className="px-4 py-3 text-zinc-600 dark:text-zinc-400"
                          >
                            {doc[k] != null ? String(doc[k]) : "—"}
                          </td>
                        ))}
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(expandedId === id ? null : id)
                            }
                            className="rounded px-2 py-1 text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                          >
                            {expandedId === id ? "Hide JSON" : "Show full JSON"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {result.documents.map((doc) => {
              const id = String(doc.person_id ?? "");
              if (expandedId !== id) return null;
              return (
                <div
                  key={id}
                  className="border-t border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <pre className="max-h-96 overflow-auto rounded bg-zinc-100 p-3 text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                    {JSON.stringify(doc, null, 2)}
                  </pre>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
