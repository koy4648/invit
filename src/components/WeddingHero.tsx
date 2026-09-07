"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useGalleryPhotos } from "@/hooks/useGalleryPhotos";

const OPENING_LINES = ["welcome to our", "wedding", "by. youngseo ♡ jinseong"];

export default function WeddingHero() {
  const photos = useGalleryPhotos();
  const cover = photos.find((photo) => photo.isCover) ?? photos[0];
  const [isOpening, setIsOpening] = useState(true);
  const displayPhoto = cover?.url ?? "/gallery-mock/04-wedding.jpg";
  const displayAlt = cover?.name ?? "Youngseo & Jinseong 웨딩 사진";

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    const resetScroll = () => window.scrollTo({ top: 0, behavior: "auto" });
    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    const timer = window.setTimeout(() => {
      resetScroll();
      setIsOpening(false);
    }, 3550);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
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
        <p className="hero-kicker">Wedding Day</p>
        <p className="hero-date">28 · AUGUST · 2027. 12:00 PM</p>
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
          <p className="hero-copy-label">Wedding Day of</p>
          <p className="hero-copy-title">Youngseo <span> ♥ </span> Jinseong</p>
          <p className="hero-copy-date">2027.08.28. SAT 12PM</p>
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
          좋아하는 것도, 살아가는 방식도 달랐던 두 사람이<br/> 더 많이 웃고, 더 좋은 사람이 되기 위해 <br/>남은 평생을 함께하기로 약속했습니다.<br/>  소중한 날, 저희의 시작을 함께해주세요.
        </p>
        <div className="hero-worship-note">
          <p className="hero-worship-label">예식 안내</p>
          <p>
            저희의 결혼식은 기독교 예배 형식으로 진행됩니다.<br />
            종교와 관계없이 편안한 마음으로 자리하시어<br />
            두 사람의 새로운 시작을 축복해 주시면 감사하겠습니다.<br />
          </p>
        </div>
      </div>
    </section>
  );
}
