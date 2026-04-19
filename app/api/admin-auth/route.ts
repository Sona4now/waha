import { NextResponse } from "next/server";
import { rateLimit, getClientId } from "@/lib/rateLimit";
import { safeCompare, authError } from "@/lib/security";
import { logger } from "@/lib/logger";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

// Admin is stricter — 5 attempts / 15 min.
const ADMIN_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 };

export async function POST(request: Request) {
  const rl = rateLimit(`admin:${getClientId(request)}`, ADMIN_LIMIT);
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

  if (!ADMIN_PASSWORD) {
    logger.error("admin-auth", "ADMIN_PASSWORD env var missing");
    return authError("خطأ في إعدادات السيرفر", 500);
  }

  if (safeCompare(password, ADMIN_PASSWORD)) {
    return NextResponse.json({ success: true });
  }

  return authError("كلمة المرور غير صحيحة", 401);
}
