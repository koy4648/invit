"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "invitation-easy-reading";

export default function EasyReadingToggle() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const savedMode = window.localStorage.getItem(STORAGE_KEY) === "true";
    document.documentElement.classList.toggle("easy-reading-mode", savedMode);
    const frame = window.requestAnimationFrame(() => setIsEnabled(savedMode));

    return () => {
      window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove("easy-reading-mode");
    };
  }, []);

  const toggleMode = () => {
    const nextMode = !isEnabled;
    setIsEnabled(nextMode);
    document.documentElement.classList.toggle("easy-reading-mode", nextMode);
    window.localStorage.setItem(STORAGE_KEY, String(nextMode));
  };

  return (
    <button
      type="button"
      className="easy-reading-toggle"
      aria-label={isEnabled ? "기본 글자 크기로 보기" : "글자를 크게 보기"}
      aria-pressed={isEnabled}
      onClick={toggleMode}
    >
      <span aria-hidden="true">{isEnabled ? "가−" : "가+"}</span>
      <span className="sr-only">{isEnabled ? "기본 보기" : "크게 보기"}</span>
    </button>
  );
}
