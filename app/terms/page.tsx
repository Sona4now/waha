import type { Metadata } from "next";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import { SITE_NAME, SITE_URL } from "@/lib/siteMeta";
import { getServerTranslations } from "@/lib/i18n.server";

export const metadata: Metadata = {
  title: `شروط الاستخدام — ${SITE_NAME}`,
  description: "شروط استخدام منصة واحة وحدود مسؤولية المحتوى والمعلومات.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default async function TermsPage() {
  const { locale, t } = await getServerTranslations();
  const isEn = locale === "en";

  return (
    <SiteLayout>
      <PageHero
        title={isEn ? "Terms of Use" : "شروط الاستخدام"}
        subtitle={
          isEn
            ? "Rules for using the platform and content"
            : "قواعد التعامل مع المنصة والمحتوى"
        }
        breadcrumb={[
          { label: t("nav.home"), href: "/home" },
          { label: isEn ? "Terms of Use" : "شروط الاستخدام" },
        ]}
      />

      <section
        className="py-16 px-4 bg-[#f5f8fa] dark:bg-[#0a151f]"
        dir={isEn ? "ltr" : "rtl"}
      >
        <article className="max-w-3xl mx-auto space-y-8 text-[#12394d] dark:text-white/80">
          <p className="text-sm text-[#7b7c7d] dark:text-white/40">
            {isEn ? "Last updated: April 2026" : "آخر تحديث: أبريل 2026"}
          </p>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              {isEn ? "1. Nature of the platform" : "1. طبيعة المنصة"}
            </h2>
            <p className="leading-relaxed">
              {isEn
                ? "Waha is an awareness content platform only — not a travel agency, not a medical centre. All content is for health and environmental awareness, and is not a substitute for professional medical advice."
                : "واحة منصة محتوى توعوي فقط — مش وكالة سياحة، ومش مركز طبي. كل المحتوى بغرض التوعية الصحية والبيئية، ومش بديل عن الاستشارة الطبية المتخصصة."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              {isEn
                ? "2. Medical and health content"
                : "2. المحتوى الطبي والصحي"}
            </h2>
            <ul
              className={`list-disc ${isEn ? "pl-6" : "pr-6"} space-y-2 leading-relaxed`}
            >
              <li>
                {isEn
                  ? "Health information on this site is "
                  : "المعلومات الصحية في الموقع "}
                <strong>
                  {isEn ? "not a medical diagnosis" : "ليست تشخيصاً طبياً"}
                </strong>
                .
              </li>
              <li>
                {isEn
                  ? "Before any therapeutic trip, you must consult a specialist physician — especially if you have chronic conditions."
                  : "قبل أي رحلة علاجية، لازم تستشير طبيب متخصص خاصة لو عندك أمراض مزمنة."}
              </li>
              <li>
                {isEn
                  ? "The AI assistant uses artificial intelligence — its answers are guidance only, not a substitute for medical advice."
                  : "المساعد الذكي بيستخدم الذكاء الاصطناعي — إجاباته استرشادية ومش بديل عن الرأي الطبي."}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              {isEn ? "3. Acceptable use" : "3. الاستخدام المقبول"}
            </h2>
            <ul
              className={`list-disc ${isEn ? "pl-6" : "pr-6"} space-y-2 leading-relaxed`}
            >
              <li>
                {isEn
                  ? "Automated tools (bots/scrapers) are forbidden without permission."
                  : "ممنوع استخدام أدوات آلية (bots/scrapers) بدون إذن."}
              </li>
              <li>
                {isEn
                  ? "Attempts to breach the system or exceed usage limits are forbidden."
                  : "ممنوع محاولة اختراق النظام أو تجاوز حدود الاستخدام."}
              </li>
              <li>
                {isEn
                  ? "Content is protected by intellectual-property rights — sharing is allowed with attribution to the source."
                  : "المحتوى محمي بحقوق الملكية الفكرية — ممكن المشاركة مع الإشارة للمصدر."}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              {isEn ? "4. Limits of liability" : "4. حدود المسؤولية"}
            </h2>
            <p className="leading-relaxed">
              {isEn
                ? "Waha is not responsible for any harm resulting from using this information outside the awareness context. Any travel or treatment decision is taken at your personal responsibility after consulting a physician."
                : "واحة مش مسؤولة عن أي ضرر ينتج عن استخدام المعلومات خارج السياق التوعوي. أي قرار سفر أو علاج بيتخذ على مسؤوليتك الشخصية بعد استشارة طبيب."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              {isEn ? "5. Contact" : "5. التواصل"}
            </h2>
            <p className="leading-relaxed">
              {isEn ? "For any inquiry: " : "لأي استفسار: "}
              <a
                href="mailto:info@wahaeg.com"
                className="text-[#1d5770] dark:text-[#91b149] underline"
              >
                info@wahaeg.com
              </a>
            </p>
          </section>
        </article>
      </section>
    </SiteLayout>
  );
}
