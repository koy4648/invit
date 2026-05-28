import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const adminPassword = process.env.ADMIN_PASSWORD || "1234";

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
    const { password } = body;

    // 비밀번호 검증
    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // RSVP 통계
    const { data: rsvpData, error: rsvpError } = await supabase
      .from("rsvp")
      .select("*");

    if (rsvpError) {
      throw rsvpError;
    }

    // 방명록 통계
    const { data: guestbookData, error: guestbookError } = await supabase
      .from("guestbook")
      .select("*");

    if (guestbookError) {
      throw guestbookError;
    }

    // 통계 계산
    const stats = {
      rsvp: {
        total: rsvpData?.length || 0,
        attend: rsvpData?.filter((r) => r.attendance === "attend").length || 0,
        absent: rsvpData?.filter((r) => r.attendance === "absent").length || 0,
        totalGuests:
          rsvpData?.reduce((sum, r) => sum + (r.guest_count || 1), 0) || 0,
        mealYes:
          rsvpData?.filter((r) => r.meal_preference === "yes").length || 0,
        mealNo:
          rsvpData?.filter((r) => r.meal_preference === "no").length || 0,
      },
      guestbook: {
        total: guestbookData?.length || 0,
      },
    };

    return NextResponse.json(
      {
        stats,
        rsvpList: rsvpData || [],
        guestbookList: guestbookData || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
