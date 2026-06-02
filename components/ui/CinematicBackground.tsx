'use client';

// ============================================================
//  CINEMATIC BACKGROUND v3 – "FOCUS FIELD"
//  Komplett neues Konzept (kein Glow-Verlauf):
//   - feines, perspektivisch fluchtendes RASTER (wie ein
//     Kamera-Sucher-Grid / Mattscheibe) das langsam atmet
//   - vertikale FILMSTREIFEN-Andeutung an den Rändern
//   - wandernde FOKUS-Punkte (scharf->unscharf), wie ein
//     Autofokus, der das Bild absucht
//   - alles dunkel, kontrastreich, mit Brand-Akzent
//   - reagiert auf Scroll (Grid verschiebt sich) + Maus
//  Reines Canvas2D = performant.
// ============================================================

import { useEffect, useRef } from 'react';

export default function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);

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

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Fokus-Punkte, die das Bild "absuchen"
    const focusPts = Array.from({ length: 5 }).map(() => ({
      x: Math.random(), y: Math.random(),
      tx: Math.random(), ty: Math.random(),
      r: Math.random() * 40 + 30,
    }));

    let raf = 0, time = 0;

    const draw = () => {
      time += 0.005;
      cur.x += (mouse.x - cur.x) * 0.04;
      cur.y += (mouse.y - cur.y) * 0.04;
      const scroll = scrollRef.current;

      // Basis: tiefes, leicht bläuliches Schwarz (Kino-Dunkel)
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#08090d');
      bg.addColorStop(1, '#050507');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // ---- PERSPEKTIVISCHES RASTER (Sucher-Grid) ----
      // Fluchtpunkt leicht maus-/scroll-versetzt
      const vpX = w * (0.5 + (cur.x - 0.5) * 0.3);
      const vpY = h * (0.42 + (cur.y - 0.5) * 0.2 - scroll * 0.1);
      ctx.lineWidth = 1;

      const lines = 16;
      // radiale Linien zum Fluchtpunkt
      for (let i = 0; i <= lines; i++) {
        const a = (i / lines) * Math.PI * 2;
        const len = Math.max(w, h) * 1.2;
        const x2 = vpX + Math.cos(a) * len;
        const y2 = vpY + Math.sin(a) * len;
        ctx.strokeStyle = 'rgba(200,169,106,0.035)';
        ctx.beginPath();
        ctx.moveTo(vpX, vpY);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      // konzentrische Ringe, die mit Scroll nach außen wandern
      for (let i = 0; i < 9; i++) {
        const prog = ((i / 9) + scroll * 0.6 + time * 0.05) % 1;
        const radius = prog * Math.max(w, h) * 0.7;
        ctx.strokeStyle = `rgba(120,140,180,${(1 - prog) * 0.05})`;
        ctx.beginPath();
        ctx.arc(vpX, vpY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ---- FILMSTREIFEN an den Rändern (Perforations-Andeutung) ----
      const stripW = Math.min(46, w * 0.05);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, stripW, h);
      ctx.fillRect(w - stripW, 0, stripW, h);
      // Perforationslöcher, die mit Scroll nach oben laufen
      const holeH = 22, gap = 38;
      const offset = (scroll * h * 2 + time * 30) % gap;
      ctx.fillStyle = 'rgba(200,169,106,0.06)';
      for (let y = -gap + offset; y < h + gap; y += gap) {
        ctx.fillRect(stripW * 0.3, y, stripW * 0.4, holeH);
        ctx.fillRect(w - stripW * 0.7, y, stripW * 0.4, holeH);
      }

      // ---- AUTOFOKUS-PUNKTE (scharf -> weich) ----
      ctx.globalCompositeOperation = 'screen';
      focusPts.forEach((p, i) => {
        // langsam zu neuen Zielen wandern
        p.x += (p.tx - p.x) * 0.006;
        p.y += (p.ty - p.y) * 0.006;
        if (Math.abs(p.x - p.tx) < 0.01 && Math.abs(p.y - p.ty) < 0.01) {
          p.tx = Math.random(); p.ty = Math.random();
        }
        const px = p.x * w, py = p.y * h;
        const pulse = 0.5 + 0.5 * Math.sin(time * 2 + i);
        // Fokus-Klammern (AF-Rahmen) statt Glow
        const s = p.r * (0.8 + pulse * 0.3);
        ctx.strokeStyle = `rgba(227,211,173,${0.04 + pulse * 0.05})`;
        ctx.lineWidth = 1.5;
        const corner = s * 0.3;
        // vier Ecken eines AF-Rahmens
        ctx.beginPath();
        // TL
        ctx.moveTo(px - s, py - s + corner); ctx.lineTo(px - s, py - s); ctx.lineTo(px - s + corner, py - s);
        // TR
        ctx.moveTo(px + s - corner, py - s); ctx.lineTo(px + s, py - s); ctx.lineTo(px + s, py - s + corner);
        // BR
        ctx.moveTo(px + s, py + s - corner); ctx.lineTo(px + s, py + s); ctx.lineTo(px + s - corner, py + s);
        // BL
        ctx.moveTo(px - s + corner, py + s); ctx.lineTo(px - s, py + s); ctx.lineTo(px - s, py + s - corner);
        ctx.stroke();
      });
      ctx.globalCompositeOperation = 'source-over';

      // ---- Set-Haze unten + Vignette ----
      const haze = ctx.createLinearGradient(0, h * 0.55, 0, h);
      haze.addColorStop(0, 'rgba(8,9,13,0)');
      haze.addColorStop(1, 'rgba(8,9,13,0.6)');
      ctx.fillStyle = haze;
      ctx.fillRect(0, h * 0.55, w, h * 0.45);

      const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.32, w / 2, h / 2, Math.max(w, h) * 0.78);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(4,4,6,0.82)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1] bg-ink" aria-hidden>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
