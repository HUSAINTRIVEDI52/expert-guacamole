/**
 * GeoSelector component types and GeoJSON interfaces.
 */

export type SelectionMode = "zip" | "county";

export interface GeoSelectorOutput {
  zips: string[];
  counties: string[];
}

export interface GeoSelectorProps {
  /** Callback when selection changes. */
  onSelectionChange?: (output: GeoSelectorOutput) => void;
  /** Optional initial selected ZIP codes. */
  initialZips?: string[];
  /** Optional initial selected county codes. */
  initialCounties?: string[];
  /** Optional initial selection mode. */
  initialMode?: SelectionMode;
  /** Optional class name for the container. */
  className?: string;
}

// GeoJSON types for API responses
export interface ZipFeatureProperties {
  zip_code: string;
  county_code: string;
}

export interface CountyFeatureProperties {
  county_code: string;
  name: string;
}

/** Minimal GeoJSON geometry for type safety. */
export type GeoJSONGeometry =
  | { type: "Polygon"; coordinates: number[][][] }
  | { type: "MultiPolygon"; coordinates: number[][][][] }
  | { type: "Point"; coordinates: number[] };

export interface GeoJSONFeature<T = Record<string, unknown>> {
  type: "Feature";
  geometry: GeoJSONGeometry;
  properties: T;
  id?: string | number;
}

export interface GeoJSONFeatureCollection<T = Record<string, unknown>> {
  type: "FeatureCollection";
  features: GeoJSONFeature<T>[];
}

export type ZipGeoJSON = GeoJSONFeatureCollection<ZipFeatureProperties>;
export type CountyGeoJSON = GeoJSONFeatureCollection<CountyFeatureProperties>;
