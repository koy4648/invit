"use client";

import { useEffect, useState } from "react";

interface Tab {
  id: string;
  label: string;
  icon: string;
  sectionId: string;
}

const TABS: Tab[] = [
  { id: "home",    label: "홈",      icon: "🏠", sectionId: "section-hero" },
  { id: "gallery", label: "갤러리",  icon: "🖼",  sectionId: "section-gallery" },
  { id: "map",     label: "안내",    icon: "📍", sectionId: "section-info" },
  { id: "photos",  label: "사진",    icon: "📸", sectionId: "section-photos" },
  { id: "guest",   label: "방명록",  icon: "💌", sectionId: "section-guestbook" },
];

export default function BottomNav() {
  const [active, setActive] = useState("home");

  /* IntersectionObserver로 현재 보이는 섹션 감지 */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    TABS.forEach(({ id, sectionId }) => {
      const el = document.getElementById(sectionId);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (sectionId: string, id: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    setActive(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto"
      aria-label="하단 탭 네비게이션"
    >
      {/* 블러 배경 */}
      <div
        className="tab-bar-safe"
        style={{
          background: "rgba(253, 250, 246, 0.88)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderTop: "1px solid rgba(212, 169, 106, 0.2)",
          boxShadow: "0 -4px 24px rgba(180, 140, 80, 0.08)",
        }}
      >
        <div className="flex items-stretch">
          {TABS.map(({ id, label, icon, sectionId }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(sectionId, id)}
                className="flex-1 flex flex-col items-center justify-center pt-2.5 pb-1 gap-0.5 transition-all duration-200 relative"
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
              >
                {/* 활성 인디케이터 */}
                {isActive && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #d4a96a, #b08840)",
                    }}
                  />
                )}

                {/* 아이콘 */}
                <span
                  className="text-xl leading-none transition-transform duration-200"
                  style={{
                    transform: isActive ? "scale(1.15)" : "scale(1)",
                    filter: isActive ? "none" : "grayscale(0.3) opacity(0.55)",
                  }}
                >
                  {icon}
                </span>

                {/* 라벨 */}
                <span
                  className="text-[10px] font-medium tracking-wider transition-colors duration-200"
                  style={{
                    color: isActive ? "#b08840" : "#a8a29e",
                  }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}