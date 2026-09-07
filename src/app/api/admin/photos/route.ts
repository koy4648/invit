import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  deleteGalleryPhoto,
  listGalleryPhotos,
  registerGalleryPhoto,
  reorderGalleryPhotos,
  setGalleryCover,
} from "@/lib/gallery-storage";
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2";

const adminPassword = process.env.ADMIN_PASSWORD || "1234";
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const CONTENT_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type AdminPhotoRequest = {
  action?: "list" | "upload-url" | "complete" | "delete" | "reorder" | "set-cover";
  password?: string;
  fileName?: string;
  contentType?: string;
  fileSize?: number;
  key?: string;
  keys?: string[];
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AdminPhotoRequest;
    if (body.password !== adminPassword) {
      return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
    }

    switch (body.action) {
      case "list": {
        return NextResponse.json({ photos: await listGalleryPhotos() });
      }
      case "upload-url": {
        const { fileName = "", contentType = "", fileSize = 0 } = body;
        const extension = CONTENT_TYPES[contentType];
        if (!fileName || !extension) {
          return NextResponse.json(
            { error: "JPG, PNG, WebP 사진만 업로드할 수 있습니다." },
            { status: 400 }
          );
        }
        if (fileSize <= 0 || fileSize > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: "사진 한 장의 크기는 20MB 이하여야 합니다." },
            { status: 400 }
          );
        }
        if (!R2_BUCKET_NAME) {
          return NextResponse.json({ error: "사진 저장소 설정이 필요합니다." }, { status: 503 });
        }

        const key = `gallery/${Date.now()}-${uuidv4()}.${extension}`;
        const uploadUrl = await getSignedUrl(
          r2Client,
          new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
            Metadata: { "original-name": encodeURIComponent(fileName) },
          }),
          { expiresIn: 600 }
        );
        return NextResponse.json({ uploadUrl, key });
      }
      case "complete": {
        await registerGalleryPhoto(body.key ?? "", body.fileName ?? "");
        return NextResponse.json({ photos: await listGalleryPhotos() });
      }
      case "delete": {
        await deleteGalleryPhoto(body.key ?? "");
        return NextResponse.json({ photos: await listGalleryPhotos() });
      }
      case "reorder": {
        await reorderGalleryPhotos(body.keys ?? []);
        return NextResponse.json({ photos: await listGalleryPhotos() });
      }
      case "set-cover": {
        await setGalleryCover(body.key ?? "");
        return NextResponse.json({ photos: await listGalleryPhotos() });
      }
      default:
        return NextResponse.json({ error: "올바르지 않은 요청입니다." }, { status: 400 });
    }
  } catch (error) {
    console.error("사진 관리 오류:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "사진 관리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
