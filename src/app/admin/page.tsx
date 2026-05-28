"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Lock, LogOut } from "lucide-react";

interface AdminStats {
  rsvp: {
    total: number;
    attend: number;
    absent: number;
    totalGuests: number;
    mealYes: number;
    mealNo: number;
  };
  guestbook: {
    total: number;
  };
}

interface RSVPEntry {
  id: string;
  name: string;
  attendance: string;
  guest_count: number;
  meal_preference: string;
  created_at: string;
}

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [rsvpList, setRsvpList] = useState<RSVPEntry[]>([]);
  const [guestbookList, setGuestbookList] = useState<GuestbookEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"stats" | "rsvp" | "guestbook">(
    "stats"
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "인증에 실패했습니다.");
      }

      setStats(data.stats);
      setRsvpList(data.rsvpList);
      setGuestbookList(data.guestbookList);
      setIsAuthenticated(true);
      setPassword("");
      toast.success("관리자 페이지에 접속했습니다.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setStats(null);
    setRsvpList([]);
    setGuestbookList([]);
    setPassword("");
    setActiveTab("stats");
    toast.success("로그아웃되었습니다.");
  };

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(180deg, #fdfaf6 0%, #f9f3ea 100%)" }}
      >
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Lock size={48} style={{ color: "#d4a96a" }} />
            </div>
            <h1
              className="text-3xl font-light tracking-wider mb-2"
              style={{ color: "#44403c" }}
            >
              관리자 로그인
            </h1>
            <p className="text-sm" style={{ color: "#a8a29e" }}>
              관리자 비밀번호를 입력하세요
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-4 p-6 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(212,169,106,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: "rgba(212,169,106,0.3)",
                color: "#44403c",
                backgroundColor: "rgba(255,255,255,0.8)",
              }}
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 text-white"
              style={{
                background: "linear-gradient(135deg, #d4a96a, #b08840)",
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "인증 중..." : "로그인"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #fdfaf6 0%, #f9f3ea 100%)" }}
    >
      {/* 헤더 */}
      <div
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          background: "rgba(253,250,246,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(212,169,106,0.2)",
        }}
      >
        <h1
          className="text-2xl font-light tracking-wider"
          style={{ color: "#44403c" }}
        >
          관리자 대시보드
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200"
          style={{
            background: "rgba(212,169,106,0.1)",
            color: "#d4a96a",
          }}
        >
          <LogOut size={18} />
          <span className="text-sm">로그아웃</span>
        </button>
      </div>

      {/* 탭 네비게이션 */}
      <div
        className="sticky top-16 z-40 px-6 py-3 flex gap-2"
        style={{
          background: "rgba(253,250,246,0.9)",
          borderBottom: "1px solid rgba(212,169,106,0.1)",
        }}
      >
        {[
          { id: "stats", label: "통계" },
          { id: "rsvp", label: "참석 현황" },
          { id: "guestbook", label: "방명록" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className="px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
            style={{
              background:
                activeTab === id
                  ? "linear-gradient(135deg, #d4a96a, #b08840)"
                  : "rgba(212,169,106,0.1)",
              color: activeTab === id ? "#fff" : "#b08840",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-6 py-8 pb-20">
        {/* 통계 탭 */}
        {activeTab === "stats" && stats && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "총 응답", value: stats.rsvp.total },
              { label: "참석", value: stats.rsvp.attend },
              { label: "불참", value: stats.rsvp.absent },
              { label: "총 인원", value: stats.rsvp.totalGuests },
              { label: "식사 예", value: stats.rsvp.mealYes },
              { label: "식사 아니오", value: stats.rsvp.mealNo },
              { label: "방명록", value: stats.guestbook.total },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl text-center"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(212,169,106,0.2)",
                }}
              >
                <p className="text-xs mb-2" style={{ color: "#a8a29e" }}>
                  {stat.label}
                </p>
                <p
                  className="text-3xl font-light"
                  style={{
                    background: "linear-gradient(135deg, #d4a96a, #b08840)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* RSVP 탭 */}
        {activeTab === "rsvp" && (
          <div className="space-y-3">
            <h2
              className="text-lg font-medium mb-4"
              style={{ color: "#44403c" }}
            >
              참석 현황 ({rsvpList.length}명)
            </h2>
            {rsvpList.length === 0 ? (
              <p style={{ color: "#a8a29e" }}>아직 응답이 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid rgba(212,169,106,0.2)",
                      }}
                    >
                      <th
                        className="px-4 py-2 text-left"
                        style={{ color: "#b08840" }}
                      >
                        이름
                      </th>
                      <th
                        className="px-4 py-2 text-left"
                        style={{ color: "#b08840" }}
                      >
                        참석
                      </th>
                      <th
                        className="px-4 py-2 text-left"
                        style={{ color: "#b08840" }}
                      >
                        인원
                      </th>
                      <th
                        className="px-4 py-2 text-left"
                        style={{ color: "#b08840" }}
                      >
                        식사
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvpList.map((entry) => (
                      <tr
                        key={entry.id}
                        style={{
                          borderBottom: "1px solid rgba(212,169,106,0.1)",
                        }}
                      >
                        <td className="px-4 py-3" style={{ color: "#44403c" }}>
                          {entry.name}
                        </td>
                        <td className="px-4 py-3" style={{ color: "#44403c" }}>
                          {entry.attendance === "attend" ? "✅ 참석" : "❌ 불참"}
                        </td>
                        <td className="px-4 py-3" style={{ color: "#44403c" }}>
                          {entry.guest_count}명
                        </td>
                        <td className="px-4 py-3" style={{ color: "#44403c" }}>
                          {entry.meal_preference === "yes"
                            ? "예"
                            : entry.meal_preference === "no"
                              ? "아니오"
                              : "미정"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 방명록 탭 */}
        {activeTab === "guestbook" && (
          <div className="space-y-3">
            <h2
              className="text-lg font-medium mb-4"
              style={{ color: "#44403c" }}
            >
              방명록 ({guestbookList.length}개)
            </h2>
            {guestbookList.length === 0 ? (
              <p style={{ color: "#a8a29e" }}>아직 방명록이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {guestbookList.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.6)",
                      border: "1px solid rgba(212,169,106,0.2)",
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p
                        className="font-medium"
                        style={{ color: "#b08840" }}
                      >
                        {entry.name}
                      </p>
                      <p className="text-xs" style={{ color: "#a8a29e" }}>
                        {new Date(entry.created_at).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                    <p style={{ color: "#78716c" }}>{entry.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
