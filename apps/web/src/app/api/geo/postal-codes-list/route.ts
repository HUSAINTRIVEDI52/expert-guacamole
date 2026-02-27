import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

const POSTAL_CODES_PATH = join(process.cwd(), "public", "postal-codes.csv");

export interface PostalCodeItem {
  code: string;
  label: string;
}

/**
 * GET /api/geo/postal-codes-list
 * Returns postal codes from public/postal-codes.csv (or .tsv).
 * Format: first line header "code,label" or "code\tlabel", then one code,label per line.
 */
export async function GET() {
  try {
    const raw = readFileSync(POSTAL_CODES_PATH, "utf-8");
    const lines = raw.trim().split(/\r?\n/);
    if (lines.length < 2) return NextResponse.json([]);
    const sep = lines[0].includes("\t") ? "\t" : ",";
    const header = lines[0]
      .toLowerCase()
      .split(sep)
      .map((h) => h.trim());
    const codeIdx = header.indexOf("code");
    const labelIdx = header.indexOf("label");
    if (codeIdx === -1 || labelIdx === -1) return NextResponse.json([]);
    const list: PostalCodeItem[] = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(sep);
      const code = parts[codeIdx]?.trim();
      const label = parts[labelIdx]?.trim();
      if (code && label) list.push({ code, label });
    }
    return NextResponse.json(list);
  } catch {
    return NextResponse.json(
      { error: "Postal codes file not found at public/postal-codes.csv" },
      { status: 404 },
    );
  }
}
