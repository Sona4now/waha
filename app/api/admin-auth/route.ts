import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body;

  if (password === ADMIN_PASSWORD) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { success: false, error: "كلمة المرور غير صحيحة" },
    { status: 401 },
  );
}
