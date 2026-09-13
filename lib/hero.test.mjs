/**
 * Vérification de la logique du héros. Sans framework.
 * Lancer : npm test
 */
import assert from "node:assert/strict";
import {
  FRAME_COUNT,
  LAST_FRAME,
  STAGES,
  coverSize,
  heroProgress,
  portraitZoomFactor,
  stageOpacity,
  targetFrame,
} from "./hero.ts";

// --- progression -----------------------------------------------------------
// Section de 600vh dans un viewport de 900px : 5400 - 900 = 4500px scrutables.
assert.equal(heroProgress(0, 5400, 900), 0, "en haut de la section → 0");
assert.equal(heroProgress(-4500, 5400, 900), 1, "en bas de la section → 1");
assert.equal(heroProgress(-2250, 5400, 900), 0.5, "à mi-course → 0.5");
assert.equal(heroProgress(500, 5400, 900), 0, "au-dessus de la section → borné à 0");
assert.equal(heroProgress(-9999, 5400, 900), 1, "au-delà → borné à 1");
assert.equal(heroProgress(0, 900, 900), 0, "section non scrutable → 0, pas de NaN");

// --- mapping frame ---------------------------------------------------------
assert.equal(targetFrame(0), 0);
assert.equal(targetFrame(1), LAST_FRAME);
assert.equal(Math.round(targetFrame(0.5)), 148);
assert.equal(FRAME_COUNT, 297);

// --- opacité des calques ---------------------------------------------------
const [s1, s2, s3] = STAGES;

// Étape 1 : visible dès le départ, éteinte à 0.22 (où l'étape 2 commence).
assert.equal(stageOpacity(0, s1.start, s1.end), 1, "étape 1 pleine à p=0");
assert.equal(stageOpacity(0.16, s1.start, s1.end), 1, "étape 1 pleine à sa fin");
assert.equal(stageOpacity(0.22, s1.start, s1.end), 0, "étape 1 éteinte à 0.22");
assert.ok(
  stageOpacity(0.19, s1.start, s1.end) > 0 && stageOpacity(0.19, s1.start, s1.end) < 1,
  "étape 1 en cours de fondu à 0.19"
);

// Étape 2 : fondu d'entrée à partir de 0.18.
assert.equal(stageOpacity(0.18, s2.start, s2.end), 0, "étape 2 éteinte à 0.18");
assert.equal(stageOpacity(0.22, s2.start, s2.end), 1, "étape 2 pleine à 0.22");
assert.equal(stageOpacity(0.4, s2.start, s2.end), 1, "étape 2 pleine à 0.40");
assert.equal(stageOpacity(0.46, s2.start, s2.end), 0, "étape 2 éteinte à 0.46");

// Le creux voulu : aucun texte entre 0.46 et 0.82.
for (const p of [0.5, 0.6, 0.7, 0.8]) {
  const total = STAGES.reduce((a, s) => a + stageOpacity(p, s.start, s.end), 0);
  assert.equal(total, 0, `aucun texte affiché à p=${p}`);
}

// Étape 3 : le rappel final.
assert.equal(stageOpacity(0.86, s3.start, s3.end), 1, "étape 3 pleine à 0.86");
assert.equal(stageOpacity(1, s3.start, s3.end), 1, "étape 3 pleine à la fin");

// --- zoom portrait ---------------------------------------------------------
assert.equal(portraitZoomFactor(0.95, 1440, 900), 0, "pas de zoom en paysage");
assert.equal(portraitZoomFactor(0.5, 390, 844), 0, "pas de zoom avant 0.78");
assert.equal(portraitZoomFactor(0.9, 390, 844), 1, "zoom complet à 0.90");
assert.ok(
  Math.abs(portraitZoomFactor(0.84, 390, 844) - 0.5) < 1e-9,
  "zoom à mi-course à 0.84"
);

// --- dimensionnement cover -------------------------------------------------
// Frame 16:9 dans un canvas plus étroit : on borne la hauteur, on déborde en largeur.
let c = coverSize(1920, 1080, 1425, 900);
assert.equal(c.h, 900);
assert.ok(c.w > 1425, "l'image déborde horizontalement, jamais de bande noire");

// Frame 16:9 dans un canvas très large : on borne la largeur.
c = coverSize(1920, 1080, 2000, 900);
assert.equal(c.w, 2000);
assert.ok(c.h > 900, "l'image déborde verticalement");

console.log("✓ logique du héros : tous les contrôles passent");
