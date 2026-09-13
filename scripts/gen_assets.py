#!/usr/bin/env python3
"""
Génère tous les assets statiques substituts : logo, visuels véhicules, photo
« fondateurs », avatars d'avis, image OG, favicon.

Réutilise le moteur de rendu de gen_hero_frames.py.
Usage: python3 scripts/gen_assets.py
"""
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_hero_frames as H  # noqa: E402

OUT = "public"
FONT_BOLD = H.FONT_BOLD
FONT_REG = H.FONT_REG
BLUE = H.BLUE


# --------------------------------------------------------------------------
def car_faces_tinted(body, low, rim, height_scale=1.0, ride=0.0):
    """Recolore et redimensionne la carrosserie pour varier les modèles."""
    saved = (H.BODY, H.BODY_LOW, H.RIM, list(H.STATIONS))
    H.BODY, H.BODY_LOW, H.RIM = body, low, rim
    if height_scale != 1.0 or ride:
        H.STATIONS = [(x, w, b + ride, ride + b + (t - b) * height_scale)
                      for (x, w, b, t) in saved[3]]
    faces = H.car_faces()
    H.BODY, H.BODY_LOW, H.RIM, H.STATIONS = saved
    return faces


VEHICLES = [
    # id,                            carrosserie,      bas de caisse,   jantes,         yaw,  haut, garde au sol
    ("ferrari-296-gts",              (132, 20, 26),    (74, 12, 16),    (196, 198, 205), -34, 0.88, 0.00),
    ("mercedes-classe-g-amg",        (34, 37, 44),     (20, 22, 27),    (168, 170, 178), -48, 1.34, 0.16),
    ("lamborghini-urus-performante", (44, 46, 54),     (24, 25, 30),    (150, 132, 96),  -40, 1.22, 0.12),
    ("porsche-gt3-rs",               (198, 201, 208),  (120, 122, 130), (126, 148, 196), -30, 0.84, 0.00),
    ("mercedes-maybach-s",           (28, 31, 40),     (17, 19, 24),    (150, 132, 96),  -44, 1.00, 0.02),
    ("ferrari-12-cilindri-spider",   (120, 18, 24),    (68, 11, 15),    (176, 178, 186), -36, 0.86, 0.00),
    ("rolls-royce-cullinan-2025",    (40, 44, 58),     (23, 25, 33),    (186, 188, 196), -50, 1.28, 0.14),
    ("porsche-356-speedster",        (58, 102, 158),   (34, 60, 94),    (198, 200, 206), -38, 0.80, 0.02),
]


