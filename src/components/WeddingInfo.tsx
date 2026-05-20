"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const KAKAO_MAP_URL = "https://map.kakao.com/link/to/그랜드볼룸웨딩홀,37.5665,126.9780";
const NAVER_MAP_URL = "https://map.naver.com/v5/search/그랜드볼룸웨딩홀";

interface ContactInfo {
  role: string;
  name: string;
  phone: string;
  side: "groom" | "bride";
}

const CONTACTS: ContactInfo[] = [
  { role: "신랑",       name: "김민준", phone: "010-1234-5678", side: "groom" },
  { role: "신랑 아버지", name: "김철수", phone: "010-2345-6789", side: "groom" },
  { role: "신랑 어머니", name: "박영희", phone: "010-3456-7890", side: "groom" },
  { role: "신부",       name: "이서연", phone: "010-4567-8901", side: "bride" },
  { role: "신부 아버지", name: "이상훈", phone: "010-5678-9012", side: "bride" },
  { role: "신부 어머니", name: "최미경", phone: "010-6789-0123", side: "bride" },
];

function ContactCard({ contact }: { contact: ContactInfo }) {
  const handleCall = () => { window.location.href = `tel:${contact.phone.replace(/-/g, "")}`; };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contact.phone);
      toast.success(`${contact.name}님 번호가 복사되었습니다.`);
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  const isGroom = contact.side === "groom";

  return (
    <div
      className="flex items-center justify-between py-3 border-b last:border-0"
      style={{ borderColor: "rgba(212,169,106,0.12)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
          style={{
            background: isGroom
              ? "linear-gradient(135deg, rgba(212,169,106,0.15), rgba(176,136,64,0.1))"
              : "linear-gradient(135deg, rgba(242,228,228,0.8), rgba(212,160,160,0.3))",
            color: isGroom ? "#b08840" : "#b87878",
            border: `1px solid ${isGroom ? "rgba(212,169,106,0.3)" : "rgba(212,160,160,0.3)"}`,
          }}
        >
          {isGroom ? "♂" : "♀"}
        </div>
        <div>
          <p className="text-[11px] tracking-wider mb-0.5" style={{ color: "#a8a29e" }}>
            {contact.role}
          </p>
          <p className="text-sm font-medium" style={{ color: "#44403c" }}>
            {contact.name}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleCall}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #d4a96a, #b08840)",
            boxShadow: "0 2px 8px rgba(176,136,64,0.3)",
          }}
          aria-label={`${contact.name}에게 전화`}
        >
          📞
        </button>
        <button
          onClick={handleCopy}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all active:scale-95"
          style={{
            background: "rgba(212,169,106,0.1)",
            border: "1px solid rgba(212,169,106,0.25)",
          }}
          aria-label={`${contact.name} 번호 복사`}
        >
          📋
        </button>
      </div>
    </div>
  );
}

