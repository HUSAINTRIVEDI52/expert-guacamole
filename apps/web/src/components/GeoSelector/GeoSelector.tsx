"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Map as MapboxMap, MapMouseEvent } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type {
  CountyGeoJSON,
  GeoSelectorOutput,
  GeoSelectorProps,
  SelectionMode,
  ZipGeoJSON,
} from "./types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const ZIP_SOURCE_ID = "zip-codes";
const COUNTY_SOURCE_ID = "counties";
const ZIP_FILL_LAYER_ID = "zip-fill";
const ZIP_LINE_LAYER_ID = "zip-line";
const COUNTY_FILL_LAYER_ID = "county-fill";
const COUNTY_LINE_LAYER_ID = "county-line";

const USA_CENTER: [number, number] = [-98.5795, 39.8283];
const DEFAULT_ZOOM = 4;

const COLORS = {
  defaultFill: "rgba(0,0,0,0)",
  defaultLine: "#9ca3af",
  hoverFill: "#e5e7eb",
  selectedFill: "#3b82f6",
} as const;

type MapFeature = {
  source: string;
  sourceLayer?: string;
  id?: string | number;
};

/** Build map from county_code -> zip_code[] from ZIP GeoJSON. */
const buildCountyToZips = (zipGeo: ZipGeoJSON): Map<string, string[]> => {
  const map = new Map<string, string[]>();
  for (const f of zipGeo.features) {
    const cc = f.properties?.county_code;
    const zc = f.properties?.zip_code;
    if (cc != null && zc != null) {
      const list = map.get(cc) ?? [];
      if (!list.includes(zc)) list.push(zc);
      map.set(cc, list);
    }
  }
  return map;
};

