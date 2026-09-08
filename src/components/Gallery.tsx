"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useGalleryPhotos } from "@/hooks/useGalleryPhotos";

const EX_IMAGES = [
  ["/gallery/b1.jpg", "영서와 진성의 웨딩 사진 1"],
  ["/gallery/b2.jpg", "영서와 진성의 웨딩 사진 2"],
  ["/gallery/b3.jpg", "영서와 진성의 웨딩 사진 3"],
  ["/gallery/b4.jpeg", "영서와 진성의 웨딩 사진 4"],
  ["/gallery/d1.jpeg", "영서와 진성의 웨딩 사진 5"],
  ["/gallery/d2.jpeg", "영서와 진성의 웨딩 사진 6"],
  ["/gallery/d3.jpeg", "영서와 진성의 웨딩 사진 7"],
  ["/gallery/d4.jpeg", "영서와 진성의 웨딩 사진 8"],
  ["/gallery/d5.jpeg", "영서와 진성의 웨딩 사진 9"],
  ["/gallery/d6.jpeg", "영서와 진성의 웨딩 사진 10"],
  ["/gallery/d7.jpeg", "영서와 진성의 웨딩 사진 11"],
  ["/gallery/d8.jpeg", "영서와 진성의 웨딩 사진 12"],
  ["/gallery/d9.jpeg", "영서와 진성의 웨딩 사진 13"],
  ["/gallery/d10.jpeg", "영서와 진성의 웨딩 사진 14"],
  ["/gallery/d11.jpeg", "영서와 진성의 웨딩 사진 15"],
  ["/gallery/d12.jpeg", "영서와 진성의 웨딩 사진 16"],
] as const;

const INITIAL_VISIBLE_COUNT = 9;

type GalleryImage = {
  key: string;
  src: string;
  alt: string;
  position: string;
};

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const uploadedPhotos = useGalleryPhotos();
  const images: GalleryImage[] = uploadedPhotos.length
    ? uploadedPhotos.map((photo) => ({
        key: photo.key,
        src: photo.url,
        alt: photo.name,
        position: "50% 50%",
      }))
    : EX_IMAGES.map(([src, alt], index) => ({
        key: `mock-${index + 1}`,
        src,
        alt,
        position: index % 3 === 0 ? "50% 35%" : "50% 50%",
      }));
  const visibleImages = isExpanded ? images : images.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = images.length > INITIAL_VISIBLE_COUNT;
  const isMock = uploadedPhotos.length === 0;

  const close = useCallback(() => setActiveIndex(null), []);
  const previous = useCallback(() => {
    setActiveIndex((index) => index === null ? 0 : (index - 1 + images.length) % images.length);
  }, [images.length]);
  const next = useCallback(() => {
    setActiveIndex((index) => index === null ? 0 : (index + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, next, previous]);

  const handleTouchEnd = (endX: number) => {
    if (touchStartX.current === null) return;
    const distance = endX - touchStartX.current;
    if (Math.abs(distance) > 45) {
      if (distance > 0) previous();
      else next();
    }
    touchStartX.current = null;
  };

  return (
    <section id="section-gallery" className="gallery-section">
      <header className="gallery-heading invitation-section-heading">
        <div>
          <p className="section-title">Gallery</p>
          <h2>우리의 순간들</h2>
        </div>
        <p>{isMock ? "우리의 장면을 담아둘게요" : `${images.length}개의 소중한 순간`}</p>
      </header>

      <div className="gallery-grid" aria-label="사진 갤러리">
        {visibleImages.map((image, index) => (
          <button
            key={image.key}
            type="button"
            className="gallery-tile"
            onClick={() => setActiveIndex(index)}
            aria-label={`${index + 1}번째 사진 크게 보기`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-500"
              style={{ objectPosition: image.position }}
              sizes="(max-width: 480px) 33vw, 160px"
            />
            <span className="gallery-expand" aria-hidden="true"><Maximize2 size={14} /></span>
          </button>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          className="gallery-more-button"
          onClick={() => setIsExpanded((expanded) => !expanded)}
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? "사진 접기" : `사진 더보기 · ${images.length - INITIAL_VISIBLE_COUNT}장`}</span>
          <ChevronDown size={17} className={isExpanded ? "is-open" : ""} />
        </button>
      )}

      {activeIndex !== null && images[activeIndex] && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="사진 크게 보기" onClick={close}>
          <button type="button" className="lightbox-close" onClick={close} aria-label="닫기"><X size={22} /></button>
          <button type="button" className="lightbox-arrow lightbox-previous" onClick={(event) => { event.stopPropagation(); previous(); }} aria-label="이전 사진">
            <ChevronLeft size={26} />
          </button>
          <div
            className="lightbox-image"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
            onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)}
          >
            <Image
              src={images[activeIndex].src}
              alt={images[activeIndex].alt}
              fill
              draggable={false}
              className="lightbox-photo object-contain"
              sizes="100vw"
              loading="eager"
            />
          </div>
          <button type="button" className="lightbox-arrow lightbox-next" onClick={(event) => { event.stopPropagation(); next(); }} aria-label="다음 사진">
            <ChevronRight size={26} />
          </button>
          <p className="lightbox-counter">{activeIndex + 1} / {images.length}</p>
        </div>
      )}
    </section>
  );
}
