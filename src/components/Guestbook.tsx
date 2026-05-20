"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import type { GuestbookEntry } from "@/types";

const MAX_MESSAGE_LENGTH = 200;

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const fetchEntries = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("guestbook")
        .select("id, name, message, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      setEntries(data ?? []);
    } catch {
      toast.error("방명록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void fetchEntries();
    }, 0);

    return () => window.clearTimeout(id);
  }, [fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim())                         return toast.error("이름을 입력해 주세요.");
    if (!password.trim() || password.length < 4) return toast.error("비밀번호는 4자 이상 입력해 주세요.");
    if (!message.trim())                      return toast.error("축하 메시지를 입력해 주세요.");
    if (message.length > MAX_MESSAGE_LENGTH)  return toast.error(`메시지는 ${MAX_MESSAGE_LENGTH}자 이내로 입력해 주세요.`);

    setSubmitting(true);
    const tid = toast.loading("메시지를 등록하는 중...");
    try {
      const { error } = await supabase.from("guestbook").insert({
        name: name.trim(), password: password.trim(), message: message.trim(),
      });
      if (error) throw error;
      toast.success("축하 메시지가 등록되었습니다! 💕", { id: tid });
      setName(""); setPassword(""); setMessage("");
      setShowForm(false);
      await fetchEntries();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      toast.error(`등록 실패: ${msg}`, { id: tid });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

  return (
    <section id="section-guestbook" className="py-10 px-4">
      {/* 섹션 헤더 */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="section-title mb-1">Guestbook</p>
          <h2 className="text-xl font-light tracking-wider" style={{ color: "#44403c" }}>
            방명록
          </h2>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-gold text-xs"
          style={{ padding: "9px 18px" }}
        >
          {showForm ? "취소" : "✦ 메시지 남기기"}
        </button>
      </div>

      {/* 작성 폼 */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-3xl p-5 space-y-3 animate-fadeInUp"
          style={{
            background: "rgba(253,250,246,0.9)",
            border: "1px solid rgba(212,169,106,0.25)",
            boxShadow: "0 4px 24px rgba(180,140,80,0.1)",
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] tracking-wider mb-1.5" style={{ color: "#a8a29e" }}>
                이름 <span style={{ color: "#d4a96a" }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                maxLength={20}
                className="input-field"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-[11px] tracking-wider mb-1.5" style={{ color: "#a8a29e" }}>
                비밀번호 <span style={{ color: "#d4a96a" }}>*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="4자 이상"
                maxLength={20}
                className="input-field"
                disabled={submitting}
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] tracking-wider mb-1.5" style={{ color: "#a8a29e" }}>
              축하 메시지 <span style={{ color: "#d4a96a" }}>*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="두 분의 결혼을 진심으로 축하드립니다..."
              maxLength={MAX_MESSAGE_LENGTH}
              rows={3}
              className="input-field resize-none"
              disabled={submitting}
            />
            <div className="text-right text-[11px] mt-0.5" style={{ color: "#c4b8a8" }}>
              {message.length} / {MAX_MESSAGE_LENGTH}
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-2xl text-sm font-medium tracking-wider transition-all active:scale-[0.98]"
            style={{
              background: submitting
                ? "rgba(212,169,106,0.3)"
                : "linear-gradient(135deg, #d4a96a, #b08840)",
              color: "#fff",
              boxShadow: submitting ? "none" : "0 4px 16px rgba(176,136,64,0.35)",
            }}
          >
            {submitting ? "등록 중..." : "축하 메시지 남기기 💕"}
          </button>
        </form>
      )}

      {/* 목록 */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 space-y-2">
              <div className="shimmer h-3 rounded-full w-1/4" />
              <div className="shimmer h-3 rounded-full w-3/4" />
              <div className="shimmer h-3 rounded-full w-1/2" />
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-14">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
            style={{ background: "rgba(212,169,106,0.1)" }}
          >
            💌
          </div>
          <p className="text-sm tracking-wider" style={{ color: "#a8a29e" }}>
            첫 번째 축하 메시지를 남겨주세요
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <div
              key={entry.id}
              className="card p-4 animate-fadeInUp"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{
                      background: "linear-gradient(135deg, rgba(212,169,106,0.2), rgba(176,136,64,0.1))",
                      color: "#b08840",
                    }}
                  >
                    {entry.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium tracking-wide" style={{ color: "#44403c" }}>
                    {entry.name}
                  </span>
                </div>
                <span className="text-[11px]" style={{ color: "#c4b8a8" }}>
                  {formatDate(entry.created_at)}
                </span>
              </div>
              <p
                className="text-[13px] leading-[1.85] whitespace-pre-wrap break-words pl-9"
                style={{ color: "#78716c" }}
              >
                {entry.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
