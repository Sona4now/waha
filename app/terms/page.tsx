import type { Metadata } from "next";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import { SITE_NAME, SITE_URL } from "@/lib/siteMeta";

export const metadata: Metadata = {
  title: `شروط الاستخدام — ${SITE_NAME}`,
  description: "شروط استخدام منصة واحة وحدود مسؤولية المحتوى والمعلومات.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <SiteLayout>
      <PageHero
        title="شروط الاستخدام"
        subtitle="قواعد التعامل مع المنصة والمحتوى"
        breadcrumb={[
          { label: "الرئيسية", href: "/home" },
          { label: "شروط الاستخدام" },
        ]}
      />

      <section
        className="py-16 px-4 bg-[#f5f8fa] dark:bg-[#0a151f]"
        dir="rtl"
      >
        <article className="max-w-3xl mx-auto space-y-8 text-[#12394d] dark:text-white/80">
          <p className="text-sm text-[#7b7c7d] dark:text-white/40">
            آخر تحديث: أبريل 2026
          </p>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              1. طبيعة المنصة
            </h2>
            <p className="leading-relaxed">
              واحة منصة محتوى توعوي فقط — مش وكالة سياحة، ومش مركز طبي.
              كل المحتوى بغرض التوعية الصحية والبيئية، ومش بديل عن
              الاستشارة الطبية المتخصصة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              2. المحتوى الطبي والصحي
            </h2>
            <ul className="list-disc pr-6 space-y-2 leading-relaxed">
              <li>المعلومات الصحية في الموقع <strong>ليست تشخيصاً طبياً</strong>.</li>
              <li>
                قبل أي رحلة علاجية، لازم تستشير طبيب متخصص خاصة لو عندك
                أمراض مزمنة.
              </li>
              <li>
                المساعد الذكي بيستخدم الذكاء الاصطناعي — إجاباته استرشادية
                ومش بديل عن الرأي الطبي.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              3. الاستخدام المقبول
            </h2>
            <ul className="list-disc pr-6 space-y-2 leading-relaxed">
              <li>ممنوع استخدام أدوات آلية (bots/scrapers) بدون إذن.</li>
              <li>ممنوع محاولة اختراق النظام أو تجاوز حدود الاستخدام.</li>
              <li>
                المحتوى محمي بحقوق الملكية الفكرية — ممكن المشاركة مع
                الإشارة للمصدر.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              4. حدود المسؤولية
            </h2>
            <p className="leading-relaxed">
              واحة مش مسؤولة عن أي ضرر ينتج عن استخدام المعلومات خارج
              السياق التوعوي. أي قرار سفر أو علاج بيتخذ على مسؤوليتك
              الشخصية بعد استشارة طبيب.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              5. التواصل
            </h2>
            <p className="leading-relaxed">
              لأي استفسار:{" "}
              <a
                href="mailto:wahhaa.2026@gmail.com"
                className="text-[#1d5770] dark:text-[#91b149] underline"
              >
                wahhaa.2026@gmail.com
              </a>
            </p>
          </section>
        </article>
      </section>
    </SiteLayout>
  );
}
