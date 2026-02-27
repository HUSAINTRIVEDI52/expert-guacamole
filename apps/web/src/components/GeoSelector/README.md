# GeoSelector – Mapbox setup

## 1. Get a Mapbox access token

1. Sign up at [mapbox.com](https://www.mapbox.com/) and open the [Account page](https://account.mapbox.com/).
2. Copy your **Default public token** (or create a new public token with `styles:read` and `fonts:read`).
3. Add it to your Next.js app env:

**`.env.local`** (in `apps/web/`):

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
```

Restart the dev server after changing env vars.

## 2. Geo API endpoints

The component expects these Next.js API routes to return **GeoJSON FeatureCollection**:

| Endpoint                 | Purpose         | Feature `properties`      |
| ------------------------ | --------------- | ------------------------- |
| `GET /api/geo/zip-codes` | ZIP polygons    | `zip_code`, `county_code` |
| `GET /api/geo/counties`  | County polygons | `county_code`, `name`     |

Sample implementations live under `src/app/api/geo/zip-codes/route.ts` and `src/app/api/geo/counties/route.ts`. Replace the sample data with your own GeoJSON (e.g. from a DB or static files).

## 3. Usage

```tsx
"use client";

import { GeoSelector } from "@/components/GeoSelector";
import type { GeoSelectorOutput } from "@/components/GeoSelector";

export default function Page() {
  const handleChange = (output: GeoSelectorOutput) => {
    console.log("ZIPs:", output.zips, "Counties:", output.counties);
  };

  return (
    <GeoSelector
      onSelectionChange={handleChange}
      initialZips={[]}
      initialCounties={[]}
      initialMode="zip"
      className="my-4"
    />
  );
}
```

Example page: **`/geo-selector`** (`src/app/geo-selector/page.tsx`).

## 4. Output shape

```ts
{
  zips: string[];      // e.g. ["94102", "94103"]
  counties: string[];  // e.g. ["06075", "36061"]
}
```

## 5. Dependencies

- `mapbox-gl` is listed in `apps/web/package.json`. Run `pnpm install` from the repo root.
