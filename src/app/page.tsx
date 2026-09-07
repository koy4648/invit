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
import FamilyContacts from "@/components/FamilyContacts";
import NavigationLinks from "@/components/NavigationLinks";
import CalendarLink from "@/components/CalendarLink";
import ConfettiEasterEgg from "@/components/ConfettiEasterEgg";
import CoupleInterview from "@/components/CoupleInterview";

/* 파스텔 구분선 */
function GoldDivider() {
  return (
    <div className="divider-gold px-8 py-2" aria-hidden="true">
      <span className="text-xs">♡</span>
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

      <main className="invitation-shell min-h-screen">
        {/* ── 히어로 ─────────────────────────────── */}
        <WeddingHero />

        {/* ── D-Day 카운트다운 배너 ─────────────── */}
        <section className="countdown-section">
          <p className="countdown-label">
            Wedding Countdown
          </p>
          <Suspense fallback={<div className="h-20" />}>
            <CountdownTimer />
          </Suspense>
          <p className="countdown-date">
            2027 · 08 · 28 · SAT · 12:00 PM
          </p>
        </section>

        {/* ── 본문 컨텐츠 ────────────────────────── */}
        <div className="content-column pb-28">
          {/* 예식 안내 */}
          <Suspense fallback={<SectionSkeleton height="h-64" />}>
            <WeddingInfo />
          </Suspense>

          <GoldDivider />

          {/* 신랑신부 소개 및 인터뷰 */}
          <CoupleInterview />

          <GoldDivider />

          {/* 갤러리 */}
          <Suspense fallback={<SectionSkeleton height="h-80" />}>
            <Gallery />
          </Suspense>

          <GoldDivider />

          {/* 하객 사진 공유 */}
          <PhotoUpload />

          <GoldDivider />

          {/* 참석 여부 */}
          <RSVPForm />

          <GoldDivider />

          {/* 연락처 및 마음 전하기 */}
          <FamilyContacts />

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
              <span className="text-xs" style={{ color: "var(--blush)" }}>♡</span>
            </div>
            <p
              className="text-[13px] leading-[2.2] font-light tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              저희의 새로운 시작을<br />
              함께 축복해 주셔서 감사합니다
            </p>
            <p
              className="mt-4 text-xs tracking-[0.3em]"
              style={{ color: "var(--ink)" }}
            >
              Youngseo Kim 🤍 Jinseong Jeong
            </p>
            <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
              2027 · 08 · 28
            </p>
          </footer>
        </div>
      </main>

      {/* ── 하단 탭 네비게이션 ─────────────────── */}
      <BottomNav />

      {/* ── 이스터에그 (폭죽) ─────────────────── */}
      <ConfettiEasterEgg />

      {/* ── RSVP 팝업 모달 ─────────────────── */}
      <RSVPModal />
    </>
  );
}
