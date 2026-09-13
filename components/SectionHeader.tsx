import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">
          {eyebrow}
        </div>
      )}
      <h2 className="text-balance text-[clamp(34px,4.5vw,62px)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-balance text-[clamp(15px,1.3vw,18px)] leading-relaxed text-white/60">
          {subtitle}
        </p>
      )}
    </div>
  );
}
