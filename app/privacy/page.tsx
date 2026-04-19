import type { Metadata } from "next";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import { SITE_NAME, SITE_URL } from "@/lib/siteMeta";

export const metadata: Metadata = {
  title: `سياسة الخصوصية — ${SITE_NAME}`,
  description:
    "كيف تجمع منصة واحة البيانات، وما الذي تفعله بها، وكيف يحمي الموقع خصوصيتك.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <SiteLayout>
      <PageHero
        title="سياسة الخصوصية"
        subtitle="كيف نجمع البيانات، وماذا نفعل بها"
        breadcrumb={[
          { label: "الرئيسية", href: "/home" },
          { label: "سياسة الخصوصية" },
        ]}
      />

      <section
        className="py-16 px-4 bg-[#f5f8fa] dark:bg-[#0a151f]"
        dir="rtl"
      >
        <article className="max-w-3xl mx-auto prose-like space-y-8 text-[#12394d] dark:text-white/80">
          <p className="text-sm text-[#7b7c7d] dark:text-white/40">
            آخر تحديث: أبريل 2026
          </p>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              1. من نحن
            </h2>
            <p className="leading-relaxed">
              واحة (WAHA) منصة محتوى رقمية للتوعية بالسياحة البيئية
              المستدامة والاستشفاء من الطبيعة في مصر. إحنا مش وكالة سياحة،
              ومش بنبيع رحلات، ومش بنجمع بيانات طبية.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              2. البيانات اللي بنجمعها
            </h2>
            <ul className="list-disc pr-6 space-y-2 leading-relaxed">
              <li>
                <strong>بيانات تقنية تلقائية:</strong> عنوان IP، نوع
                المتصفح، نظام التشغيل — لحماية الموقع من الهجمات ومتابعة
                الأداء.
              </li>
              <li>
                <strong>تحليلات Vercel:</strong> بنستخدم Vercel Analytics
                لقياس الزيارات (بدون تتبع أفراد).
              </li>
              <li>
                <strong>تخزين محلي (localStorage):</strong> تفضيلاتك زي
                المفضلات والمقارنات والوضع الليلي — محفوظة على جهازك
                فقط ومابتتبعتش لأي سيرفر.
              </li>
              <li>
                <strong>محادثات المساعد الذكي:</strong> بتتبعت لـ Anthropic
                للمعالجة، ومحفوظة على جهازك فقط (localStorage).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              3. اللي ما بنعمله
            </h2>
            <ul className="list-disc pr-6 space-y-2 leading-relaxed">
              <li>ما بنبيع بياناتك لأي طرف تالت.</li>
              <li>ما بنطلب منك بيانات طبية أو معلومات شخصية حساسة.</li>
              <li>ما بنستخدم كوكيز إعلانية أو trackers من طرف تالت.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              4. الأمان
            </h2>
            <p className="leading-relaxed">
              بنستخدم HTTPS دائماً، كلمات مرور محمية server-side، ورؤوس
              أمان (CSP, HSTS, X-Content-Type-Options). الصور والطلبات
              محصورة في domains موثوقة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              5. حقوقك
            </h2>
            <p className="leading-relaxed">
              تقدر تمسح بياناتك المحلية في أي وقت من إعدادات المتصفح
              (مسح الـ localStorage). لأي استفسار تقدر تتواصل معانا على{" "}
              <a
                href="mailto:wahhaa.2026@gmail.com"
                className="text-[#1d5770] dark:text-[#91b149] underline"
              >
                wahhaa.2026@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-display mb-3">
              6. تحديثات
            </h2>
            <p className="leading-relaxed">
              أي تعديل على السياسة دي بيتنشر في نفس الصفحة مع تاريخ
              التحديث في الأعلى.
            </p>
          </section>
        </article>
      </section>
    </SiteLayout>
  );
}
