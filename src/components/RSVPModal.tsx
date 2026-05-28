"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import RSVPForm from "./RSVPForm";

interface RSVPModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function RSVPModal({ isOpen = true, onClose }: RSVPModalProps) {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [hasResponded, setHasResponded] = useState(false);

  useEffect(() => {
    // localStorage에서 RSVP 응답 여부 확인
    const hasRsvpResponded = localStorage.getItem("rsvp_responded");
    if (hasRsvpResponded === "true") {
      setHasResponded(true);
      setIsVisible(false);
    } else {
      setIsVisible(isOpen);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleRsvpSubmit = () => {
    // RSVP 응답 완료 표시
    localStorage.setItem("rsvp_responded", "true");
    setHasResponded(true);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* 백그라운드 오버레이 */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
        }}
        onClick={handleClose}
      />

      {/* 모달 */}
      <div
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
        onClick={handleClose}
      >
        <div
          className="w-full max-w-md rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto md:rounded-3xl"
          style={{
            background: "linear-gradient(180deg, #fdfaf6 0%, #f9f3ea 100%)",
            animation: "slideUp 0.3s ease-out",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div
            className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
            style={{
              background: "rgba(253, 250, 246, 0.95)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(212, 169, 106, 0.2)",
            }}
          >
            <h2
              className="text-xl font-light tracking-wider"
              style={{ color: "#44403c" }}
            >
              참석 여부 안내
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              style={{
                background: "rgba(212, 169, 106, 0.1)",
              }}
              title="닫기"
            >
              <X size={20} style={{ color: "#d4a96a" }} />
            </button>
          </div>

          {/* 콘텐츠 */}
          <div className="px-6 py-6">
            <p className="text-sm mb-6" style={{ color: "#78716c" }}>
              축하해주셔서 감사합니다! 아래 양식을 통해 참석 여부를 알려주세요.
              <br />
              <span style={{ color: "#a8a29e" }} className="text-xs">
                (선택사항이며, 나중에 언제든 수정할 수 있습니다)
              </span>
            </p>

            {/* RSVP 폼 */}
            <div
              className="p-4 rounded-xl"
              style={{
                background: "rgba(255, 255, 255, 0.4)",
                border: "1px solid rgba(212, 169, 106, 0.15)",
              }}
            >
              <RSVPForm
                isModal={true}
                onSubmitSuccess={handleRsvpSubmit}
              />
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={handleClose}
              className="w-full mt-6 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-white"
              style={{
                background: "rgba(212, 169, 106, 0.2)",
                color: "#b08840",
                border: "1px solid rgba(212, 169, 106, 0.3)",
              }}
            >
              나중에 하기
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
