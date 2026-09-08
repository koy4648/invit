"use client";

import { Share2 } from "lucide-react";
import toast from "react-hot-toast";
import KakaoShare from "./KakaoShare";

const SHARE_TITLE = "김영서 ♥ 정진성 결혼합니다";
const SHARE_TEXT = "2027년 8월 28일, 저희의 새로운 시작을 함께해주세요.";

export default function ShareInvitation() {
  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      toast.success("초대장 링크를 복사했어요.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;

      try {
        await navigator.clipboard.writeText(url);
        toast.success("초대장 링크를 복사했어요.");
      } catch {
        toast.error("링크를 복사하지 못했어요.");
      }
    }
  };

  return (
    <div className="flex flex-row justify-center gap-2 max-w-[280px] mx-auto mt-6">
      <KakaoShare />
      
      <button 
        type="button" 
        onClick={handleShare}
        className="flex-1 py-3 px-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 hover:bg-white/80"
        style={{
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          color: "var(--ink)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
        }}
      >
        <Share2 size={13} aria-hidden="true" />
        <span>링크 복사</span>
      </button>
    </div>
  );
}
