import { NextResponse } from "next/server";

/**
 * Helper: create a simple box polygon (visible at zoom 4) from center [lng, lat] and half-size in degrees.
 */
function box(
  lng: number,
  lat: number,
  half = 0.25,
): [
  [number, number],
  [number, number],
  [number, number],
  [number, number],
  [number, number],
] {
  return [
    [lng - half, lat - half],
    [lng + half, lat - half],
    [lng + half, lat + half],
    [lng - half, lat + half],
    [lng - half, lat - half],
  ];
}

/**
 * GET /api/geo/zip-codes
 * Returns GeoJSON FeatureCollection of ZIP code polygons.
 * Each feature must have properties: { zip_code: string, county_code: string }
 * Sample data: US ZIPs with approximate bounding boxes (visible on map at USA zoom).
 */
export async function GET() {
  const zipGeoJSON = {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        properties: { zip_code: "94102", county_code: "06075" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-122.42, 37.78)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "94103", county_code: "06075" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-122.41, 37.77)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "94105", county_code: "06075" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-122.39, 37.79)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "10001", county_code: "36061" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-74.01, 40.74)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "10002", county_code: "36061" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-73.99, 40.71)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "10003", county_code: "36061" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-73.99, 40.73)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "90210", county_code: "06037" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-118.4, 34.09)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "90211", county_code: "06037" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-118.38, 34.07)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "60601", county_code: "17031" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-87.63, 41.89)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "60602", county_code: "17031" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-87.63, 41.88)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "75201", county_code: "48113" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-96.8, 32.78)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "85001", county_code: "04013" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-112.07, 33.45)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "33101", county_code: "12086" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-80.19, 25.77)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "98101", county_code: "53033" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-122.33, 47.61)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "02101", county_code: "25025" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-71.06, 42.36)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "19102", county_code: "42101" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-75.17, 39.95)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "30301", county_code: "13089" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-84.39, 33.75)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "80202", county_code: "08031" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-104.99, 39.75)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "48201", county_code: "26163" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-83.05, 42.33)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "77001", county_code: "48201" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-95.36, 29.76)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "53202", county_code: "55079" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-87.91, 43.04)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "55401", county_code: "27053" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-93.27, 44.98)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "37201", county_code: "47037" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-86.78, 36.17)],
        },
      },
      {
        type: "Feature" as const,
        properties: { zip_code: "70112", county_code: "22071" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [box(-90.07, 29.96)],
        },
      },
    ],
  };

  return NextResponse.json(zipGeoJSON);
}
