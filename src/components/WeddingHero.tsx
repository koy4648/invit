"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useGalleryPhotos } from "@/hooks/useGalleryPhotos";

const OPENING_LINES = ["Wedding of", "Youngseo & Jinseong"];

export default function WeddingHero() {
  const photos = useGalleryPhotos();
  const cover = photos.find((photo) => photo.isCover) ?? photos[0];
  const [isOpening, setIsOpening] = useState(true);
  const displayPhoto = cover?.url ?? "/gallery-mock/04-wedding.jpg";
  const displayAlt = cover?.name ?? "Youngseo & Jinseong 웨딩 사진";

  useEffect(() => {
    const timer = window.setTimeout(() => setIsOpening(false), 3550);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section id="section-hero" className="hero-editorial">
      <div className={`hero-opening ${isOpening ? "is-visible" : "is-hidden"}`} aria-hidden={!isOpening}>
        <div className="hero-opening-copy">
          {OPENING_LINES.map((line, lineIndex) => (
            <p key={line} className="hero-opening-line">
              {Array.from(line).map((character, index) => (
                <span key={`${line}-${index}`} style={{ animationDelay: `${0.5 + lineIndex * 0.45 + index * 0.07}s` }}>
                  {character === " " ? "\u00a0" : character}
                </span>
              ))}
            </p>
          ))}
          <span className="hero-opening-rule" aria-hidden="true" />
        </div>
      </div>

      <div className="hero-masthead">
        <p className="hero-kicker">The Wedding of</p>
        <p className="hero-date">28 · AUGUST · 2027</p>
      </div>

      <div className="hero-image-wrap has-photo">
        <Image
          src={displayPhoto}
          alt={displayAlt}
          fill
          className="object-cover"
          sizes="(max-width: 480px) 100vw, 480px"
          preload
        />
        <div className="hero-image-copy">
          <p className="hero-copy-label">Wedding of</p>
          <p className="hero-copy-title">Youngseo <span>&amp;</span> Jinseong</p>
          <span className="hero-copy-line" aria-hidden="true" />
        </div>
      </div>

      <div className="hero-intro">
        <p className="hero-script">We are getting married</p>
        <h1>
          김영서 <span>&amp;</span> 정진성
        </h1>
        <p className="hero-venue">2027년 8월 28일 토요일 낮 12시<br />서울가든호텔 그랜드볼룸웨딩홀 2층</p>
        <div className="hero-rule" />
        <p className="hero-message">
          서로의 하루를 아끼며 걸어온 두 사람이<br />
          이제 같은 방향을 바라보려 합니다.<br />
          귀한 걸음으로 함께해 주시면 감사하겠습니다.
        </p>
      </div>
    </section>
  );
}
