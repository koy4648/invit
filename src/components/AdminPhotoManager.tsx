"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { GalleryPhoto } from "@/types";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_FILES = 20;

interface AdminPhotoManagerProps {
  password: string;
}

async function adminRequest(
  password: string,
  body: Record<string, unknown>
): Promise<{ photos?: GalleryPhoto[]; uploadUrl?: string; key?: string; error?: string }> {
  const response = await fetch("/api/admin/photos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, ...body }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "사진 관리 요청에 실패했습니다.");
  return result;
}

export default function AdminPhotoManager({ password }: AdminPhotoManagerProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    try {
      const result = await adminRequest(password, { action: "list" });
      setPhotos(result.photos ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "사진을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [password]);

  useEffect(() => {
    let active = true;
    adminRequest(password, { action: "list" })
      .then((result) => {
        if (active) setPhotos(result.photos ?? []);
      })
      .catch((error) => {
        if (active) {
          toast.error(error instanceof Error ? error.message : "사진을 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [password]);

  const handleUpload = async (files: File[]) => {
    const selected = files.slice(0, MAX_FILES);
    if (files.length > MAX_FILES) toast.error(`한 번에 최대 ${MAX_FILES}장까지 선택할 수 있습니다.`);

    const valid = selected.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: JPG, PNG, WebP만 사용할 수 있습니다.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: 20MB를 초과합니다.`);
        return false;
      }
      return true;
    });
    if (!valid.length) return;

    try {
      for (const [index, file] of valid.entries()) {
        setUploadStatus(`${index + 1} / ${valid.length} 업로드 중`);
        const signed = await adminRequest(password, {
          action: "upload-url",
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
        });
        if (!signed.uploadUrl || !signed.key) throw new Error("업로드 주소를 받지 못했습니다.");

        const upload = await fetch(signed.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!upload.ok) throw new Error(`${file.name} 업로드에 실패했습니다.`);

        const completed = await adminRequest(password, {
          action: "complete",
          key: signed.key,
          fileName: file.name,
        });
        setPhotos(completed.photos ?? []);
      }
      toast.success(`${valid.length}장의 사진을 추가했습니다.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "사진 업로드에 실패했습니다.");
      await refresh();
    } finally {
      setUploadStatus(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const runPhotoAction = async (
    action: "delete" | "set-cover",
    key: string
  ) => {
    if (action === "delete" && !window.confirm("이 사진을 갤러리에서 삭제할까요? 삭제 후 복구할 수 없습니다.")) {
      return;
    }

    setBusyKey(key);
    try {
      const result = await adminRequest(password, { action, key });
      setPhotos(result.photos ?? []);
      toast.success(action === "delete" ? "사진을 삭제했습니다." : "대표 사진으로 설정했습니다.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "요청에 실패했습니다.");
    } finally {
      setBusyKey(null);
    }
  };

  const movePhoto = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;

    const reordered = [...photos];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setPhotos(reordered);
    setBusyKey(reordered[target].key);
    try {
      const result = await adminRequest(password, {
        action: "reorder",
        keys: reordered.map((photo) => photo.key),
      });
      setPhotos(result.photos ?? reordered);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "순서를 저장하지 못했습니다.");
      await refresh();
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium" style={{ color: "#44403c" }}>
            웨딩 사진 관리
          </h2>
          <p className="mt-1 text-sm leading-6" style={{ color: "#78716c" }}>
            대표 사진은 첫 화면에, 전체 사진은 갤러리에 표시됩니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={Boolean(uploadStatus)}
          className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #cbb8e3, #80639c)" }}
        >
          <ImagePlus size={17} />
          {uploadStatus ?? "사진 추가"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(event) => handleUpload(Array.from(event.target.files ?? []))}
        />
      </div>

      <div
        className="rounded-2xl px-4 py-3 text-sm"
        style={{ background: "rgba(205,188,229,0.1)", color: "#78716c" }}
      >
        JPG · PNG · WebP / 한 장당 20MB 이하 / 최대 20장씩 업로드
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-sm" style={{ color: "#a8a29e" }}>
          사진을 불러오는 중입니다.
        </p>
      ) : photos.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-2xl border border-dashed px-6 py-14 text-center"
          style={{ borderColor: "rgba(205,188,229,0.4)", color: "#a8a29e" }}
        >
          아직 등록된 사진이 없습니다.<br />스냅 사진이 준비되면 여기에 추가하세요.
        </button>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {photos.map((photo, index) => (
            <article
              key={photo.key}
              className="overflow-hidden rounded-2xl bg-white"
              style={{ border: "1px solid rgba(205,188,229,0.2)" }}
            >
              <div className="relative aspect-[4/3] bg-stone-100">
                {/* 저장소 주소가 달라도 표시할 수 있도록 동일 출처 이미지 API를 사용합니다. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.name} className="h-full w-full object-cover" />
                {photo.isCover && (
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs" style={{ color: "#80639c" }}>
                    <Star size={13} fill="currentColor" /> 대표 사진
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium" style={{ color: "#44403c" }}>
                  {photo.name}
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => runPhotoAction("set-cover", photo.key)}
                    disabled={photo.isCover || busyKey === photo.key}
                    className="mr-auto rounded-lg px-2.5 py-2 text-xs disabled:opacity-40"
                    style={{ background: "#f8f3eb", color: "#9a7337" }}
                  >
                    대표로 설정
                  </button>
                  <button type="button" onClick={() => movePhoto(index, -1)} disabled={index === 0 || Boolean(busyKey)} className="rounded-lg p-2 disabled:opacity-30" aria-label="앞으로 이동">
                    <ArrowUp size={16} />
                  </button>
                  <button type="button" onClick={() => movePhoto(index, 1)} disabled={index === photos.length - 1 || Boolean(busyKey)} className="rounded-lg p-2 disabled:opacity-30" aria-label="뒤로 이동">
                    <ArrowDown size={16} />
                  </button>
                  <button type="button" onClick={() => runPhotoAction("delete", photo.key)} disabled={Boolean(busyKey)} className="rounded-lg p-2 text-red-500 disabled:opacity-30" aria-label="사진 삭제">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
