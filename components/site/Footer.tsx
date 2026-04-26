import Link from "next/link";
// NewsletterForm has its own `"use client"` directive — importing it
// directly from this server component is fine; the React runtime knows to
// hydrate just that subtree on the client. (We can't use dynamic with
// ssr:false here — that pattern is only valid inside client components.)
import NewsletterForm from "./NewsletterForm";
import SocialBar from "./SocialBar";
import { getServerTranslations } from "@/lib/i18n.server";
import { DESTINATIONS } from "@/data/siteData";

export default async function Footer() {
  const { t, locale } = await getServerTranslations();

  // Destination link labels: prefer the English short name when available
  // (already curated in data/siteData.ts as `nameEn`) so the EN footer
  // doesn't show Arabic-only names. Falls back to the Arabic name if no
  // English exists.
  const destLinks = DESTINATIONS.map((d) => ({
    id: d.id,
    label: locale === "en" && d.nameEn ? d.nameEn : d.name,
  }));

  return (
    <footer className="bg-[#0d2a39] text-white pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="text-[1.7rem] font-black leading-none font-display mb-3.5">
              {locale === "en" ? (
                <span className="text-white">WAHA</span>
              ) : (
                <>
                  <span className="text-white">وا</span>
                  <span className="text-[#1d5770]">حة</span>
                </>
              )}
            </div>
            <p className="text-[0.88rem] text-white/60 leading-relaxed max-w-[290px] mb-5">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[0.7rem] uppercase tracking-widest text-white/50 font-bold">
                {t("footer.followUs")}
              </span>
              <SocialBar size="md" variant="white" />
            </div>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-[0.9rem] font-bold mb-4">
              {t("footer.pages")}
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { href: "/home", key: "nav.home" },
                { href: "/destinations", key: "nav.destinations" },
                { href: "/map", key: "nav.map" },
                { href: "/ai-guide", key: "common.exploreMore" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[0.88rem] text-white/60 hover:text-[#1d5770] transition-colors no-underline"
                >
                  {t(l.key)}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-[0.9rem] font-bold mb-4">
              {t("footer.info")}
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/about"
                className="text-[0.88rem] text-white/60 hover:text-[#1d5770] transition-colors no-underline"
              >
                {t("nav.about")}
              </Link>
              <Link
                href="/blog"
                className="text-[0.88rem] text-white/60 hover:text-[#1d5770] transition-colors no-underline"
              >
                {t("nav.blog")}
              </Link>
              <Link
                href="/team"
                className="text-[0.88rem] text-white/60 hover:text-[#1d5770] transition-colors no-underline"
              >
                {t("nav.team")}
              </Link>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-[0.9rem] font-bold mb-4">
              {t("footer.destinations")}
            </h4>
            <div className="flex flex-col gap-2">
              {destLinks.map((d) => (
                <Link
                  key={d.id}
                  href={`/destination/${d.id}`}
                  className="text-[0.88rem] text-white/60 hover:text-[#1d5770] transition-colors no-underline"
                >
                  {d.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-10 max-w-md mx-auto sm:mx-0">
          <NewsletterForm />
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <p className="text-white/30 text-[0.82rem]">
            {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4 text-[0.75rem] text-white/30">
            <Link
              href="/privacy"
              className="hover:text-white/60 no-underline transition-colors"
            >
              {t("footer.privacy")}
            </Link>
            <span className="text-white/10">·</span>
            <Link
              href="/terms"
              className="hover:text-white/60 no-underline transition-colors"
            >
              {t("footer.terms")}
            </Link>
          </div>
          <p className="text-white/20 text-[0.75rem]">
            {t("footer.tagShort")}
          </p>
        </div>
      </div>
    </footer>
  );
}
