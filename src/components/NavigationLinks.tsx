"use client";

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
    <div className="invitation-utility-block">
      <div className="invitation-section-heading mb-6">
        <p className="section-title">Location</p>
        <h2>오시는 길</h2>
      </div>

      <div className="invitation-utility-card px-6 py-4 space-y-3">
        <p className="text-sm mb-5 text-center leading-relaxed" style={{ color: "var(--muted)" }}>
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
    </div>
  );
}
