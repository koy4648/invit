"use client";

import { useEffect, useState } from "react";

// 예식 일시 설정 (환경 변수 또는 하드코딩)
const WEDDING_DATE = new Date("2025-10-18T11:00:00+09:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateTimeLeft(): TimeLeft {
  const now = new Date();
  const diff = WEDDING_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPast: false };
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center gap-3 py-4">
        {["일", "시간", "분", "초"].map((unit) => (
          <div key={unit} className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl animate-pulse" />
            <span className="text-xs text-white/70 mt-1">{unit}</span>
          </div>
        ))}
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className="text-center py-4">
        <p className="text-white/90 text-lg font-light tracking-widest">
          결혼식이 거행되었습니다
        </p>
        <p className="text-white/60 text-sm mt-1">
          축하해 주셔서 감사합니다 💕
        </p>
      </div>
    );
  }

  const units = [
    { value: timeLeft.days, label: "일" },
    { value: timeLeft.hours, label: "시간" },
    { value: timeLeft.minutes, label: "분" },
    { value: timeLeft.seconds, label: "초" },
  ];

  return (
    <div className="flex justify-center gap-3 py-4">
      {units.map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white tabular-nums">
              {String(value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs text-white/70 mt-1.5 tracking-wider">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
