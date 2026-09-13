#!/usr/bin/env python3
"""
Génère la séquence héros de ReflexRent : 297 frames, 16:9.

Substitut maison de la vidéo d'origine (générée par Veo, filigranée, non réutilisable).
Rendu 3D minimal : projection perspective + algorithme du peintre, en numpy/PIL.

Découpage identique à l'original :
  f001-f120  orbite autour d'une berline sombre, studio bleu
  f121-f175  travelling rapproché le long du flanc
  f176-f215  recul, la voiture sort, le mur logo se révèle
  f216-f297  plaque ReflexRent rétro-éclairée, lent travelling avant

Usage: python3 scripts/gen_hero_frames.py [--preview N] [--width W]
"""
import argparse
import math
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FRAME_COUNT = 297
ASPECT = 16 / 9

BG_DEEP = (6, 9, 18)
BLUE = (33, 150, 243)
FLOOR_NEAR = (16, 20, 30)

FONT_BOLD = "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/TTF/DejaVuSans.ttf"


# --------------------------------------------------------------------------
# maths 3D
# --------------------------------------------------------------------------
def normalize(v):
    n = math.sqrt(sum(c * c for c in v))
    return (v[0] / n, v[1] / n, v[2] / n) if n else v


def sub(a, b):
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def cross(a, b):
    return (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])


def dot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


class Camera:
    """Caméra look-at + projection perspective."""

    def __init__(self, eye, target, w, h, fov_deg=38.0, up=(0, 0, 1)):
        self.eye = eye
        self.w, self.h = w, h
        f = normalize(sub(target, eye))
        r = normalize(cross(f, up))
        u = cross(r, f)
        self.f, self.r, self.u = f, r, u
        self.scale = (h / 2) / math.tan(math.radians(fov_deg) / 2)

    def project(self, p):
        d = sub(p, self.eye)
        z = dot(d, self.f)
        if z <= 0.05:
            return None
        x = dot(d, self.r)
        y = dot(d, self.u)
        return (self.w / 2 + x * self.scale / z, self.h / 2 - y * self.scale / z, z)


# --------------------------------------------------------------------------
# géométrie de la berline
# --------------------------------------------------------------------------
# (x le long de la voiture, demi-largeur, z bas de caisse, z haut)
# Berline longue et basse. BELT = ligne de ceinture : en dessous = tôle, au-dessus = vitrage.
BELT = 1.00
STATIONS = [
    (-2.62, 0.62, 0.34, 0.78),
    (-2.35, 0.86, 0.29, 0.92),
    (-1.95, 0.95, 0.27, 1.02),
    (-1.45, 0.98, 0.26, 1.20),
    (-0.75, 1.00, 0.26, 1.30),
    (0.05, 1.00, 0.26, 1.31),
    (0.70, 0.99, 0.26, 1.22),
    (1.30, 0.97, 0.27, 1.01),
    (1.95, 0.93, 0.29, 0.90),
    (2.45, 0.84, 0.32, 0.83),
    (2.72, 0.66, 0.38, 0.74),
]

BODY = (30, 33, 42)
BODY_LOW = (18, 20, 26)
GLASS = (10, 13, 22)
TIRE = (13, 13, 16)
RIM = (152, 132, 96)  # jantes bronze, comme l'original


