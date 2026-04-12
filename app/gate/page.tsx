"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function GatePage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "كلمة المرور غير صحيحة");
      }
    } catch {
      setError("حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#070d15]"
      dir="rtl"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#070d15] via-[#070d15]/80 to-[#070d15]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="واحة — شعار المنصة"
            width={80}
            height={80}
            className="rounded-full bg-white/90 p-1"
          />

          <div>
            <h1
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "Reem Kufi, Cairo, sans-serif" }}
            >
              واحة
            </h1>
            <p className="text-white/40 text-sm">
              الموقع محمي بكلمة مرور
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="w-full px-5 py-4 bg-white/[0.06] border border-white/15 rounded-xl text-white text-center placeholder:text-white/25 focus:outline-none focus:border-[#91b149]/50 focus:bg-white/[0.08] transition-all duration-300"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm animate-pulse">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-4 bg-[#91b149] hover:bg-[#a3c45a] disabled:opacity-40 disabled:hover:bg-[#91b149] text-[#0a0f14] font-bold text-sm rounded-xl transition-all duration-300"
            >
              {loading ? "جاري التحقق..." : "دخول"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
