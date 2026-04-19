import { NextResponse } from "next/server";
import { rateLimit, getClientId } from "@/lib/rateLimit";
import { safeCompare, authError } from "@/lib/security";
import { logger } from "@/lib/logger";

// Fallback kept for dev only; production MUST set TEAM_PASSWORD.
const TEAM_PASSWORD = process.env.TEAM_PASSWORD || "";

const TEAM_LIMIT = { limit: 10, windowMs: 15 * 60 * 1000 };

export async function POST(request: Request) {
  const rl = rateLimit(`team:${getClientId(request)}`, TEAM_LIMIT);
  if (!rl.success) {
    return authError("محاولات كتير. جرب بعد شوية.", 429, {
      "Retry-After": String(rl.retryAfter ?? 60),
    });
  }

  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return authError("الطلب غير صالح", 400);
  }

  if (!TEAM_PASSWORD) {
    logger.error("team-auth", "TEAM_PASSWORD env var missing");
    return authError("خطأ في إعدادات السيرفر", 500);
  }

  if (safeCompare(password, TEAM_PASSWORD)) {
    return NextResponse.json({ success: true });
  }

  return authError("كلمة المرور غير صحيحة", 401);
}