def car_faces():
    """Retourne une liste de (points3D, couleur_base, is_glass)."""
    faces = []
    for i in range(len(STATIONS) - 1):
        x0, w0, b0, t0 = STATIONS[i]
        x1, w1, b1, t1 = STATIONS[i + 1]

        # --- flancs, coupés à la ligne de ceinture ---
        for sgn in (1, -1):
            m0 = min(t0, BELT)
            m1 = min(t1, BELT)
            # tôle
            faces.append(([(x0, sgn * w0, b0), (x1, sgn * w1, b1),
                           (x1, sgn * w1, m1), (x0, sgn * w0, m0)], BODY, False))
            # vitrage latéral, seulement là où le toit dépasse la ceinture
            if t0 > BELT and t1 > BELT:
                gw0, gw1 = w0 * 0.93, w1 * 0.93
                faces.append(([(x0, sgn * gw0, m0), (x1, sgn * gw1, m1),
                               (x1, sgn * gw1, t1), (x0, sgn * gw0, t0)], GLASS, True))

        # --- dessus ---
        glass_top = t0 > BELT + 0.12 and t1 > BELT + 0.12
        tw0 = w0 * (0.93 if glass_top else 1.0)
        tw1 = w1 * (0.93 if glass_top else 1.0)
        faces.append(([(x0, -tw0, t0), (x1, -tw1, t1), (x1, tw1, t1), (x0, tw0, t0)],
                      GLASS if glass_top else BODY, glass_top))

        # --- dessous ---
        faces.append(([(x0, -w0, b0), (x0, w0, b0), (x1, w1, b1), (x1, -w1, b1)],
                      (6, 6, 8), False))

        # --- bas de caisse plus sombre ---
        faces.append(([(x0, -w0, b0), (x1, -w1, b1), (x1, -w1, b1 + 0.10), (x0, -w0, b0 + 0.10)],
                      BODY_LOW, False))
        faces.append(([(x0, w0, b0), (x0, w0, b0 + 0.10), (x1, w1, b1 + 0.10), (x1, w1, b1)],
                      BODY_LOW, False))

    # capuchons avant / arrière
    xa, wa, ba, ta = STATIONS[0]
    faces.append(([(xa, -wa, ba), (xa, wa, ba), (xa, wa, ta), (xa, -wa, ta)], BODY, False))
    xb, wb, bb, tb = STATIONS[-1]
    faces.append(([(xb, -wb, bb), (xb, -wb, tb), (xb, wb, tb), (xb, wb, bb)], BODY, False))

    # roues
    for ax in (1.72, -1.75):
        for ay in (0.99, -0.99):
            faces += wheel_faces(ax, ay, 0.40, 0.15)
    return faces


def wheel_faces(cx, cy, radius, half_w, seg=18):
    """Cylindre approché : bande de roulement + disque de jante côté extérieur."""
    out = []
    pts = [(cx + radius * math.cos(2 * math.pi * k / seg),
            radius * 0.0,
            radius + radius * math.sin(2 * math.pi * k / seg)) for k in range(seg)]
    for k in range(seg):
        a = pts[k]
        b = pts[(k + 1) % seg]
        y_in = cy - half_w if cy > 0 else cy + half_w
        y_out = cy + half_w if cy > 0 else cy - half_w
        out.append(([(a[0], y_in, a[2]), (b[0], y_in, b[2]),
                     (b[0], y_out, b[2]), (a[0], y_out, a[2])], TIRE, False))
    # disque de jante, un peu rentré
    yd = cy + (half_w * 0.72 if cy > 0 else -half_w * 0.72)
    disc = [(cx + radius * 0.54 * math.cos(2 * math.pi * k / seg), yd,
             radius + radius * 0.54 * math.sin(2 * math.pi * k / seg)) for k in range(seg)]
    out.append((disc, RIM, False))
    return out


