import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

const COUNTIES_CSV_PATH = join(process.cwd(), "public", "counties.csv");

/** Plotly US counties GeoJSON: features have id = FIPS (string, 5 digits). */
const US_COUNTIES_GEOJSON_URL =
  "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json";

function parseCsv(csvText: string): Map<string, string> {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return new Map();
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const valueIdx = header.indexOf("value");
  const labelIdx = header.indexOf("label");
  if (valueIdx === -1 || labelIdx === -1) return new Map();
  const map = new Map<string, string>();
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    const value = parts[valueIdx]?.trim();
    const label = parts[labelIdx]?.trim();
    if (value && label) map.set(value, label);
  }
  return map;
}

function normalizeFips(id: string | number | undefined): string {
  if (id == null) return "";
  const s = String(id).trim().replace(/^0+/, "") || "0";
  return s.padStart(5, "0");
}

/**
 * GET /api/geo/counties
 * Returns GeoJSON FeatureCollection of US county polygons.
 * Uses public/counties.csv for county names (value = FIPS, label = name).
 * Geometry is loaded from an external US counties GeoJSON (Plotly dataset).
 */
export async function GET() {
  let csvNames: Map<string, string>;
  try {
    const csvText = readFileSync(COUNTIES_CSV_PATH, "utf-8");
    csvNames = parseCsv(csvText);
  } catch {
    csvNames = new Map();
  }

  let geo: {
    type: string;
    features: Array<{
      type: string;
      id?: string | number;
      properties?: Record<string, unknown>;
      geometry: unknown;
    }>;
  };
  try {
    const res = await fetch(US_COUNTIES_GEOJSON_URL, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error("GeoJSON fetch failed");
    geo = (await res.json()) as typeof geo;
  } catch (e) {
    console.error("Failed to fetch US counties GeoJSON:", e);
    return NextResponse.json(
      {
        type: "FeatureCollection",
        features: [],
        error:
          "Could not load county boundaries. Check network or add a local GeoJSON.",
      },
      { status: 200 },
    );
  }

  if (geo?.type !== "FeatureCollection" || !Array.isArray(geo.features)) {
    return NextResponse.json({
      type: "FeatureCollection" as const,
      features: [],
    });
  }

  const features = geo.features.map((f) => {
    const fips = normalizeFips(
      f.id ?? (f.properties as Record<string, unknown>)?.GEO_ID,
    );
    const name =
      csvNames.get(fips) ??
      (f.properties as Record<string, unknown>)?.NAME ??
      fips;
    return {
      type: "Feature" as const,
      properties: { county_code: fips, name: String(name) },
      geometry: f.geometry,
    };
  });

  return NextResponse.json({
    type: "FeatureCollection" as const,
    features,
  });
}
