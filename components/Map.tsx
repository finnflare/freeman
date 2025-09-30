"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Route } from "@/lib/content";
import { getSatelliteStyle, fallbackMaxZoom } from "@/lib/mapStyle";

type PlaceLite = {
  id: string;
  title: string;
  coords: [number, number]; // [lon, lat]
};

export default function MapView({
  places,
  onSelect,
  routes,
  highlightedRoutes = [],
}: {
  places: PlaceLite[];
  onSelect: (id: string) => void;
  routes?: Route[];
  highlightedRoutes?: string[];
}) {
  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const style = getSatelliteStyle();
    const maxZoom = fallbackMaxZoom();

    const map = new maplibregl.Map({
      container: containerRef.current,
      style,
      center: [139.767, 35.681], // Tokyo Station area
      zoom: Math.min(5, maxZoom - 2),
      maxZoom,
      attributionControl: true,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      // ---- Places source/layers (clustered) ----
      const features = places.map((p) => ({
        type: "Feature" as const,
        properties: { id: p.id, title: p.title },
        geometry: { type: "Point" as const, coordinates: p.coords },
      }));

      map.addSource("places", {
        type: "geojson",
        data: { type: "FeatureCollection", features },
        cluster: true,
        clusterRadius: 50,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "places",
        filter: ["has", "point_count"],
        paint: {
          "circle-radius": 16,
          "circle-color": "#3b82f6",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "places",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "unclustered",
        type: "circle",
        source: "places",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-radius": 8,
          "circle-color": "#1d4ed8",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });

      map.on("click", "unclustered", (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const id = f.properties?.id as string;
        if (id) onSelect(id);
      });

      map.on("mouseenter", "unclustered", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "unclustered", () => {
        map.getCanvas().style.cursor = "";
      });

      // Click handler for clusters (zoom in)
      map.on("click", "clusters", (e) => {
        if (!e.features || e.features.length === 0) return;
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0].properties?.cluster_id;
        if (clusterId !== undefined) {
          (map.getSource("places") as maplibregl.GeoJSONSource).getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
              if (err) return;
              map.easeTo({
                center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
                zoom: zoom ?? 10,
              });
            }
          );
        }
      });

      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });

      // ---- Optional Routes ----
      if (routes && routes.length > 0) {
        routes.forEach((r) => {
          const sourceId = `route-src-${r.id}`;
          const layerId = `route-lyr-${r.id}`;

          map.addSource(sourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: { id: r.id, title: r.title },
              geometry: {
                type: "LineString",
                coordinates: r.geometry.coordinates,
              },
            },
          });

          map.addLayer({
            id: layerId,
            type: "line",
            source: sourceId,
            layout: {
              visibility: highlightedRoutes.includes(r.id) ? "visible" : "none",
            },
            paint: {
              "line-width": 3,
              "line-color": "#ef4444",
            },
          });
        });
      }
    });

    mapRef.current = map;
    return () => {
      map.remove();
    };
  }, [places, routes, onSelect]);

  // Update route visibility when highlightedRoutes changes
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (!routes) return;

    routes.forEach((r) => {
      const layerId = `route-lyr-${r.id}`;
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(
          layerId,
          "visibility",
          highlightedRoutes.includes(r.id) ? "visible" : "none"
        );
      }
    });
  }, [highlightedRoutes, routes]);

  return <div ref={containerRef} className="h-full w-full" />;
}