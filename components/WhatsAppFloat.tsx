"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={buildSimpleWhatsAppUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="Contacter ReflexRent sur WhatsApp"
      className={cn(
        "fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full",
        "bg-[#25d366] text-white shadow-[0_12px_36px_-6px_rgba(37,211,102,0.55)]",
        "transition-all duration-300 hover:scale-105 hover:bg-[#1ebe5b] md:bottom-7 md:right-7",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      <MessageCircle className="h-7 w-7" strokeWidth={2} />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25d366]/40" />
    </a>
  );
}
