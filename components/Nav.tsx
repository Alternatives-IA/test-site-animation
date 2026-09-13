"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/catalogue", label: "Nos véhicules" },
  { href: "/#categories", label: "Catégories" },
  { href: "/#services", label: "Services" },
  { href: "/#histoire", label: "Notre histoire" },
  { href: "/#contact", label: "Contact" },
];

function LocaleSwitch({ className }: { className?: string }) {
  const [locale, setLocale] = useState<"fr" | "en">("fr");
  return (
    <div
      className={cn(
        "items-center rounded-full bg-white/5 ring-1 ring-white/10 text-[11px] font-semibold tracking-widest backdrop-blur-md p-0.5",
        className
      )}
    >
      {(["fr", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-label={`Switch to ${l.toUpperCase()}`}
          className={cn(
            "rounded-full px-3 py-1.5 transition-colors",
            locale === l ? "bg-blue-500 text-white" : "text-white/55 hover:text-white"
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-300",
          scrolled
            ? "bg-black/65 backdrop-blur-xl backdrop-saturate-150 border-b border-white/[0.06]"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="container-x flex h-16 items-center justify-between gap-3 md:h-20 md:gap-6">
          <Link
            href="/"
            aria-label="ReflexRent"
            className="relative inline-flex shrink-0 items-center"
          >
            <Image
              src="/branding/logo-240.png"
              alt="ReflexRent"
              width={120}
              height={64}
              priority
              unoptimized
              className="h-9 w-auto md:h-11"
            />
          </Link>

          <ul className="hidden lg:flex items-center gap-7 text-[13px] font-medium text-white/70">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} prefetch={false} className="transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 md:gap-3">
            <LocaleSwitch className="hidden md:inline-flex" />

            <Link
              href="/#reservation"
              className="hidden sm:inline-flex items-center rounded-full bg-blue-500 px-4 py-2 text-[13px] font-semibold text-white transition-all hover:bg-blue-600 hover:shadow-[0_8px_28px_-4px_rgba(33,150,243,0.6)]"
            >
              Réserver
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:text-white"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Panneau mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-full max-w-sm border-l border-white/10 bg-[#0a0c10] p-8 transition-transform duration-300",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="mt-16 flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                prefetch={false}
                onClick={() => setOpen(false)}
                className="flex h-12 items-center text-lg font-medium tracking-tight text-white/80 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
            <LocaleSwitch className="inline-flex" />
            <Link
              href="/#reservation"
              onClick={() => setOpen(false)}
              className="inline-flex items-center rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Réserver
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
