import { notFound } from "next/navigation";
import { getAllPlaces } from "@/lib/content";
import PlaceDetailClient from "./PlaceDetailClient";

interface PlaceDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const places = await getAllPlaces();
  return places.map((place) => ({
    slug: place.slug,
  }));
}

export async function generateMetadata({ params }: PlaceDetailPageProps) {
  const places = await getAllPlaces();
  const place = places.find((p) => p.slug === params.slug);

  if (!place) {
    return {
      title: "Place Not Found",
    };
  }

  return {
    title: `${place.title} | Travel Map`,
    description: place.bodyHtml.substring(0, 160),
  };
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const places = await getAllPlaces();
  const place = places.find((p) => p.slug === params.slug);

  if (!place) {
    notFound();
  }

  return <PlaceDetailClient place={place} />;
}
