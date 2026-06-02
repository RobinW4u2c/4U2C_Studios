// ============================================================
//  CONTACT API ROUTE (Resend-ready)
//  POST /api/contact
//
//  AKTIVIEREN MIT RESEND (später):
//  1) `npm install resend`
//  2) In .env.local setzen:
//       RESEND_API_KEY=dein_key
//       CONTACT_TO=hello@4u2c-studios.de
//       CONTACT_FROM="4U2C Studios <noreply@deine-domain.de>"
//  3) Den markierten Block unten einkommentieren.
//
//  OHNE Key: Route antwortet mit 503, das Frontend nutzt dann
//  automatisch den mailto-Fallback. Nichts crasht.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface ContactPayload {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
}

// Server-seitige Validierung (nie dem Client vertrauen)
function isValid(p: Partial<ContactPayload>): p is ContactPayload {
  return (
    typeof p.name === 'string' && p.name.trim().length > 0 &&
    typeof p.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email) &&
    typeof p.projectType === 'string' &&
    typeof p.budget === 'string' &&
    typeof p.message === 'string' && p.message.trim().length >= 10
  );
}

export async function POST(req: NextRequest) {
  let body: Partial<ContactPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid-json' }, { status: 400 });
  }

  if (!isValid(body)) {
    return NextResponse.json({ error: 'validation-failed' }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;

  // Kein Key konfiguriert -> 503 (Frontend fällt auf mailto zurück)
  if (!apiKey) {
    return NextResponse.json(
      { error: 'email-not-configured', fallback: 'mailto' },
      { status: 503 }
    );
  }

  // ----------------------------------------------------------
  //  RESEND-VERSAND – nach `npm install resend` einkommentieren:
  // ----------------------------------------------------------
  /*
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: process.env.CONTACT_FROM || 'onboarding@resend.dev',
      to: process.env.CONTACT_TO || 'hello@4u2c-studios.de',
      replyTo: body.email,
      subject: `Neue Anfrage – ${body.projectType} (${body.budget})`,
      text:
        `Name: ${body.name}\n` +
        `E-Mail: ${body.email}\n` +
        `Projekt: ${body.projectType}\n` +
        `Budget: ${body.budget}\n\n` +
        `${body.message}`,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('Resend error:', err);
    return NextResponse.json({ error: 'send-failed' }, { status: 500 });
  }
  */

  // Solange Resend-Block auskommentiert ist: als "nicht konfiguriert" behandeln
  return NextResponse.json(
    { error: 'email-not-configured', fallback: 'mailto' },
    { status: 503 }
  );
}