# --------------------------------------------------------------------------
# fond : dégradé + halo bleu + sol
# --------------------------------------------------------------------------
def make_backdrop(w, h, glow_x=0.5, glow_y=0.42, glow_strength=1.0, horizon=0.62):
    small_w, small_h = 160, 90
    yy, xx = np.mgrid[0:small_h, 0:small_w].astype(np.float32)
    u = xx / (small_w - 1)
    v = yy / (small_h - 1)

    img = np.zeros((small_h, small_w, 3), np.float32)
    img[:] = np.array(BG_DEEP, np.float32)

    # halo bleu derrière la voiture
    d = np.sqrt(((u - glow_x) * 1.5) ** 2 + ((v - glow_y) * 2.1) ** 2)
    glow = np.clip(1.0 - d / 1.05, 0, 1) ** 2.1
    img += glow[..., None] * np.array(BLUE, np.float32) * 0.72 * glow_strength

    # sol
    floor = v > horizon
    t = np.clip((v - horizon) / max(1e-3, 1 - horizon), 0, 1)
    floor_col = (np.array(BG_DEEP, np.float32) * (1 - t[..., None])
                 + np.array(FLOOR_NEAR, np.float32) * t[..., None])
    # traînée spéculaire au sol, sous le halo
    streak = np.clip(1.0 - np.abs(u - glow_x) * 2.6, 0, 1) ** 2 * np.clip(1 - t * 1.4, 0, 1)
    floor_col += streak[..., None] * np.array(BLUE, np.float32) * 0.5
    img = np.where(floor[..., None], floor_col, img)

    out = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    return out.filter(ImageFilter.GaussianBlur(radius=max(1, w // 320)))


def vignette(img):
    w, h = img.size
    sw, sh = 120, 68
    yy, xx = np.mgrid[0:sh, 0:sw].astype(np.float32)
    u = (xx / (sw - 1) - 0.5) * 2
    v = (yy / (sh - 1) - 0.42) * 2
    d = np.sqrt((u * 0.92) ** 2 + (v * 0.86) ** 2)
    m = np.clip((d - 0.55) / 0.95, 0, 1) ** 1.6
    mask = Image.fromarray((m * 150).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    dark = Image.new("RGB", (w, h), (0, 0, 0))
    return Image.composite(dark, img, mask)


# --------------------------------------------------------------------------
# rendu d'une passe voiture
# --------------------------------------------------------------------------
LIGHT = normalize((-0.45, -0.62, 0.68))


def shade(base, normal, view_dir, boost=1.0):
    lam = max(0.0, dot(normal, LIGHT))
    amb = 0.16
    k = amb + 0.84 * lam ** 0.85
    rim = max(0.0, 1.0 - abs(dot(normal, view_dir))) ** 3.0
    r = base[0] * k + BLUE[0] * rim * 0.75
    g = base[1] * k + BLUE[1] * rim * 0.75
    b = base[2] * k + BLUE[2] * rim * 0.95
    return (min(255, int(r * boost)), min(255, int(g * boost)), min(255, int(b * boost)))


def draw_car(draw, cam, faces, yaw, offset=(0, 0, 0), mirror=False, alpha_layer=None):
    cy, sy = math.cos(yaw), math.sin(yaw)
    prepared = []
    for pts, base, is_glass in faces:
        world = []
        for (x, y, z) in pts:
            wx = x * cy - y * sy + offset[0]
            wy = x * sy + y * cy + offset[1]
            wz = (-z if mirror else z) + offset[2]
            world.append((wx, wy, wz))
        if len(world) < 3:
            continue
        n = normalize(cross(sub(world[1], world[0]), sub(world[2], world[0])))
        centroid = (sum(p[0] for p in world) / len(world),
                    sum(p[1] for p in world) / len(world),
                    sum(p[2] for p in world) / len(world))
        view = normalize(sub(centroid, cam.eye))
        if dot(n, view) > 0:          # face arrière
            n = (-n[0], -n[1], -n[2])
        proj = [cam.project(p) for p in world]
        if any(p is None for p in proj):
            continue
        depth = sum(p[2] for p in proj) / len(proj)
        prepared.append((depth, [(p[0], p[1]) for p in proj], shade(base, n, view)))

    for depth, poly, col in sorted(prepared, key=lambda t: -t[0]):
        if alpha_layer is not None:
            alpha_layer.polygon(poly, fill=col + (alpha_layer_alpha,))
        else:
            draw.polygon(poly, fill=col)


alpha_layer_alpha = 60


# --------------------------------------------------------------------------
# logo
# --------------------------------------------------------------------------
def _fit_font(draw, text_bold, target_w, path, lo=8, hi=400):
    """Plus grande taille de police telle que le texte tienne dans target_w."""
    best = lo
    while lo <= hi:
        mid = (lo + hi) // 2
        f = ImageFont.truetype(path, mid)
        if draw.textlength(text_bold, font=f) <= target_w:
            best = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return ImageFont.truetype(path, best), best


def draw_logo_plaque(img, cx, cy, plaque_w, glow=1.0, baseline=True):
    """Plaque noire « ReflexRent » rétro-éclairée en bleu, façon enseigne."""
    w, h = img.size
    plaque_h = int(plaque_w * 0.40)
    x0, y0 = int(cx - plaque_w / 2), int(cy - plaque_h / 2)

    # halo arrière (additif, contenu)
    g = Image.new("RGB", (w, h), (0, 0, 0))
    gd = ImageDraw.Draw(g)
    pad = int(plaque_w * 0.055)
    gd.rectangle([x0 - pad, y0 - pad, x0 + plaque_w + pad, y0 + plaque_h + pad],
                 fill=(int(BLUE[0] * glow), int(BLUE[1] * glow), int(BLUE[2] * glow)))
    g = g.filter(ImageFilter.GaussianBlur(radius=max(5, int(plaque_w * 0.075))))
    img = Image.fromarray(np.clip(
        np.asarray(img, np.float32) + np.asarray(g, np.float32) * 0.85,
        0, 255).astype(np.uint8))

    d = ImageDraw.Draw(img)
    d.rectangle([x0, y0, x0 + plaque_w, y0 + plaque_h], fill=(8, 9, 12))
    d.rectangle([x0, y0, x0 + plaque_w, y0 + plaque_h],
                outline=(46, 50, 60), width=max(1, plaque_w // 300))

    t1, t2 = "Reflex", "Rent"
    fb, fs = _fit_font(d, t1 + t2, plaque_w * 0.84, FONT_BOLD)
    w1 = d.textlength(t1, font=fb)
    w2 = d.textlength(t2, font=fb)
    tx = cx - (w1 + w2) / 2
    ty = y0 + plaque_h * 0.14

    d.text((tx, ty), t1, font=fb, fill=(255, 255, 255))
    d.text((tx + w1, ty), t2, font=fb, fill=BLUE)

    # les deux barres sous le lettrage
    by = ty + fs * 1.16
    bh = max(2, int(plaque_h * 0.05))
    d.rectangle([tx, by, tx + w1, by + bh], fill=(255, 255, 255))
    d.rectangle([tx + w1, by, tx + w1 + w2, by + bh], fill=BLUE)

    if baseline and plaque_h > 60:
        sub_t = "Location de Véhicules"
        fr = ImageFont.truetype(FONT_REG, max(8, int(fs * 0.27)))
        ws = d.textlength(sub_t, font=fr)
        d.text((cx - ws / 2, by + bh * 2.0), sub_t, font=fr, fill=(226, 231, 240))
    return img


# --------------------------------------------------------------------------
# mise en scène : une frame à partir de la progression 0->1
# --------------------------------------------------------------------------
def ease(t):
    return t * t * (3 - 2 * t)


def seg(p, a, b):
    return min(1.0, max(0.0, (p - a) / (b - a)))


def render_frame(i, w, h, faces):
    p = i / (FRAME_COUNT - 1)

    # --- acte 4 : la plaque logo (72 % -> 100 %) ---
    if p >= 0.723:
        q = ease(seg(p, 0.723, 1.0))
        img = make_backdrop(w, h, glow_x=0.5, glow_y=0.46,
                            glow_strength=0.40 + 0.50 * q, horizon=0.82)
        plaque_w = int(w * (0.44 + 0.16 * q))
        img = draw_logo_plaque(img, w * 0.5, h * (0.50 - 0.015 * q), plaque_w,
                               glow=0.26 + 0.40 * q)
        return vignette(img)

    # --- actes 1-3 : la voiture ---
    if p < 0.404:                       # orbite 3/4 avant, caméra qui descend
        t = ease(seg(p, 0.0, 0.404))
        yaw = math.radians(-46 + 56 * t)
        dist = 9.0 - 1.5 * t
        height = 1.85 - 0.75 * t
        fov = 34
        look = (0.0, 0, 0.72)
    elif p < 0.589:                     # travelling rapproché le long du flanc
        t = ease(seg(p, 0.404, 0.589))
        yaw = math.radians(10 + 62 * t)
        dist = 7.5 - 3.4 * t
        height = 1.10 - 0.48 * t
        fov = 32
        look = (1.6 - 3.2 * t, 0, 0.66 - 0.12 * t)
    else:                               # recul : la voiture s'éloigne, le mur logo se révèle
        t = ease(seg(p, 0.589, 0.723))
        yaw = math.radians(72 + 20 * t)
        dist = 4.1 + 7.5 * t
        height = 0.62 + 1.25 * t
        fov = 32 + 6 * t
        look = (-1.6 + 1.6 * t, 0, 0.54 + 0.26 * t)

    glow_x = 0.5 + 0.07 * math.sin(p * 3.1)
    img = make_backdrop(w, h, glow_x=glow_x, glow_y=0.40,
                        glow_strength=1.0, horizon=0.615)

    # le mur logo apparaît au fond pendant l'acte 3, AVANT la voiture
    if p >= 0.589:
        t = ease(seg(p, 0.589, 0.723))
        img = draw_logo_plaque(img, w * 0.5, h * 0.365,
                               int(w * (0.16 + 0.16 * t)),
                               glow=0.10 + 0.16 * t, baseline=False)

    eye = (math.cos(yaw) * dist, math.sin(yaw) * dist, height)
    cam = Camera(eye, look, w, h, fov_deg=fov)

    # reflet au sol, dessiné avant la voiture
    refl = Image.new("RGB", (w, h), (0, 0, 0))
    draw_car(ImageDraw.Draw(refl), cam, faces, 0.0, mirror=True)
    refl = refl.filter(ImageFilter.GaussianBlur(radius=max(2, w // 200)))
    img = Image.fromarray(
        np.clip(np.asarray(img, np.float32) + np.asarray(refl, np.float32) * 0.20,
                0, 255).astype(np.uint8))

    draw_car(ImageDraw.Draw(img), cam, faces, 0.0)
    return vignette(img)


# --------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--preview", type=int, default=None,
                    help="ne rendre qu'une frame (index 1-297) et l'écrire dans /tmp")
    ap.add_argument("--width", type=int, default=1920)
    ap.add_argument("--out", default="public")
    args = ap.parse_args()

    w = args.width
    h = int(round(w / ASPECT))
    faces = car_faces()

    if args.preview:
        img = render_frame(args.preview - 1, w, h, faces)
        path = f"/tmp/hero_preview_{args.preview:03d}.jpg"
        img.save(path, quality=88)
        print(path)
        return

    big = os.path.join(args.out, "hero-frames")
    small = os.path.join(args.out, "hero-frames-sm")
    os.makedirs(big, exist_ok=True)
    os.makedirs(small, exist_ok=True)

    for i in range(FRAME_COUNT):
        img = render_frame(i, w, h, faces)
        name = f"f_{i + 1:03d}.jpg"
        img.save(os.path.join(big, name), quality=78, optimize=True, progressive=True)
        img.resize((1280, 720), Image.LANCZOS).save(
            os.path.join(small, name), quality=72, optimize=True, progressive=True)
        if (i + 1) % 30 == 0:
            print(f"  {i + 1}/{FRAME_COUNT}")
    print("terminé")


if __name__ == "__main__":
    main()
