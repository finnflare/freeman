"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { PlaceWithHtml } from "@/lib/content";

interface PlaceDetailClientProps {
  place: PlaceWithHtml;
}

export default function PlaceDetailClient({ place }: PlaceDetailClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="h-12 bg-primary text-primary-foreground flex items-center px-4 shadow-md">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-semibold">Back to Map</span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{place.title}</h1>

        {/* Cover Image */}
        {place.cover && (
          <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6">
            <Image
              src={place.cover}
              alt={place.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Metadata */}
        <div className="text-sm text-muted-foreground space-y-1 mb-6">
          {place.city && place.country && (
            <p>
              {place.city}, {place.country}
            </p>
          )}
          {place.date && (
            <p>
              {new Date(place.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>

        {/* Tags */}
        {place.tags && place.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {place.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Body HTML */}
        <div
          className="prose prose-lg max-w-none dark:prose-invert mb-8"
          dangerouslySetInnerHTML={{ __html: place.bodyHtml }}
        />

        {/* Photo Gallery */}
        {place.photos && place.photos.length > 0 && (
          <div className="space-y-4 mb-8">
            <h2 className="font-semibold text-2xl">Photos</h2>
            {place.photos.map((photo, idx) => (
              <div key={idx} className="space-y-2">
                <div className="relative w-full h-96 rounded-lg overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.caption || `Photo ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
                {photo.caption && (
                  <p className="text-sm text-muted-foreground italic">
                    {photo.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Audio */}
        {place.audio && (
          <div className="space-y-2">
            <h2 className="font-semibold text-2xl">Audio</h2>
            <audio controls src={place.audio} className="w-full" />
          </div>
        )}
      </main>
    </div>
  );
}
