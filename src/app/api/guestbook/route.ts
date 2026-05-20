import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 서버 사이드 Supabase 클라이언트 (Service Role Key 사용 가능)
function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase 환경 변수가 설정되지 않았습니다.");
  }

  return createClient(url, key);
}

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("guestbook")
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ entries: data ?? [] });
  } catch (err: unknown) {
    console.error("방명록 조회 오류:", err);
    const message = err instanceof Error ? err.message : "서버 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, password, message } = body as {
      name: string;
      password: string;
      message: string;
    };

    // 서버 사이드 입력값 검증
    if (!name?.trim() || name.trim().length > 20) {
      return NextResponse.json(
        { error: "이름은 1~20자 사이여야 합니다." },
        { status: 400 }
      );
    }
    if (!password?.trim() || password.trim().length < 4) {
      return NextResponse.json(
        { error: "비밀번호는 4자 이상이어야 합니다." },
        { status: 400 }
      );
    }
    if (!message?.trim() || message.trim().length > 200) {
      return NextResponse.json(
        { error: "메시지는 1~200자 사이여야 합니다." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase.from("guestbook").insert({
      name: name.trim(),
      password: password.trim(),
      message: message.trim(),
    });

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: unknown) {
    console.error("방명록 등록 오류:", err);
    const message = err instanceof Error ? err.message : "서버 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
