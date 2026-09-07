"use client";

import { useEffect, useState } from "react";

const WEDDING_DATE = new Date("2027-08-28T12:00:00+09:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateTimeLeft(): TimeLeft {
  const diff = WEDDING_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };

  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
    isPast:  false,
  };
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calculateTimeLeft()), 1_000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { value: timeLeft.days,    label: "DAYS" },
    { value: timeLeft.hours,   label: "HRS" },
    { value: timeLeft.minutes, label: "MIN" },
    { value: timeLeft.seconds, label: "SEC" },
  ];

  if (timeLeft.isPast) {
    return (
      <div className="text-center py-4">
        <p className="text-sm tracking-widest font-light" style={{ color: "var(--ink)" }}>
          결혼식이 거행되었습니다
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
          축하해 주셔서 감사합니다
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-2.5 py-2">
      {units.map(({ value, label }, i) => (
        <div key={label} className="flex flex-col items-center gap-1.5">
          {/* 숫자 카드 */}
          <div
            className="w-[68px] h-[68px] flex items-center justify-center relative overflow-hidden"
            style={{
              background: "#fff",
              border: "1px solid var(--line)",
            }}
          >
            {/* 상단 하이라이트 */}
            <div
              className="absolute top-0 left-0 right-0 h-1/2"
              style={{ background: "#fafaf8" }}
            />
            <span
              className="relative z-10 text-[26px] font-light tabular-nums"
              style={{
                color: "var(--ink)",
                fontFamily: "var(--font-cormorant), serif",
              }}
            >
              {String(value).padStart(2, "0")}
            </span>
          </div>

          {/* 레이블 */}
          <span
            className="text-[9px] tracking-[0.25em] font-medium"
            style={{ color: "var(--muted)" }}
          >
            {label}
          </span>

          {/* 구분 점 (마지막 제외) */}
          {i < units.length - 1 && (
            <div
              className="absolute"
              style={{ display: "none" }} // flex gap으로 대체
            />
          )}
        </div>
      ))}
    </div>
  );
}
