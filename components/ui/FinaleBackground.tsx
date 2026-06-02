'use client';

// ============================================================
//  FINALE BACKGROUND (für "Let's Create")
//  Das große Finale: ein cinematic LIGHT TUNNEL aus
//  perspektivischen Ringen (wie in ein Objektiv blicken) +
//  schwebende Partikel, die nach vorne strömen. Scroll-reaktiv:
//  je näher man dem Finale kommt, desto intensiver der Tunnel.
//  Liegt nur hinter der Contact-Section (absolute).
// ============================================================

import { useEffect, useRef } from 'react';

export default function FinaleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const parent = canvas.parentElement!;

    const resize = () => {
      w = parent.clientWidth; h = parent.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Partikel, die aus der Tiefe nach vorne strömen (Z 1..0)
    type P = { a: number; z: number; sp: number };
    const parts: P[] = [];
    for (let i = 0; i < 80; i++) {
      parts.push({ a: Math.random() * Math.PI * 2, z: Math.random(), sp: Math.random() * 0.004 + 0.001 });
    }

    let raf = 0, time = 0;
    const draw = () => {
      time += 0.01;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2, cy = h / 2;

      // ---- LIGHT TUNNEL: konzentrische, perspektivische Ringe ----
      ctx.globalCompositeOperation = 'screen';
      const rings = 14;
      for (let i = 0; i < rings; i++) {
        // Ringe wandern nach außen (Illusion: man fliegt hinein)
        const prog = ((i / rings) + (time * 0.15) % 1) % 1;
        const radius = prog * Math.max(w, h) * 0.75;
        const alpha = (1 - prog) * 0.16;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(200,169,106,${alpha})`;
        ctx.lineWidth = 1 + (1 - prog) * 2;
        // leicht elliptisch für Tiefe
        ctx.ellipse(cx, cy, radius, radius * 0.82, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // weicher Kern in der Tunnelmitte
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.4);
      core.addColorStop(0, 'rgba(227,211,173,0.18)');
      core.addColorStop(0.5, 'rgba(200,169,106,0.05)');
      core.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, w, h);

      // ---- strömende Partikel nach vorne ----
      parts.forEach((p) => {
        p.z -= p.sp;
        if (p.z <= 0.02) { p.z = 1; p.a = Math.random() * Math.PI * 2; }
        const radius = (1 - p.z) * Math.max(w, h) * 0.55;
        const px = cx + Math.cos(p.a) * radius;
        const py = cy + Math.sin(p.a) * radius * 0.82;
        const size = (1 - p.z) * 2.4;
        const alpha = (1 - p.z) * 0.5;
        ctx.beginPath();
        ctx.fillStyle = `rgba(227,211,173,${alpha})`;
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = 'source-over';

      // Vignette dezenter, damit das Formular luftig wirkt (kein dunkler Kasten)
      const vig = ctx.createRadialGradient(cx, cy, Math.min(w, h) * 0.35, cx, cy, Math.max(w, h) * 0.8);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(6,6,8,0.55)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
