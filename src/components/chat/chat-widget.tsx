"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, FileText, MessageCircle, Phone, Package } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const actions = [
  { label: "Quiero cotizar por volumen", href: "/cotizador", icon: FileText, tone: "accent" as const },
  { label: "Ver productos", href: "/productos", icon: Package, tone: "plain" as const },
  { label: "Escribir por WhatsApp", href: siteConfig.contact.whatsappHref, icon: MessageCircle, tone: "plain" as const, external: true },
  { label: "Llamar ahora", href: siteConfig.contact.phoneHref, icon: Phone, tone: "plain" as const },
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Muestra el globo "¿Necesitas ayuda?" a los pocos segundos, una vez.
  useEffect(() => {
    const seen = sessionStorage.getItem("ns-chat-hint");
    if (seen) return;
    const t = setTimeout(() => setShowHint(true), 3500);
    return () => clearTimeout(t);
  }, []);

  function toggle() {
    setOpen((v) => !v);
    setShowHint(false);
    sessionStorage.setItem("ns-chat-hint", "1");
  }

  return (
    <div className="fixed bottom-5 left-5 z-50 lg:bottom-7 lg:left-7">
      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="absolute bottom-[4.5rem] left-0 w-[min(20rem,calc(100vw-2.5rem))] overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl"
          >
            {/* Encabezado */}
            <div className="relative flex items-center gap-3 bg-primary px-4 py-4 text-primary-foreground">
              <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-white/15 ring-2 ring-white/40">
                <Image src="/img/huaipesito.png" alt="Huaipesito" width={44} height={44} className="h-full w-full object-cover" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-bold leading-tight">Huaipesito</p>
                <p className="flex items-center gap-1.5 text-xs text-primary-foreground/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Asistente · En línea
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="ml-auto grid h-8 w-8 place-items-center rounded-full text-primary-foreground/80 hover:bg-white/15 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mensaje */}
            <div className="px-4 pt-4">
              <div className="rounded-2xl rounded-tl-sm bg-paper-2 px-3.5 py-3 text-sm text-ink">
                ¡Hola! 👋 Soy <strong>Huaipesito</strong>, tu asistente de Norte Sur.
                ¿Buscas abastecer tu empresa o necesitas una cotización por volumen?
                Te ayudo al toque.
              </div>
            </div>

            {/* Acciones */}
            <div className="space-y-2 p-4">
              {actions.map((a) =>
                a.external ? (
                  <a
                    key={a.label}
                    href={a.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className={chipClass(a.tone)}
                  >
                    <a.icon className="h-4 w-4" /> {a.label}
                  </a>
                ) : (
                  <Link key={a.label} href={a.href} onClick={() => setOpen(false)} className={chipClass(a.tone)}>
                    <a.icon className="h-4 w-4" /> {a.label}
                  </Link>
                ),
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Globo de ayuda */}
      <AnimatePresence>
        {showHint && !open && (
          <motion.button
            onClick={toggle}
            initial={{ opacity: 0, x: -10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-2 left-[4.5rem] w-max max-w-[13rem] rounded-2xl rounded-bl-sm border border-line bg-surface px-3.5 py-2 text-left text-sm font-medium text-ink shadow-lg"
          >
            ¡Hola! Soy Huaipesito 👋 ¿Te ayudo?
          </motion.button>
        )}
      </AnimatePresence>

      {/* Lanzador (mascota) */}
      <motion.button
        onClick={toggle}
        aria-label="Abrir asistente Huaipesito"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        animate={open ? {} : { y: [0, -5, 0] }}
        transition={open ? {} : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-accent to-primary p-[3px] shadow-xl shadow-primary/25"
      >
        <span className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-paper">
          {open ? (
            <X className="h-6 w-6 text-ink" />
          ) : (
            <Image src="/img/huaipesito.png" alt="Huaipesito" width={62} height={62} className="h-full w-full rounded-full object-cover" />
          )}
        </span>
        {!open && (
          <span className="absolute right-0 top-0 h-4 w-4 rounded-full bg-accent ring-[3px] ring-paper" />
        )}
      </motion.button>
    </div>
  );
}

function chipClass(tone: "accent" | "plain") {
  return tone === "accent"
    ? "flex w-full items-center gap-2.5 rounded-xl bg-accent px-3.5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-600"
    : "flex w-full items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent";
}
