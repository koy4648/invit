import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";
import { v4 as uuidv4 } from "uuid";

// 허용된 MIME 타입 목록
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

// 최대 파일 크기: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Presigned URL 유효 시간: 10분
const URL_EXPIRY_SECONDS = 600;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, contentType, fileSize } = body as {
      fileName: string;
      contentType: string;
      fileSize: number;
    };

    // 입력값 검증
    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "fileName과 contentType은 필수입니다." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(contentType)) {
      return NextResponse.json(
        {
          error: `지원하지 않는 파일 형식입니다. 허용 형식: ${ALLOWED_MIME_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `파일 크기는 ${MAX_FILE_SIZE / 1024 / 1024}MB를 초과할 수 없습니다.` },
        { status: 400 }
      );
    }

    if (!R2_BUCKET_NAME) {
      console.error("R2_BUCKET_NAME 환경 변수가 설정되지 않았습니다.");
      return NextResponse.json(
        { error: "스토리지 설정 오류입니다. 관리자에게 문의해 주세요." },
        { status: 500 }
      );
    }

    // 고유 키 생성: guests/{uuid}/{원본파일명}
    const fileExtension = fileName.split(".").pop() ?? "jpg";
    const uniqueKey = `guests/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: contentType,
      // 메타데이터: 원본 파일명 보존
      Metadata: {
        "original-name": encodeURIComponent(fileName),
        "uploaded-at": new Date().toISOString(),
      },
    });

    const uploadUrl = await getSignedUrl(r2Client, command, {
      expiresIn: URL_EXPIRY_SECONDS,
    });

    const publicUrl = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL.replace(/\/$/, "")}/${uniqueKey}`
      : null;

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      key: uniqueKey,
    });
  } catch (err: unknown) {
    console.error("Presigned URL 발급 오류:", err);
    const message =
      err instanceof Error ? err.message : "알 수 없는 서버 오류";
    return NextResponse.json(
      { error: `Presigned URL 발급 실패: ${message}` },
      { status: 500 }
    );
  }
}
