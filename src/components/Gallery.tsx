"use client";

import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const GALLERY_IMAGES = [
  { src: "/gallery/photo1.jpg", alt: "신랑신부 사진 1" },
  { src: "/gallery/photo2.jpg", alt: "신랑신부 사진 2" },
  { src: "/gallery/photo3.jpg", alt: "신랑신부 사진 3" },
  { src: "/gallery/photo4.jpg", alt: "신랑신부 사진 4" },
  { src: "/gallery/photo5.jpg", alt: "신랑신부 사진 5" },
  { src: "/gallery/photo6.jpg", alt: "신랑신부 사진 6" },
];

type ViewMode = "carousel" | "grid";

/* ── 라이트박스 ─────────────────────────────────────────── */
function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: typeof GALLERY_IMAGES;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(28, 25, 23, 0.96)" }}
      onClick={onClose}
    >
      {/* 닫기 */}
      <button
        className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors z-10"
        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
        onClick={onClose}
        aria-label="닫기"
      >
        ✕
      </button>

      {/* 이전 */}
      <button
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors z-10 text-xl"
        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="이전"
      >
        ‹
      </button>

      {/* 이미지 */}
      <div
        className="relative w-full max-w-xs mx-16 aspect-[3/4]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index].src}
          alt={images[index].alt}
          fill
          className="object-contain"
          sizes="320px"
        />
      </div>

      {/* 다음 */}
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors z-10 text-xl"
        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="다음"
      >
        ›
      </button>

      {/* 인디케이터 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width:  i === index ? "20px" : "6px",
              height: "6px",
              background: i === index
                ? "linear-gradient(90deg, #d4a96a, #b08840)"
                : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── 메인 갤러리 ─────────────────────────────────────────── */
export default function Gallery() {
  const [viewMode, setViewMode] = useState<ViewMode>("carousel");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3800, stopOnInteraction: true }),
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    setCurrentSlide((i) => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    setCurrentSlide((i) => (i + 1) % GALLERY_IMAGES.length);
  }, [emblaApi]);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevLightbox = () =>
    setLightboxIndex((i) => i === null ? 0 : (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  const nextLightbox = () =>
    setLightboxIndex((i) => i === null ? 0 : (i + 1) % GALLERY_IMAGES.length);

  return (
    <section id="section-gallery" className="py-10 px-4">
      {/* 섹션 헤더 */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="section-title mb-1">Gallery</p>
          <h2
            className="text-xl font-light tracking-wider"
            style={{ color: "#44403c" }}
          >
            갤러리
          </h2>
        </div>

        {/* 뷰 전환 토글 */}
        <div
          className="flex gap-0.5 p-1 rounded-xl"
          style={{
            background: "rgba(212,169,106,0.1)",
            border: "1px solid rgba(212,169,106,0.2)",
          }}
        >
          {(["carousel", "grid"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                background: viewMode === mode ? "#fff" : "transparent",
                color:      viewMode === mode ? "#b08840" : "#a8a29e",
                boxShadow:  viewMode === mode ? "0 1px 4px rgba(180,140,80,0.15)" : "none",
              }}
            >
              {mode === "carousel" ? "슬라이드" : "전체"}
            </button>
          ))}
        </div>
      </div>

      {/* 캐러셀 뷰 */}
      {viewMode === "carousel" ? (
        <div className="relative">
          <div
            className="overflow-hidden rounded-3xl"
            style={{ boxShadow: "0 8px 40px rgba(180,140,80,0.15)" }}
            ref={emblaRef}
          >
            <div className="flex">
              {GALLERY_IMAGES.map((img, idx) => (
                <div
                  key={idx}
                  className="flex-[0_0_100%] min-w-0 relative aspect-[3/4] cursor-pointer"
                  onClick={() => openLightbox(idx)}
                >
                  {/* 플레이스홀더 */}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "linear-gradient(160deg, #f9f3ea, #e4d0b8)" }}
                  >
                    <span className="text-4xl opacity-40">🌸</span>
                  </div>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={idx === 0}
                  />
                  {/* 하단 그라디언트 */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-20"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.2), transparent)" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 이전/다음 버튼 */}
          {[
            { dir: "prev", pos: "left-3", fn: scrollPrev, icon: "‹" },
            { dir: "next", pos: "right-3", fn: scrollNext, icon: "›" },
          ].map(({ dir, pos, fn, icon }) => (
            <button
              key={dir}
              onClick={fn}
              className={`absolute ${pos} top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all`}
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(212,169,106,0.3)",
                color: "#b08840",
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
              }}
              aria-label={dir === "prev" ? "이전" : "다음"}
            >
              {icon}
            </button>
          ))}

          {/* 슬라이드 인디케이터 */}
          <div className="flex justify-center gap-1.5 mt-4">
            {GALLERY_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => { emblaApi?.scrollTo(i); setCurrentSlide(i); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width:  i === currentSlide ? "20px" : "6px",
                  height: "6px",
                  background: i === currentSlide
                    ? "linear-gradient(90deg, #d4a96a, #b08840)"
                    : "rgba(212,169,106,0.3)",
                }}
                aria-label={`슬라이드 ${i + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* 그리드 뷰 */
        <div className="grid grid-cols-3 gap-1.5">
          {GALLERY_IMAGES.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
              style={{ boxShadow: "0 2px 8px rgba(180,140,80,0.1)" }}
              onClick={() => openLightbox(idx)}
            >
              {/* 플레이스홀더 */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "linear-gradient(160deg, #f9f3ea, #e4d0b8)" }}
              >
                <span className="text-2xl opacity-40">🌸</span>
              </div>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 768px) 33vw, 150px"
              />
              {/* 호버 오버레이 */}
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                style={{ background: "rgba(180,140,80,0.25)" }}
              >
                <span className="text-white text-xl">🔍</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 라이트박스 */}
      {lightboxIndex !== null && (
        <Lightbox
          images={GALLERY_IMAGES}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
        />
      )}
    </section>
  );
}