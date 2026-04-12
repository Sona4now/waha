import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0a151f] text-white"
      dir="rtl"
    >
      <div className="text-center px-6 max-w-md">
        <div className="text-8xl font-display font-black text-[#91b149] mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold font-display mb-3">
          الصفحة مش موجودة
        </h1>
        <p className="text-white/50 mb-8 leading-relaxed">
          يبدو إنك ضللت الطريق. الصفحة اللي بتدور عليها مش موجودة أو اتنقلت.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/home"
            className="px-6 py-3 bg-[#91b149] hover:bg-[#a3c45a] text-[#0a0f14] font-bold rounded-full transition-all duration-300 no-underline text-sm"
          >
            الصفحة الرئيسية
          </Link>
          <Link
            href="/destinations"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 transition-all duration-300 no-underline text-sm"
          >
            استكشف الأماكن
          </Link>
        </div>
      </div>
    </div>
  );
}
