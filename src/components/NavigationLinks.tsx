"use client";

import { MapPin } from "lucide-react";

interface NavigationLinksProps {
  venueName?: string;
  venueAddress?: string;
  latitude?: number;
  longitude?: number;
}

export default function NavigationLinks({
  venueName = "보테가마지오 로스타뇨홀",
  venueAddress = "서울시 강남구 테헤란로 123",
  latitude = 37.4979,
  longitude = 127.0276,
}: NavigationLinksProps) {
  // 카카오내비 링크
  const openKakaoNavi = () => {
    const kakaoNaviUrl = `kakaomap://look?q=${encodeURIComponent(venueName)}`;
    window.location.href = kakaoNaviUrl;
  };

  // 티맵 링크
  const openTMap = () => {
    const tmapUrl = `tmap://search?query=${encodeURIComponent(venueName)}`;
    window.location.href = tmapUrl;
  };

  // 네이버지도 링크
  const openNaverMap = () => {
    const naverMapUrl = `naver://map/search/${encodeURIComponent(venueName)}`;
    window.location.href = naverMapUrl;
  };

  return (
    <div className="px-6 py-4 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={20} style={{ color: "#d4a96a" }} />
        <h3
          className="text-lg font-light tracking-wider"
          style={{ color: "#44403c" }}
        >
          오시는 길
        </h3>
      </div>

      <p className="text-sm mb-4" style={{ color: "#78716c" }}>
        {venueName}
        <br />
        {venueAddress}
      </p>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={openKakaoNavi}
          className="px-3 py-3 rounded-lg font-medium transition-all duration-200 text-white text-xs"
          style={{
            background: "linear-gradient(135deg, #FFE812, #FFED4E)",
            color: "#000",
          }}
        >
          카카오내비
        </button>
        <button
          onClick={openTMap}
          className="px-3 py-3 rounded-lg font-medium transition-all duration-200 text-white text-xs"
          style={{
            background: "linear-gradient(135deg, #FF6B6B, #FF8E72)",
          }}
        >
          티맵
        </button>
        <button
          onClick={openNaverMap}
          className="px-3 py-3 rounded-lg font-medium transition-all duration-200 text-white text-xs"
          style={{
            background: "linear-gradient(135deg, #00C73C, #1EC800)",
          }}
        >
          네이버지도
        </button>
      </div>
    </div>
  );
}
