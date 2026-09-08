"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Volume2 } from "lucide-react";

interface BgmPlayerProps {
  audioUrl?: string;
  autoPlay?: boolean;
}

export default function BgmPlayer({
  audioUrl = "/bgm.mp3",
  autoPlay = false,
}: BgmPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 오디오 재생 상태 변경
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // 모바일 자동재생 방지 정책 대응
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // 오디오 파일이 없거나 재생 실패해도 UI는 정상 작동
          console.log("Audio playback not available:", error);
        });
      }
    }
  };

  return (
    <>
      {/* 숨겨진 오디오 요소 */}
      <audio
        ref={audioRef}
        src={audioUrl}
        autoPlay={autoPlay}
        loop
        preload="metadata"
        crossOrigin="anonymous"
      />

      {/* BGM 토글 버튼 - 항상 표시 */}
      <button
        onClick={togglePlayPause}
        className="music-button fixed top-24 z-40 w-11 h-11 rounded-full transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95"
        style={{
          background: isPlaying ? "var(--accent)" : "rgba(32, 34, 31, 0.86)",
          cursor: "pointer",
          boxShadow: "0 6px 20px rgba(32, 34, 31, 0.16)",
        }}
        title={isPlaying ? "음악 중지" : "음악 재생"}
      >
        {isPlaying ? (
          <Music size={19} style={{ color: "#fff" }} />
        ) : (
          <Volume2 size={19} style={{ color: "#fff" }} />
        )}
      </button>
    </>
  );
}
