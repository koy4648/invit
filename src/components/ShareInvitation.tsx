"use client";

import { Share2 } from "lucide-react";
import toast from "react-hot-toast";

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
    <button type="button" className="invitation-share-button" onClick={handleShare}>
      <Share2 size={15} aria-hidden="true" />
      <span>초대장 공유하기</span>
    </button>
  );
}
