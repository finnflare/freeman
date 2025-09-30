import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

export type Place = {
  id: string;
  title: string;
  date: string;
  coords: [number, number];
  city?: string;
  country?: string;
  tags?: string[];
  cover?: string;
  photos?: { src: string; caption?: string }[];
  audio?: string;
  routeRefs?: string[];
  slug: string;
};

export type PlaceWithHtml = Place & {
  bodyHtml: string;
};

export type Route = {
  id: string;
  title: string;
  geometry: {
    type: "LineString";
    coordinates: [number, number][];
  };
};

const placesDir = path.join(process.cwd(), "content", "places");
const routesDir = path.join(process.cwd(), "content", "routes");

export async function getAllPlaces(): Promise<PlaceWithHtml[]> {
  if (!fs.existsSync(placesDir)) {
    return [];
  }

  const files = fs.readdirSync(placesDir).filter((f) => f.endsWith(".mdx"));

  const places = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const fullPath = path.join(placesDir, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      // Validate required fields
      if (!data.id || typeof data.id !== "string") {
        throw new Error(`Missing or invalid 'id' in ${filename}`);
      }
      if (!data.title || typeof data.title !== "string") {
        throw new Error(`Missing or invalid 'title' in ${filename}`);
      }
      if (!data.date || typeof data.date !== "string") {
        throw new Error(`Missing or invalid 'date' in ${filename}`);
      }
      if (
        !Array.isArray(data.coords) ||
        data.coords.length !== 2 ||
        typeof data.coords[0] !== "number" ||
        typeof data.coords[1] !== "number"
      ) {
        throw new Error(`Missing or invalid 'coords' in ${filename}`);
      }

      // Convert markdown to sanitized HTML
      const processed = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(rehypeStringify)
        .process(content);

      const bodyHtml = String(processed);

      const place: PlaceWithHtml = {
        id: data.id,
        title: data.title,
        date: data.date,
        coords: data.coords as [number, number],
        city: data.city,
        country: data.country,
        tags: data.tags,
        cover: data.cover,
        photos: data.photos,
        audio: data.audio,
        routeRefs: data.routeRefs,
        slug,
        bodyHtml,
      };

      return place;
    })
  );

  // Sort by date descending
  places.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return places;
}

export async function getAllRoutes(): Promise<Route[]> {
  if (!fs.existsSync(routesDir)) {
    return [];
  }

  const files = fs.readdirSync(routesDir).filter((f) => f.endsWith(".geojson"));

  const routes = files.map((filename) => {
    const fullPath = path.join(routesDir, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const geojson = JSON.parse(fileContents);

    // Validate minimal schema
    if (geojson.type !== "Feature") {
      throw new Error(`Invalid GeoJSON type in ${filename}`);
    }
    if (!geojson.properties?.id || !geojson.properties?.title) {
      throw new Error(`Missing id or title in properties in ${filename}`);
    }
    if (geojson.geometry?.type !== "LineString") {
      throw new Error(`Expected LineString geometry in ${filename}`);
    }
    if (!Array.isArray(geojson.geometry?.coordinates)) {
      throw new Error(`Invalid coordinates in ${filename}`);
    }

    const route: Route = {
      id: geojson.properties.id,
      title: geojson.properties.title,
      geometry: {
        type: "LineString",
        coordinates: geojson.geometry.coordinates,
      },
    };

    return route;
  });

  return routes;
}
