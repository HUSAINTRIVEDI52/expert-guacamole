"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { CountyGeoJSON, ZipGeoJSON } from "@/components/GeoSelector/types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const ZIP_SOURCE_ID = "leads-zip-codes";
const COUNTY_SOURCE_ID = "leads-counties";
const ZIP_FILL_LAYER_ID = "leads-zip-fill";
const ZIP_LINE_LAYER_ID = "leads-zip-line";
const COUNTY_FILL_LAYER_ID = "leads-county-fill";
const COUNTY_LINE_LAYER_ID = "leads-county-line";
const COUNTY_LABEL_LAYER_ID = "leads-county-label";

const USA_CENTER: [number, number] = [-98.5795, 39.8283];
const DEFAULT_ZOOM = 4;

const COLORS = {
  defaultFill: "rgba(13, 99, 99, 0.02)",
  defaultLine: "rgba(13, 99, 99, 0.5)",
  hoverFill: "rgba(13, 99, 99, 0.2)",
  selectedFill: "rgba(13, 99, 99, 0.8)",
  selectedLine: "#0D6363",
} as const;

// MapFeature type removed since any is used in handlers for speed/simplicity

interface LeadsMapProps {
  selectedZips: string[];
  selectedCounties: string[];
  selectionMode: "zip" | "county";
  highlightedStateFips?: string;
  onZipsChange: (zips: string[]) => void;
  onCountiesChange: (counties: string[]) => void;
  onMapDataReady?: (zips: string[]) => void;
}

