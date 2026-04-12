import { NextResponse } from "next/server";

const PASSWORD = process.env.SITE_PASSWORD!;

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body;

  if (password === PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("waaha_auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    return response;
  }

  return NextResponse.json(
    { success: false, error: "كلمة المرور غير صحيحة" },
    { status: 401 }
  );
}
