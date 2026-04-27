import type { Metadata } from "next";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import { SITE_NAME, SITE_URL } from "@/lib/siteMeta";
import { getServerTranslations } from "@/lib/i18n.server";

export const metadata: Metadata = {
  title: `سياسة الخصوصية — ${SITE_NAME}`,
  description:
    "كيف تجمع منصة واحة البيانات، وما الذي تفعله بها، وكيف يحمي الموقع خصوصيتك.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default async function PrivacyPage() {
  const { locale, t } = await getServerTranslations();
  const isEn = locale === "en";

  return (
    <SiteLayout>
      <PageHero
        title={isEn ? "Privacy Policy" : "سياسة الخصوصية"}
        subtitle={
          isEn
            ? "How we collect data and what we do with it"
            : "كيف نجمع البيانات، وماذا نفعل بها"
        }
        breadcrumb={[
          { label: t("nav.home"), href: "/home" },
          { label: isEn ? "Privacy Policy" : "سياسة الخصوصية" },
        ]}
      />

      <section
        className="py-16 px-4 bg-[#f5f8fa] dark:bg-[#0a151f]"
        dir={isEn ? "ltr" : "rtl"}
      >
        <article className="max-w-3xl mx-auto prose-like space-y-8 text-[#12394d] dark:text-white/80">
          <p className="text-sm text-[#7b7c7d] dark:text-white/40">
            {isEn ? "Last updated: April 2026" : "آخر تحديث: أبريل 2026"}
          </p>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              {isEn ? "1. Who we are" : "1. من نحن"}
            </h2>
            <p className="leading-relaxed">
              {isEn
                ? "Waha (WAHA) is a digital content platform raising awareness about sustainable ecotourism and natural healing in Egypt. We are not a travel agency, we don't sell trips, and we don't collect medical data."
                : "واحة (WAHA) منصة محتوى رقمية للتوعية بالسياحة البيئية المستدامة والاستشفاء من الطبيعة في مصر. إحنا مش وكالة سياحة، ومش بنبيع رحلات، ومش بنجمع بيانات طبية."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              {isEn ? "2. Data we collect" : "2. البيانات اللي بنجمعها"}
            </h2>
            <ul
              className={`list-disc ${isEn ? "pl-6" : "pr-6"} space-y-2 leading-relaxed`}
            >
              <li>
                <strong>
                  {isEn
                    ? "Automatic technical data:"
                    : "بيانات تقنية تلقائية:"}
                </strong>{" "}
                {isEn
                  ? "IP address, browser type, operating system — to protect the site from attacks and monitor performance."
                  : "عنوان IP، نوع المتصفح، نظام التشغيل — لحماية الموقع من الهجمات ومتابعة الأداء."}
              </li>
              <li>
                <strong>
                  {isEn ? "Vercel Analytics:" : "تحليلات Vercel:"}
                </strong>{" "}
                {isEn
                  ? "We use Vercel Analytics to measure visits (without tracking individuals)."
                  : "بنستخدم Vercel Analytics لقياس الزيارات (بدون تتبع أفراد)."}
              </li>
              <li>
                <strong>
                  {isEn
                    ? "Local storage (localStorage):"
                    : "تخزين محلي (localStorage):"}
                </strong>{" "}
                {isEn
                  ? "Your preferences such as favourites, comparisons, and dark mode — saved on your device only and never sent to any server."
                  : "تفضيلاتك زي المفضلات والمقارنات والوضع الليلي — محفوظة على جهازك فقط ومابتتبعتش لأي سيرفر."}
              </li>
              <li>
                <strong>
                  {isEn
                    ? "AI assistant conversations:"
                    : "محادثات المساعد الذكي:"}
                </strong>{" "}
                {isEn
                  ? "Sent to Anthropic for processing, and stored on your device only (localStorage)."
                  : "بتتبعت لـ Anthropic للمعالجة، ومحفوظة على جهازك فقط (localStorage)."}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              {isEn ? "3. What we don't do" : "3. اللي ما بنعمله"}
            </h2>
            <ul
              className={`list-disc ${isEn ? "pl-6" : "pr-6"} space-y-2 leading-relaxed`}
            >
              <li>
                {isEn
                  ? "We don't sell your data to any third party."
                  : "ما بنبيع بياناتك لأي طرف تالت."}
              </li>
              <li>
                {isEn
                  ? "We don't ask you for medical data or sensitive personal information."
                  : "ما بنطلب منك بيانات طبية أو معلومات شخصية حساسة."}
              </li>
              <li>
                {isEn
                  ? "We don't use advertising cookies or third-party trackers."
                  : "ما بنستخدم كوكيز إعلانية أو trackers من طرف تالت."}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              {isEn ? "4. Security" : "4. الأمان"}
            </h2>
            <p className="leading-relaxed">
              {isEn
                ? "We always use HTTPS, server-side hashed passwords, and security headers (CSP, HSTS, X-Content-Type-Options). Images and requests are restricted to trusted domains."
                : "بنستخدم HTTPS دائماً، كلمات مرور محمية server-side، ورؤوس أمان (CSP, HSTS, X-Content-Type-Options). الصور والطلبات محصورة في domains موثوقة."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              {isEn ? "5. Your rights" : "5. حقوقك"}
            </h2>
            <p className="leading-relaxed">
              {isEn
                ? "You can clear your local data at any time from your browser settings (clear localStorage). For any inquiries you can reach us at "
                : "تقدر تمسح بياناتك المحلية في أي وقت من إعدادات المتصفح (مسح الـ localStorage). لأي استفسار تقدر تتواصل معانا على "}
              <a
                href="mailto:info@wahaeg.com"
                className="text-[#1d5770] dark:text-[#91b149] underline"
              >
                info@wahaeg.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              {isEn ? "6. Updates" : "6. تحديثات"}
            </h2>
            <p className="leading-relaxed">
              {isEn
                ? "Any change to this policy is published on this same page with the update date shown at the top."
                : "أي تعديل على السياسة دي بيتنشر في نفس الصفحة مع تاريخ التحديث في الأعلى."}
            </p>
          </section>
        </article>
      </section>
    </SiteLayout>
  );
}
