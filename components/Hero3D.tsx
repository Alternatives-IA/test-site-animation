"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  FRAME_COUNT,
  LAST_FRAME as LAST,
  PORTRAIT_ZOOM,
  SMOOTHING,
  STAGES,
  type Stage,
  clamp,
  coverSize,
  heroProgress,
  portraitZoomFactor,
  stageOpacity,
  targetFrame,
} from "@/lib/hero";

/** Frames chargées avant de lever l'écran de chargement. Le reste continue en fond. */
const EAGER = 30;

const pad = (n: number) => String(n).padStart(3, "0");

export function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const drawnRef = useRef(-1);
  const progRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!canvas || !section || !sticky) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const base = window.matchMedia("(max-width: 768px)").matches
      ? "/hero-frames-sm"
      : "/hero-frames";

    let raf = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const w = sticky!.clientWidth;
      const h = sticky!.clientHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.imageSmoothingEnabled = true;
      ctx!.imageSmoothingQuality = "high";
    }

    /**
     * Dessin « cover », avec zoom de fin de séquence sur viewport portrait.
     * Retourne false si la frame n'est pas encore décodée : l'appelant ne doit
     * alors PAS considérer cet index comme dessiné, sinon une frame qui arrive
     * en retard ne serait jamais peinte (le canvas resterait figé).
     */
    function draw(img?: HTMLImageElement): boolean {
      if (!img || !img.complete || !img.naturalWidth) return false;
      const cw = sticky!.clientWidth;
      const ch = sticky!.clientHeight;
      const ir = img.naturalWidth / img.naturalHeight;

      const fit = coverSize(img.naturalWidth, img.naturalHeight, cw, ch);

      // Variante zoomée, utilisée en fin de séquence sur viewport portrait.
      const cr = cw / ch;
      const zw = ir > cr ? PORTRAIT_ZOOM * cw : PORTRAIT_ZOOM * ch * ir;
      const zh = ir > cr ? (PORTRAIT_ZOOM * cw) / ir : PORTRAIT_ZOOM * ch;

      const k = portraitZoomFactor(progRef.current, cw, ch);
      const fw = fit.w * (1 - k) + zw * k;
      const fh = fit.h * (1 - k) + zh * k;

      ctx!.fillStyle = "#0a0c10";
      ctx!.fillRect(0, 0, cw, ch);
      ctx!.drawImage(img, (cw - fw) / 2, (ch - fh) / 2, fw, fh);
      return true;
    }

    function onScroll() {
      const rect = section!.getBoundingClientRect();
      const p = heroProgress(rect.top, rect.height, window.innerHeight);
      progRef.current = p;
      targetRef.current = targetFrame(p);

      stageRefs.current.forEach((el, i) => {
        if (!el) return;
        const o = stageOpacity(p, STAGES[i].start, STAGES[i].end);
        el.style.opacity = String(o);
        el.style.transform = `translateY(${(1 - o) * 16}px)`;
      });
    }

    function tick() {
      currentRef.current += (targetRef.current - currentRef.current) * SMOOTHING;
      const idx = Math.round(currentRef.current);

      const w = sticky!.clientWidth;
      const h = sticky!.clientHeight;
      const forceRedraw = w > 0 && h > 0 && w < h && progRef.current > 0.7;

      if (idx !== drawnRef.current || forceRedraw) {
        // On ne mémorise l'index que si la frame a réellement été peinte.
        if (draw(framesRef.current[clamp(idx, 0, LAST)])) drawnRef.current = idx;
      }
      raf = requestAnimationFrame(tick);
    }

    resize();

    // Mouvement réduit : une seule image fixe, pas de boucle rAF.
    if (reduced) {
      const img = new Image();
      img.onload = () => {
        framesRef.current[0] = img;
        draw(img);
        setPercent(100);
        setReady(true);
        onScroll();
      };
      img.src = `${base}/f_001.jpg`;
      window.addEventListener("resize", () => {
        resize();
        draw(framesRef.current[0]);
      });
      return;
    }

    // Préchargement : on lève l'écran dès EAGER frames, le reste arrive en fond.
    let loaded = 0;
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      draw(framesRef.current[0]);
      setTimeout(() => setReady(true), 250);
      onScroll();
      raf = requestAnimationFrame(tick);
    };

    framesRef.current = new Array(FRAME_COUNT);
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      const done = () => {
        loaded++;
        setPercent(Math.floor((loaded / FRAME_COUNT) * 100));
        if (loaded >= EAGER) release();
      };
      img.onload = done;
      img.onerror = done;
      img.src = `${base}/f_${pad(i + 1)}.jpg`;
      framesRef.current[i] = img;
    }

    const onResize = () => {
      resize();
      drawnRef.current = -1;
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const stageClass = (s: Stage) =>
    cn(
      "pointer-events-none absolute inset-0 flex flex-col items-center px-6 text-center",
      "will-change-[opacity,transform]",
      s.position === "bottom" ? "justify-end pb-[14vh]" : "justify-center"
    );

  return (
    <section
      ref={sectionRef}
      style={{ height: "600vh" }}
      aria-label="Hero"
      className="relative"
    >
      {/* ---- Écran de chargement ---- */}
      <div
        aria-hidden={ready}
        className={cn(
          "fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-[#00060f]",
          "transition-[opacity,visibility] duration-700",
          ready ? "pointer-events-none opacity-0 invisible" : "opacity-100 visible"
        )}
      >
        <div className="text-3xl font-bold tracking-tight">
          Reflex<span className="text-blue-500">Rent</span>
        </div>
        <div className="h-[2px] w-[min(280px,60vw)] overflow-hidden rounded bg-white/10">
          <div
            style={{ width: `${percent}%` }}
            className="h-full bg-blue-500 transition-[width] duration-150"
          />
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">
          Chargement {percent}%
        </div>
      </div>

      {/* ---- Scène collante ---- */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#0a0c10]"
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 35%, transparent 0%, transparent 55%, rgba(0,0,0,0.45) 100%), linear-gradient(to bottom, rgba(8,9,12,0.35) 0%, transparent 18%, transparent 75%, rgba(8,9,12,0.55) 100%)",
          }}
        />

        {/* Étape 1 */}
        <div
          ref={(el) => {
            stageRefs.current[0] = el;
          }}
          style={{ opacity: 0, transform: "translateY(16px)" }}
          className={stageClass(STAGES[0])}
        >
          <div className="mb-7 text-[13px] font-semibold uppercase tracking-[0.2em] text-white/85">
            <span>
              Reflex<span className="text-blue-500">Rent</span>
            </span>{" "}
            · Paris
          </div>
          <h1 className="mb-7 text-balance text-[clamp(48px,8vw,110px)] font-bold leading-[0.95] tracking-[-0.045em] text-white drop-shadow-[0_4px_50px_rgba(0,0,0,0.55)]">
            <span className="block">L&apos;art de rouler</span>
            <span className="block">autrement.</span>
          </h1>
          <p className="max-w-xl text-[clamp(15px,1.4vw,19px)] leading-relaxed text-white/75 drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]">
            Berlines, sportives, supercars et 4×4 d&apos;exception. Livrés à votre porte,
            partout en France.
          </p>
          <div className="absolute bottom-[8vh] left-1/2 -translate-x-1/2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55 animate-[bob_2.4s_ease-in-out_infinite]">
            ↓ Faites défiler
          </div>
        </div>

        {/* Étape 2 */}
        <div
          ref={(el) => {
            stageRefs.current[1] = el;
          }}
          style={{ opacity: 0, transform: "translateY(16px)" }}
          className={stageClass(STAGES[1])}
        >
          <div className="mb-6 text-[12px] font-semibold uppercase tracking-[0.22em] text-blue-400">
            Précision · Détail · Performance
          </div>
          <h2 className="mb-6 text-balance text-[clamp(36px,5.5vw,76px)] font-semibold leading-[0.98] tracking-[-0.035em] text-white drop-shadow-[0_4px_50px_rgba(0,0,0,0.55)]">
            <span className="block">Chaque ligne pensée</span>
            <span className="block">pour vous porter.</span>
          </h2>
        </div>

        {/* Étape 3 */}
        <div
          ref={(el) => {
            stageRefs.current[2] = el;
          }}
          style={{ opacity: 0, transform: "translateY(16px)" }}
          className={stageClass(STAGES[2])}
        >
          <div className="text-[clamp(13px,1.2vw,15px)] font-semibold uppercase tracking-[0.18em] text-white/75 drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]">
            Réservez votre prochaine sortie ↓
          </div>
        </div>
      </div>
    </section>
  );
}
