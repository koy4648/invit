"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import type { GuestbookEntry } from "@/types";

const MAX_MESSAGE_LENGTH = 200;
const ENTRIES_PER_PAGE = 10;

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
        .limit(ENTRIES_PER_PAGE);

      if (error) throw error;
      setEntries(data ?? []);
    } catch (err) {
      console.error("방명록 로딩 오류:", err);
      toast.error("방명록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("이름을 입력해 주세요.");
      return;
    }
    if (!password.trim() || password.length < 4) {
      toast.error("비밀번호는 4자 이상 입력해 주세요.");
      return;
    }
    if (!message.trim()) {
      toast.error("축하 메시지를 입력해 주세요.");
      return;
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      toast.error(`메시지는 ${MAX_MESSAGE_LENGTH}자 이내로 입력해 주세요.`);
      return;
    }

    setSubmitting(true);
    const loadingToast = toast.loading("메시지를 등록하는 중...");

    try {
      const { error } = await supabase.from("guestbook").insert({
        name: name.trim(),
        password: password.trim(),
        message: message.trim(),
      });

      if (error) throw error;

      toast.success("축하 메시지가 등록되었습니다! 💕", { id: loadingToast });
      setName("");
      setPassword("");
      setMessage("");
      setShowForm(false);
      await fetchEntries();
    } catch (err: unknown) {
      console.error("방명록 등록 오류:", err);
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      toast.error(`등록 실패: ${errorMessage}`, { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-stone-700 tracking-widest">
          방명록
        </h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 bg-rose-400 hover:bg-rose-500 text-white text-sm rounded-full transition-colors shadow-sm"
        >
          {showForm ? "취소" : "메시지 남기기"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-rose-50 rounded-2xl p-4 space-y-3 border border-rose-100"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-stone-500 mb-1">
                이름 <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                maxLength={20}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">
                비밀번호 <span className="text-rose-400">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="4자 이상"
                maxLength={20}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all"
                disabled={submitting}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1">
              축하 메시지 <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="두 분의 결혼을 진심으로 축하드립니다..."
              maxLength={MAX_MESSAGE_LENGTH}
              rows={3}
              className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all resize-none"
              disabled={submitting}
            />
            <div className="text-right text-xs text-stone-400 mt-0.5">
              {message.length} / {MAX_MESSAGE_LENGTH}
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-rose-400 hover:bg-rose-500 disabled:bg-rose-200 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {submitting ? "등록 중..." : "축하 메시지 남기기 💕"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-stone-50 rounded-2xl p-4 animate-pulse space-y-2"
            >
              <div className="h-3 bg-stone-200 rounded w-1/4" />
              <div className="h-3 bg-stone-200 rounded w-3/4" />
              <div className="h-3 bg-stone-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-10 text-stone-400">
          <p className="text-3xl mb-2">💌</p>
          <p className="text-sm">첫 번째 축하 메시지를 남겨주세요!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-stone-700 text-sm">
                  {entry.name}
                </span>
                <span className="text-xs text-stone-400">
                  {formatDate(entry.created_at)}
                </span>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
                {entry.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
