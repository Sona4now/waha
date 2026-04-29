"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT_PHONE_INTL, CONTACT_PHONE_DISPLAY } from "@/lib/siteMeta";
import { useTranslations } from "@/components/site/LocaleProvider";

const PROFILE_KEY = "waaha_lead_profile";
const TIER_KEY = "waaha_chosen_tier";
const COOLDOWN_KEY = "waaha_lead_cooldown";
const COOLDOWN_HOURS = 4;

interface Props {
  destinationId: string;
  destinationName: string;
}

interface SavedProfile {
  name: string;
  phone: string;
  people: string;
}

/**
 * Per-destination lead capture form.
 *
 * Posts nothing to a backend (we don't have one) — instead it composes a
 * structured WhatsApp message and opens wa.me with it pre-filled. The
 * operator on the other end gets the user's name, phone, dates, and
 * party size in one message and can follow up directly.
 *
 * This is the single highest-conversion CTA on the site for the Egyptian
 * market: WhatsApp is universal, and skipping the backend means there's
 * nothing to break, no email deliverability issues, no spam filters.
 */
export default function LeadCaptureForm({
  destinationId,
  destinationName,
}: Props) {
  const { t, locale } = useTranslations();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dates, setDates] = useState("");
  const [people, setPeople] = useState("2");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);
  const [returning, setReturning] = useState(false);

  // Pre-fill from a previous successful lead — same user shouldn't have to
  // re-type their name/phone for every destination.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = setTimeout(() => {
      try {
        const raw = localStorage.getItem(PROFILE_KEY);
        if (raw) {
          const saved: SavedProfile = JSON.parse(raw);
          if (saved.name) setName(saved.name);
          if (saved.phone) setPhone(saved.phone);
          if (saved.people) setPeople(saved.people);
          if (saved.name) setReturning(true);
        }
        const tier = sessionStorage.getItem(TIER_KEY);
        if (tier) {
          const labelByTier: Record<string, string> =
            locale === "en"
              ? {
                  basic: "Interested in the basic package",
                  standard: "Interested in the recommended package",
                  premium: "Interested in the premium package",
                }
              : {
                  basic: "مهتم بالباقة الأساسية",
                  standard: "مهتم بالباقة الموصى بها",
                  premium: "مهتم بالباقة المتكاملة",
                };
          if (labelByTier[tier]) setNotes(labelByTier[tier]);
          sessionStorage.removeItem(TIER_KEY);
        }
        const cd = localStorage.getItem(COOLDOWN_KEY);
        if (cd) {
          const last = parseInt(cd, 10);
          if (
            !Number.isNaN(last) &&
            Date.now() - last < COOLDOWN_HOURS * 60 * 60 * 1000
          ) {
            setSent(true);
          }
        }
      } catch {}
    }, 0);
    return () => clearTimeout(id);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const body = (
      locale === "en"
        ? [
            `Quote request — ${destinationName}`,
            "",
            `Name: ${name.trim()}`,
            `Phone: ${phone.trim()}`,
            `Preferred dates: ${dates.trim() || "Flexible"}`,
            `Group size: ${people}`,
            notes.trim() ? `Notes: ${notes.trim()}` : "",
            "",
            `(Sent from /destination/${destinationId})`,
          ]
        : [
            `طلب عرض سعر — ${destinationName}`,
            "",
            `الاسم: ${name.trim()}`,
            `الموبايل: ${phone.trim()}`,
            `الموعد المفضّل: ${dates.trim() || "مرن"}`,
            `عدد الأشخاص: ${people}`,
            notes.trim() ? `ملاحظات: ${notes.trim()}` : "",
            "",
            `(تم إرسال هذا الطلب من /destination/${destinationId})`,
          ]
    )
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/${CONTACT_PHONE_INTL}?text=${encodeURIComponent(body)}`;
    window.open(url, "_blank");
    setSent(true);

    // Persist profile for next time so they don't re-type.
    try {
      const profile: SavedProfile = {
        name: name.trim(),
        phone: phone.trim(),
        people,
      };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
    } catch {}

    // Lead count for the future analytics dashboard.
    try {
      const key = "waaha_lead_count";
      const cur = parseInt(localStorage.getItem(key) || "0", 10);
      localStorage.setItem(key, String(cur + 1));
    } catch {}
  }

  return (
    <div
      className="bg-gradient-to-br from-[#12394d] to-[#1d5770] dark:from-[#0a151f] dark:to-[#162033] rounded-3xl p-6 md:p-8 text-white shadow-[0_20px_60px_-15px_rgba(18,57,77,0.4)]"
      dir={locale === "en" ? "ltr" : "rtl"}
    >
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#91b149] mb-4 text-3xl">
              ✓
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              {t("lead.successTitle")}
            </h3>
            <p className="text-sm text-white/75 leading-relaxed mb-5 max-w-sm mx-auto">
              {t("lead.successBody")} {t("lead.directLine")}{" "}
              <a
                href={`tel:+${CONTACT_PHONE_INTL}`}
                className="text-[#91b149] font-bold hover:underline"
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-xs text-white/60 hover:text-white underline"
            >
              {t("lead.anotherRequest")}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-1 h-5 bg-[#91b149] rounded-full" />
              <h3 className="text-xs font-bold text-[#91b149] uppercase tracking-wider">
                {locale === "en" ? "Book your trip" : "احجز رحلتك"}
              </h3>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-black mb-2 leading-tight">
              {t("lead.title")} — {destinationName}
            </h2>
            <p className="text-sm text-white/70 mb-4 leading-relaxed">
              {t("lead.subtitle")}
            </p>
            {returning && (
              <div className="mb-5 inline-flex items-center gap-2 bg-[#91b149]/15 text-[#91b149] text-xs font-bold rounded-full px-3 py-1.5">
                <span>✨</span>
                <span>
                  {t("lead.returningHi").replace("{name}", name)}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <FormField
                label={t("lead.name")}
                value={name}
                onChange={setName}
                placeholder={t("lead.namePlaceholder")}
                required
                autoComplete="name"
              />
              <FormField
                label={t("lead.phone")}
                value={phone}
                onChange={setPhone}
                placeholder={t("lead.phonePlaceholder")}
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
              />
              <FormField
                label={t("lead.dates")}
                value={dates}
                onChange={setDates}
                placeholder={t("lead.datesPlaceholder")}
              />
              <SelectField
                label={t("lead.people")}
                value={people}
                onChange={setPeople}
                options={[
                  { v: "1", l: t("lead.groupOne") },
                  { v: "2", l: t("lead.groupTwo") },
                  { v: "3", l: t("lead.groupThree") },
                  { v: "4", l: t("lead.groupFour") },
                  { v: "5+", l: t("lead.groupFivePlus") },
                ]}
              />
            </div>

            <FormField
              label={t("lead.notes")}
              value={notes}
              onChange={setNotes}
              placeholder={t("lead.notesPlaceholder")}
              multiline
            />

            <button
              type="submit"
              disabled={!name.trim() || !phone.trim()}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1da851] disabled:bg-white/10 disabled:cursor-not-allowed text-white font-display font-bold text-base py-3.5 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>{t("lead.send")}</span>
            </button>

            <p className="mt-3 text-[11px] text-white/50 text-center leading-relaxed">
              {t("lead.noFee")}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  inputMode?: "tel" | "text" | "email" | "numeric";
  autoComplete?: string;
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  multiline,
  inputMode,
  autoComplete,
}: FieldProps) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-white/70 mb-1.5 block">
        {label} {required && <span className="text-[#91b149]">*</span>}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-base text-white placeholder:text-white/40 focus:outline-none focus:border-[#91b149] focus:bg-white/15 transition-all resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          inputMode={inputMode}
          autoComplete={autoComplete}
          className="w-full px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-base text-white placeholder:text-white/40 focus:outline-none focus:border-[#91b149] focus:bg-white/15 transition-all"
        />
      )}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-white/70 mb-1.5 block">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none px-4 py-3 pl-10 bg-white/10 border border-white/15 rounded-xl text-base text-white focus:outline-none focus:border-[#91b149] focus:bg-white/15 transition-all cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.v} value={o.v} className="bg-[#12394d]">
              {o.l}
            </option>
          ))}
        </select>
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </label>
  );
}
