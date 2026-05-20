"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import type { UploadedPhoto, PresignedUrlResponse } from "@/types";

const ALLOWED_TYPES = ["image/jpeg","image/jpg","image/png","image/webp","image/heic","image/heif"];
const MAX_FILE_SIZE   = 50 * 1024 * 1024;
const MAX_FILES       = 10;
const UPLOAD_TIMEOUT  = 120_000;

interface FileUploadState {
  file: File;
  id: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  errorMessage?: string;
  previewUrl?: string;
  publicUrl?: string;
}

async function fetchPresignedUrl(file: File): Promise<PresignedUrlResponse> {
  const res = await fetch("/api/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, contentType: file.type || "image/jpeg", fileSize: file.size }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "알 수 없는 오류" }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

function uploadWithProgress(
  url: string, file: File, contentType: string,
  onProgress: (p: number) => void, signal: AbortSignal
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });
    xhr.addEventListener("load",    () => xhr.status >= 200 && xhr.status < 300 ? (onProgress(100), resolve()) : reject(new Error(`업로드 실패: HTTP ${xhr.status}`)));
    xhr.addEventListener("error",   () => reject(new Error("네트워크 오류로 업로드에 실패했습니다.")));
    xhr.addEventListener("timeout", () => reject(new Error("업로드 시간이 초과되었습니다.")));
    xhr.addEventListener("abort",   () => reject(Object.assign(new Error("업로드가 취소되었습니다."), { name: "AbortError" })));
    signal.addEventListener("abort", () => xhr.abort());
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.timeout = UPLOAD_TIMEOUT;
    xhr.send(file);
  });
}

