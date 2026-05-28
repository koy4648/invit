"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Copy, Heart } from "lucide-react";

interface Account {
  name: string;
  bank: string;
  account: string;
  accountHolder: string;
  type: "groom" | "bride" | "groom_parents" | "bride_parents";
}

interface AccountInfoProps {
  accounts?: Account[];
  showAccounts?: boolean;
}

const DEFAULT_ACCOUNTS: Account[] = [
  {
    name: "신랑",
    bank: "국민은행",
    account: "123-456-789012",
    accountHolder: "김민준",
    type: "groom",
  },
  {
    name: "신부",
    bank: "우리은행",
    account: "987-654-321098",
    accountHolder: "이서연",
    type: "bride",
  },
  {
    name: "신랑 부모님",
    bank: "신한은행",
    account: "111-222-333444",
    accountHolder: "김철수",
    type: "groom_parents",
  },
  {
    name: "신부 부모님",
    bank: "하나은행",
    account: "555-666-777888",
    accountHolder: "이영희",
    type: "bride_parents",
  },
];

export default function AccountInfo({
  accounts = DEFAULT_ACCOUNTS,
  showAccounts = true,
}: AccountInfoProps) {
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(
    new Set()
  );

  // showAccounts가 false면 섹션 자체를 렌더링하지 않음
  if (!showAccounts || accounts.length === 0) {
    return null;
  }

  const toggleExpand = (type: string) => {
    const newSet = new Set(expandedAccounts);
    if (newSet.has(type)) {
      newSet.delete(type);
    } else {
      newSet.add(type);
    }
    setExpandedAccounts(newSet);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label}이(가) 복사되었습니다.`);
  };

  const openKakaoPayLink = (account: Account) => {
    // 카카오페이 송금 링크 (실제 구현 시 카카오페이 API 사용)
    const kakaopayUrl = `https://qr.kakaopay.com/`;
    window.open(kakaopayUrl, "_blank");
    toast("카카오페이 앱으로 이동합니다.");
  };

  const openTossLink = (account: Account) => {
    // 토스 송금 링크 (실제 구현 시 토스 API 사용)
    const tossUrl = `https://toss.me/`;
    window.open(tossUrl, "_blank");
    toast("토스 앱으로 이동합니다.");
  };

  return (
    <section id="section-account" className="px-6 py-8">
      <div className="mb-6">
        <h2
          className="text-xl font-light tracking-wider mb-2"
          style={{ color: "#44403c" }}
        >
          마음 전하기
        </h2>
        <p className="text-sm" style={{ color: "#a8a29e" }}>
          축하의 마음을 전해주세요
        </p>
      </div>

      <div className="space-y-3">
        {accounts.map((account) => {
          const isExpanded = expandedAccounts.has(account.type);

          return (
            <div key={account.type}>
              {/* 아코디언 헤더 */}
              <button
                onClick={() => toggleExpand(account.type)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300"
                style={{
                  background: isExpanded
                    ? "linear-gradient(135deg, rgba(212,169,106,0.15), rgba(176,136,64,0.08))"
                    : "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(212,169,106,0.2)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="flex items-center gap-3 flex-1 text-left">
                  <Heart
                    size={18}
                    style={{
                      color: "#d4a96a",
                      fill: isExpanded ? "#d4a96a" : "none",
                    }}
                  />
                  <div>
                    <p
                      className="font-medium text-sm"
                      style={{ color: "#b08840" }}
                    >
                      {account.name}
                    </p>
                    <p className="text-xs" style={{ color: "#a8a29e" }}>
                      {account.bank}
                    </p>
                  </div>
                </div>
                <span
                  className="text-lg transition-transform duration-300"
                  style={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    color: "#d4a96a",
                  }}
                >
                  ▼
                </span>
              </button>

              {/* 아코디언 콘텐츠 */}
              <div
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: isExpanded ? "300px" : "0px",
                  opacity: isExpanded ? 1 : 0,
                }}
              >
                <div
                  className="mt-2 p-4 rounded-xl space-y-3"
                  style={{
                    background: "rgba(255,255,255,0.4)",
                    border: "1px solid rgba(212,169,106,0.15)",
                  }}
                >
                  {/* 계좌 정보 */}
                  <div>
                    <p className="text-xs mb-1" style={{ color: "#a8a29e" }}>
                      계좌번호
                    </p>
                    <div className="flex items-center gap-2">
                      <p
                        className="text-sm font-medium flex-1"
                        style={{ color: "#44403c" }}
                      >
                        {account.account}
                      </p>
                      <button
                        onClick={() =>
                          copyToClipboard(account.account, "계좌번호")
                        }
                        className="p-2 rounded-lg hover:bg-white transition-colors"
                        style={{
                          background: "rgba(212,169,106,0.1)",
                        }}
                        title="복사"
                      >
                        <Copy size={16} style={{ color: "#d4a96a" }} />
                      </button>
                    </div>
                  </div>

                  {/* 예금주 */}
                  <div>
                    <p className="text-xs mb-1" style={{ color: "#a8a29e" }}>
                      예금주
                    </p>
                    <p className="text-sm" style={{ color: "#44403c" }}>
                      {account.accountHolder}
                    </p>
                  </div>

                  {/* 송금 버튼 */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => openKakaoPayLink(account)}
                      className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-white"
                      style={{
                        background: "linear-gradient(135deg, #ffd700, #ffed4e)",
                        color: "#000",
                      }}
                    >
                      카카오페이
                    </button>
                    <button
                      onClick={() => openTossLink(account)}
                      className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-white"
                      style={{
                        background: "linear-gradient(135deg, #0052e3, #0066ff)",
                      }}
                    >
                      토스
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
