import { Suspense } from "react";
import CountdownTimer from "@/components/CountdownTimer";
import Gallery from "@/components/Gallery";
import Guestbook from "@/components/Guestbook";
import PhotoUpload from "@/components/PhotoUpload";
import WeddingHero from "@/components/WeddingHero";
import WeddingInfo from "@/components/WeddingInfo";
import BottomNav from "@/components/BottomNav";
import ToastProvider from "@/components/ToastProvider";
import RSVPForm from "@/components/RSVPForm";
import AccountInfo from "@/components/AccountInfo";
import NavigationLinks from "@/components/NavigationLinks";
import CalendarLink from "@/components/CalendarLink";
import BgmPlayer from "@/components/BgmPlayer";
import LoveStory from "@/components/LoveStory";
import ConfettiEasterEgg from "@/components/ConfettiEasterEgg";

/* 골드 구분선 */
function GoldDivider() {
  return (
    <div className="divider-gold px-8 py-2">
      <span className="text-xs" style={{ color: "#d4a96a" }}>✦</span>
    </div>
  );
}

/* 섹션 스켈레톤 */
function SectionSkeleton({ height = "h-48" }: { height?: string }) {
  return <div className={`${height} mx-4 rounded-3xl shimmer`} />;
}

export default function Home() {
  return (
    <>
      <ToastProvider />

      <main
        className="min-h-screen"
        style={{ background: "linear-gradient(180deg, #fdfaf6 0%, #f9f3ea 100%)" }}
      >
        {/* ── 히어로 ─────────────────────────────── */}
        <WeddingHero />

        {/* ── D-Day 카운트다운 배너 ─────────────── */}
        <section
          className="px-4 py-8"
          style={{
            background: "linear-gradient(135deg, #c49a55 0%, #b08840 50%, #9a7535 100%)",
          }}
        >
          <p
            className="text-center text-[10px] tracking-[0.4em] uppercase mb-4"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Wedding Countdown
          </p>
          <Suspense fallback={<div className="h-20" />}>
            <CountdownTimer />
          </Suspense>
          <p
            className="text-center text-[11px] tracking-widest mt-4 font-light"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            2025 · 10 · 18 · SAT · 11:00 AM
          </p>
        </section>

        {/* ── 본문 컨텐츠 ────────────────────────── */}
        <div className="max-w-md mx-auto pb-28">
          {/* 예식 안내 */}
          <Suspense fallback={<SectionSkeleton height="h-64" />}>
            <WeddingInfo />
          </Suspense>

          <GoldDivider />

          {/* 갤러리 */}
          <Suspense fallback={<SectionSkeleton height="h-80" />}>
            <Gallery />
          </Suspense>

          <GoldDivider />

          {/* 하객 사진 공유 */}
          <PhotoUpload />

          <GoldDivider />

          {/* 우리들의 이야기 */}
          <Suspense fallback={<SectionSkeleton height="h-80" />}>
            <LoveStory />
          </Suspense>

          <GoldDivider />

          {/* 참석 여부 */}
          <RSVPForm />

          <GoldDivider />

          {/* 마음 전하기 */}
          {/* showAccounts={false}로 설정하면 이 섹션을 남기지 않습니다 */}
          <AccountInfo showAccounts={true} />

          <GoldDivider />

          {/* 오시는 길 */}
          <NavigationLinks />

          <GoldDivider />

          {/* 캘린더 등록 */}
          <CalendarLink />

          <GoldDivider />

          {/* 방명록 */}
          <Suspense fallback={<SectionSkeleton height="h-48" />}>
            <Guestbook />
          </Suspense>

          {/* 푸터 */}
          <footer className="text-center py-12 px-6">
            <div className="divider-gold mb-6">
              <span className="text-xs" style={{ color: "#d4a96a" }}>✦</span>
            </div>
            <p
              className="text-[13px] leading-[2.2] font-light tracking-wider"
              style={{ color: "#a8a29e" }}
            >
              두 사람의 새로운 시작을<br />
              함께 축복해 주셔서 감사합니다
            </p>
            <p
              className="mt-4 text-xs tracking-[0.3em]"
              style={{
                background: "linear-gradient(135deg, #d4a96a, #b08840)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Kim Minjun &amp; Lee Seoyeon
            </p>
            <p className="mt-2 text-xs" style={{ color: "#c4b8a8" }}>
              2025 · 10 · 18
            </p>
          </footer>
        </div>
      </main>

      {/* ── 하단 탭 네비게이션 ─────────────────── */}
      <BottomNav />

      {/* ── BGM 플레이어 ─────────────────── */}
      <BgmPlayer />

      {/* ── 이스터에그 (폭죽) ─────────────────── */}
      <ConfettiEasterEgg />
    </>
  );
}