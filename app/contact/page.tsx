"use client";

import { useState } from "react";
import Link from "next/link";
import SiteLayout from "@/components/site/SiteLayout";
import PageHero from "@/components/site/PageHero";
import { TEAM } from "@/data/siteData";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("تم إرسال رسالتك بنجاح! سنتواصل معك قريبا.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <SiteLayout>
      <PageHero title="الفريق" />

      {/* Team Section */}
      <section className="py-16 px-4" style={{ backgroundColor: "#f5f8fa" }}>
        <div className="max-w-6xl mx-auto" dir="rtl">
          <h2
            className="text-3xl font-bold mb-4 text-center"
            style={{ color: "#12394d" }}
          >
            فريق العمل
          </h2>
          <p
            className="text-center mb-12 max-w-2xl mx-auto"
            style={{ color: "#7b7c7d" }}
          >
            تعرّف على الفريق الأكاديمي القائم على هذا المشروع البحثي
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
              >
                {/* Avatar */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-5"
                  style={{ backgroundColor: "#f0f7ed" }}
                >
                  {member.avatar || "👤"}
                </div>

                {/* Name */}
                <h3
                  className="text-xl font-bold mb-1"
                  style={{ color: "#1d5770" }}
                >
                  {member.name}
                </h3>

                {/* Role */}
                <p
                  className="text-sm font-medium mb-3"
                  style={{ color: "#91b149" }}
                >
                  {member.role}
                </p>

                {/* Bio */}
                {member.bio && (
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#7b7c7d" }}
                  >
                    {member.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto" dir="rtl">
          <h2
            className="text-3xl font-bold mb-4 text-center"
            style={{ color: "#12394d" }}
          >
            تواصل معنا
          </h2>
          <p
            className="text-center mb-12 max-w-2xl mx-auto"
            style={{ color: "#7b7c7d" }}
          >
            لديك سؤال أو اقتراح؟ لا تتردد في التواصل معنا
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Form */}
            <div className="md:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-white border rounded-2xl p-8 space-y-6"
                style={{ borderColor: "#e5e7eb" }}
              >
                {/* Name */}
                <div>
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: "#12394d" }}
                  >
                    الاسم
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="أدخل اسمك الكامل"
                    className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors focus:border-[#1d5770]"
                    style={{ borderColor: "#d1d5db", color: "#12394d" }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: "#12394d" }}
                  >
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors focus:border-[#1d5770]"
                    style={{ borderColor: "#d1d5db", color: "#12394d" }}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: "#12394d" }}
                  >
                    الموضوع
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors focus:border-[#1d5770] bg-white"
                    style={{ borderColor: "#d1d5db", color: "#12394d" }}
                  >
                    <option value="">اختر الموضوع</option>
                    <option value="استفسار عام">استفسار عام</option>
                    <option value="اقتراح">اقتراح</option>
                    <option value="تعاون أكاديمي">تعاون أكاديمي</option>
                    <option value="مشكلة تقنية">مشكلة تقنية</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: "#12394d" }}
                  >
                    الرسالة
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors focus:border-[#1d5770] resize-none"
                    style={{ borderColor: "#d1d5db", color: "#12394d" }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg text-white font-bold text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#1d5770" }}
                >
                  إرسال الرسالة
                </button>
              </form>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: "#f5f8fa" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: "#1d5770" }}
                  >
                    📧
                  </span>
                  <h4
                    className="font-bold"
                    style={{ color: "#12394d" }}
                  >
                    البريد الإلكتروني
                  </h4>
                </div>
                <p className="text-sm" style={{ color: "#7b7c7d" }}>
                  info@therapeutic-tourism.eg
                </p>
              </div>

              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: "#f5f8fa" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: "#91b149" }}
                  >
                    💬
                  </span>
                  <h4
                    className="font-bold"
                    style={{ color: "#12394d" }}
                  >
                    واتساب
                  </h4>
                </div>
                <p className="text-sm" style={{ color: "#7b7c7d" }}>
                  +20 100 000 0000
                </p>
              </div>

              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: "#f5f8fa" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: "#12394d" }}
                  >
                    🕐
                  </span>
                  <h4
                    className="font-bold"
                    style={{ color: "#12394d" }}
                  >
                    ساعات العمل
                  </h4>
                </div>
                <p className="text-sm" style={{ color: "#7b7c7d" }}>
                  السبت - الخميس: 9 صباحا - 5 مساء
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
