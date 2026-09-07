import { NextResponse } from "next/server";
import { listGalleryPhotos } from "@/lib/gallery-storage";

export async function GET() {
  try {
    const photos = await listGalleryPhotos();
    return NextResponse.json(
      { photos },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("갤러리 조회 오류:", error);
    return NextResponse.json(
      { error: "갤러리를 불러오지 못했습니다." },
      { status: 503 }
    );
  }
}
