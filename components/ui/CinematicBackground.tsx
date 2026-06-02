'use client';

// ============================================================
//  CINEMATIC BACKGROUND v2 (Canvas, filmisch & lebendig)
//  Kein generischer Glow. Stattdessen eine echte
//  "Lichtsetzung am Set":
//   - volumetrische Lichtkegel (god rays) aus der Tiefe
//   - schwebende Tiefen-Partikel mit Parallax (3 Ebenen)
//   - vertikale Film-Licht-Streifen, die langsam atmen
//   - subtiles "Set-Haze" (Nebel)
//  Reagiert auf Maus (Parallax) – wirkt lebendig, lenkt nicht ab.
//  Reines Canvas2D = sehr performant, kein WebGL.
// ============================================================

import { useEffect, useRef } from 'react';

export default function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0.5, y: 0.5 };
    const cur = { x: 0.5, y: 0.5 };

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMove);

    // ---- Tiefen-Partikel (3 Ebenen für Parallax) ----
    type P = { x: number; y: number; z: number; r: number; s: number };
    const particles: P[] = [];
    const COUNT = Math.min(90, Math.floor((w * h) / 22000));
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random() * 3 + 0.3,      // Tiefe (klein=fern)
        r: Math.random() * 1.6 + 0.4,
        s: Math.random() * 0.00008 + 0.00002,
      });
    }

    // ---- Lichtkegel (god rays) ----
    const cones = [
      { x: 0.25, w: 0.10, hue: 'rgba(227,211,173,', sp: 0.00012, ph: 0 },
      { x: 0.55, w: 0.16, hue: 'rgba(255,255,255,', sp: 0.00008, ph: 2 },
      { x: 0.80, w: 0.08, hue: 'rgba(200,169,106,', sp: 0.00015, ph: 4 },
    ];

    let raf = 0;
    let time = 0;

    const draw = () => {
      time += 1;
      // Maus weich folgen
      cur.x += (mouse.x - cur.x) * 0.04;
      cur.y += (mouse.y - cur.y) * 0.04;

      // Hintergrund: tiefer vertikaler Verlauf (Set-Schwarz)
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#0c0c12');
      bg.addColorStop(0.5, '#08080c');
      bg.addColorStop(1, '#050507');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // ---- volumetrische Lichtkegel ----
      ctx.globalCompositeOperation = 'screen';
      cones.forEach((c) => {
        const breathe = 0.5 + 0.5 * Math.sin(time * c.sp * 1000 + c.ph);
        const px = (c.x + (cur.x - 0.5) * 0.06) * w;   // Parallax mit Maus
        const topW = c.w * w * 0.2;
        const botW = c.w * w * 1.6;
        const g = ctx.createLinearGradient(0, 0, 0, h);
        const a = 0.05 + breathe * 0.06;
        g.addColorStop(0, c.hue + a + ')');
        g.addColorStop(0.6, c.hue + a * 0.4 + ')');
        g.addColorStop(1, c.hue + '0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(px - topW, -20);
        ctx.lineTo(px + topW, -20);
        ctx.lineTo(px + botW, h + 20);
        ctx.lineTo(px - botW, h + 20);
        ctx.closePath();
        ctx.fill();
      });

      // ---- Tiefen-Partikel ----
      particles.forEach((p) => {
        // langsames Aufsteigen
        p.y -= p.s * (4 - p.z) * 120;
        if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
        // Parallax nach Tiefe + Maus
        const par = (cur.x - 0.5) * (0.04 * p.z);
        const px = (p.x + par) * w;
        const py = p.y * h;
        const alpha = (0.12 + (3.3 - p.z) * 0.05);
        ctx.beginPath();
        ctx.fillStyle = `rgba(227,211,173,${alpha})`;
        ctx.arc(px, py, p.r * (1 / p.z), 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = 'source-over';

      // ---- Set-Haze unten (Nebel) ----
      const haze = ctx.createLinearGradient(0, h * 0.5, 0, h);
      haze.addColorStop(0, 'rgba(10,10,14,0)');
      haze.addColorStop(1, 'rgba(12,12,18,0.55)');
      ctx.fillStyle = haze;
      ctx.fillRect(0, h * 0.5, w, h * 0.5);

      // ---- Vignette ----
      const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(4,4,6,0.8)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1] bg-ink" aria-hidden>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
