"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { GeoSelector } from "@/components/GeoSelector";
import type { GeoSelectorOutput } from "@/components/GeoSelector";

interface CountyListItem {
  value: string;
  label: string;
}

interface PostalCodeItem {
  code: string;
  label: string;
}

export default function GeoSelectorExamplePage() {
  const [output, setOutput] = useState<GeoSelectorOutput>({
    zips: [],
    counties: [],
  });
  const [selectedPostalCodes] = useState<string[]>([]);
  const [selectedZipCodes, setSelectedZipCodes] = useState<string[]>([]);
  const [countiesList, setCountiesList] = useState<CountyListItem[]>([]);
  const [postalCodesList, setPostalCodesList] = useState<PostalCodeItem[]>([]);
  const [zipCodesList, setZipCodesList] = useState<string[]>([]);
  const [countiesLoading, setCountiesLoading] = useState(true);
  const [postalCodesLoading, setPostalCodesLoading] = useState(true);
  const [zipCodesLoading, setZipCodesLoading] = useState(true);
  const [countySearch, setCountySearch] = useState("");
  const [postalSearch, setPostalSearch] = useState("");
  const [zipSearch, setZipSearch] = useState("");
  const [showCountiesList, setShowCountiesList] = useState(false);
  const [showPostalList, setShowPostalList] = useState(false);
  const [showZipList, setShowZipList] = useState(false);

  const handleSelectionChange = useCallback((value: GeoSelectorOutput) => {
    setOutput(value);
  }, []);

  const mergedOutput = useMemo(
    () => ({
      zips: [...output.zips, ...selectedZipCodes, ...selectedPostalCodes],
      counties: output.counties,
    }),
    [output.zips, output.counties, selectedZipCodes, selectedPostalCodes],
  );

  const handleToggleZipCode = useCallback((zip: string) => {
    setSelectedZipCodes((prev) =>
      prev.includes(zip) ? prev.filter((z) => z !== zip) : [...prev, zip],
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/geo/counties-list")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: CountyListItem[]) => {
        if (!cancelled) {
          setCountiesList(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (!cancelled) setCountiesList([]);
      })
      .finally(() => {
        if (!cancelled) setCountiesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/geo/postal-codes-list")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: PostalCodeItem[]) => {
        if (!cancelled) setPostalCodesList(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setPostalCodesList([]);
      })
      .finally(() => {
        if (!cancelled) setPostalCodesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/geo/zip-codes-list")
      .then((r) => (r.ok ? r.json() : { zips: [] }))
      .then((data: { zips?: string[] }) => {
        if (!cancelled)
          setZipCodesList(Array.isArray(data?.zips) ? data.zips : []);
      })
      .catch(() => {
        if (!cancelled) setZipCodesList([]);
      })
      .finally(() => {
        if (!cancelled) setZipCodesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCounties = useMemo(() => {
    if (!countySearch.trim()) return countiesList.slice(0, 200);
    const q = countySearch.trim().toLowerCase();
    return countiesList
      .filter((c) => c.label.toLowerCase().includes(q) || c.value.includes(q))
      .slice(0, 200);
  }, [countiesList, countySearch]);

  const filteredPostalCodes = useMemo(() => {
    if (!postalSearch.trim()) return postalCodesList.slice(0, 300);
    const q = postalSearch.trim().toLowerCase();
    return postalCodesList
      .filter(
        (p) =>
          p.code.toLowerCase().includes(q) || p.label.toLowerCase().includes(q),
      )
      .slice(0, 300);
  }, [postalCodesList, postalSearch]);

  const filteredZipCodes = useMemo(() => {
    if (!zipSearch.trim()) return zipCodesList.slice(0, 300);
    const q = zipSearch.trim();
    return zipCodesList.filter((z) => z.includes(q)).slice(0, 300);
  }, [zipCodesList, zipSearch]);

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">
          ZIP & County Selector
        </h1>
        <p className="mb-4 text-sm text-gray-600">
          Select by map (ZIP polygons) or use the lists below. ZIP codes from
          public/zipcodes, counties from CSV, Canadian postal codes from CSV.
        </p>
        <GeoSelector
          onSelectionChange={handleSelectionChange}
          className="overflow-hidden rounded-lg shadow-sm"
        />
        <section
          className="mt-4 rounded-lg border border-gray-200 bg-white p-4"
          aria-label="ZIP codes (US) from file"
        >
          <button
            type="button"
            onClick={() => setShowZipList((v) => !v)}
            className="flex w-full items-center justify-between rounded-md py-2 text-left text-lg font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-expanded={showZipList}
            aria-controls="zip-list-region"
          >
            ZIP codes – US ({zipCodesList.length})
            {selectedZipCodes.length > 0 && (
              <span className="text-blue-600">
                {selectedZipCodes.length} selected
              </span>
            )}
            <span className="text-gray-500">{showZipList ? "▼" : "▶"}</span>
          </button>
          {showZipList && (
            <div id="zip-list-region" className="pt-2">
              <input
                type="search"
                placeholder="Search by ZIP (e.g. 00601 or 90210)..."
                value={zipSearch}
                onChange={(e) => setZipSearch(e.target.value)}
                className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Search ZIP codes"
              />
              {zipCodesLoading ? (
                <p className="py-4 text-sm text-gray-500">Loading…</p>
              ) : (
                <div
                  className="max-h-64 overflow-auto rounded border border-gray-200"
                  role="list"
                >
                  {filteredZipCodes.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">
                      No ZIP codes found. Add public/zipcodes file.
                    </p>
                  ) : (
                    filteredZipCodes.map((zip) => {
                      const selected = selectedZipCodes.includes(zip);
                      return (
                        <button
                          key={zip}
                          type="button"
                          onClick={() => handleToggleZipCode(zip)}
                          className={`flex w-full justify-between border-b border-gray-100 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                            selected ? "bg-blue-50" : ""
                          }`}
                          aria-pressed={selected}
                        >
                          <span className="font-medium text-gray-900">
                            {zip}
                          </span>
                        </button>
                      );
                    })
                  )}
                  {filteredZipCodes.length === 300 && (
                    <p className="border-t border-gray-200 px-3 py-2 text-xs text-gray-500">
                      Showing first 300. Type to search and narrow results.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
        <section
          className="mt-4 rounded-lg border border-gray-200 bg-white p-4"
          aria-label="All counties from CSV"
        >
          <button
            type="button"
            onClick={() => setShowCountiesList((v) => !v)}
            className="flex w-full items-center justify-between rounded-md py-2 text-left text-lg font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-expanded={showCountiesList}
            aria-controls="counties-list-region"
          >
            All counties ({countiesList.length})
            <span className="text-gray-500">
              {showCountiesList ? "▼" : "▶"}
            </span>
          </button>
          {showCountiesList && (
            <div id="counties-list-region" className="pt-2">
              <input
                type="search"
                placeholder="Search by name or FIPS..."
                value={countySearch}
                onChange={(e) => setCountySearch(e.target.value)}
                className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Search counties"
              />
              {countiesLoading ? (
                <p className="py-4 text-sm text-gray-500">Loading…</p>
              ) : (
                <div
                  className="max-h-64 overflow-auto rounded border border-gray-200"
                  role="list"
                >
                  {filteredCounties.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">
                      No counties match your search.
                    </p>
                  ) : (
                    filteredCounties.map((c) => (
                      <div
                        key={c.value}
                        role="listitem"
                        className="border-b border-gray-100 px-3 py-2 text-sm last:border-b-0 hover:bg-gray-50"
                      >
                        <span className="font-medium text-gray-900">
                          {c.label}
                        </span>{" "}
                        <span className="text-gray-500">({c.value})</span>
                      </div>
                    ))
                  )}
                  {filteredCounties.length === 200 && (
                    <p className="border-t border-gray-200 px-3 py-2 text-xs text-gray-500">
                      Showing first 200 matches. Narrow search to see more.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
        <section
          className="mt-4 rounded-lg border border-gray-200 bg-white p-4"
          aria-label="Postal codes (Canada)"
        >
          <button
            type="button"
            onClick={() => setShowPostalList((v) => !v)}
            className="flex w-full items-center justify-between rounded-md py-2 text-left text-lg font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-expanded={showPostalList}
            aria-controls="postal-list-region"
          >
            Postal codes – Canada ({postalCodesList.length})
            {selectedPostalCodes.length > 0 && (
              <span className="text-blue-600">
                {selectedPostalCodes.length} selected
              </span>
            )}
            <span className="text-gray-500">{showPostalList ? "▼" : "▶"}</span>
          </button>
          {showPostalList && (
            <div id="postal-list-region" className="pt-2">
              <input
                type="search"
                placeholder="Search by code or place..."
                value={postalSearch}
                onChange={(e) => setPostalSearch(e.target.value)}
                className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Search postal codes"
              />
              {postalCodesLoading ? (
                <p className="py-4 text-sm text-gray-500">Loading…</p>
              ) : (
                <div
                  className="max-h-64 overflow-auto rounded border border-gray-200"
                  role="list"
                >
                  {filteredPostalCodes.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">
                      No postal codes found. Add public/postal-codes.csv.
                    </p>
                  ) : (
                    filteredPostalCodes.map((p) => {
                      const selected = selectedPostalCodes.includes(p.code);
                      return (
                        <button
                          key={p.code}
                          type="button"
                          onClick={() => handleToggleZipCode(p.code)}
                          className={`flex w-full justify-between border-b border-gray-100 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                            selected ? "bg-blue-50" : ""
                          }`}
                          aria-pressed={selected}
                        >
                          <span className="font-medium text-gray-900">
                            {p.code}
                          </span>
                          <span className="text-gray-500">{p.label}</span>
                        </button>
                      );
                    })
                  )}
                  {filteredPostalCodes.length === 300 && (
                    <p className="border-t border-gray-200 px-3 py-2 text-xs text-gray-500">
                      Showing first 300. Narrow search to see more.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
        <section
          className="mt-4 rounded-lg border border-gray-200 bg-white p-4"
          aria-label="Selected geography"
        >
          <h2 className="mb-2 text-lg font-medium text-gray-900">
            Selected geography
          </h2>
          <pre className="overflow-auto rounded bg-gray-100 p-3 text-xs text-gray-800">
            {JSON.stringify(mergedOutput, null, 2)}
          </pre>
          <p className="mt-2 text-sm text-gray-500">
            {mergedOutput.zips.length} ZIP/postal(s),{" "}
            {mergedOutput.counties.length} county(ies)
          </p>
        </section>
      </div>
    </main>
  );
}
