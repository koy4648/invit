"use client";

import { useEffect, useState } from "react";

interface KakaoShareProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  webUrl?: string;
  mobileWebUrl?: string;
}

export default function KakaoShare({
  title = "김영서 ♥ 정진성 결혼합니다",
  description = "2027년 8월 28일 토요일 오전 12시\n서울가든호텔 2층 그랜드볼룸에서 두 사람의 새로운 시작을 함께 축복해 주세요.",
  imageUrl = "/og-image.jpg",
  webUrl = typeof window !== "undefined" ? window.location.origin : "",
  mobileWebUrl = typeof window !== "undefined" ? window.location.origin : "",
}: KakaoShareProps) {
  const [isKakaoReady, setIsKakaoReady] = useState(false);

  useEffect(() => {
    // Kakao SDK 로드
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js";
    script.async = true;
    script.onload = () => {
      if (window.Kakao) {
        const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
        if (kakaoKey) {
          window.Kakao.init(kakaoKey);
          setIsKakaoReady(true);
        }
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleShareClick = () => {
    if (!window.Kakao || !isKakaoReady) {
      alert("카카오톡 공유 기능을 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title,
        description,
        imageUrl,
        link: {
          mobileWebUrl,
          webUrl,
        },
      },
      buttons: [
        {
          title: "모바일 청첩장",
          link: {
            mobileWebUrl,
            webUrl,
          },
        },
        {
          title: "위치 보기",
          link: {
            mobileWebUrl: `${mobileWebUrl}#section-info`,
            webUrl: `${webUrl}#section-info`,
          },
        },
      ],
    });
  };

  return (
    <button
      onClick={handleShareClick}
      disabled={!isKakaoReady}
      className="invitation-action w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
      style={{
        background: isKakaoReady
          ? "linear-gradient(135deg, #8fcbd2, #5c91aa)"
          : "linear-gradient(135deg, #8fcbd2, #5c91aa)",
        color: "#fff",
        opacity: isKakaoReady ? 1 : 0.6,
        cursor: isKakaoReady ? "pointer" : "not-allowed",
      }}
    >
      <span>💬</span>
      <span>카카오톡으로 공유</span>
    </button>
  );
}

// Kakao 타입 정의
declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      Share: {
        sendDefault: (params: Record<string, unknown>) => void;
      };
    };
  }
}
