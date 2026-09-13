"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { isoDate } from "@/lib/utils";

export function BookingBar() {
  const router = useRouter();
  const [from, setFrom] = useState(isoDate(1));
  const [to, setTo] = useState(isoDate(4));

  return (
    <section id="reservation" className="relative -mt-20 z-30 px-4">
      <div className="container-x">
        <div className="rounded-3xl border border-white/10 bg-[#0b0e15]/95 p-6 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl md:p-8">
          <div className="mb-5 flex flex-col items-start gap-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400">
              Réservez votre prochaine sortie
            </div>
            <p className="text-sm text-white/60">
              Récupération à notre agence parisienne. Réponse confirmée sous 1 heure.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/catalogue?from=${from}&to=${to}`);
            }}
          >
            <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto] md:gap-4">
              <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3.5">
                <MapPin size={18} className="shrink-0 text-blue-400" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
                    Lieu de retrait
                  </div>
                  <div className="truncate text-sm font-medium text-white">Paris · 16ᵉ</div>
                  <div className="truncate text-[11px] text-white/55">
                    {BRAND.address.street}
                  </div>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3.5 transition-colors focus-within:border-blue-500/60 hover:border-white/15">
                <Calendar size={18} className="shrink-0 text-blue-400" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
                    Date de retrait
                  </div>
                  <input
                    type="date"
                    min={isoDate(0)}
                    value={from}
                    onChange={(e) => {
                      setFrom(e.target.value);
                      if (e.target.value >= to) setTo(e.target.value);
                    }}
                    className="w-full bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]"
                  />
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3.5 transition-colors focus-within:border-blue-500/60 hover:border-white/15">
                <Calendar size={18} className="shrink-0 text-blue-400" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
                    Date de retour
                  </div>
                  <input
                    type="date"
                    min={from}
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-600 hover:shadow-[0_12px_40px_-6px_rgba(33,150,243,0.6)]"
              >
                Voir les véhicules disponibles
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
