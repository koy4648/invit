"use client";

import { useEffect, useState } from "react";
import type { GalleryPhoto } from "@/types";

let photoRequest: Promise<GalleryPhoto[]> | null = null;

function requestPhotos() {
  if (!photoRequest) {
    photoRequest = fetch("/api/gallery", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return [];
        const data = (await response.json()) as { photos?: GalleryPhoto[] };
        return data.photos ?? [];
      })
      .catch(() => []);
  }
  return photoRequest;
}

export function useGalleryPhotos() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    let active = true;
    requestPhotos().then((items) => {
      if (active) setPhotos(items);
    });
    return () => {
      active = false;
    };
  }, []);

  return photos;
}
