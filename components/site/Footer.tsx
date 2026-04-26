import Link from "next/link";
// NewsletterForm has its own `"use client"` directive — importing it
// directly from this server component is fine; the React runtime knows to
// hydrate just that subtree on the client. (We can't use dynamic with
// ssr:false here — that pattern is only valid inside client components.)
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-[#0d2a39] text-white pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="text-[1.7rem] font-black leading-none font-display mb-3.5">
              <span className="text-white">وا</span>
              <span className="text-[#1d5770]">حة</span>
            </div>
            <p className="text-[0.88rem] text-white/60 leading-relaxed max-w-[290px]">
              منصة متخصصة في السياحة الاستشفائية في مصر. نساعدك على اكتشاف
              الوجهة الطبيعية المثالية لصحتك وراحتك.
            </p>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-[0.9rem] font-bold mb-4">الصفحات</h4>
            <div className="flex flex-col gap-2">
              {[
                { href: "/home", label: "الرئيسية" },
                { href: "/destinations", label: "الأماكن" },
                { href: "/map", label: "الخريطة" },
                { href: "/ai-guide", label: "المساعد" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[0.88rem] text-white/60 hover:text-[#1d5770] transition-colors no-underline"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-[0.9rem] font-bold mb-4">المعلومات</h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/about"
                className="text-[0.88rem] text-white/60 hover:text-[#1d5770] transition-colors no-underline"
              >
                من نحن
              </Link>
              <Link
                href="/blog"
                className="text-[0.88rem] text-white/60 hover:text-[#1d5770] transition-colors no-underline"
              >
                المدونة
              </Link>
              <Link
                href="/team"
                className="text-[0.88rem] text-white/60 hover:text-[#1d5770] transition-colors no-underline"
              >
                الفريق
              </Link>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-[0.9rem] font-bold mb-4">الوجهات</h4>
            <div className="flex flex-col gap-2">
              {[
                { id: "safaga", name: "سفاجا" },
                { id: "siwa", name: "سيوة" },
                { id: "sinai", name: "سيناء" },
                { id: "fayoum", name: "الفيوم" },
                { id: "bahariya", name: "الواحات البحرية" },
                { id: "wadi-degla", name: "وادي دجلة" },
                { id: "shagie-farms", name: "مزارع شجيع" },
              ].map((d) => (
                <Link
                  key={d.id}
                  href={`/destination/${d.id}`}
                  className="text-[0.88rem] text-white/60 hover:text-[#1d5770] transition-colors no-underline"
                >
                  {d.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter — last block before the legal footer. Centered on mobile,
            spans full width inside the constrained container. */}
        <div className="mb-10 max-w-md mx-auto sm:mx-0">
          <NewsletterForm />
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <p className="text-white/30 text-[0.82rem]">
            © 2026 واحة — WAHA · السياحة البيئية والاستشفاء من الطبيعة
          </p>
          <div className="flex items-center gap-4 text-[0.75rem] text-white/30">
            <Link
              href="/privacy"
              className="hover:text-white/60 no-underline transition-colors"
            >
              سياسة الخصوصية
            </Link>
            <span className="text-white/10">·</span>
            <Link
              href="/terms"
              className="hover:text-white/60 no-underline transition-colors"
            >
              الشروط
            </Link>
          </div>
          <p className="text-white/20 text-[0.75rem]">
            شفاؤك من الطبيعة 🌿
          </p>
        </div>
      </div>
    </footer>
  );
}
