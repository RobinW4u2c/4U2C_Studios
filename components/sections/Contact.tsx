'use client';

// ============================================================
//  CONTACT SYSTEM
//  Vollständiges Formular: Name, Email, Project Type, Budget,
//  Message. Versand:
//    1) Versucht POST an /api/contact (Resend-ready Backend)
//    2) Schlägt das fehl ODER ist kein Key gesetzt -> mailto-Fallback
//  Client-seitige Validierung inklusive.
// ============================================================

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SITE, PROJECT_TYPES, BUDGET_RANGES } from '@/lib/data';
import FinaleBackground from '@/components/ui/FinaleBackground';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: PROJECT_TYPES[0],
    budget: BUDGET_RANGES[0],
    message: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const update = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  // einfache Validierung
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Bitte Namen angeben.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Gültige E-Mail angeben.';
    if (form.message.trim().length < 10) e.message = 'Mindestens 10 Zeichen.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // baut den mailto-Link als Fallback
  const buildMailto = () => {
    const subject = encodeURIComponent(`Anfrage – ${form.projectType} (${form.budget})`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nE-Mail: ${form.email}\nProjekt: ${form.projectType}\nBudget: ${form.budget}\n\n${form.message}`
    );
    return `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStatus('sending');

    try {
      // 1) Versuch über Backend-Route (Resend)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({
          name: '',
          email: '',
          projectType: PROJECT_TYPES[0],
          budget: BUDGET_RANGES[0],
          message: '',
        });
        return;
      }
      // Backend antwortete, aber nicht ok (z.B. kein API-Key gesetzt)
      throw new Error('backend-unavailable');
    } catch {
      // 2) Fallback: Mail-Client öffnen
      window.location.href = buildMailto();
      setStatus('idle');
    }
  };

  return (
    <section id="contact" className="relative z-10 overflow-hidden py-40">
      {/* SPEKTAKULÄRES FINALE: Light Tunnel hinter der Section (full-bleed) */}
      <FinaleBackground />

      <div className="relative mx-auto max-w-[1100px] px-6 md:px-12">
      <motion.div
        ref={formRef}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-14 text-center">
          <span className="font-mono text-xs uppercase tracking-widest2 text-accent">
            05 — Contact
          </span>
          <h2 className="mt-4 font-display text-5xl tracking-tightest text-bone md:text-7xl">
            Let&apos;s create
          </h2>
          <p className="mt-6 font-body text-smoke">
            Erzähl mir von deinem Projekt. Antwort meist innerhalb von 24 Stunden.
          </p>
        </div>

        {/* Erfolgsmeldung */}
        {status === 'success' ? (
          <div className="rounded-sm border border-accent/40 bg-carbon p-12 text-center">
            <h3 className="font-display text-3xl text-bone">Danke!</h3>
            <p className="mt-4 font-body text-smoke">
              Deine Nachricht ist angekommen. Ich melde mich in Kürze.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Name */}
            <Field label="Name" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Dein Name"
                className="cine-input"
              />
            </Field>

            {/* Email */}
            <Field label="E-Mail" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="name@mail.com"
                className="cine-input"
              />
            </Field>

            {/* Project Type */}
            <Field label="Projekt-Art">
              <select
                value={form.projectType}
                onChange={(e) => update('projectType', e.target.value)}
                className="cine-input"
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-ink">
                    {t}
                  </option>
                ))}
              </select>
            </Field>

            {/* Budget */}
            <Field label="Budget">
              <select
                value={form.budget}
                onChange={(e) => update('budget', e.target.value)}
                className="cine-input"
              >
                {BUDGET_RANGES.map((b) => (
                  <option key={b} value={b} className="bg-ink">
                    {b}
                  </option>
                ))}
              </select>
            </Field>

            {/* Message */}
            <div className="md:col-span-2">
              <Field label="Nachricht" error={errors.message}>
                <textarea
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  placeholder="Worum geht es?"
                  rows={5}
                  className="cine-input resize-none"
                />
              </Field>
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                onClick={handleSubmit}
                disabled={status === 'sending'}
                data-cursor="hover"
                className="group relative w-full overflow-hidden rounded-full border border-accent bg-accent px-8 py-4 font-mono text-xs uppercase tracking-widest2 text-ink transition-colors duration-500 hover:bg-transparent hover:text-accent disabled:opacity-50"
              >
                {status === 'sending' ? 'Senden …' : 'Anfrage senden'}
              </button>
              <p className="mt-4 text-center font-mono text-[10px] text-smoke">
                Oder direkt:{' '}
                <a href={`mailto:${SITE.email}`} className="text-accent underline">
                  {SITE.email}
                </a>
              </p>
            </div>
          </div>
        )}
      </motion.div>
      </div>
    </section>
  );
}

// --- Feld-Wrapper mit Label + Fehleranzeige -------------------
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest2 text-smoke">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block font-mono text-[10px] text-red-400">{error}</span>}
    </label>
  );
}
