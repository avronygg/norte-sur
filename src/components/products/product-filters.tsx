"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Funnel } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface Option {
  value: string | null;
  label: string;
}

function buildHref(params: { categoria?: string | null; modalidad?: string | null }) {
  const qs = new URLSearchParams();
  if (params.categoria) qs.set("categoria", params.categoria);
  if (params.modalidad) qs.set("modalidad", params.modalidad);
  const s = qs.toString();
  return s ? `/productos?${s}` : "/productos";
}

export function ProductFilters({
  categories,
  categoria,
  modalidad,
  total,
}: {
  categories: { slug: string; name: string }[];
  categoria?: string;
  modalidad?: string;
  total: number;
}) {
  const modeOptions: Option[] = [
    { value: null, label: "Todas las modalidades" },
    { value: "direct", label: "Compra directa" },
    { value: "quote", label: "Cotización" },
  ];
  const catOptions: Option[] = [
    { value: null, label: "Todas las categorías" },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ];

  const modeValue = modalidad === "direct" || modalidad === "quote" ? modalidad : null;
  const catValue = categoria ?? null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft">
        <Funnel className="h-4 w-4 text-accent" /> Filtrar
      </span>

      <Dropdown
        label="Modalidad"
        options={modeOptions}
        current={modeValue}
        hrefFor={(v) => buildHref({ categoria: catValue, modalidad: v })}
      />
      <Dropdown
        label="Categoría"
        options={catOptions}
        current={catValue}
        hrefFor={(v) => buildHref({ categoria: v, modalidad: modeValue })}
      />

      {(catValue || modeValue) && (
        <Link
          href="/productos"
          className="text-sm font-medium text-ink-soft underline-offset-4 hover:text-accent hover:underline"
        >
          Limpiar
        </Link>
      )}

      <span className="ml-auto text-sm text-ink-soft">
        {total} {total === 1 ? "producto" : "productos"}
      </span>
    </div>
  );
}

function Dropdown({
  label,
  options,
  current,
  hrefFor,
}: {
  label: string;
  options: Option[];
  current: string | null;
  hrefFor: (value: string | null) => string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const currentLabel = options.find((o) => o.value === current)?.label ?? label;
  const isActive = current != null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "border-accent bg-accent/10 text-accent-600"
            : "border-line bg-surface text-ink hover:border-ink/25",
        )}
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          {label}:
        </span>
        <span className="max-w-[10rem] truncate">{currentLabel}</span>
        <ChevronDown
          className={cn("h-4 w-4 text-ink-soft transition-transform", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-full z-30 mt-2 w-60 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-xl"
          >
            {options.map((o) => {
              const selected = o.value === current;
              return (
                <Link
                  key={o.label}
                  href={hrefFor(o.value)}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    selected
                      ? "bg-accent/10 font-semibold text-accent-600"
                      : "text-ink hover:bg-ink/[0.05]",
                  )}
                >
                  {o.label}
                  {selected && <Check className="h-4 w-4 text-accent" />}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
