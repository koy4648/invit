"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useGalleryPhotos } from "@/hooks/useGalleryPhotos";

const MOCK_IMAGES = [
  ["/gallery-mock/01-cafe.jpg", "핑크빛 카페에서 시작된 하루"],
  ["/gallery-mock/02-flowers.jpg", "햇살 아래 피어난 꽃"],
  ["/gallery-mock/03-bloom.jpg", "우리의 봄날"],
  ["/gallery-mock/04-wedding.jpg", "서로를 바라보던 순간"],
  ["/gallery-mock/05-cafe.jpg", "달콤한 오후의 데이트"],
  ["/gallery-mock/06-couple.jpg", "바다를 닮은 여행"],
  ["/gallery-mock/07-dreamy.jpg", "포근하게 물든 계절"],
  ["/gallery-mock/08-sunset.jpg", "노을이 예뻤던 날"],
  ["/gallery-mock/09-wedding-detail.jpg", "함께 걷는 길"],
  ["/gallery-mock/10-cafe-detail.jpg", "우리만의 작은 장소"],
  ["/gallery-mock/11-bloom-detail.jpg", "꽃처럼 피어난 마음"],
  ["/gallery-mock/12-flowers-detail.jpg", "오래 기억할 장면"],
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
    : MOCK_IMAGES.map(([src, alt], index) => ({
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
      <header className="gallery-heading">
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
            <Image src={images[activeIndex].src} alt={images[activeIndex].alt} fill className="object-contain" sizes="100vw" loading="eager" />
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
