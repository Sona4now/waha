"use client";

import { useState } from "react";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/site/Reveal";
import { showToast } from "@/components/site/Toast";
import { TEAM } from "@/data/siteData";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast("البريد الإلكتروني غير صحيح", "error");
      return;
    }

    if (formData.message.length < 10) {
      showToast("الرسالة قصيرة جداً — اكتب 10 حروف على الأقل", "warning");
      return;
    }

    setSending(true);

    // Build mailto link as fallback (no backend)
    const subject = encodeURIComponent(
      `[واحة] ${formData.subject} — من ${formData.name}`,
    );
    const body = encodeURIComponent(
      `الاسم: ${formData.name}\nالإيميل: ${formData.email}\n\n${formData.message}`,
    );
    window.open(`mailto:waha.team.contact@gmail.com?subject=${subject}&body=${body}`, "_self");

    // Save to localStorage for admin dashboard
    try {
      const messages = JSON.parse(
        localStorage.getItem("waaha_contact_messages") || "[]",
      );
      messages.push({ ...formData, timestamp: Date.now() });
      localStorage.setItem(
        "waaha_contact_messages",
        JSON.stringify(messages),
      );
    } catch {}

    setTimeout(() => {
      setSending(false);
      showToast("تم فتح تطبيق البريد — أرسل الرسالة من هناك", "success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 800);
  };

  return (
    <SiteLayout>
      <PageHero
        title="الفريق"
        breadcrumb={[
          { label: "الرئيسية", href: "/home" },
          { label: "الفريق والتواصل" },
        ]}
      />

      {/* Team Section */}
      <section className="py-16 px-4 bg-[#f5f8fa] dark:bg-[#0a151f]">
        <div className="max-w-6xl mx-auto" dir="rtl">
          <Reveal>
            <h2 className="text-3xl font-bold mb-4 text-center text-[#12394d] dark:text-white font-display">
              فريق العمل
            </h2>
            <p className="text-center mb-12 max-w-2xl mx-auto text-[#7b7c7d] dark:text-white/50">
              تعرّف على الفريق الأكاديمي القائم على هذا المشروع البحثي
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM.map((member, idx) => (
              <Reveal key={idx} delay={idx * 0.08}>
                <div className="bg-white dark:bg-[#162033] rounded-2xl p-8 shadow-md hover:shadow-lg dark:hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-transparent dark:border-[#1e3a5f] transition-all duration-300 text-center hover:-translate-y-1">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 bg-[#f0f7ed] dark:bg-[#1e3a5f]">
                    {member.avatar || "👤"}
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-[#1d5770] dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium mb-3 text-[#91b149]">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="text-sm leading-relaxed text-[#7b7c7d] dark:text-white/50">
                      {member.bio}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 bg-white dark:bg-[#0d1b2a]">
        <div className="max-w-4xl mx-auto" dir="rtl">
          <Reveal>
            <h2 className="text-3xl font-bold mb-4 text-center text-[#12394d] dark:text-white font-display">
              تواصل معنا
            </h2>
            <p className="text-center mb-12 max-w-2xl mx-auto text-[#7b7c7d] dark:text-white/50">
              لديك سؤال أو اقتراح؟ لا تتردد في التواصل معنا
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Reveal className="md:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-[#162033] border border-[#e5e7eb] dark:border-[#1e3a5f] rounded-2xl p-6 sm:p-8 space-y-6"
              >
                <div>
                  <label className="block text-sm font-bold mb-2 text-[#12394d] dark:text-white">
                    الاسم
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="أدخل اسمك الكامل"
                    className="w-full px-4 py-3 rounded-lg border border-[#d1d5db] dark:border-[#1e3a5f] bg-white dark:bg-[#0a151f] text-[#12394d] dark:text-white text-sm outline-none transition-colors focus:border-[#1d5770] dark:focus:border-[#91b149] placeholder:text-[#7b7c7d]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-[#12394d] dark:text-white">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="example@email.com"
                    dir="ltr"
                    className="w-full px-4 py-3 rounded-lg border border-[#d1d5db] dark:border-[#1e3a5f] bg-white dark:bg-[#0a151f] text-[#12394d] dark:text-white text-sm outline-none transition-colors focus:border-[#1d5770] dark:focus:border-[#91b149] placeholder:text-[#7b7c7d]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-[#12394d] dark:text-white">
                    الموضوع
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#d1d5db] dark:border-[#1e3a5f] bg-white dark:bg-[#0a151f] text-[#12394d] dark:text-white text-sm outline-none transition-colors focus:border-[#1d5770] dark:focus:border-[#91b149]"
                  >
                    <option value="">اختر الموضوع</option>
                    <option value="استفسار عام">استفسار عام</option>
                    <option value="اقتراح">اقتراح</option>
                    <option value="تعاون أكاديمي">تعاون أكاديمي</option>
                    <option value="مشكلة تقنية">مشكلة تقنية</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-[#12394d] dark:text-white">
                    الرسالة
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    maxLength={2000}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full px-4 py-3 rounded-lg border border-[#d1d5db] dark:border-[#1e3a5f] bg-white dark:bg-[#0a151f] text-[#12394d] dark:text-white text-sm outline-none transition-colors focus:border-[#1d5770] dark:focus:border-[#91b149] resize-none placeholder:text-[#7b7c7d]/50"
                  />
                  <p className="text-[10px] text-[#7b7c7d] mt-1 text-left" dir="ltr">
                    {formData.message.length} / 2000
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 rounded-lg bg-[#1d5770] hover:bg-[#174860] disabled:opacity-60 text-white font-bold text-sm transition-all"
                >
                  {sending ? "جاري الإرسال..." : "إرسال الرسالة"}
                </button>
              </form>
            </Reveal>

            {/* Contact Info Sidebar */}
            <Reveal delay={0.2}>
              <div className="space-y-6">
                {[
                  {
                    icon: "📧",
                    title: "البريد الإلكتروني",
                    info: "waha.team.contact@gmail.com",
                    bg: "bg-[#1d5770]",
                  },
                  {
                    icon: "💬",
                    title: "المساعد الذكي",
                    info: "تحدث مع مساعدنا الذكي في أي وقت",
                    bg: "bg-[#91b149]",
                  },
                  {
                    icon: "🕐",
                    title: "ساعات العمل",
                    info: "السبت - الخميس: 9 صباحاً - 5 مساءً",
                    bg: "bg-[#12394d]",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-6 bg-[#f5f8fa] dark:bg-[#162033] border border-transparent dark:border-[#1e3a5f]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${item.bg}`}
                      >
                        {item.icon}
                      </span>
                      <h4 className="font-bold text-[#12394d] dark:text-white">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-sm text-[#7b7c7d] dark:text-white/50">
                      {item.info}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
