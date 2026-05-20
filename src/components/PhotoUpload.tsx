"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import type { UploadedPhoto, PresignedUrlResponse } from "@/types";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES_AT_ONCE = 10;
const UPLOAD_TIMEOUT_MS = 120_000; // 2분

interface FileUploadState {
  file: File;
  id: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  errorMessage?: string;
  previewUrl?: string;
  publicUrl?: string;
}

// Presigned URL을 발급받는 함수
async function fetchPresignedUrl(
  file: File
): Promise<PresignedUrlResponse> {
  const response = await fetch("/api/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type || "image/jpeg",
      fileSize: file.size,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "알 수 없는 오류" }));
    throw new Error(err.error ?? `HTTP ${response.status}`);
  }

  return response.json();
}

// XMLHttpRequest를 활용한 진행률 추적 업로드
function uploadWithProgress(
  url: string,
  file: File,
  contentType: string,
  onProgress: (percent: number) => void,
  signal: AbortSignal
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new Error(`업로드 실패: HTTP ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("네트워크 오류로 업로드에 실패했습니다."));
    });

    xhr.addEventListener("timeout", () => {
      reject(new Error("업로드 시간이 초과되었습니다. 파일 크기를 확인해 주세요."));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("업로드가 취소되었습니다."));
    });

    // AbortSignal 연동
    signal.addEventListener("abort", () => xhr.abort());

    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.timeout = UPLOAD_TIMEOUT_MS;
    xhr.send(file);
  });
}

interface PhotoUploadProps {
  onUploadComplete?: (photos: UploadedPhoto[]) => void;
}

export default function PhotoUpload({ onUploadComplete }: PhotoUploadProps) {
  const [uploadStates, setUploadStates] = useState<FileUploadState[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  // 컴포넌트 언마운트 시 진행 중인 업로드 취소
  useEffect(() => {
    return () => {
      abortControllersRef.current.forEach((controller) => controller.abort());
    };
  }, []);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(heic|heif)$/i)) {
      return `${file.name}: 지원하지 않는 파일 형식입니다. (JPG, PNG, WebP, HEIC 허용)`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name}: 파일 크기가 50MB를 초과합니다.`;
    }
    return null;
  };

  const processFiles = useCallback(async (files: File[]) => {
    if (files.length > MAX_FILES_AT_ONCE) {
      toast.error(`한 번에 최대 ${MAX_FILES_AT_ONCE}개까지 업로드할 수 있습니다.`);
      files = files.slice(0, MAX_FILES_AT_ONCE);
    }

    // 파일 유효성 검사
    const validFiles: File[] = [];
    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;

    // 업로드 상태 초기화
    const newStates: FileUploadState[] = validFiles.map((file) => ({
      file,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      progress: 0,
      status: "pending",
      previewUrl: URL.createObjectURL(file),
    }));

    setUploadStates((prev) => [...prev, ...newStates]);

    // 각 파일 업로드 처리
    const uploadPromises = newStates.map(async (state) => {
      const controller = new AbortController();
      abortControllersRef.current.set(state.id, controller);

      const updateState = (updates: Partial<FileUploadState>) => {
        setUploadStates((prev) =>
          prev.map((s) => (s.id === state.id ? { ...s, ...updates } : s))
        );
      };

      try {
        updateState({ status: "uploading", progress: 0 });

        // 1단계: Presigned URL 발급
        const { uploadUrl, publicUrl, key } = await fetchPresignedUrl(state.file);

        // 2단계: R2로 직접 PUT 업로드
        await uploadWithProgress(
          uploadUrl,
          state.file,
          state.file.type || "image/jpeg",
          (percent) => updateState({ progress: percent }),
          controller.signal
        );

        updateState({ status: "done", progress: 100, publicUrl: publicUrl ?? undefined });

        const uploadedPhoto: UploadedPhoto = {
          key,
          url: publicUrl ?? URL.createObjectURL(state.file),
          name: state.file.name,
          uploadedAt: new Date().toISOString(),
        };

        setUploadedPhotos((prev) => {
          const updated = [...prev, uploadedPhoto];
          onUploadComplete?.(updated);
          return updated;
        });

        return { success: true, id: state.id };
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "업로드 중 오류가 발생했습니다.";

        // AbortError는 사용자가 의도적으로 취소한 경우
        if (err instanceof Error && err.name === "AbortError") {
          updateState({ status: "error", errorMessage: "취소됨" });
          return { success: false, id: state.id };
        }

        updateState({ status: "error", errorMessage: message });
        toast.error(`${state.file.name} 업로드 실패: ${message}`);
        return { success: false, id: state.id };
      } finally {
        abortControllersRef.current.delete(state.id);
      }
    });

    const results = await Promise.allSettled(uploadPromises);
    const successCount = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;

    if (successCount > 0) {
      toast.success(
        `${successCount}개 사진이 성공적으로 업로드되었습니다! 📸`
      );
    }
  }, [onUploadComplete]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) processFiles(files);
    // input 초기화 (같은 파일 재선택 허용)
    e.target.value = "";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (files.length > 0) processFiles(files);
    },
    [processFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const cancelUpload = (id: string) => {
    abortControllersRef.current.get(id)?.abort();
  };

  const removeFromList = (id: string) => {
    setUploadStates((prev) => {
      const state = prev.find((s) => s.id === id);
      if (state?.previewUrl) URL.revokeObjectURL(state.previewUrl);
      return prev.filter((s) => s.id !== id);
    });
  };

  const isUploading = uploadStates.some((s) => s.status === "uploading");
  const totalProgress =
    uploadStates.length > 0
      ? Math.round(
          uploadStates.reduce((sum, s) => sum + s.progress, 0) /
            uploadStates.length
        )
      : 0;

  return (
    <section className="py-10 px-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-stone-700 tracking-widest mb-1">
          하객 사진 공유
        </h2>
        <p className="text-xs text-stone-400">
          소중한 순간을 함께 나눠주세요 · 최대 50MB · JPG/PNG/WebP/HEIC
        </p>
      </div>

      {/* 드래그 앤 드롭 업로드 영역 */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-rose-400 bg-rose-50 scale-[1.01]"
            : "border-stone-200 bg-stone-50 hover:border-rose-300 hover:bg-rose-50/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="text-4xl mb-3">📸</div>
        <p className="text-stone-600 text-sm font-medium mb-1">
          사진을 드래그하거나 탭하여 선택
        </p>
        <p className="text-stone-400 text-xs">
          한 번에 최대 {MAX_FILES_AT_ONCE}개 · 파일당 최대 50MB
        </p>
      </div>

      {/* 전체 업로드 진행률 */}
      {isUploading && (
        <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-stone-600 font-medium">
              업로드 중...
            </span>
            <span className="text-sm text-rose-500 font-bold tabular-nums">
              {totalProgress}%
            </span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-300"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 개별 파일 업로드 상태 목록 */}
      {uploadStates.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadStates.map((state) => (
            <div
              key={state.id}
              className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-stone-100"
            >
              {/* 썸네일 */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100">
                {state.previewUrl && (
                  <Image
                    src={state.previewUrl}
                    alt={state.file.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                    unoptimized
                  />
                )}
              </div>

              {/* 파일 정보 + 진행률 */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-stone-600 font-medium truncate">
                  {state.file.name}
                </p>
                <p className="text-xs text-stone-400 mb-1">
                  {(state.file.size / 1024 / 1024).toFixed(1)} MB
                </p>
                {state.status === "uploading" && (
                  <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-200"
                      style={{ width: `${state.progress}%` }}
                    />
                  </div>
                )}
                {state.status === "error" && (
                  <p className="text-xs text-red-500">{state.errorMessage}</p>
                )}
              </div>

              {/* 상태 아이콘 */}
              <div className="flex-shrink-0">
                {state.status === "pending" && (
                  <span className="text-stone-300 text-lg">⏳</span>
                )}
                {state.status === "uploading" && (
                  <button
                    onClick={() => cancelUpload(state.id)}
                    className="text-stone-400 hover:text-red-400 text-xs px-2 py-1 rounded-md border border-stone-200 transition-colors"
                  >
                    취소
                  </button>
                )}
                {state.status === "done" && (
                  <span className="text-green-500 text-lg">✓</span>
                )}
                {state.status === "error" && (
                  <button
                    onClick={() => removeFromList(state.id)}
                    className="text-stone-400 hover:text-red-400 text-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 업로드 완료된 사진 갤러리 */}
      {uploadedPhotos.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-stone-600 mb-3">
            업로드된 사진 ({uploadedPhotos.length}장)
          </h3>
          <div className="grid grid-cols-3 gap-1.5">
            {uploadedPhotos.map((photo) => (
              <div
                key={photo.key}
                className="relative aspect-square rounded-lg overflow-hidden bg-stone-100"
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
