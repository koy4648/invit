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
import RSVPModal from "@/components/RSVPModal";
import ShareInvitation from "@/components/ShareInvitation";
import FamilyContacts from "@/components/FamilyContacts";
import NavigationLinks from "@/components/NavigationLinks";
import CalendarLink from "@/components/CalendarLink";
import ConfettiEasterEgg from "@/components/ConfettiEasterEgg";
import CoupleInterview from "@/components/CoupleInterview";
import EasyReadingToggle from "@/components/EasyReadingToggle";

/* 섹션 스켈레톤 */
function SectionSkeleton({ height = "h-48" }: { height?: string }) {
  return <div className={`${height} mx-4 rounded-3xl shimmer`} />;
}

export default function Home() {
  return (
    <>
      <ToastProvider />

      <main className="invitation-shell summer-sea-theme min-h-screen">
        <div className="ocean-motion" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} className={`rising-bubble rising-bubble-${index + 1}`} />
          ))}
        </div>

        {/* ── 히어로 ─────────────────────────────── */}
        <WeddingHero />

        {/* ── D-Day 카운트다운 배너 ─────────────── */}
        <section className="countdown-section">
          <header className="countdown-heading invitation-section-heading">
            <p className="section-title">Wedding Countdown</p>
            <h2>결혼식까지 남은 시간</h2>
          </header>
          <Suspense fallback={<div className="h-20" />}>
            <CountdownTimer />
          </Suspense>
          <p className="countdown-date">
            2027 · 08 · 28 · SAT · 12 PM
          </p>
        </section>

        {/* ── 본문 컨텐츠 ────────────────────────── */}
        <div className="content-column">
          {/* 예식 안내 */}
          <Suspense fallback={<SectionSkeleton height="h-64" />}>
            <WeddingInfo />
          </Suspense>

          <div className="section-bridge section-bridge-oyster" aria-hidden="true" />

          {/* 신랑신부 소개 및 인터뷰 */}
          <CoupleInterview />

          {/* 갤러리 */}
          <Suspense fallback={<SectionSkeleton height="h-80" />}>
            <Gallery />
          </Suspense>

          <div className="section-bridge section-bridge-coral" aria-hidden="true" />

          {/* 하객 사진 공유 */}
          <PhotoUpload />

          {/* 참석 여부 */}
          <RSVPForm />

          {/* 연락처 및 마음 전하기 */}
          <FamilyContacts />

          <div className="section-bridge section-bridge-shell-garden" aria-hidden="true" />

          {/* 오시는 길 */}
          <section className="invitation-utility-section location-background">
            <NavigationLinks />
          </section>

          {/* 캘린더 등록 */}
          <section className="invitation-utility-section">
            <CalendarLink />
          </section>

          <div className="section-bridge section-bridge-guestbook" aria-hidden="true" />

          {/* 방명록 */}
          <Suspense fallback={<SectionSkeleton height="h-48" />}>
            <Guestbook />
          </Suspense>

          <div className="shore-playground" aria-hidden="true" />

          {/* 푸터 */}
          <footer className="invitation-footer text-center py-12 px-6">
            <span className="invitation-footer-mark" aria-hidden="true">♡</span>
            <p
              className="reading-reflow text-[13px] leading-[2.2] font-light tracking-wider"
              style={{ color: "var(--ink)" }}
            >
              저희의 새로운 시작을<br />{" "}
              함께 축복해 주셔서 감사합니다
            </p>
            <p
              className="mt-4 text-xs tracking-[0.3em]"
              style={{ color: "var(--ink)" }}
            >
              김영서 💝 정진성
            </p>
            <p className="mt-2 text-xs" style={{ color: "var(--ink)", opacity: 0.8 }}>
              2027 · 08 · 28
            </p>
            <ShareInvitation />
          </footer>
        </div>
      </main>

      {/* ── 하단 탭 네비게이션 ─────────────────── */}
      <BottomNav />

      {/* ── 어르신을 위한 큰 글자 보기 ─────────── */}
      <EasyReadingToggle />

      {/* ── 이스터에그 (폭죽) ─────────────────── */}
      <ConfettiEasterEgg />

      {/* ── RSVP 팝업 모달 ─────────────────── */}
      <RSVPModal />
    </>
  );
}
