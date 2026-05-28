"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

interface ConfettiEasterEggProps {
  targetElementId?: string;
  tapCount?: number;
}

export default function ConfettiEasterEgg({
  targetElementId = "section-hero",
  tapCount = 5,
}: ConfettiEasterEggProps) {
  const tapCounterRef = useRef(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) return;

    const handleTap = () => {
      // 이전 타이머 초기화
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }

      tapCounterRef.current += 1;

      // 지정된 횟수에 도달하면 폭죽 실행
      if (tapCounterRef.current >= tapCount) {
        triggerConfetti();
        tapCounterRef.current = 0;
        setHasTriggered(true);

        // 1초 후 상태 초기화
        setTimeout(() => setHasTriggered(false), 1000);
      }

      // 2초 후 카운터 초기화
      tapTimeoutRef.current = setTimeout(() => {
        tapCounterRef.current = 0;
      }, 2000);
    };

    targetElement.addEventListener("click", handleTap);
    targetElement.addEventListener("touchend", handleTap);

    return () => {
      targetElement.removeEventListener("click", handleTap);
      targetElement.removeEventListener("touchend", handleTap);
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    };
  }, [targetElementId, tapCount]);

  const triggerConfetti = () => {
    // 화면 중앙에서 폭죽 발사
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;

    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
    };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // 화면 중앙에서 발사
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  return (
    <>
      {/* 이스터에그 트리거 표시 (선택사항) */}
      {hasTriggered && (
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            animation: "fadeOut 1s ease-out forwards",
          }}
        >
          <div
            className="text-4xl font-bold"
            style={{
              background: "linear-gradient(135deg, #d4a96a, #b08840)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            🎉
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeOut {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
          }
        }
      `}</style>
    </>
  );
}
