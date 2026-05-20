"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const KAKAO_MAP_URL =
  "https://map.kakao.com/link/to/그랜드볼룸웨딩홀,37.5665,126.9780";
const NAVER_MAP_URL =
  "https://map.naver.com/v5/search/그랜드볼룸웨딩홀";

interface ContactInfo {
  role: string;
  name: string;
  phone: string;
}

const CONTACTS: ContactInfo[] = [
  { role: "신랑", name: "김민준", phone: "010-1234-5678" },
  { role: "신랑 아버지", name: "김철수", phone: "010-2345-6789" },
  { role: "신랑 어머니", name: "박영희", phone: "010-3456-7890" },
  { role: "신부", name: "이서연", phone: "010-4567-8901" },
  { role: "신부 아버지", name: "이상훈", phone: "010-5678-9012" },
  { role: "신부 어머니", name: "최미경", phone: "010-6789-0123" },
];

function ContactCard({ contact }: { contact: ContactInfo }) {
  const handleCall = () => {
    window.location.href = `tel:${contact.phone.replace(/-/g, "")}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contact.phone);
      toast.success(`${contact.name}님 번호가 복사되었습니다.`);
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-0">
      <div>
        <span className="text-xs text-rose-400 font-medium">{contact.role}</span>
        <p className="text-sm text-stone-700 font-medium">{contact.name}</p>
        <p className="text-xs text-stone-400">{contact.phone}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleCall}
          className="w-9 h-9 bg-rose-50 hover:bg-rose-100 rounded-full flex items-center justify-center text-rose-400 transition-colors"
          aria-label={`${contact.name}에게 전화`}
        >
          📞
        </button>
        <button
          onClick={handleCopy}
          className="w-9 h-9 bg-stone-50 hover:bg-stone-100 rounded-full flex items-center justify-center text-stone-400 transition-colors text-sm"
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
      await navigator.clipboard.writeText(
        "서울특별시 중구 을지로 30 그랜드볼룸웨딩홀 5층"
      );
      toast.success("주소가 복사되었습니다.");
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  return (
    <section className="py-10 px-4 space-y-6">
      {/* 예식 정보 카드 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
        <h2 className="text-base font-semibold text-stone-700 tracking-widest mb-4">
          예식 안내
        </h2>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="text-rose-300 w-5 flex-shrink-0">📅</span>
            <div>
              <p className="text-sm text-stone-700 font-medium">
                2025년 10월 18일 토요일
              </p>
              <p className="text-xs text-stone-400">오전 11시 00분</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-rose-300 w-5 flex-shrink-0">📍</span>
            <div>
              <p className="text-sm text-stone-700 font-medium">
                그랜드볼룸웨딩홀 5층
              </p>
              <p className="text-xs text-stone-400">
                서울특별시 중구 을지로 30
              </p>
              <button
                onClick={handleCopyAddress}
                className="text-xs text-rose-400 hover:text-rose-500 mt-0.5 transition-colors"
              >
                주소 복사
              </button>
            </div>
          </div>
        </div>

        {/* 지도 버튼 */}
        <div className="flex gap-2 mt-4">
          <a
            href={KAKAO_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 text-xs font-medium rounded-xl text-center transition-colors"
          >
            카카오맵
          </a>
          <a
            href={NAVER_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-xl text-center transition-colors"
          >
            네이버지도
          </a>
        </div>
      </div>

      {/* 오시는 길 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
        <h3 className="text-sm font-semibold text-stone-700 mb-3">
          오시는 길
        </h3>
        <div className="space-y-2 text-xs text-stone-500 leading-relaxed">
          <div className="flex gap-2">
            <span className="text-blue-400 font-bold flex-shrink-0">지하철</span>
            <p>2호선 을지로입구역 5번 출구 도보 3분</p>
          </div>
          <div className="flex gap-2">
            <span className="text-orange-400 font-bold flex-shrink-0">버스</span>
            <p>간선 103, 421 / 지선 7011 을지로입구 정류장 하차</p>
          </div>
          <div className="flex gap-2">
            <span className="text-stone-400 font-bold flex-shrink-0">주차</span>
            <p>건물 지하 주차장 이용 가능 (3시간 무료)</p>
          </div>
        </div>
      </div>

      {/* 연락처 */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <button
          onClick={() => setShowContacts((v) => !v)}
          className="w-full flex items-center justify-between p-5 text-left"
        >
          <h3 className="text-sm font-semibold text-stone-700">연락처</h3>
          <span
            className={`text-stone-400 transition-transform duration-200 ${
              showContacts ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </button>
        {showContacts && (
          <div className="px-5 pb-4">
            {CONTACTS.map((contact) => (
              <ContactCard key={contact.phone} contact={contact} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
