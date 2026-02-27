"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { RangeSlider } from "@/components/RangeSlider";
import { GeoSelector, type GeoSelectorOutput } from "@/components/GeoSelector";
import { LeadSelectionSidebar } from "@/components/LeadSelectionSidebar";
import { LeadResultsPreview } from "@/components/LeadResultsPreview";

const AGE_MIN = 0;
const AGE_MAX = 120;
const NETWORTH_MIN = 0;
const NETWORTH_MAX = 10_000_000;
const NETWORTH_STEP = 100_000;

interface CountyListItem {
  value: string;
  label: string;
}

const formatNetworth = (v: number) =>
  v >= 1_000_000
    ? `$${v / 1_000_000}M`
    : v >= 1_000
      ? `$${v / 1_000}k`
      : `$${v}`;

export default function LeadGenerationPage() {
  // Filter States
  const [ageMin, setAgeMin] = useState(AGE_MIN);
  const [ageMax, setAgeMax] = useState(AGE_MAX);
  const [networthMin, setNetworthMin] = useState(NETWORTH_MIN);
  const [networthMax, setNetworthMax] = useState(NETWORTH_MAX);
  const [recentlyMoved, setRecentlyMoved] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Selection State
  const [geoSelection, setGeoSelection] = useState<GeoSelectorOutput>({
    zips: [],
    counties: [],
  });

  const [countiesList, setCountiesList] = useState<CountyListItem[]>([]);

  // Fetch counties for labeling
  useEffect(() => {
    fetch("/api/geo/counties-list")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setCountiesList(data))
      .catch(() => setCountiesList([]));
  }, []);

  const handleGeoChange = useCallback((output: GeoSelectorOutput) => {
    setGeoSelection(output);
  }, []);

  const handleRemoveZip = useCallback((zip: string) => {
    setGeoSelection((prev) => ({
      ...prev,
      zips: prev.zips.filter((z) => z !== zip),
    }));
  }, []);

  const handleRemoveCounty = useCallback((fips: string) => {
    setGeoSelection((prev) => ({
      ...prev,
      counties: prev.counties.filter((c) => c !== fips),
    }));
  }, []);

  // Map FIPS to labels for the sidebar
  const selectedCountiesWithLabels = useMemo(() => {
    return geoSelection.counties.map((fips) => {
      const county = countiesList.find((c) => c.value === fips);
      return {
        value: fips,
        label: county ? county.label : `County ${fips}`,
      };
    });
  }, [geoSelection.counties, countiesList]);

  if (showResults) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-[1600px] px-6 py-8">
          <header className="mb-4">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Results Preview
            </h1>
          </header>
          <LeadResultsPreview
            leadCount={1240} // Static for now
            onBack={() => setShowResults(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-[1600px] px-6 py-4">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Lead Generation
          </h1>
        </header>

        {/* Top Filters Section */}
        <section className="mb-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid gap-8 lg:grid-cols-7 items-center">
            {/* Age Filter */}
            <div className="lg:col-span-2 space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Age Range:{" "}
                <span className="text-zinc-900 dark:text-zinc-100 lowercase font-medium">
                  {ageMin} – {ageMax}
                </span>
              </label>
              <RangeSlider
                min={AGE_MIN}
                max={AGE_MAX}
                valueMin={ageMin}
                valueMax={ageMax}
                onMinChange={(v) => setAgeMin(v)}
                onMaxChange={(v) => setAgeMax(v)}
                ariaLabelMin="Minimum Age"
                ariaLabelMax="Maximum Age"
              />
            </div>

            {/* Income/Networth Filter */}
            <div className="lg:col-span-3 space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Income Range:{" "}
                <span className="text-zinc-900 dark:text-zinc-100 lowercase font-medium">
                  {formatNetworth(networthMin)} – {formatNetworth(networthMax)}
                </span>
              </label>
              <RangeSlider
                min={NETWORTH_MIN}
                max={NETWORTH_MAX}
                step={NETWORTH_STEP}
                valueMin={networthMin}
                valueMax={networthMax}
                onMinChange={(v) => setNetworthMin(v)}
                onMaxChange={(v) => setNetworthMax(v)}
                ariaLabelMin="Minimum Income"
                ariaLabelMax="Maximum Income"
              />
            </div>

            {/* Recently Moved Toggle */}
            <div className="lg:col-span-2 flex items-center justify-end">
              <label className="relative flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={recentlyMoved}
                  onChange={(e) => setRecentlyMoved(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-5 w-9 rounded-full bg-zinc-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-zinc-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-zinc-900 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-zinc-700 dark:peer-checked:bg-zinc-100 dark:peer-checked:after:border-zinc-800" />
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Recently Moved
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* Main Content: Sidebar + Map */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Sidebar */}
          <LeadSelectionSidebar
            selectedZips={geoSelection.zips}
            selectedCounties={selectedCountiesWithLabels}
            onRemoveZip={handleRemoveZip}
            onRemoveCounty={handleRemoveCounty}
            onClearAll={() => setGeoSelection({ zips: [], counties: [] })}
            onFindResults={() => setShowResults(true)}
          />

          {/* Map Area */}
          <div className="flex-1 w-full h-[calc(100vh-280px)] min-h-[500px] rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
            <GeoSelector
              onSelectionChange={handleGeoChange}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