export default function PhotoUpload({ onUploadComplete }: { onUploadComplete?: (p: UploadedPhoto[]) => void }) {
  const [uploadStates, setUploadStates]     = useState<FileUploadState[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [isDragging, setIsDragging]         = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRefs    = useRef<Map<string, AbortController>>(new Map());

  useEffect(() => () => { abortRefs.current.forEach((c) => c.abort()); }, []);

  const validateFile = (f: File) => {
    if (!ALLOWED_TYPES.includes(f.type) && !f.name.match(/\.(heic|heif)$/i))
      return `${f.name}: 지원하지 않는 파일 형식입니다.`;
    if (f.size > MAX_FILE_SIZE)
      return `${f.name}: 파일 크기가 50MB를 초과합니다.`;
    return null;
  };

  const processFiles = useCallback(async (rawFiles: File[]) => {
    const files = rawFiles.slice(0, MAX_FILES);
    if (rawFiles.length > MAX_FILES) toast.error(`한 번에 최대 ${MAX_FILES}개까지 업로드할 수 있습니다.`);

    const valid: File[] = [];
    for (const f of files) {
      const err = validateFile(f);
      if (err) {
        toast.error(err);
      } else {
        valid.push(f);
      }
    }
    if (!valid.length) return;

    const newStates: FileUploadState[] = valid.map((file) => ({
      file, id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      progress: 0, status: "pending", previewUrl: URL.createObjectURL(file),
    }));
    setUploadStates((p) => [...p, ...newStates]);

    const results = await Promise.allSettled(newStates.map(async (state) => {
      const ctrl = new AbortController();
      abortRefs.current.set(state.id, ctrl);
      const update = (u: Partial<FileUploadState>) =>
        setUploadStates((p) => p.map((s) => s.id === state.id ? { ...s, ...u } : s));

      try {
        update({ status: "uploading" });
        const { uploadUrl, publicUrl, key } = await fetchPresignedUrl(state.file);
        await uploadWithProgress(uploadUrl, state.file, state.file.type || "image/jpeg",
          (pct) => update({ progress: pct }), ctrl.signal);
        update({ status: "done", progress: 100, publicUrl: publicUrl ?? undefined });

        const photo: UploadedPhoto = {
          key, url: publicUrl ?? URL.createObjectURL(state.file),
          name: state.file.name, uploadedAt: new Date().toISOString(),
        };
        setUploadedPhotos((p) => { const u = [...p, photo]; onUploadComplete?.(u); return u; });
        return true;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          update({ status: "error", errorMessage: "취소됨" }); return false;
        }
        const msg = err instanceof Error ? err.message : "업로드 오류";
        update({ status: "error", errorMessage: msg });
        toast.error(`${state.file.name} 업로드 실패: ${msg}`);
        return false;
      } finally { abortRefs.current.delete(state.id); }
    }));

    const ok = results.filter((r) => r.status === "fulfilled" && r.value).length;
    if (ok > 0) toast.success(`${ok}개 사진이 업로드되었습니다! 📸`);
  }, [onUploadComplete]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = Array.from(e.target.files ?? []);
    if (f.length) processFiles(f);
    e.target.value = "";
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/")));
  }, [processFiles]);

  const isUploading = uploadStates.some((s) => s.status === "uploading");
  const totalProgress = uploadStates.length
    ? Math.round(uploadStates.reduce((s, u) => s + u.progress, 0) / uploadStates.length) : 0;

  return (
    <section id="section-photos" className="py-10 px-4">
      {/* 헤더 */}
      <div className="mb-6">
        <p className="section-title mb-1">Photo Share</p>
        <h2 className="text-xl font-light tracking-wider" style={{ color: "#44403c" }}>
          하객 사진 공유
        </h2>
        <p className="text-xs mt-1 tracking-wide" style={{ color: "#a8a29e" }}>
          소중한 순간을 함께 나눠주세요 · 최대 50MB · JPG/PNG/WebP/HEIC
        </p>
      </div>

      {/* 드래그 앤 드롭 영역 */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        className="relative rounded-3xl p-8 text-center cursor-pointer transition-all duration-300"
        style={{
          background: isDragging
            ? "rgba(212,169,106,0.1)"
            : "rgba(253,250,246,0.8)",
          border: `2px dashed ${isDragging ? "#d4a96a" : "rgba(212,169,106,0.35)"}`,
          transform: isDragging ? "scale(1.01)" : "scale(1)",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(212,169,106,0.15), rgba(176,136,64,0.08))",
            border: "1px solid rgba(212,169,106,0.2)",
          }}
        >
          📸
        </div>
        <p className="text-sm font-medium tracking-wider mb-1" style={{ color: "#78716c" }}>
          사진을 드래그하거나 탭하여 선택
        </p>
        <p className="text-xs tracking-wide" style={{ color: "#a8a29e" }}>
          한 번에 최대 {MAX_FILES}개 · 파일당 최대 50MB
        </p>
      </div>

      {/* 전체 진행률 */}
      {isUploading && (
        <div
          className="mt-4 rounded-2xl p-4 animate-fadeInUp"
          style={{
            background: "rgba(253,250,246,0.9)",
            border: "1px solid rgba(212,169,106,0.2)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs tracking-wider" style={{ color: "#78716c" }}>업로드 중...</span>
            <span className="text-sm font-medium tabular-nums" style={{ color: "#b08840" }}>
              {totalProgress}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(212,169,106,0.15)" }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${totalProgress}%`,
                background: "linear-gradient(90deg, #d4a96a, #b08840)",
              }}
            />
          </div>
        </div>
      )}

      {/* 개별 파일 상태 */}
      {uploadStates.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadStates.map((state) => (
            <div
              key={state.id}
              className="flex items-center gap-3 rounded-2xl p-3 animate-fadeInUp"
              style={{
                background: "#fff",
                border: "1px solid rgba(212,169,106,0.15)",
                boxShadow: "0 2px 8px rgba(180,140,80,0.06)",
              }}
            >
              {/* 썸네일 */}
              <div
                className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                style={{ background: "rgba(212,169,106,0.1)" }}
              >
                {state.previewUrl && (
                  <Image src={state.previewUrl} alt={state.file.name} fill className="object-cover" sizes="48px" unoptimized />
                )}
              </div>

              {/* 정보 */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate mb-0.5" style={{ color: "#44403c" }}>
                  {state.file.name}
                </p>
                <p className="text-[11px] mb-1" style={{ color: "#a8a29e" }}>
                  {(state.file.size / 1024 / 1024).toFixed(1)} MB
                </p>
                {state.status === "uploading" && (
                  <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(212,169,106,0.15)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-200"
                      style={{ width: `${state.progress}%`, background: "linear-gradient(90deg, #d4a96a, #b08840)" }}
                    />
                  </div>
                )}
                {state.status === "error" && (
                  <p className="text-[11px]" style={{ color: "#ef4444" }}>{state.errorMessage}</p>
                )}
              </div>

              {/* 상태 아이콘 */}
              <div className="flex-shrink-0">
                {state.status === "pending"   && <span style={{ color: "#c4b8a8" }}>⏳</span>}
                {state.status === "uploading" && (
                  <button
                    onClick={() => abortRefs.current.get(state.id)?.abort()}
                    className="text-[11px] px-2 py-1 rounded-lg tracking-wider transition-colors"
                    style={{ border: "1px solid rgba(212,169,106,0.3)", color: "#a8a29e" }}
                  >
                    취소
                  </button>
                )}
                {state.status === "done"  && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    style={{ background: "linear-gradient(135deg, #d4a96a, #b08840)", color: "#fff" }}
                  >
                    ✓
                  </div>
                )}
                {state.status === "error" && (
                  <button
                    onClick={() => setUploadStates((p) => p.filter((s) => s.id !== state.id))}
                    className="text-lg"
                    style={{ color: "#c4b8a8" }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 업로드 완료 갤러리 */}
      {uploadedPhotos.length > 0 && (
        <div className="mt-6">
          <p className="text-[11px] tracking-[0.25em] uppercase mb-3" style={{ color: "#c49a55" }}>
            업로드된 사진 ({uploadedPhotos.length}장)
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {uploadedPhotos.map((photo) => (
              <div
                key={photo.key}
                className="relative aspect-square rounded-2xl overflow-hidden"
                style={{ background: "rgba(212,169,106,0.1)" }}
              >
                <Image
                  src={photo.url}
                  alt={photo.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 150px"
                  unoptimized={photo.url.startsWith("blob:")}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
