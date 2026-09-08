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

const INITIAL_TIME_LEFT: TimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isPast: false,
};

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(INITIAL_TIME_LEFT);

  useEffect(() => {
    const update = () => setTimeLeft(calculateTimeLeft());
    const initialId = window.setTimeout(update, 0);
    const intervalId = window.setInterval(update, 1_000);

    return () => {
      window.clearTimeout(initialId);
      window.clearInterval(intervalId);
    };
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
    <div className="countdown-grid">
      {units.map(({ value, label }, i) => (
        <div key={label} className="countdown-unit">
          {/* 숫자 카드 */}
          <div
            className="countdown-card"
          >
            {/* 상단 하이라이트 */}
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
            style={{ color: "var(--ink)", opacity: 0.85 }}
          >
            {label}
          </span>

          {i < units.length - 1 && null}
        </div>
      ))}
    </div>
  );
}