export default function WeddingInfo() {
  const [showContacts, setShowContacts] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText("서울특별시 중구 을지로 30 그랜드볼룸웨딩홀 5층");
      toast.success("주소가 복사되었습니다.");
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  return (
    <section id="section-info" className="py-10 px-4 space-y-4">
      {/* 섹션 헤더 */}
      <div className="mb-6">
        <p className="section-title mb-1">Location & Info</p>
        <h2 className="text-xl font-light tracking-wider" style={{ color: "#44403c" }}>
          예식 안내
        </h2>
      </div>

      {/* 예식 정보 카드 */}
      <div className="card p-5">
        {/* 날짜 */}
        <div className="flex items-start gap-4 pb-4" style={{ borderBottom: "1px solid rgba(212,169,106,0.12)" }}>
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, rgba(212,169,106,0.15), rgba(176,136,64,0.08))" }}
          >
            <span className="text-lg">📅</span>
          </div>
          <div>
            <p className="text-[11px] tracking-wider mb-1" style={{ color: "#a8a29e" }}>DATE & TIME</p>
            <p className="text-sm font-medium" style={{ color: "#44403c" }}>
              2025년 10월 18일 토요일
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#78716c" }}>오전 11시 00분</p>
          </div>
        </div>

        {/* 장소 */}
        <div className="flex items-start gap-4 pt-4">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, rgba(212,169,106,0.15), rgba(176,136,64,0.08))" }}
          >
            <span className="text-lg">📍</span>
          </div>
          <div className="flex-1">
            <p className="text-[11px] tracking-wider mb-1" style={{ color: "#a8a29e" }}>VENUE</p>
            <p className="text-sm font-medium" style={{ color: "#44403c" }}>그랜드볼룸웨딩홀 5층</p>
            <p className="text-xs mt-0.5" style={{ color: "#78716c" }}>서울특별시 중구 을지로 30</p>
            <button
              onClick={handleCopyAddress}
              className="text-[11px] mt-1.5 tracking-wider transition-colors"
              style={{ color: "#c49a55" }}
            >
              주소 복사 →
            </button>
          </div>
        </div>

        {/* 지도 버튼 */}
        <div className="flex gap-2.5 mt-5">
          <a
            href={KAKAO_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 rounded-2xl text-xs font-medium text-center tracking-wider transition-all active:scale-95"
            style={{
              background: "#FEE500",
              color: "#3C1E1E",
              boxShadow: "0 2px 8px rgba(254,229,0,0.4)",
            }}
          >
            카카오맵
          </a>
          <a
            href={NAVER_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 rounded-2xl text-xs font-medium text-center tracking-wider transition-all active:scale-95"
            style={{
              background: "#03C75A",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(3,199,90,0.35)",
            }}
          >
            네이버지도
          </a>
        </div>
      </div>

      {/* 오시는 길 */}
      <div className="card p-5">
        <p className="text-[11px] tracking-[0.25em] uppercase mb-4" style={{ color: "#c49a55" }}>
          Direction
        </p>
        <div className="space-y-3">
          {[
            { icon: "🚇", label: "지하철", desc: "2호선 을지로입구역 5번 출구 도보 3분" },
            { icon: "🚌", label: "버스",   desc: "간선 103, 421 / 지선 7011 을지로입구 정류장 하차" },
            { icon: "🚗", label: "주차",   desc: "건물 지하 주차장 이용 가능 (3시간 무료)" },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="flex gap-3 items-start">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
                style={{ background: "rgba(212,169,106,0.1)" }}
              >
                {icon}
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-wider mb-0.5" style={{ color: "#b08840" }}>
                  {label}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#78716c" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 연락처 아코디언 */}
      <div className="card overflow-hidden">
        <button
          onClick={() => setShowContacts((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4"
        >
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase mb-0.5" style={{ color: "#c49a55" }}>
              Contact
            </p>
            <p className="text-sm font-medium tracking-wider" style={{ color: "#44403c" }}>
              연락처
            </p>
          </div>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300"
            style={{
              background: "rgba(212,169,106,0.1)",
              transform: showContacts ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <span className="text-xs" style={{ color: "#b08840" }}>▾</span>
          </div>
        </button>

        {showContacts && (
          <div className="px-5 pb-4">
            <div
              className="mb-3 pb-1 text-[11px] tracking-widest font-medium"
              style={{ color: "#b08840", borderBottom: "1px solid rgba(212,169,106,0.2)" }}
            >
              신랑측
            </div>
            {CONTACTS.filter((c) => c.side === "groom").map((c) => (
              <ContactCard key={c.phone} contact={c} />
            ))}
            <div
              className="mt-4 mb-3 pb-1 text-[11px] tracking-widest font-medium"
              style={{ color: "#b87878", borderBottom: "1px solid rgba(212,169,106,0.2)" }}
            >
              신부측
            </div>
            {CONTACTS.filter((c) => c.side === "bride").map((c) => (
              <ContactCard key={c.phone} contact={c} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}