export const GeoSelector = ({
  onSelectionChange,
  initialZips = [],
  initialCounties = [],
  initialMode = "zip",
  className = "",
}: GeoSelectorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const countyToZipsRef = useRef<Map<string, string[]>>(new Map());
  const allZipIdsRef = useRef<string[]>([]);
  const allCountyIdsRef = useRef<string[]>([]);

  const [selectedZips, setSelectedZips] = useState<string[]>(initialZips);
  const [selectedCounties, setSelectedCounties] =
    useState<string[]>(initialCounties);
  const [selectionMode, setSelectionMode] =
    useState<SelectionMode>(initialMode);
  const [countyLayerVisible, setCountyLayerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hoveredZipIdRef = useRef<string | number | null>(null);
  const hoveredCountyIdRef = useRef<string | number | null>(null);
  const selectionModeRef = useRef(selectionMode);
  const selectedCountiesRef = useRef(selectedCounties);
  const countyLayerVisibleRef = useRef(countyLayerVisible);
  selectionModeRef.current = selectionMode;
  selectedCountiesRef.current = selectedCounties;
  countyLayerVisibleRef.current = countyLayerVisible;

  const output: GeoSelectorOutput = useMemo(
    () => ({ zips: [...selectedZips], counties: [...selectedCounties] }),
    [selectedZips, selectedCounties],
  );

  useEffect(() => {
    onSelectionChange?.(output);
  }, [output, onSelectionChange]);

  const clearHoverState = useCallback((mapInstance: MapboxMap) => {
    if (hoveredZipIdRef.current != null) {
      try {
        mapInstance.setFeatureState(
          {
            source: ZIP_SOURCE_ID,
            id: hoveredZipIdRef.current,
          },
          { hover: false },
        );
      } catch {
        // ignore if source/layer not ready
      }
      hoveredZipIdRef.current = null;
    }
    if (hoveredCountyIdRef.current != null) {
      try {
        mapInstance.setFeatureState(
          {
            source: COUNTY_SOURCE_ID,
            id: hoveredCountyIdRef.current,
          },
          { hover: false },
        );
      } catch {
        // ignore
      }
      hoveredCountyIdRef.current = null;
    }
  }, []);

  const applySelectionState = useCallback(
    (mapInstance: MapboxMap) => {
      try {
        for (const id of allZipIdsRef.current) {
          mapInstance.setFeatureState(
            { source: ZIP_SOURCE_ID, id },
            { selected: selectedZips.includes(id) },
          );
        }
      } catch {
        // ignore if source/layer not ready
      }
      try {
        for (const id of allCountyIdsRef.current) {
          mapInstance.setFeatureState(
            { source: COUNTY_SOURCE_ID, id },
            { selected: selectedCounties.includes(id) },
          );
        }
      } catch {
        // ignore
      }
    },
    [selectedZips, selectedCounties],
  );

  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current) return;

    let cancelled = false;
    const container = containerRef.current;

    const init = async () => {
      const [{ default: mapboxgl }, zipRes, countyRes] = await Promise.all([
        import("mapbox-gl"),
        fetch("/api/geo/zip-codes"),
        fetch("/api/geo/counties"),
      ]);

      if (cancelled) return;

      if (!zipRes.ok || !countyRes.ok) {
        setError("Failed to load geography data.");
        setLoading(false);
        return;
      }

      let zipGeo: ZipGeoJSON;
      let countyGeo: CountyGeoJSON;
      try {
        zipGeo = (await zipRes.json()) as ZipGeoJSON;
        countyGeo = (await countyRes.json()) as CountyGeoJSON;
      } catch {
        setError("Invalid geography data.");
        setLoading(false);
        return;
      }

      if (
        zipGeo?.type !== "FeatureCollection" ||
        countyGeo?.type !== "FeatureCollection"
      ) {
        setError("Invalid GeoJSON format.");
        setLoading(false);
        return;
      }

      countyToZipsRef.current = buildCountyToZips(zipGeo);
      allZipIdsRef.current = zipGeo.features
        .map((f) => f.properties?.zip_code)
        .filter((id): id is string => id != null);
      allCountyIdsRef.current = countyGeo.features
        .map((f) => f.properties?.county_code)
        .filter((id): id is string => id != null);

      type MapboxLib = {
        accessToken: string;
        Map: new (opts: unknown) => MapboxMap;
      };
      const mapbox = mapboxgl as unknown as MapboxLib;
      mapbox.accessToken = MAPBOX_TOKEN;
      const mapInstance = new mapbox.Map({
        container,
        style: "mapbox://styles/mapbox/streets-v12",
        center: USA_CENTER,
        zoom: DEFAULT_ZOOM,
      });

      mapRef.current = mapInstance;

      mapInstance.on("load", () => {
        if (cancelled) return;

        mapInstance.addSource(ZIP_SOURCE_ID, {
          type: "geojson",
          data: zipGeo,
          promoteId: "zip_code",
        } as Parameters<MapboxMap["addSource"]>[1]);

        mapInstance.addSource(COUNTY_SOURCE_ID, {
          type: "geojson",
          data: countyGeo,
          promoteId: "county_code",
        } as Parameters<MapboxMap["addSource"]>[1]);

        mapInstance.addLayer({
          id: ZIP_FILL_LAYER_ID,
          type: "fill",
          source: ZIP_SOURCE_ID,
          paint: {
            "fill-color": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              COLORS.selectedFill,
              [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                COLORS.hoverFill,
                COLORS.defaultFill,
              ],
            ],
            "fill-opacity": 0.7,
          },
        });
        mapInstance.addLayer({
          id: ZIP_LINE_LAYER_ID,
          type: "line",
          source: ZIP_SOURCE_ID,
          paint: {
            "line-color": COLORS.defaultLine,
            "line-width": 1,
          },
        });

        mapInstance.addLayer({
          id: COUNTY_FILL_LAYER_ID,
          type: "fill",
          source: COUNTY_SOURCE_ID,
          paint: {
            "fill-color": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              COLORS.selectedFill,
              [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                COLORS.hoverFill,
                COLORS.defaultFill,
              ],
            ],
            "fill-opacity": 0.5,
          },
          layout: { visibility: countyLayerVisible ? "visible" : "none" },
        });
        mapInstance.addLayer({
          id: COUNTY_LINE_LAYER_ID,
          type: "line",
          source: COUNTY_SOURCE_ID,
          paint: {
            "line-color": COLORS.defaultLine,
            "line-width": 1,
          },
          layout: { visibility: countyLayerVisible ? "visible" : "none" },
        });

        applySelectionState(mapInstance);
      });

      const handleClick = (e: MapMouseEvent) => {
        if (cancelled || !mapRef.current) return;
        const mapInstance = mapRef.current;
        const features = mapInstance.queryRenderedFeatures(
          e.point,
        ) as MapFeature[];

        const zipFeature = features.find(
          (f) => f.sourceLayer === undefined && f.source === ZIP_SOURCE_ID,
        );
        const countyFeature = features.find(
          (f) => f.sourceLayer === undefined && f.source === COUNTY_SOURCE_ID,
        );

        const mode = selectionModeRef.current;
        if (mode === "zip" && zipFeature?.id != null) {
          const id = String(zipFeature.id);
          setSelectedZips((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
          );
          return;
        }

        if (mode === "county" && countyFeature?.id != null) {
          const id = String(countyFeature.id);
          const isRemovingCounty = selectedCountiesRef.current.includes(id);
          setSelectedCounties((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
          );
          setSelectedZips((prev) => {
            const zipsInCounty = countyToZipsRef.current.get(id) ?? [];
            if (isRemovingCounty) {
              return prev.filter((z) => !zipsInCounty.includes(z));
            }
            const added = new Set(prev);
            zipsInCounty.forEach((z) => added.add(z));
            return [...added];
          });
        }
      };

      const handleMouseMove = (e: MapMouseEvent) => {
        if (cancelled || !mapRef.current) return;
        const mapInstance = mapRef.current;
        clearHoverState(mapInstance);

        const moveFeatures = mapInstance.queryRenderedFeatures(
          e.point,
        ) as MapFeature[];
        const zipFeature = moveFeatures.find(
          (f) => f.source === ZIP_SOURCE_ID && f.id != null,
        );
        const countyFeature = moveFeatures.find(
          (f) => f.source === COUNTY_SOURCE_ID && f.id != null,
        );

        const mode = selectionModeRef.current;
        if (mode === "zip" && zipFeature?.id != null) {
          mapInstance.getCanvas().style.cursor = "pointer";
          hoveredZipIdRef.current = zipFeature.id;
          mapInstance.setFeatureState(
            { source: ZIP_SOURCE_ID, id: zipFeature.id },
            { hover: true },
          );
          return;
        }
        if (
          mode === "county" &&
          countyLayerVisibleRef.current &&
          countyFeature?.id != null
        ) {
          mapInstance.getCanvas().style.cursor = "pointer";
          hoveredCountyIdRef.current = countyFeature.id;
          mapInstance.setFeatureState(
            { source: COUNTY_SOURCE_ID, id: countyFeature.id },
            { hover: true },
          );
          return;
        }
        mapInstance.getCanvas().style.cursor = "";
      };

      const handleMouseLeave = () => {
        if (mapRef.current) {
          clearHoverState(mapRef.current);
          mapRef.current.getCanvas().style.cursor = "";
        }
      };

      mapInstance.on("click", handleClick);
      mapInstance.on("mousemove", handleMouseMove);
      mapInstance.on("mouseleave", handleMouseLeave);

      setLoading(false);

      return () => {
        mapInstance.off("click", handleClick);
        mapInstance.off("mousemove", handleMouseMove);
        mapInstance.off("mouseleave", handleMouseLeave);
      };
    };

    init();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [MAPBOX_TOKEN]); // eslint-disable-line react-hooks/exhaustive-deps -- init once

  useEffect(() => {
    const mapInstance = mapRef.current;
    if (!mapInstance?.getLayer(COUNTY_FILL_LAYER_ID)) return;
    const vis = countyLayerVisible ? "visible" : "none";
    mapInstance.setLayoutProperty(COUNTY_FILL_LAYER_ID, "visibility", vis);
    mapInstance.setLayoutProperty(COUNTY_LINE_LAYER_ID, "visibility", vis);
  }, [countyLayerVisible]);

  useEffect(() => {
    const mapInstance = mapRef.current;
    if (mapInstance) applySelectionState(mapInstance);
  }, [applySelectionState, selectedZips, selectedCounties]);

  const handleClearSelection = useCallback(() => {
    setSelectedZips([]);
    setSelectedCounties([]);
  }, []);

  const handleToggleMode = useCallback(() => {
    setSelectionMode((m) => (m === "zip" ? "county" : "zip"));
  }, []);

  const handleToggleCountyLayer = useCallback(() => {
    setCountyLayerVisible((v) => !v);
  }, []);

  if (!MAPBOX_TOKEN) {
    return (
      <div
        className={`flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-6 ${className}`}
        role="alert"
      >
        <p className="text-sm text-red-600">
          NEXT_PUBLIC_MAPBOX_TOKEN is not set. Add it to .env.local.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-6 ${className}`}
        role="alert"
      >
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={containerRef}
        className="h-[500px] w-full rounded-lg border border-gray-200 bg-gray-100"
        aria-label="Map for ZIP and County selection"
      />
      {loading && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80"
          role="status"
          aria-live="polite"
        >
          <span className="text-sm text-gray-600">Loading map…</span>
        </div>
      )}
      <div className="absolute right-4 top-4 flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <button
          type="button"
          onClick={handleToggleMode}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={
            selectionMode === "zip"
              ? "Switch to Select by County"
              : "Switch to Select by ZIP"
          }
        >
          {selectionMode === "zip" ? "Select by County" : "Select by ZIP"}
        </button>
        <button
          type="button"
          onClick={handleToggleCountyLayer}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-pressed={countyLayerVisible}
          aria-label="Toggle county boundaries"
        >
          {countyLayerVisible ? "Hide counties" : "Show counties"}
        </button>
        <button
          type="button"
          onClick={handleClearSelection}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Clear selection"
        >
          Clear selection
        </button>
        <div className="border-t border-gray-200 pt-2 text-xs text-gray-600">
          <p>ZIPs: {selectedZips.length}</p>
          <p>Counties: {selectedCounties.length}</p>
        </div>
      </div>
    </div>
  );
};

export type {
  GeoSelectorOutput,
  GeoSelectorProps,
  SelectionMode,
} from "./types";
