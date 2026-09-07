"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import RSVPForm from "./RSVPForm";

interface RSVPModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const HIDE_TODAY_KEY = "rsvp_modal_hide_until";
const RESPONDED_KEY = "rsvp_responded";

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

export default function RSVPModal({ isOpen = false, onClose }: RSVPModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hideToday, setHideToday] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const responded = localStorage.getItem(RESPONDED_KEY) === "true";
      const hiddenUntil = localStorage.getItem(HIDE_TODAY_KEY);
      const hiddenForToday = hiddenUntil === todayKey();
      setIsVisible(isOpen || (!responded && !hiddenForToday));
    }, isOpen ? 0 : 3900);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isVisible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isVisible]);

  const handleClose = () => {
    if (hideToday) localStorage.setItem(HIDE_TODAY_KEY, todayKey());
    setIsVisible(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    onClose?.();
  };

  const handleRsvpSubmit = () => {
    localStorage.setItem(RESPONDED_KEY, "true");
    setIsVisible(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="rsvp-modal-backdrop" onClick={handleClose} />

      <div className="rsvp-modal-layer" onClick={handleClose}>
        <div className="rsvp-modal-card" onClick={(event) => event.stopPropagation()}>
          <div className="rsvp-modal-header">
            <div>
              <p className="rsvp-modal-kicker">A little note from us</p>
              <h2>참석 여부를 알려주세요</h2>
            </div>
            <button type="button" onClick={handleClose} className="rsvp-modal-close" title="닫기" aria-label="닫기">
              <X size={19} />
            </button>
          </div>

          <div className="rsvp-modal-content">
            <p className="rsvp-modal-intro">
              저희의 결혼식에 함께해 주실 수 있을까요?<br />
              편하신 방법으로 참석 여부를 남겨주세요.
            </p>

            <div className="rsvp-modal-form-wrap">
              <RSVPForm isModal={true} onSubmitSuccess={handleRsvpSubmit} />
            </div>

            <label className="rsvp-modal-check">
              <input
                type="checkbox"
                checked={hideToday}
                onChange={(event) => setHideToday(event.target.checked)}
              />
              <span className="rsvp-check-box" aria-hidden="true"><Check size={13} /></span>
              <span>오늘 하루 보지 않기</span>
            </label>

            <button type="button" onClick={handleClose} className="rsvp-modal-later">
              나중에 하기
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rsvpModalIn {
          from { transform: translateY(1.5rem) scale(0.98); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
