import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    const { name, attendance, guest_count, meal_preference } = body;

    // 입력값 검증
    if (!name || !attendance) {
      return NextResponse.json(
        { error: "이름과 참석 여부는 필수입니다." },
        { status: 400 }
      );
    }

    if (!["attend", "absent"].includes(attendance)) {
      return NextResponse.json(
        { error: "참석 여부는 'attend' 또는 'absent'이어야 합니다." },
        { status: 400 }
      );
    }

    // Supabase에 데이터 삽입
    const { data, error } = await supabase.from("rsvp").insert([
      {
        name,
        attendance,
        guest_count: guest_count || 1,
        meal_preference: meal_preference || null,
      },
    ]);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "RSVP 저장에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "RSVP가 성공적으로 저장되었습니다.", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("rsvp").select("*");

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "RSVP 데이터 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
