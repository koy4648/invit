"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";

interface BgmPlayerProps {
  audioUrl?: string;
  autoPlay?: boolean;
}

export default function BgmPlayer({
  audioUrl = "/bgm.mp3", // public 폴더에 bgm.mp3 파일 필요
  autoPlay = false,
}: BgmPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 오디오 로드 완료 시
    const handleCanPlay = () => {
      setIsLoaded(true);
    };

    // 오디오 재생 상태 변경
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
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
          console.error("Audio playback failed:", error);
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
        loop
        preload="metadata"
        crossOrigin="anonymous"
      />

      {/* BGM 토글 버튼 */}
      <button
        onClick={togglePlayPause}
        disabled={!isLoaded}
        className="fixed right-6 top-24 z-40 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
        style={{
          background: isPlaying
            ? "linear-gradient(135deg, #d4a96a, #b08840)"
            : "linear-gradient(135deg, rgba(212,169,106,0.8), rgba(176,136,64,0.6))",
          opacity: isLoaded ? 1 : 0.5,
          cursor: isLoaded ? "pointer" : "not-allowed",
          boxShadow: isPlaying
            ? "0 8px 24px rgba(212,169,106,0.4)"
            : "0 4px 12px rgba(212,169,106,0.2)",
        }}
        title={isPlaying ? "음악 중지" : "음악 재생"}
      >
        {isPlaying ? (
          <Music size={24} style={{ color: "#fff" }} />
        ) : (
          <VolumeX size={24} style={{ color: "#fff" }} />
        )}
      </button>

      {/* 로딩 상태 표시 (선택사항) */}
      {!isLoaded && (
        <div
          className="fixed right-6 top-24 z-30 w-14 h-14 rounded-full animate-pulse"
          style={{
            background: "linear-gradient(135deg, rgba(212,169,106,0.3), rgba(176,136,64,0.2))",
          }}
        />
      )}
    </>
  );
}
