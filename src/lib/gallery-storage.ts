import "server-only";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2";
import type { GalleryPhoto } from "@/types";

const GALLERY_PREFIX = "gallery/";
const MANIFEST_KEY = `${GALLERY_PREFIX}_manifest.json`;

interface GalleryManifest {
  order: string[];
  coverKey: string | null;
  names: Record<string, string>;
}

function assertStorageConfigured() {
  if (!R2_BUCKET_NAME) {
    throw new Error("R2_BUCKET_NAME 환경 변수가 설정되지 않았습니다.");
  }
}

function emptyManifest(): GalleryManifest {
  return { order: [], coverKey: null, names: {} };
}

export function isGalleryKey(key: string) {
  return key.startsWith(GALLERY_PREFIX) && key !== MANIFEST_KEY;
}

export async function readGalleryManifest(): Promise<GalleryManifest> {
  assertStorageConfigured();

  try {
    const result = await r2Client.send(
      new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: MANIFEST_KEY })
    );
    const raw = await result.Body?.transformToString();
    if (!raw) return emptyManifest();

    const parsed = JSON.parse(raw) as Partial<GalleryManifest>;
    return {
      order: Array.isArray(parsed.order) ? parsed.order.filter(isGalleryKey) : [],
      coverKey:
        typeof parsed.coverKey === "string" && isGalleryKey(parsed.coverKey)
          ? parsed.coverKey
          : null,
      names:
        parsed.names && typeof parsed.names === "object" ? parsed.names : {},
    };
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    if (name === "NoSuchKey" || name === "NotFound") return emptyManifest();
    throw error;
  }
}

export async function writeGalleryManifest(manifest: GalleryManifest) {
  assertStorageConfigured();
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: MANIFEST_KEY,
      Body: JSON.stringify(manifest),
      ContentType: "application/json; charset=utf-8",
      CacheControl: "no-store",
    })
  );
}

export async function listGalleryPhotos(): Promise<GalleryPhoto[]> {
  assertStorageConfigured();

  const [objectsResult, manifest] = await Promise.all([
    r2Client.send(
      new ListObjectsV2Command({ Bucket: R2_BUCKET_NAME, Prefix: GALLERY_PREFIX })
    ),
    readGalleryManifest(),
  ]);

  const objects = (objectsResult.Contents ?? [])
    .filter((object) => object.Key && isGalleryKey(object.Key))
    .sort(
      (a, b) =>
        (a.LastModified?.getTime() ?? 0) - (b.LastModified?.getTime() ?? 0)
    );
  const objectMap = new Map(objects.map((object) => [object.Key!, object]));
  const orderedKeys = [
    ...manifest.order.filter((key) => objectMap.has(key)),
    ...objects
      .map((object) => object.Key!)
      .filter((key) => !manifest.order.includes(key)),
  ];

  return orderedKeys.map((key) => {
    const object = objectMap.get(key)!;
    return {
      key,
      url: `/api/gallery/image?key=${encodeURIComponent(key)}`,
      name: manifest.names[key] || "웨딩 사진",
      uploadedAt: object.LastModified?.toISOString() ?? new Date(0).toISOString(),
      size: object.Size ?? 0,
      isCover: manifest.coverKey === key,
    };
  });
}

export async function registerGalleryPhoto(key: string, name: string) {
  if (!isGalleryKey(key)) throw new Error("올바르지 않은 사진 키입니다.");
  assertStorageConfigured();

  await r2Client.send(
    new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key })
  );
  const manifest = await readGalleryManifest();
  if (!manifest.order.includes(key)) manifest.order.push(key);
  manifest.names[key] = name.trim() || "웨딩 사진";
  if (!manifest.coverKey) manifest.coverKey = key;
  await writeGalleryManifest(manifest);
}

export async function reorderGalleryPhotos(keys: string[]) {
  const photos = await listGalleryPhotos();
  const existingKeys = photos.map((photo) => photo.key);
  const isSameSet =
    keys.length === existingKeys.length &&
    keys.every((key) => isGalleryKey(key) && existingKeys.includes(key));
  if (!isSameSet) throw new Error("사진 목록이 변경되었습니다. 새로고침 후 다시 시도해 주세요.");

  const manifest = await readGalleryManifest();
  manifest.order = keys;
  await writeGalleryManifest(manifest);
}

export async function setGalleryCover(key: string) {
  if (!isGalleryKey(key)) throw new Error("올바르지 않은 사진 키입니다.");
  const photos = await listGalleryPhotos();
  if (!photos.some((photo) => photo.key === key)) {
    throw new Error("사진을 찾을 수 없습니다.");
  }

  const manifest = await readGalleryManifest();
  manifest.coverKey = key;
  await writeGalleryManifest(manifest);
}

export async function deleteGalleryPhoto(key: string) {
  if (!isGalleryKey(key)) throw new Error("올바르지 않은 사진 키입니다.");
  assertStorageConfigured();

  await r2Client.send(
    new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key })
  );
  const manifest = await readGalleryManifest();
  manifest.order = manifest.order.filter((item) => item !== key);
  delete manifest.names[key];
  if (manifest.coverKey === key) manifest.coverKey = manifest.order[0] ?? null;
  await writeGalleryManifest(manifest);
}
