import Image from "next/image";
import Link from "next/link";
import { Briefcase, Gauge, Users } from "lucide-react";
import { BRAND } from "@/lib/brand";
import type { Vehicle } from "@/lib/vehicles";
import { cn } from "@/lib/utils";

export function CategoryBadge({
  category,
  className,
  size = "sm",
}: {
  category: string;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold uppercase tracking-[0.16em]",
        "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30 backdrop-blur-md",
        size === "sm" ? "text-[10px] px-2.5 py-1" : "text-xs px-3 py-1.5",
        className
      )}
    >
      {category}
    </span>
  );
}

export function VehicleCard({
  vehicle: v,
  priority = false,
  className,
}: {
  vehicle: Vehicle;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/catalogue/${v.id}`}
      prefetch={false}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl bg-white/[0.03] ring-1 ring-white/[0.08]",
        "transition-all duration-500 hover:-translate-y-1 hover:ring-blue-500/40",
        "hover:shadow-[0_24px_80px_-20px_rgba(33,150,243,0.4)]",
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={`/vehicles/${v.id}.png`}
          alt={v.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute right-3 top-3">
          <CategoryBadge category={v.category} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
          {v.brand}
        </div>
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-white md:text-xl">
          {v.model}
        </h3>
        <div className="mt-1 text-sm text-white/55">
          {v.bodyType} · {v.transmission}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/65">
          <span className="inline-flex items-center gap-1.5">
            <Users size={14} className="text-blue-400" />
            {v.seats}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Briefcase size={14} className="text-blue-400" />
            {v.luggage}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Gauge size={14} className="text-blue-400" />
            {v.horsepower} ch
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between border-t border-white/[0.06] pt-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-white/40">
              à partir de
            </div>
            <div className="font-mono text-2xl font-bold text-blue-400">
              {BRAND.baseDailyRate} €
              <span className="ml-1 text-xs font-normal text-white/55">/ jour</span>
            </div>
          </div>
          <span className="rounded-full bg-blue-500/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-blue-300 ring-1 ring-blue-500/30 transition-colors group-hover:bg-blue-500 group-hover:text-white">
            Réserver →
          </span>
        </div>
      </div>
    </Link>
  );
}
