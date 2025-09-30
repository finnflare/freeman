export function getSatelliteStyle(): string | object {
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  if (key) {
    // Crisp satellite with labels (free MapTiler key)
    return `https://api.maptiler.com/maps/satellite/style.json?key=${key}`;
  }

  // Keyless fallback: ESRI World Imagery (free, reliable, no authentication required)
  // Max practical zoom is ~17; works globally without CORS issues
  return {
    version: 8,
    sources: {
      "esri-satellite": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        ],
        tileSize: 256,
        attribution: "© Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        maxzoom: 17
      }
    },
    layers: [
      { 
        id: "esri-satellite-layer", 
        type: "raster", 
        source: "esri-satellite",
        minzoom: 0,
        maxzoom: 22
      }
    ]
  };
}

export function fallbackMaxZoom(): number {
  // If no MapTiler key is present, ESRI supports up to zoom 17
  return process.env.NEXT_PUBLIC_MAPTILER_KEY ? 18 : 17;
}