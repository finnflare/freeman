"use client";

import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { PlaceWithHtml } from "@/lib/content";

interface PlaceDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  place: PlaceWithHtml | null;
}

export default function PlaceDrawer({ open, onOpenChange, place }: PlaceDrawerProps) {
  if (!place) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">{place.title}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Cover Image */}
          {place.cover && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={place.cover}
                alt={place.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 512px"
              />
            </div>
          )}

          {/* Metadata */}
          <div className="text-sm text-muted-foreground space-y-1">
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
            <div className="flex flex-wrap gap-2">
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
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: place.bodyHtml }}
          />

          {/* Photo Gallery */}
          {place.photos && place.photos.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Photos</h3>
              {place.photos.map((photo, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                      src={photo.src}
                      alt={photo.caption || `Photo ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 512px"
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
              <h3 className="font-semibold text-lg">Audio</h3>
              <audio controls src={place.audio} className="w-full" />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