def render_vehicle(body, low, rim, yaw_deg, height_scale, ride, w=1200, h=750):
    faces = car_faces_tinted(body, low, rim, height_scale, ride)
    img = H.make_backdrop(w, h, glow_x=0.5, glow_y=0.40, glow_strength=0.85, horizon=0.68)

    yaw = math.radians(yaw_deg)
    cam = H.Camera((math.cos(yaw) * 8.6, math.sin(yaw) * 8.6, 1.75),
                   (0, 0, 0.78), w, h, fov_deg=33)

    refl = Image.new("RGB", (w, h), (0, 0, 0))
    H.draw_car(ImageDraw.Draw(refl), cam, faces, 0.0, mirror=True)
    refl = refl.filter(ImageFilter.GaussianBlur(radius=max(2, w // 180)))
    img = Image.fromarray(np.clip(
        np.asarray(img, np.float32) + np.asarray(refl, np.float32) * 0.24,
        0, 255).astype(np.uint8))

    H.draw_car(ImageDraw.Draw(img), cam, faces, 0.0)
    return H.vignette(img)


# --------------------------------------------------------------------------
def render_logo(w=480, h=256):
    """Plaque ReflexRent sur fond noir, telle qu'utilisée dans la nav et le footer."""
    img = Image.new("RGB", (w, h), (8, 9, 12))
    img = H.draw_logo_plaque(img, w / 2, h / 2, int(w * 0.86), glow=0.20)
    return img


def render_founders(w=900, h=1125):
    """Photo de showroom substitut : trois voitures alignées, éclairage bleu."""
    img = H.make_backdrop(w, h, glow_x=0.5, glow_y=0.34, glow_strength=0.85, horizon=0.58)

    # une seule caméra, trois voitures décalées le long de l'axe y
    yaw = math.radians(-56)
    cam = H.Camera((math.cos(yaw) * 15.0, math.sin(yaw) * 15.0, 2.8),
                   (0, 0, 0.85), w, h, fov_deg=42)

    specs = [
        ((150, 26, 32), (86, 15, 18), (170, 172, 180), -3.6),
        ((208, 92, 22), (124, 55, 13), (166, 168, 175), 0.0),
        ((34, 38, 48), (20, 22, 28), (150, 132, 96), 3.6),
    ]
    # du plus lointain au plus proche pour que le recouvrement soit correct
    for body, low, rim, offy in sorted(specs, key=lambda s: -s[3]):
        faces = car_faces_tinted(body, low, rim)
        H.draw_car(ImageDraw.Draw(img), cam, faces, 0.0, offset=(0, offy, 0))

    # enseigne au mur du fond
    img = H.draw_logo_plaque(img, w * 0.5, h * 0.17, int(w * 0.40), glow=0.22)
    return H.vignette(img)


AVATARS = [
    ("antoine", "AM", (38, 78, 132)),
    ("elodie", "ER", (122, 52, 96)),
    ("karim", "KB", (44, 96, 92)),
    ("aymeric", "AV", (60, 62, 108)),
    ("sarah", "SL", (136, 74, 44)),
    ("hugo", "HD", (48, 88, 60)),
    ("camille", "CT", (104, 58, 58)),
    ("yanis", "YK", (52, 70, 124)),
    ("maxime", "MJ", (78, 72, 46)),
]


def render_avatar(initials, base, size=128):
    img = Image.new("RGB", (size, size), base)
    d = ImageDraw.Draw(img)
    # léger dégradé diagonal
    grad = np.linspace(0, 1, size, dtype=np.float32)
    gx, gy = np.meshgrid(grad, grad)
    m = ((gx + gy) / 2)[..., None]
    arr = np.asarray(img, np.float32) * (0.72 + 0.55 * m)
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(FONT_BOLD, int(size * 0.38))
    tw = d.textlength(initials, font=f)
    d.text((size / 2 - tw / 2, size * 0.27), initials, font=f, fill=(240, 244, 250))
    return img


def render_og(w=1200, h=630):
    img = H.make_backdrop(w, h, glow_x=0.5, glow_y=0.44, glow_strength=0.9, horizon=0.78)
    img = H.draw_logo_plaque(img, w * 0.5, h * 0.42, int(w * 0.46), glow=0.34)
    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(FONT_REG, 34)
    t = "L'art de rouler autrement."
    tw = d.textlength(t, font=f)
    d.text((w / 2 - tw / 2, h * 0.74), t, font=f, fill=(224, 230, 240))
    return H.vignette(img)


def render_icon(size=512):
    img = Image.new("RGB", (size, size), (8, 9, 12))
    d = ImageDraw.Draw(img)
    g = Image.new("RGB", (size, size), (0, 0, 0))
    ImageDraw.Draw(g).ellipse([size * 0.12, size * 0.12, size * 0.88, size * 0.88],
                              fill=(int(BLUE[0] * 0.5), int(BLUE[1] * 0.5), int(BLUE[2] * 0.5)))
    g = g.filter(ImageFilter.GaussianBlur(radius=size // 10))
    img = Image.fromarray(np.clip(
        np.asarray(img, np.float32) + np.asarray(g, np.float32), 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(FONT_BOLD, int(size * 0.46))
    for text, color, dx in (("R", (255, 255, 255), -0.20), ("R", BLUE, 0.04)):
        tw = d.textlength(text, font=f)
        d.text((size / 2 + dx * size - tw / 2 + tw / 2 - tw / 2, size * 0.24),
               text, font=f, fill=color)
    # deux barres, signature du logo
    bh = max(4, size // 40)
    d.rectangle([size * 0.22, size * 0.76, size * 0.50, size * 0.76 + bh], fill=(255, 255, 255))
    d.rectangle([size * 0.50, size * 0.76, size * 0.78, size * 0.76 + bh], fill=BLUE)
    return img


# --------------------------------------------------------------------------
def main():
    os.makedirs(f"{OUT}/vehicles", exist_ok=True)
    os.makedirs(f"{OUT}/branding", exist_ok=True)
    os.makedirs(f"{OUT}/avatars", exist_ok=True)

    for vid, body, low, rim, yaw, hs, ride in VEHICLES:
        render_vehicle(body, low, rim, yaw, hs, ride).save(
            f"{OUT}/vehicles/{vid}.png", optimize=True)
        print("véhicule", vid)

    logo = render_logo(480, 256)
    logo.save(f"{OUT}/branding/logo-480.png", optimize=True)
    logo.resize((240, 128), Image.LANCZOS).save(f"{OUT}/branding/logo-240.png", optimize=True)
    print("logo")

    render_founders().save(f"{OUT}/branding/founders.jpg", quality=86, optimize=True)
    print("fondateurs")

    for name, initials, base in AVATARS:
        render_avatar(initials, base).save(f"{OUT}/avatars/{name}.jpg", quality=88, optimize=True)
    print("avatars")

    render_og().save(f"{OUT}/og-image.png", optimize=True)
    render_icon().save("app/icon.png", optimize=True)
    render_icon(180).save("app/apple-icon.png", optimize=True)
    print("og + favicons")


if __name__ == "__main__":
    main()
