import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

const COUNTIES_CSV_PATH = join(process.cwd(), "public", "counties.csv");

export interface CountyListItem {
  value: string;
  label: string;
}

/**
 * GET /api/geo/counties-list
 * Returns all counties from public/counties.csv as JSON.
 * Use for dropdowns, search, or displaying the full list.
 */
export async function GET() {
  try {
    const csvText = readFileSync(COUNTIES_CSV_PATH, "utf-8");
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) {
      return NextResponse.json([]);
    }
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const valueIdx = header.indexOf("value");
    const labelIdx = header.indexOf("label");
    if (valueIdx === -1 || labelIdx === -1) {
      return NextResponse.json([]);
    }
    const list: CountyListItem[] = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",");
      const value = parts[valueIdx]?.trim();
      const label = parts[labelIdx]?.trim();
      if (value && label) list.push({ value, label });
    }
    return NextResponse.json(list);
  } catch {
    return NextResponse.json(
      { error: "Counties CSV not found at public/counties.csv" },
      { status: 404 },
    );
  }
}
