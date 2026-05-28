"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface RSVPFormData {
  name: string;
  attendance: "attend" | "absent";
  guest_count: number;
  meal_preference: "yes" | "no" | "undecided";
}

interface RSVPFormProps {
  isModal?: boolean;
  onSubmitSuccess?: () => void;
}

export default function RSVPForm({
  isModal = false,
  onSubmitSuccess,
}: RSVPFormProps = {}) {
  const [formData, setFormData] = useState<RSVPFormData>({
    name: "",
    attendance: "attend",
    guest_count: 1,
    meal_preference: "undecided",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(isModal ? true : false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "guest_count" ? parseInt(value, 10) : (value as any),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "RSVP 저장에 실패했습니다.");
      }

      toast.success("참석 여부가 저장되었습니다!");
      setFormData({
        name: "",
        attendance: "attend",
        guest_count: 1,
        meal_preference: "undecided",
      });
      setIsExpanded(false);

      // 모달 모드에서 콜백 실행
      if (isModal && onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <>
      {/* 아코디언 헤더 (모달 모드에서는 숨김) */}
      {!isModal && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300"
          style={{
            background: isExpanded
              ? "linear-gradient(135deg, rgba(212,169,106,0.15), rgba(176,136,64,0.08))"
              : "rgba(255,255,255,0.6)",
            border: "1px solid rgba(212,169,106,0.2)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="text-left">
            <h3
              className="text-lg font-medium tracking-wide"
              style={{ color: "#b08840" }}
            >
              참석 여부 알리기
            </h3>
            <p className="text-xs mt-1" style={{ color: "#a8a29e" }}>
              예식 참석 여부를 알려주세요
            </p>
          </div>
          <span
            className="text-2xl transition-transform duration-300"
            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▼
          </span>
        </button>
      )}

      {/* 아코디언 콘텐츠 또는 모달 폼 */}
      <div
        className={isModal ? "" : "overflow-hidden transition-all duration-300"}
        style={
          !isModal
            ? {
                maxHeight: isExpanded ? "600px" : "0px",
                opacity: isExpanded ? 1 : 0,
              }
            : undefined
        }
      >
        <form
          onSubmit={handleSubmit}
          className={`${isModal ? "" : "mt-4"} space-y-4 px-4 py-4 rounded-2xl`}
          style={{
            background: "rgba(255,255,255,0.4)",
            border: "1px solid rgba(212,169,106,0.15)",
          }}
        >
          {/* 이름 입력 */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#78716c" }}
            >
              이름 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="성함을 입력해주세요"
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: "rgba(212,169,106,0.3)",
                color: "#44403c",
                backgroundColor: "rgba(255,255,255,0.8)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#d4a96a";
                e.currentTarget.style.backgroundColor = "#fff";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(212,169,106,0.3)";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.8)";
              }}
            />
          </div>

          {/* 참석 여부 */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#78716c" }}
            >
              참석 여부 *
            </label>
            <div className="flex gap-3">
              {[
                { value: "attend", label: "참석합니다" },
                { value: "absent", label: "불참합니다" },
              ].map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <input
                    type="radio"
                    name="attendance"
                    value={value}
                    checked={formData.attendance === value}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm" style={{ color: "#78716c" }}>
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 동반인 수 */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#78716c" }}
            >
              동반인 수 (본인 포함)
            </label>
            <select
              name="guest_count"
              value={formData.guest_count}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: "rgba(212,169,106,0.3)",
                color: "#44403c",
                backgroundColor: "rgba(255,255,255,0.8)",
              }}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}명
                </option>
              ))}
            </select>
          </div>

          {/* 식사 여부 */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "#78716c" }}
            >
              식사 여부
            </label>
            <div className="flex gap-2">
              {[
                { value: "yes", label: "예" },
                { value: "no", label: "아니오" },
                { value: "undecided", label: "미정" },
              ].map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <input
                    type="radio"
                    name="meal_preference"
                    value={value}
                    checked={formData.meal_preference === value}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm" style={{ color: "#78716c" }}>
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 text-white"
            style={{
              background: isSubmitting
                ? "linear-gradient(135deg, #d4a96a, #b08840)"
                : "linear-gradient(135deg, #d4a96a, #b08840)",
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "저장 중..." : "참석 여부 저장"}
          </button>
        </form>
      </div>
    </>
  );

  if (isModal) {
    return <>{content}</>;
  }

  return (
    <section id="section-rsvp" className="px-6 py-8">
      {content}
    </section>
  );
}
