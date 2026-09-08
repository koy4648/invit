"use client";

import toast from "react-hot-toast";

const VENUE_QUERY = "서울가든호텔 서울특별시 마포구 마포대로 58";
const KAKAO_MAP_URL = `https://map.kakao.com/?q=${encodeURIComponent(VENUE_QUERY)}`;
const NAVER_MAP_URL = `https://map.naver.com/p/search/${encodeURIComponent(VENUE_QUERY)}`;

export default function WeddingInfo() {
  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText("서울특별시 마포구 마포대로 58 그랜드볼룸웨딩홀 2층");
      toast.success("주소가 복사되었습니다.");
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  return (
    <section id="section-info" className="py-10 px-4 space-y-4">
      {/* 섹션 헤더 */}
      <div className="invitation-section-heading mb-6">
        <p className="section-title mb-1">Location & Info</p>
        <h2 className="text-xl font-light tracking-wider" style={{ color: "var(--ink)" }}>
          예식 안내
        </h2>
      </div>

      {/* 예식 정보 카드 */}
      <div className="card p-5">
        {/* 날짜 */}
        <div className="flex items-start gap-4 pb-4" style={{ borderBottom: "1px solid rgba(167,217,234,0.28)" }}>
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, rgba(231,169,187,0.18), rgba(172,212,233,0.14))" }}
          >
            <span className="text-lg">📅</span>
          </div>
          <div>
            <p className="text-[11px] tracking-wider mb-1" style={{ color: "var(--muted)" }}>DATE & TIME</p>
            <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
              2027년 8월 28일 토요일
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>낮 12시 00분</p>
          </div>
        </div>

        {/* 장소 */}
        <div className="flex items-start gap-4 pt-4">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, rgba(231,169,187,0.18), rgba(172,212,233,0.14))" }}
          >
            <span className="text-lg">📍</span>
          </div>
          <div className="flex-1">
            <p className="text-[11px] tracking-wider mb-1" style={{ color: "var(--muted)" }}>VENUE</p>
            <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>서울가든호텔 그랜드볼룸웨딩홀</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>서울특별시 마포구 마포대로 58</p>
            <button
              onClick={handleCopyAddress}
              className="text-[11px] mt-1.5 tracking-wider transition-colors"
              style={{ color: "var(--button)" }}
            >
              주소 복사 →
            </button>
          </div>
        </div>

        {/* 지도 버튼 */}
        <div className="flex gap-2.5 mt-5">
          <a
            href={KAKAO_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="invitation-action flex-1 py-3 rounded-2xl text-xs font-medium text-center tracking-wider transition-all active:scale-95"
            style={{
              background: "var(--blush-soft)",
              color: "var(--accent)",
              boxShadow: "0 2px 8px rgba(231,169,187,0.2)",
            }}
          >
            카카오맵
          </a>
          <a
            href={NAVER_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="invitation-action flex-1 py-3 rounded-2xl text-xs font-medium text-center tracking-wider transition-all active:scale-95"
            style={{
              background: "var(--blue-soft)",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(172,212,233,0.24)",
            }}
          >
            네이버지도
          </a>
        </div>
      </div>

      {/* 오시는 길 */}
      <div className="card p-5">
        <p className="text-[11px] tracking-[0.25em] uppercase mb-4" style={{ color: "var(--button)" }}>
          Direction
        </p>
        <div className="space-y-3">
          {[
            {
              icon: "🚇",
              label: "지하철",
              desc: (
                <>
                  마포역(5호선) 3번 출구에서 도보 약 2분,
                  <br />
                  공덕역(5호선·6호선·공항철도·경의중앙선)에서는 도보 약 5분 거리
                </>
              )
            },
            { icon: "🚌", label: "버스",   desc: "마포역(중) 정류장에서 하차" },
            { icon: "🚗", label: "주차",   desc: "호텔 건물 주차장 이용 가능 (3시간 무료)" },
                    ].map(({ icon, label, desc }) => (
            <div key={label} className="flex gap-3 items-start">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
                style={{ background: "rgba(172,212,233,0.16)" }}
              >
                {icon}
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-wider mb-0.5" style={{ color: "var(--button)" }}>
                  {label}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
