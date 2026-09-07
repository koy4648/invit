"use client";

import Image from "next/image";
import HandwrittenTitle from "./HandwrittenTitle";
import { useGalleryPhotos } from "@/hooks/useGalleryPhotos";

export default function WeddingHero() {
  const photos = useGalleryPhotos();
  const cover = photos.find((photo) => photo.isCover) ?? photos[0];

  return (
    <section id="section-hero" className="hero-editorial">
      <div className="hero-masthead">
        <p className="hero-kicker">The Wedding of</p>
        <p className="hero-date">28 · AUGUST · 2027</p>
      </div>

      <div className="hero-image-wrap" style={{ position: "relative" }}>
        <Image
          src={cover?.url ?? "/editorial-peony-hydrangea.png"}
          alt={cover?.name ?? "분홍 작약과 흐릿한 파란 수국으로 장식한 웨딩 이미지"}
          fill
          className="object-cover"
          sizes="(max-width: 480px) 100vw, 480px"
          preload
        />
        <div className="hero-image-copy">
          <HandwrittenTitle />
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
