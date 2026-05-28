"use client";

import { useEffect, useRef, useState } from "react";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: "2020",
    title: "첫 만남",
    description: "우연한 만남이 시작되었습니다.",
    icon: "👀",
  },
  {
    year: "2021",
    title: "사귀기 시작",
    description: "특별한 날, 우리의 시작입니다.",
    icon: "💕",
  },
  {
    year: "2023",
    title: "여행",
    description: "함께한 소중한 시간들을 기억합니다.",
    icon: "✈️",
  },
  {
    year: "2024",
    title: "프로포즈",
    description: "평생을 함께하고 싶다고 말했습니다.",
    icon: "💍",
  },
  {
    year: "2025",
    title: "결혼식",
    description: "새로운 시작, 함께 나아갑니다.",
    icon: "💒",
  },
];

export default function LoveStory() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = itemRefs.current.indexOf(
            entry.target as HTMLDivElement
          );
          if (index !== -1) {
            setVisibleItems((prev) => new Set(prev).add(index));
          }
        }
      });
    }, observerOptions);

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="section-love-story" className="px-6 py-8">
      <div className="mb-8">
        <h2
          className="text-2xl font-light tracking-wider mb-2"
          style={{ color: "#44403c" }}
        >
          우리들의 이야기
        </h2>
        <p className="text-sm" style={{ color: "#a8a29e" }}>
          만남부터 결혼까지의 특별한 순간들
        </p>
      </div>

      {/* 타임라인 */}
      <div className="relative">
        {/* 중앙 세로 라인 */}
        <div
          className="absolute left-8 top-0 bottom-0 w-0.5"
          style={{
            background: "linear-gradient(180deg, #d4a96a, #b08840, #d4a96a)",
          }}
        />

        {/* 타임라인 아이템들 */}
        <div className="space-y-8">
          {TIMELINE_EVENTS.map((event, index) => {
            const isVisible = visibleItems.has(index);
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className={`flex ${isEven ? "flex-row" : "flex-row-reverse"} items-center gap-6 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                {/* 콘텐츠 */}
                <div className="flex-1">
                  <div
                    className="p-4 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.6)",
                      border: "1px solid rgba(212,169,106,0.2)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <p
                      className="text-xs tracking-widest font-medium mb-1"
                      style={{ color: "#d4a96a" }}
                    >
                      {event.year}
                    </p>
                    <h3
                      className="text-lg font-medium mb-2"
                      style={{ color: "#b08840" }}
                    >
                      {event.title}
                    </h3>
                    <p className="text-sm" style={{ color: "#78716c" }}>
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* 중앙 원형 마커 */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-500"
                    style={{
                      background: isVisible
                        ? "linear-gradient(135deg, #d4a96a, #b08840)"
                        : "rgba(212,169,106,0.3)",
                      transform: isVisible ? "scale(1)" : "scale(0.8)",
                    }}
                  >
                    {event.icon}
                  </div>
                </div>

                {/* 공간 유지 (레이아웃용) */}
                <div className="flex-1" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
