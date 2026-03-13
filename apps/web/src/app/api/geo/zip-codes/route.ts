import { NextResponse } from "next/server";

const STATE_MAP: Record<string, { abbr: string; name: string }> = {
  "01": { abbr: "al", name: "alabama" },
  "02": { abbr: "ak", name: "alaska" },
  "04": { abbr: "az", name: "arizona" },
  "05": { abbr: "ar", name: "arkansas" },
  "06": { abbr: "ca", name: "california" },
  "08": { abbr: "co", name: "colorado" },
  "09": { abbr: "ct", name: "connecticut" },
  "10": { abbr: "de", name: "delaware" },
  "11": { abbr: "dc", name: "district_of_columbia" },
  "12": { abbr: "fl", name: "florida" },
  "13": { abbr: "ga", name: "georgia" },
  "15": { abbr: "hi", name: "hawaii" },
  "16": { abbr: "id", name: "idaho" },
  "17": { abbr: "il", name: "illinois" },
  "18": { abbr: "in", name: "indiana" },
  "19": { abbr: "ia", name: "iowa" },
  "20": { abbr: "ks", name: "kansas" },
  "21": { abbr: "ky", name: "kentucky" },
  "22": { abbr: "la", name: "louisiana" },
  "23": { abbr: "me", name: "maine" },
  "24": { abbr: "md", name: "maryland" },
  "25": { abbr: "ma", name: "massachusetts" },
  "26": { abbr: "mi", name: "michigan" },
  "27": { abbr: "mn", name: "minnesota" },
  "28": { abbr: "ms", name: "mississippi" },
  "29": { abbr: "mo", name: "missouri" },
  "30": { abbr: "mt", name: "montana" },
  "31": { abbr: "ne", name: "nebraska" },
  "32": { abbr: "nv", name: "nevada" },
  "33": { abbr: "nh", name: "new_hampshire" },
  "34": { abbr: "nj", name: "new_jersey" },
  "35": { abbr: "nm", name: "new_mexico" },
  "36": { abbr: "ny", name: "new_york" },
  "37": { abbr: "nc", name: "north_carolina" },
  "38": { abbr: "nd", name: "north_dakota" },
  "39": { abbr: "oh", name: "ohio" },
  "40": { abbr: "ok", name: "oklahoma" },
  "41": { abbr: "or", name: "oregon" },
  "42": { abbr: "pa", name: "pennsylvania" },
  "44": { abbr: "ri", name: "rhode_island" },
  "45": { abbr: "sc", name: "south_carolina" },
  "46": { abbr: "sd", name: "south_dakota" },
  "47": { abbr: "tn", name: "tennessee" },
  "48": { abbr: "tx", name: "texas" },
  "49": { abbr: "ut", name: "utah" },
  "50": { abbr: "vt", name: "vermont" },
  "51": { abbr: "va", name: "virginia" },
  "53": { abbr: "wa", name: "washington" },
  "54": { abbr: "wv", name: "west_virginia" },
  "55": { abbr: "wi", name: "wisconsin" },
  "56": { abbr: "wy", name: "wyoming" },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stateFips = searchParams.get("state");

  const emptyGeoJSON = { type: "FeatureCollection" as const, features: [] };

  if (!stateFips || !STATE_MAP[stateFips]) {
    return NextResponse.json(emptyGeoJSON);
  }

  const { abbr, name } = STATE_MAP[stateFips];
  const url = `https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/${abbr}_${name}_zip_codes_geo.min.json`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } }); // cache for 1 day
    if (!res.ok) {
      console.warn(`Could not fetch zip codes for ${stateFips}: ${res.status}`);
      return NextResponse.json(emptyGeoJSON);
    }
    const rawData: { type: string; features: unknown[] } = await res.json();

    // Normalize the feature properties to expose `zip_code`
    const features = (rawData.features || []).map((feature: any) => {
      const p = feature.properties || {};
      const zip = p.ZCTA5CE10 || p.ZCTA5 || p.zip_code || p.ZIP;
      const zipStr = zip ? String(zip) : "";

      return {
        ...feature,
        id: zip ? parseInt(zipStr, 10) : undefined,
        type: "Feature",
        properties: {
          zip_code: zipStr,
          county_code: "00000",
        },
      };
    });

    return NextResponse.json({
      type: "FeatureCollection",
      features,
    });
  } catch (e) {
    console.error("Failed to fetch zip codes from GitHub:", e);
    return NextResponse.json(emptyGeoJSON);
  }
}
