"use client";

import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

// 사전 업로드된 신랑신부 갤러리 이미지 목록
// 실제 배포 시 public/gallery/ 폴더에 이미지를 넣거나 외부 URL로 교체하세요.
const GALLERY_IMAGES = [
  { src: "/gallery/photo1.jpg", alt: "신랑신부 사진 1" },
  { src: "/gallery/photo2.jpg", alt: "신랑신부 사진 2" },
  { src: "/gallery/photo3.jpg", alt: "신랑신부 사진 3" },
  { src: "/gallery/photo4.jpg", alt: "신랑신부 사진 4" },
  { src: "/gallery/photo5.jpg", alt: "신랑신부 사진 5" },
  { src: "/gallery/photo6.jpg", alt: "신랑신부 사진 6" },
];

type ViewMode = "carousel" | "grid";

interface LightboxProps {
  images: typeof GALLERY_IMAGES;
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ images, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl z-10 w-10 h-10 flex items-center justify-center"
        onClick={onClose}
        aria-label="닫기"
      >
        ✕
      </button>
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-2xl z-10 w-10 h-10 flex items-center justify-center bg-black/40 rounded-full"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="이전"
      >
        ‹
      </button>
      <div
        className="relative w-full max-w-sm mx-8 aspect-[3/4]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-2xl z-10 w-10 h-10 flex items-center justify-center bg-black/40 rounded-full"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="다음"
      >
        ›
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

export default function Gallery() {
  const [viewMode, setViewMode] = useState<ViewMode>("carousel");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3500, stopOnInteraction: true }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevLightbox = () =>
    setLightboxIndex((i) =>
      i === null ? 0 : (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
    );
  const nextLightbox = () =>
    setLightboxIndex((i) =>
      i === null ? 0 : (i + 1) % GALLERY_IMAGES.length
    );

  return (
    <section className="py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-stone-700 tracking-widest">
          갤러리
        </h2>
        <div className="flex gap-1 bg-stone-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("carousel")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "carousel"
                ? "bg-white text-stone-700 shadow-sm"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            슬라이드
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "grid"
                ? "bg-white text-stone-700 shadow-sm"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            전체보기
          </button>
        </div>
      </div>

      {viewMode === "carousel" ? (
        <div className="relative">
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex">
              {GALLERY_IMAGES.map((img, idx) => (
                <div
                  key={idx}
                  className="flex-[0_0_100%] min-w-0 relative aspect-[3/4] cursor-pointer"
                  onClick={() => openLightbox(idx)}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={idx === 0}
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-stone-600 hover:bg-white transition-all"
            aria-label="이전 사진"
          >
            ‹
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-stone-600 hover:bg-white transition-all"
            aria-label="다음 사진"
          >
            ›
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1.5">
          {GALLERY_IMAGES.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openLightbox(idx)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 150px"
              />
            </div>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={GALLERY_IMAGES}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
        />
      )}
    </section>
  );
}
