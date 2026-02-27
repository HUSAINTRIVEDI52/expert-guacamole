import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

const ZIPCODES_PATH = join(process.cwd(), "public", "zipcodes");

/**
 * GET /api/geo/zip-codes-list
 * Returns unique ZIP codes from public/zipcodes (text file, one ZIP per line, first line = header).
 */
export async function GET() {
  try {
    const raw = readFileSync(ZIPCODES_PATH, "utf-8");
    const lines = raw.trim().split(/\r?\n/);
    const seen = new Set<string>();
    const zips: string[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      if (i === 0 && /^[a-z\s]+$/i.test(line)) continue;
      const zip = line.replace(/\D/g, "").slice(0, 5);
      if (zip.length === 5 && !seen.has(zip)) {
        seen.add(zip);
        zips.push(zip);
      }
    }
    zips.sort((a, b) => a.localeCompare(b));
    return NextResponse.json({ zips });
  } catch {
    return NextResponse.json(
      { error: "ZIP codes file not found at public/zipcodes" },
      { status: 404 },
    );
  }
}
