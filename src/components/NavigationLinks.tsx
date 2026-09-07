"use client";

import { MapPin } from "lucide-react";

interface NavigationLinksProps {
  venueName?: string;
  venueAddress?: string;
}

export default function NavigationLinks({
  venueName = "서울가든호텔",
  venueAddress = "서울특별시 마포구 마포대로 58",
}: NavigationLinksProps) {
  const destination = `${venueName} ${venueAddress}`;

  // 카카오내비 링크
  const openKakaoNavi = () => {
    const kakaoNaviUrl = `https://map.kakao.com/?q=${encodeURIComponent(destination)}`;
    window.location.href = kakaoNaviUrl;
  };

  // 네이버지도 링크
  const openNaverMap = () => {
    const naverMapUrl = `https://map.naver.com/p/search/${encodeURIComponent(destination)}`;
    window.location.href = naverMapUrl;
  };

  return (
    <div className="px-6 py-4 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={20} style={{ color: "var(--blush)" }} />
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

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={openKakaoNavi}
          className="invitation-action px-3 py-3 rounded-xl font-medium transition-all duration-200 text-white text-xs"
          style={{
            background: "linear-gradient(135deg, var(--lilac), var(--sky))",
            color: "#fff",
          }}
        >
          카카오내비
        </button>
        <button
          onClick={openNaverMap}
          className="invitation-action px-3 py-3 rounded-xl font-medium transition-all duration-200 text-white text-xs"
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
