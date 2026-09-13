/**
 * Captures de vérification, en Chromium headless.
 * Le panneau navigateur du harnais ne compose plus après le chargement des
 * 297 frames ; ce script contourne le problème et permet de vérifier
 * réellement le rendu, canvas du héros compris.
 *
 * Usage : node scripts/shoot.mjs [url] [outDir]
 */
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const URL_BASE = process.argv[2] ?? "http://localhost:33851/";
const OUT = process.argv[3] ?? "/tmp/shots";

const HERO_H = 5400;
const VIEW_H = 900;
const SCROLLABLE = HERO_H - VIEW_H; // 4500

/** Points de vérification du héros, en progression 0→1. */
const HERO_POINTS = [0, 0.1, 0.3, 0.5, 0.7, 0.94];

/** Sections statiques, par offset de scroll absolu. */
const SECTIONS = [
  ["02-reservation-flotte", 5330],
  ["03-flotte-cartes", 6050],
  ["04-categories", 7000],
  ["05-services", 7950],
  ["06-histoire", 8700],
  ["07-avis", 9580],
  ["08-faq", 10720],
  ["09-cta-footer", 11750],
];

async function settle(page, ms = 900) {
  await page.waitForTimeout(ms);
}

async function run() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox", "--force-device-scale-factor=1"],
  });

  // ---------------- desktop ----------------
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));

  await page.goto(URL_BASE, { waitUntil: "load", timeout: 60000 });

  // On attend que l'écran de chargement soit réellement levé.
  await page.waitForFunction(
    () => {
      const pre = document.querySelector('section[aria-label="Hero"] > div');
      return pre && getComputedStyle(pre).visibility === "hidden";
    },
    { timeout: 60000 }
  );
  await settle(page, 1200);

  for (const p of HERO_POINTS) {
    const y = Math.round(SCROLLABLE * p);
    await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), y);
    await settle(page, 1100);
    const name = `01-hero-p${String(Math.round(p * 100)).padStart(3, "0")}`;
    await page.screenshot({ path: `${OUT}/${name}.png` });
  }

  for (const [name, y] of SECTIONS) {
    await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), y);
    await settle(page, 800);
    await page.screenshot({ path: `${OUT}/${name}.png` });
  }

  // Vérifications programmatiques
  const facts = await page.evaluate(() => {
    const hero = document.querySelector('section[aria-label="Hero"]');
    const canvas = hero.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    // le canvas est-il réellement peint ? (on échantillonne 5 points)
    const pts = [
      [0.5, 0.5],
      [0.25, 0.4],
      [0.75, 0.6],
      [0.5, 0.8],
      [0.15, 0.15],
    ].map(([fx, fy]) => {
      const d = ctx.getImageData(
        Math.floor(canvas.width * fx),
        Math.floor(canvas.height * fy),
        1,
        1
      ).data;
      return [d[0], d[1], d[2]];
    });
    const distinct = new Set(pts.map((p) => p.join(","))).size;
    return {
      docHeight: document.documentElement.scrollHeight,
      heroHeight: hero.getBoundingClientRect().height,
      canvasBuffer: canvas.width + "x" + canvas.height,
      canvasSamples: pts,
      canvasDistinctColours: distinct,
      sections: [...document.querySelectorAll("main > *")].map(
        (s) =>
          s.tagName +
          ":" +
          Math.round(s.getBoundingClientRect().top + window.scrollY) +
          "+" +
          Math.round(s.getBoundingClientRect().height)
      ),
      navScrolled: getComputedStyle(document.querySelector("nav")).backgroundColor,
      whatsappOpacity: getComputedStyle(
        document.querySelector('a[href*="wa.me"][aria-label]')
      ).opacity,
      revealsHidden: [...document.querySelectorAll('[style*="translate3d"]')].filter(
        (e) => e.style.opacity === "0"
      ).length,
      images404: [...document.images].filter((i) => i.complete && i.naturalWidth === 0)
        .length,
      totalImages: document.images.length,
    };
  });

  // ---------------- mobile ----------------
  const mob = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await mob.goto(URL_BASE, { waitUntil: "load", timeout: 60000 });
  await mob.waitForFunction(
    () => {
      const pre = document.querySelector('section[aria-label="Hero"] > div');
      return pre && getComputedStyle(pre).visibility === "hidden";
    },
    { timeout: 60000 }
  );
  await settle(mob, 1200);
  await mob.screenshot({ path: `${OUT}/10-mobile-hero.png` });

  const mobHeroH = await mob.evaluate(
    () => document.querySelector('section[aria-label="Hero"]').getBoundingClientRect().height
  );
  const mobScrollable = mobHeroH - 844;
  await mob.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), mobScrollable + 200);
  await settle(mob, 900);
  await mob.screenshot({ path: `${OUT}/11-mobile-reservation.png` });
  await mob.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), mobScrollable + 1400);
  await settle(mob, 900);
  await mob.screenshot({ path: `${OUT}/12-mobile-flotte.png` });

  // quelle variante de frames le mobile a-t-il chargée ?
  const mobFrameSrc = await mob.evaluate(
    () =>
      performance
        .getEntriesByType("resource")
        .filter((r) => r.name.includes("hero-frames"))
        .slice(0, 1)
        .map((r) => new URL(r.name).pathname)[0] ?? null
  );

  await browser.close();

  console.log(JSON.stringify({ ...facts, mobFrameSrc, consoleErrors: errors }, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
