/**
 * Logique pure de la séquence héros : mapping scroll → frame et opacité des
 * calques de texte. Isolée ici pour être vérifiable sans DOM (voir hero.test.mjs).
 *
 * Les constantes proviennent du relevé du site d'origine — ne pas les modifier
 * sans recalibrer l'ensemble.
 */
export const FRAME_COUNT = 297;
export const LAST_FRAME = FRAME_COUNT - 1; // 296

/** Lissage exponentiel de la frame courante, par tick de rAF. */
export const SMOOTHING = 0.22;

/** Fondu d'entrée avant `start`, fondu de sortie après `end`. */
export const FADE_IN = 0.04;
export const FADE_OUT = 0.06;

/** Facteur de zoom appliqué en fin de séquence sur viewport portrait. */
export const PORTRAIT_ZOOM = 1.5789473684210529;
export const PORTRAIT_ZOOM_START = 0.78;
export const PORTRAIT_ZOOM_SPAN = 0.12;

export type Stage = { start: number; end: number; position?: "bottom" };

export const STAGES: Stage[] = [
  { start: 0, end: 0.16 },
  { start: 0.22, end: 0.4 },
  { start: 0.86, end: 1, position: "bottom" },
];

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** Progression 0→1 de la section héros, à partir de son rectangle. */
export function heroProgress(rectTop: number, rectHeight: number, viewportH: number) {
  const scrollable = rectHeight - viewportH;
  return scrollable > 0 ? clamp(-rectTop / scrollable, 0, 1) : 0;
}

/** Frame visée pour une progression donnée. */
export function targetFrame(progress: number) {
  return LAST_FRAME * progress;
}

/** Opacité d'un calque de texte pour une progression donnée. */
export function stageOpacity(p: number, start: number, end: number) {
  if (p < start - FADE_IN || p > end + FADE_OUT) return 0;
  if (p < start) return (p - (start - FADE_IN)) / FADE_IN;
  if (p > end) return 1 - (p - end) / FADE_OUT;
  return 1;
}

/** Facteur de zoom portrait (0 en paysage, 0→1 en fin de séquence en portrait). */
export function portraitZoomFactor(progress: number, canvasW: number, canvasH: number) {
  if (canvasW / canvasH >= 1) return 0;
  return clamp((progress - PORTRAIT_ZOOM_START) / PORTRAIT_ZOOM_SPAN, 0, 1);
}

/** Dimensions de dessin « cover » d'une image dans le canvas. */
export function coverSize(imgW: number, imgH: number, cw: number, ch: number) {
  const ir = imgW / imgH;
  const cr = cw / ch;
  return ir > cr ? { w: ch * ir, h: ch } : { w: cw, h: cw / ir };
}
