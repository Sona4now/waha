import Link from "next/link";

interface Props {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export default function PageHero({ title, subtitle, breadcrumb }: Props) {
  return (
    <section className="pt-[calc(72px+52px)] pb-14 bg-gradient-to-br from-[#12394d] via-[#1a6b8a] to-[#1f8a6e] text-white text-center">
      <div className="max-w-[1280px] mx-auto px-6">
        {breadcrumb && (
          <div className="inline-flex items-center gap-2 text-[0.82rem] text-white/55 bg-white/10 px-3.5 py-1.5 rounded-full mb-4">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="opacity-40 text-[0.7rem]">›</span>}
                {b.href ? (
                  <Link
                    href={b.href}
                    className="text-white/65 hover:text-white transition-colors no-underline"
                  >
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-white/80">{b.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 font-display">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/75 text-[1.08rem] max-w-[560px] mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