export function LeadsMap({
  selectedZips,
  selectedCounties,
  selectionMode,
  highlightedStateFips,
  onZipsChange,
  onCountiesChange,
  onMapDataReady,
}: LeadsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapboxMap | null>(null);
  const countyGeoRef = useRef<CountyGeoJSON | null>(null);
  const allZipIdsRef = useRef<string[]>([]);
  const allCountyIdsRef = useRef<string[]>([]);

  // Maintain a ref of the current state mapped
  const loadedStateZipsRef = useRef<string | null>(null);

  const hoveredZipIdRef = useRef<string | number | null>(null);
  const hoveredCountyIdRef = useRef<string | number | null>(null);
  const highlightedStateFipsRef = useRef(highlightedStateFips);
  const selectedZipsRef = useRef(selectedZips);
  const selectedCountiesRef = useRef(selectedCounties);
  const selectionModeRef = useRef(selectionMode);

  highlightedStateFipsRef.current = highlightedStateFips;
  selectedZipsRef.current = selectedZips;
  selectedCountiesRef.current = selectedCounties;
  selectionModeRef.current = selectionMode;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearHoverState = useCallback((m: MapboxMap) => {
    if (hoveredZipIdRef.current != null) {
      try {
        m.setFeatureState(
          { source: ZIP_SOURCE_ID, id: hoveredZipIdRef.current },
          { hover: false },
        );
      } catch {
        /* */
      }
      hoveredZipIdRef.current = null;
    }
    if (hoveredCountyIdRef.current != null) {
      try {
        m.setFeatureState(
          { source: COUNTY_SOURCE_ID, id: hoveredCountyIdRef.current },
          { hover: false },
        );
      } catch {
        /* */
      }
      hoveredCountyIdRef.current = null;
    }
  }, []);

  const applySelectionState = useCallback(
    (mArg?: MapboxMap) => {
      const m = mArg || map;
      if (!m) return;
      try {
        for (const zipStr of allZipIdsRef.current) {
          const numericId = parseInt(zipStr, 10);
          if (!isNaN(numericId)) {
            m.setFeatureState(
              { source: ZIP_SOURCE_ID, id: numericId },
              { selected: selectedZips.includes(zipStr) },
            );
          }
        }
      } catch (e) {
        console.warn("Failed to apply zip selection state:", e);
      }
      try {
        for (const countyCode of allCountyIdsRef.current) {
          m.setFeatureState(
            { source: COUNTY_SOURCE_ID, id: countyCode },
            { selected: selectedCounties.includes(countyCode) },
          );
        }
      } catch (e) {
        console.warn("Failed to apply county selection state:", e);
      }
    },
    [selectedZips, selectedCounties, map],
  );

  const fitSelectedBounds = useCallback(() => {
    if (!map) return;

    let minLng = 180,
      minLat = 90,
      maxLng = -180,
      maxLat = -90;
    let found = false;

    const processCoords = (coords: any[]) => {
      if (typeof coords[0] === "number") {
        const [lng, lat] = coords as [number, number];
        if (lng < minLng) minLng = lng;
        if (lat < minLat) minLat = lat;
        if (lng > maxLng) maxLng = lng;
        if (lat > maxLat) maxLat = lat;
        found = true;
      } else {
        for (const c of coords) processCoords(c as any[]);
      }
    };

    // 1. Check selected counties
    if (
      selectionMode === "county" &&
      selectedCounties.length > 0 &&
      countyGeoRef.current
    ) {
      const selectedFeatures = countyGeoRef.current.features.filter((f) =>
        selectedCounties.includes(f.properties?.county_code || ""),
      );
      for (const f of selectedFeatures) {
        processCoords(f.geometry.coordinates as any[]);
      }
    }
    // 2. Check selected zips (this would require full zip geo, but we can at least use current loaded state)
    else if (selectionMode === "zip" && selectedZips.length > 0) {
      const zipSource = map.getSource(ZIP_SOURCE_ID) as any;
      if (zipSource && zipSource._data) {
        const features = zipSource._data.features.filter((f: any) =>
          selectedZips.includes(String(f.id).padStart(5, "0")),
        );
        for (const f of features) {
          processCoords(f.geometry.coordinates as any[]);
        }
      }
    }

    if (found) {
      map.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 80, duration: 1000 },
      );
    }
  }, [map, selectionMode, selectedCounties, selectedZips]);

  const zoomToHighlightedState = useCallback(
    (mArg?: MapboxMap) => {
      const m = mArg || map;
      const geo = countyGeoRef.current;
      const hState = highlightedStateFipsRef.current;

      if (!m || !geo || !hState) return;

      const stateCounties = geo.features.filter((f) =>
        f.properties?.county_code?.startsWith(hState),
      );
      if (stateCounties.length === 0) return;

      let minLng = 180,
        minLat = 90,
        maxLng = -180,
        maxLat = -90;
      let foundGeo = false;

      const processCoords = (coords: any[]) => {
        if (typeof coords[0] === "number") {
          const [lng, lat] = coords as [number, number];
          if (lng < minLng) minLng = lng;
          if (lat < minLat) minLat = lat;
          if (lng > maxLng) maxLng = lng;
          if (lat > maxLat) maxLat = lat;
          foundGeo = true;
        } else {
          for (const c of coords) processCoords(c as any[]);
        }
      };

      for (const feature of stateCounties) {
        processCoords(feature.geometry.coordinates as any[]);
      }

      if (foundGeo) {
        m.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          { padding: 50, duration: 1000 },
        );
      }
    },
    [map],
  );

  // Handle zoom when highlightedStateFips changes explicitly
  useEffect(() => {
    zoomToHighlightedState();
  }, [highlightedStateFips, zoomToHighlightedState]);

  // Sync selection state
  useEffect(() => {
    if (map) applySelectionState(map);
  }, [
    applySelectionState,
    selectedZips,
    selectedCounties,
    highlightedStateFips,
    map,
  ]);

  // Handle layer visibility based on selectionMode
  useEffect(() => {
    if (!map) return;
    const isZipMode = selectionMode === "zip";

    // ZIP layers: Show all if active, otherwise only show selected
    map.setPaintProperty(ZIP_FILL_LAYER_ID, "fill-opacity", [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      0.9,
      isZipMode
        ? ["case", ["boolean", ["feature-state", "hover"], false], 0.4, 0.3]
        : 0,
    ]);
    map.setPaintProperty(ZIP_LINE_LAYER_ID, "line-opacity", [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      1,
      isZipMode ? 0.5 : 0,
    ]);

    // County layers: Show all if active, otherwise only show selected
    if (map.getLayer(COUNTY_FILL_LAYER_ID)) {
      map.setPaintProperty(COUNTY_FILL_LAYER_ID, "fill-opacity", [
        "case",
        ["boolean", ["feature-state", "selected"], false],
        0.9,
        !isZipMode
          ? ["case", ["boolean", ["feature-state", "hover"], false], 0.4, 0.3]
          : 0,
      ]);
      map.setPaintProperty(COUNTY_LINE_LAYER_ID, "line-opacity", [
        "case",
        ["boolean", ["feature-state", "selected"], false],
        1,
        !isZipMode ? 0.5 : 0,
      ]);
    }

    // Ensure layers are always 'visible' layout-wise so selection can shine through
    map.setLayoutProperty(ZIP_FILL_LAYER_ID, "visibility", "visible");
    map.setLayoutProperty(ZIP_LINE_LAYER_ID, "visibility", "visible");
    if (map.getLayer(COUNTY_FILL_LAYER_ID)) {
      map.setLayoutProperty(COUNTY_FILL_LAYER_ID, "visibility", "visible");
    }
    if (map.getLayer(COUNTY_LINE_LAYER_ID)) {
      map.setLayoutProperty(COUNTY_LINE_LAYER_ID, "visibility", "visible");
      if (map.getLayer(COUNTY_LABEL_LAYER_ID)) {
        map.setLayoutProperty(COUNTY_LABEL_LAYER_ID, "visibility", "visible");
        // Apply filter to only show labels for the highlighted state in Zip mode
        if (highlightedStateFips && selectionMode === "zip") {
          map.setFilter(COUNTY_LABEL_LAYER_ID, [
            "==",
            ["slice", ["get", "county_code"], 0, 2],
            highlightedStateFips,
          ]);
        } else {
          map.setFilter(COUNTY_LABEL_LAYER_ID, null);
        }
      }
    }
  }, [map, selectionMode]);

  // Fetch dynamic zip codes when state changes
  useEffect(() => {
    console.log("LeadsMap: fetch effect triggered", {
      hasMap: !!map,
      highlightedStateFips,
    });
    if (!map) return;

    if (!highlightedStateFips) {
      console.log("LeadsMap: No state selected, resetting source");
      loadedStateZipsRef.current = null;
      const mapSource = map.getSource(ZIP_SOURCE_ID) as any;
      if (mapSource)
        mapSource.setData({ type: "FeatureCollection", features: [] });
      allZipIdsRef.current = [];
      if (onMapDataReadyRef.current) onMapDataReadyRef.current([]);
      return;
    }

    const doFetch = async () => {
      console.log("LeadsMap: doFetch executing", {
        current: loadedStateZipsRef.current,
        next: highlightedStateFips,
        isStyleLoaded: map.isStyleLoaded(),
      });

      // Prevent duplicate fetching for the same state
      if (loadedStateZipsRef.current === highlightedStateFips) {
        console.log("LeadsMap: returning early (already loaded/loading)");
        return;
      }

      loadedStateZipsRef.current = highlightedStateFips;

      try {
        console.log(
          `LeadsMap: Fetching zips for state: ${highlightedStateFips}`,
        );
        const res = await fetch(
          `/api/geo/zip-codes?state=${highlightedStateFips}`,
        );
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const zipGeo = (await res.json()) as ZipGeoJSON;
        console.log(`LeadsMap: Received ${zipGeo.features.length} features`);

        // Update source
        const mapSource = map.getSource(ZIP_SOURCE_ID) as any;
        if (mapSource) {
          mapSource.setData(zipGeo);
          console.log("LeadsMap: source.setData completed");
        }

        // Update refs and notify parent
        const zips = zipGeo.features
          .map((f) => String(f.properties?.zip_code))
          .filter((id): id is string => id != null && id !== "undefined");

        allZipIdsRef.current = zips;
        console.log(`LeadsMap: Found ${zips.length} zips`);

        if (onMapDataReadyRef.current) {
          onMapDataReadyRef.current(zips);
        }

        // Re-apply selections for new data
        applySelectionState(map);
      } catch (e) {
        console.error("LeadsMap: Failed to fetch dynamic zips:", e);
        loadedStateZipsRef.current = null; // allow retry
        if (onMapDataReadyRef.current) onMapDataReadyRef.current([]);
      }
    };

    doFetch();
  }, [highlightedStateFips, applySelectionState, map]);

  // Track onMapDataReady in a ref to avoid effect cycles
  const onMapDataReadyRef = useRef(onMapDataReady);
  useEffect(() => {
    onMapDataReadyRef.current = onMapDataReady;
  }, [onMapDataReady]);

  // Init map
  const mapRefInternal = useRef<MapboxMap | null>(null);
  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current) return;
    let cancelled = false;
    const container = containerRef.current;

    const init = async () => {
      const [{ default: mapboxgl }, countyRes] = await Promise.all([
        import("mapbox-gl"),
        fetch("/api/geo/counties"),
      ]);
      if (cancelled) return;

      if (!countyRes.ok) {
        setError("Failed to load geography data.");
        setLoading(false);
        return;
      }

      let countyGeo: CountyGeoJSON;
      try {
        countyGeo = (await countyRes.json()) as CountyGeoJSON;
        countyGeoRef.current = countyGeo;
        allCountyIdsRef.current = countyGeo.features
          .map((f) => f.properties?.county_code)
          .filter((id): id is string => id != null);
      } catch {
        setError("Invalid geography data.");
        setLoading(false);
        return;
      }

      const emptyZipGeo: ZipGeoJSON = {
        type: "FeatureCollection",
        features: [],
      };
      const mapbox = mapboxgl as any;
      mapbox.accessToken = MAPBOX_TOKEN;

      const mapInstance = new mapbox.Map({
        container,
        style: "mapbox://styles/mapbox/light-v11",
        center: USA_CENTER,
        zoom: DEFAULT_ZOOM,
      });

      mapInstance.addControl(new mapbox.NavigationControl(), "bottom-right");
      mapRefInternal.current = mapInstance;

      mapInstance.on("load", () => {
        if (cancelled) return;

        mapInstance.addSource(ZIP_SOURCE_ID, {
          type: "geojson",
          data: emptyZipGeo,
        });

        mapInstance.addSource(COUNTY_SOURCE_ID, {
          type: "geojson",
          data: countyGeo,
          promoteId: "county_code",
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
                "rgba(0,0,0,0)",
              ],
            ],
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              0.9,
              0.1,
            ],
          },
          layout: {
            visibility:
              selectionModeRef.current === "county" ? "visible" : "none",
          },
          minzoom: 0,
        });

        mapInstance.addLayer({
          id: COUNTY_LINE_LAYER_ID,
          type: "line",
          source: COUNTY_SOURCE_ID,
          paint: {
            "line-color": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              COLORS.selectedLine,
              COLORS.defaultLine,
            ],
            "line-width": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              2,
              0.5,
            ],
          },
          layout: {
            visibility:
              selectionModeRef.current === "county" ? "visible" : "none",
          },
          minzoom: 0,
        });

        mapInstance.addLayer({
          id: COUNTY_LABEL_LAYER_ID,
          type: "symbol",
          source: COUNTY_SOURCE_ID,
          layout: {
            "text-field": ["get", "name"],
            "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
            "text-size": 12,
            "text-anchor": "center",
            "text-allow-overlap": false,
            visibility: "visible",
          },
          minzoom: 0,
          paint: {
            "text-color": "#333333",
            "text-halo-color": "rgba(255,255,255,0.8)",
            "text-halo-width": 1,
          },
        });

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
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              0.9,
              [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.2,
                0.05,
              ],
            ],
          },
          layout: {
            visibility: selectionModeRef.current === "zip" ? "visible" : "none",
          },
          minzoom: 0,
        });

        mapInstance.addLayer({
          id: ZIP_LINE_LAYER_ID,
          type: "line",
          source: ZIP_SOURCE_ID,
          paint: {
            "line-color": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              COLORS.selectedLine,
              COLORS.defaultLine,
            ],
            "line-width": [
              "case",
              ["boolean", ["feature-state", "selected"], false],
              2,
              0.5,
            ],
          },
          layout: {
            visibility: selectionModeRef.current === "zip" ? "visible" : "none",
          },
          minzoom: 0,
        });

        mapInstance.addLayer({
          id: "leads-state-highlight-fill",
          type: "fill",
          source: COUNTY_SOURCE_ID,
          filter: [
            "==",
            ["slice", ["get", "county_code"], 0, 2],
            highlightedStateFipsRef.current || "",
          ],
          paint: {
            "fill-color": "#0D6363",
            "fill-opacity": 0.05,
          },
        });

        mapInstance.addLayer({
          id: "leads-state-highlight-line",
          type: "line",
          source: COUNTY_SOURCE_ID,
          filter: [
            "==",
            ["slice", ["get", "county_code"], 0, 2],
            highlightedStateFipsRef.current || "",
          ],
          paint: {
            "line-color": "#0D6363",
            "line-width": 1.5,
          },
        });

        applySelectionState(mapInstance);
        zoomToHighlightedState(mapInstance);
        setMap(mapInstance);
        setLoading(false);
      });

      const handleClick = (e: any) => {
        if (cancelled || !mapInstance) return;
        const features = mapInstance.queryRenderedFeatures(e.point) as any[];
        const mode = selectionModeRef.current;

        if (mode === "zip") {
          const zipFeature = features.find((f) => f.source === ZIP_SOURCE_ID);
          if (zipFeature?.id != null) {
            // id is numeric in mapbox, convert to 5-digit zip string
            const zipStr = String(zipFeature.id).padStart(5, "0");
            const prev = selectedZipsRef.current;
            onZipsChange(
              prev.includes(zipStr)
                ? prev.filter((x) => x !== zipStr)
                : [...prev, zipStr],
            );
          }
        } else if (mode === "county") {
          const countyFeature = features.find(
            (f) => f.source === COUNTY_SOURCE_ID,
          );
          if (countyFeature?.id != null) {
            const countyCode = String(countyFeature.id);
            const prev = selectedCountiesRef.current;
            onCountiesChange(
              prev.includes(countyCode)
                ? prev.filter((x) => x !== countyCode)
                : [...prev, countyCode],
            );
          }
        }
      };

      const handleMouseMove = (e: any) => {
        if (cancelled || !mapInstance) return;
        clearHoverState(mapInstance);
        const features = mapInstance.queryRenderedFeatures(e.point) as any[];
        const mode = selectionModeRef.current;

        if (mode === "zip") {
          const zipFeat = features.find((f) => f.source === ZIP_SOURCE_ID);
          if (zipFeat?.id != null) {
            mapInstance.getCanvas().style.cursor = "pointer";
            hoveredZipIdRef.current = zipFeat.id;
            mapInstance.setFeatureState(
              { source: ZIP_SOURCE_ID, id: zipFeat.id },
              { hover: true },
            );
          } else {
            mapInstance.getCanvas().style.cursor = "";
          }
        } else if (mode === "county") {
          const countyFeat = features.find(
            (f) => f.source === COUNTY_SOURCE_ID,
          );
          if (countyFeat?.id != null) {
            mapInstance.getCanvas().style.cursor = "pointer";
            hoveredCountyIdRef.current = countyFeat.id;
            mapInstance.setFeatureState(
              { source: COUNTY_SOURCE_ID, id: countyFeat.id },
              { hover: true },
            );
          } else {
            mapInstance.getCanvas().style.cursor = "";
          }
        }
      };

      const handleMouseLeave = () => {
        if (mapInstance) {
          clearHoverState(mapInstance);
          mapInstance.getCanvas().style.cursor = "";
        }
      };

      mapInstance.on("click", handleClick);
      mapInstance.on("mousemove", handleMouseMove);
      mapInstance.on("mouseleave", handleMouseLeave);
    };

    const initPromise = init();

    return () => {
      cancelled = true;
      initPromise.then(() => {
        if (mapRefInternal.current) {
          mapRefInternal.current.remove();
          mapRefInternal.current = null;
        }
        setMap(null);
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-[16px] border border-[#EEEEEA] bg-[#F4F4F4] p-6">
        <p className="text-sm text-red-600 font-noto-sans">
          NEXT_PUBLIC_MAPBOX_TOKEN is not set. Add it to .env.local.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-[16px] border border-[#EEEEEA] bg-[#F4F4F4] p-6">
        <p className="text-sm text-red-600 font-noto-sans">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-[16px] overflow-hidden border border-[#EEEEEA]">
      <div
        ref={containerRef}
        className="w-full h-full min-h-[500px]"
        aria-label="Map for ZIP and County selection"
      />

      {/* Map Actions */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={fitSelectedBounds}
          disabled={
            selectionMode === "zip"
              ? selectedZips.length === 0
              : selectedCounties.length === 0
          }
          title="Zoom to selected locations"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#EEEEEA] bg-white text-[#333333] shadow-sm hover:bg-[#F4F4F4] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
          </svg>
        </button>
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[16px] bg-white/80">
          <div className="flex items-center gap-3">
            <svg
              className="animate-spin h-5 w-5 text-[#0D6363]"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-sm text-[#888888] font-noto-sans">
              Loading map…
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
