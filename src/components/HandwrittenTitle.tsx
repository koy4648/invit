"use client";

import { useEffect, useState } from "react";

const MESSAGE = "우리, 결혼합니다";

export default function HandwrittenTitle() {
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let current = 0;
    let writingTimer: number | undefined;
    const startTimer = window.setTimeout(() => {
      if (reducedMotion) {
        setVisibleLength(MESSAGE.length);
        return;
      }
      writingTimer = window.setInterval(() => {
        current += 1;
        setVisibleLength(current);
        if (current >= MESSAGE.length) window.clearInterval(writingTimer);
      }, 150);
    }, reducedMotion ? 0 : 700);

    return () => {
      window.clearTimeout(startTimer);
      if (writingTimer) window.clearInterval(writingTimer);
    };
  }, []);

  const isComplete = visibleLength >= MESSAGE.length;

  return (
    <p className="handwritten-title" aria-label={MESSAGE}>
      <span aria-hidden="true">{MESSAGE.slice(0, visibleLength)}</span>
      <span className={isComplete ? "writing-caret is-complete" : "writing-caret"} aria-hidden="true" />
    </p>
  );
}
