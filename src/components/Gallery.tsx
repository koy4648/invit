"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useGalleryPhotos } from "@/hooks/useGalleryPhotos";

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const uploadedPhotos = useGalleryPhotos();
  const images = uploadedPhotos.map((photo) => ({
    key: photo.key,
    src: photo.url,
    alt: photo.name,
    position: "50% 50%",
  }));
  const imageCount = images.length;

  const close = useCallback(() => setActiveIndex(null), []);
  const previous = useCallback(() =>
    setActiveIndex((index) => index === null ? 0 : (index - 1 + imageCount) % imageCount), [imageCount]);
  const next = useCallback(() =>
    setActiveIndex((index) => index === null ? 0 : (index + 1) % imageCount), [imageCount]);

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
      <header className="gallery-heading">
        <div>
          <p className="section-title">Gallery</p>
          <h2>우리의 순간들</h2>
        </div>
        <p>{images.length ? "사진을 누르면 크게 볼 수 있어요" : "스냅 촬영 후 공개됩니다"}</p>
      </header>

      {images.length ? (
        <div className="gallery-grid">
          {images.map((image, index) => (
            <button
              key={image.key}
              type="button"
              className={`gallery-tile gallery-tile-${index + 1}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`${index + 1}번째 사진 크게 보기`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500"
                style={{ objectPosition: image.position }}
                sizes="(max-width: 480px) 50vw, 240px"
              />
              <span className="gallery-expand" aria-hidden="true"><Maximize2 size={15} /></span>
            </button>
          ))}
        </div>
      ) : (
        <div className="gallery-empty">
          <div className="gallery-empty-mark" aria-hidden="true"><span /><span /></div>
          <p>사진으로 채워질 우리의 순간들</p>
          <span>스냅 촬영 후 천천히 담아둘게요.</span>
        </div>
      )}

      {activeIndex !== null && images[activeIndex] && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="사진 크게 보기" onClick={close}>
          <button type="button" className="lightbox-close" onClick={close} aria-label="닫기">
            <X size={22} />
          </button>

          <button
            type="button"
            className="lightbox-arrow lightbox-previous"
            onClick={(event) => { event.stopPropagation(); previous(); }}
            aria-label="이전 사진"
          >
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
              className="object-contain"
              sizes="100vw"
              loading="eager"
            />
          </div>

          <button
            type="button"
            className="lightbox-arrow lightbox-next"
            onClick={(event) => { event.stopPropagation(); next(); }}
            aria-label="다음 사진"
          >
            <ChevronRight size={26} />
          </button>

          <p className="lightbox-counter">{activeIndex + 1} / {images.length}</p>
        </div>
      )}
    </section>
  );
}
