"use client";

import { useState, useEffect } from "react";
import Map from "@/components/Map";
import PlaceDrawer from "@/components/PlaceDrawer";
import type { PlaceWithHtml, Route } from "@/lib/content";

export default function HomePage() {
  const [places, setPlaces] = useState<PlaceWithHtml[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      const [placesRes, routesRes] = await Promise.all([
        fetch("/api/places"),
        fetch("/api/routes"),
      ]);
      const placesData = await placesRes.json();
      const routesData = await routesRes.json();
      setPlaces(placesData);
      setRoutes(routesData);
    }
    fetchData();
  }, []);

  const selectedPlace = places.find((p) => p.id === selectedPlaceId) || null;
  const highlightedRoutes = selectedPlace?.routeRefs || [];

  const handleSelectPlace = (id: string) => {
    setSelectedPlaceId(id);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setSelectedPlaceId(null);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="h-12 bg-primary text-primary-foreground flex items-center px-4 shadow-md">
        <h1 className="text-lg font-semibold">Travel Map</h1>
      </header>
      <main className="flex-1 relative">
        <Map
          places={places.map((p) => ({ id: p.id, title: p.title, coords: p.coords }))}
          onSelect={handleSelectPlace}
          routes={routes}
          highlightedRoutes={highlightedRoutes}
        />
        <PlaceDrawer
          open={isDrawerOpen}
          onOpenChange={handleCloseDrawer}
          place={selectedPlace}
        />
      </main>
    </div>
  );
}
