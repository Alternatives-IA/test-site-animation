"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

const EASE = "cubic-bezier(0.25, 0.4, 0.25, 1)";

const HIDDEN = {
  up: { opacity: 0, transform: "translate3d(0, 32px, 0)" },
  down: { opacity: 0, transform: "translate3d(0, -32px, 0)" },
  in: { opacity: 0 },
} as const;

const SHOWN = {
  up: { opacity: 1, transform: "translate3d(0, 0, 0)" },
  down: { opacity: 1, transform: "translate3d(0, 0, 0)" },
  in: { opacity: 1 },
} as const;

type Variant = keyof typeof HIDDEN;

export function Reveal({
  children,
  index = 0,
  variant = "up",
  as: Tag = "div",
  className,
  rootMargin = "-80px",
}: {
  children: ReactNode;
  index?: number;
  variant?: Variant;
  as?: ElementType;
  className?: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Déjà dans le viewport au chargement : on affiche sans attendre l'observer.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            return;
          }
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  const delay = 0.12 * index;
  const dur = variant === "in" ? 1 : 0.9;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...(visible ? SHOWN[variant] : HIDDEN[variant]),
        transition: `opacity ${dur}s ${EASE} ${delay}s, transform ${dur}s ${EASE} ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
