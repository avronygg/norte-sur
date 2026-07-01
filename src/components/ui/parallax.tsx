"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * Envuelve contenido decorativo y lo desplaza suavemente en Y según el scroll,
 * dando un efecto parallax sutil. Respeta prefers-reduced-motion.
 * El wrapper (con ref) no se transforma, así la medición es estable.
 */
export function Parallax({
  children,
  className,
  from = 50,
  to = -50,
  rotate,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
  /** rotación [inicio, fin] en grados a lo largo del scroll */
  rotate?: [number, number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [from, to]);
  const r = useTransform(
    scrollYProgress,
    [0, 1],
    reduce || !rotate ? [0, 0] : rotate,
  );

  return (
    <div ref={ref} className={className} aria-hidden>
      <motion.div style={{ y, rotate: r }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
