import { Suspense } from "react";
import CountdownTimer from "@/components/CountdownTimer";
import Gallery from "@/components/Gallery";
import Guestbook from "@/components/Guestbook";
import PhotoUpload from "@/components/PhotoUpload";
import WeddingHero from "@/components/WeddingHero";
import WeddingInfo from "@/components/WeddingInfo";
import ToastProvider from "@/components/ToastProvider";

export default function Home() {
  return (
    <>
      <ToastProvider />
      <main className="min-h-screen bg-stone-50">
        {/* 히어로 섹션 */}
        <WeddingHero />

        {/* D-Day 카운트다운 */}
        <section className="bg-gradient-to-b from-rose-400 to-rose-300 px-4 py-6">
          <p className="text-center text-white/80 text-xs tracking-[0.3em] uppercase mb-2">
            Wedding Countdown
          </p>
          <Suspense fallback={<div className="h-24" />}>
            <CountdownTimer />
          </Suspense>
        </section>

        {/* 본문 컨텐츠 */}
        <div className="max-w-md mx-auto">
          {/* 예식 정보 */}
          <WeddingInfo />

          {/* 구분선 */}
          <div className="flex items-center gap-3 px-4">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-stone-300 text-xs">❤</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* 신랑신부 갤러리 */}
          <Suspense
            fallback={
              <div className="h-64 bg-stone-100 rounded-2xl mx-4 animate-pulse" />
            }
          >
            <Gallery />
          </Suspense>

          {/* 구분선 */}
          <div className="flex items-center gap-3 px-4">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-stone-300 text-xs">❤</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* 하객 사진 업로드 */}
          <PhotoUpload />

          {/* 구분선 */}
          <div className="flex items-center gap-3 px-4">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-stone-300 text-xs">❤</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* 방명록 */}
          <Suspense
            fallback={
              <div className="h-48 bg-stone-100 rounded-2xl mx-4 animate-pulse" />
            }
          >
            <Guestbook />
          </Suspense>

          {/* 푸터 */}
          <footer className="text-center py-10 px-4">
            <p className="text-stone-400 text-xs leading-relaxed">
              두 사람의 새로운 시작을 <br />
              함께 축복해 주셔서 감사합니다
            </p>
            <p className="text-rose-300 text-lg mt-3">💕</p>
          </footer>
        </div>
      </main>
    </>
  );
}
