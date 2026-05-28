import Image from "next/image";
import KakaoShare from "./KakaoShare";

export default function WeddingHero() {
  return (
    <section
      id="section-hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fdfaf6 0%, #f9f3ea 50%, #f0e6d3 100%)" }}
    >
      {/* 배경 장식 원 */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212,169,106,0.12) 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212,169,106,0.08) 0%, transparent 70%)",
          transform: "translate(-30%, 30%)",
        }}
      />

      {/* 상단 날짜 뱃지 */}
      <div className="relative z-10 flex flex-col items-center px-8 pt-16 pb-12 w-full max-w-sm">
        <div
          className="inline-flex items-center gap-2 rounded-full px-5 py-1.5 mb-10"
          style={{
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(212,169,106,0.35)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: "linear-gradient(135deg, #d4a96a, #b08840)" }}
          />
          <span
            className="text-[11px] tracking-[0.25em] font-medium"
            style={{ color: "#b08840" }}
          >
            2025 · 10 · 18 SAT
          </span>
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: "linear-gradient(135deg, #d4a96a, #b08840)" }}
          />
        </div>

        {/* 커버 이미지 프레임 */}
        <div className="relative mb-10">
          {/* 외부 골드 링 */}
          <div
            className="absolute -inset-3 rounded-[32px]"
            style={{
              background: "linear-gradient(135deg, rgba(212,169,106,0.4), rgba(176,136,64,0.15), rgba(212,169,106,0.4))",
              padding: "1px",
            }}
          >
            <div
              className="w-full h-full rounded-[31px]"
              style={{ background: "linear-gradient(160deg, #fdfaf6, #f0e6d3)" }}
            />
          </div>

          {/* 사진 컨테이너 */}
          <div
            className="relative w-52 h-64 rounded-3xl overflow-hidden"
            style={{
              boxShadow: "0 20px 60px rgba(180,140,80,0.2), 0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            {/* 플레이스홀더 그라디언트 (실제 이미지 없을 때) */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{
                background: "linear-gradient(160deg, #f9f3ea 0%, #e4d0b8 100%)",
              }}
            >
              <span className="text-5xl mb-2">💑</span>
              <span className="text-xs tracking-widest" style={{ color: "#c49a55" }}>
                PHOTO
              </span>
            </div>

            {/* 실제 이미지 (있을 경우 위에 렌더링) */}
            <Image
              src="/gallery/cover.jpg"
              alt="신랑신부 커버 사진"
              fill
              className="object-cover"
              sizes="208px"
              priority
            />

            {/* 하단 그라디언트 오버레이 */}
            <div
              className="absolute bottom-0 left-0 right-0 h-16"
              style={{
                background: "linear-gradient(to top, rgba(180,140,80,0.15), transparent)",
              }}
            />
          </div>
        </div>

        {/* 이름 */}
        <div className="text-center mb-8 space-y-2">
          <p
            className="text-[10px] tracking-[0.45em] uppercase mb-3"
            style={{ color: "#c49a55" }}
          >
            We Are Getting Married
          </p>

          <h1
            className="text-[28px] font-light tracking-[0.15em]"
            style={{
              color: "#44403c",
              fontFamily: "var(--font-noto-serif-kr), serif",
            }}
          >
            김민준
            <span
              className="inline-block mx-3 text-2xl"
              style={{
                background: "linear-gradient(135deg, #d4a96a, #b08840)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ♥
            </span>
            이서연
          </h1>

          <p
            className="text-[13px] tracking-[0.2em] font-light"
            style={{
              color: "#a8a29e",
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
            }}
          >
            Minjun Kim &amp; Seoyeon Lee
          </p>
        </div>

        {/* 초대 문구 카드 */}
        <div
          className="w-full rounded-2xl px-6 py-6 text-center"
          style={{
            background: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(212,169,106,0.2)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* 장식 라인 */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex-1 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(212,169,106,0.5))" }}
            />
            <span className="text-xs" style={{ color: "#d4a96a" }}>✦</span>
            <div
              className="flex-1 h-px"
              style={{ background: "linear-gradient(90deg, rgba(212,169,106,0.5), transparent)" }}
            />
          </div>

          <p
            className="text-[13.5px] leading-[2] font-light"
            style={{ color: "#78716c" }}
          >
            서로가 서로의 곁에 있어<br />
            더 빛나는 두 사람이<br />
            이제 하나가 되려 합니다.<br />
            <br />
            소중한 걸음으로 함께해 주시어<br />
            저희의 새 출발을<br />
            축복해 주시면 감사하겠습니다.
          </p>

          <div className="flex items-center gap-3 mt-4">
            <div
              className="flex-1 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(212,169,106,0.5))" }}
            />
            <span className="text-xs" style={{ color: "#d4a96a" }}>✦</span>
            <div
              className="flex-1 h-px"
              style={{ background: "linear-gradient(90deg, rgba(212,169,106,0.5), transparent)" }}
            />
          </div>
        </div>

        {/* 카카오톡 공유 버튼 */}
        <div className="w-full px-6 mt-8">
          <KakaoShare />
        </div>

        {/* 스크롤 유도 */}
        <div className="mt-8 flex flex-col items-center gap-1.5">
          <p className="text-[10px] tracking-[0.3em]" style={{ color: "#c49a55" }}>
            SCROLL
          </p>
          <div className="flex flex-col items-center gap-1 animate-bounce">
            <div className="w-px h-5" style={{ background: "linear-gradient(to bottom, #d4a96a, transparent)" }} />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#d4a96a" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
