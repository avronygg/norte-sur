"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ShieldCheck, Truck, Factory } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import type { ProductWithCategory } from "@/types/database";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const features = [
  { icon: ShieldCheck, label: "Garantía" },
  { icon: Truck, label: "Despacho nacional" },
  { icon: Factory, label: "+30 años de experiencia" },
];

export function Hero({ products }: { products: ProductWithCategory[] }) {
  const [i, setI] = useState(0);
  const showcase = products.length > 0 ? products : [];

  useEffect(() => {
    if (showcase.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % showcase.length), 4000);
    return () => clearInterval(t);
  }, [showcase.length]);

  const current = showcase[i % showcase.length];

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-primary text-primary-foreground">
      {/* video de fondo: vertical en móvil, horizontal en escritorio */}
      <video
        className="absolute inset-0 h-full w-full object-cover lg:hidden"
        autoPlay muted loop playsInline preload="metadata" aria-hidden
      >
        <source src="/video/institucional.mp4" type="video/mp4" />
      </video>
      <video
        className="absolute inset-0 hidden h-full w-full object-cover lg:block"
        autoPlay muted loop playsInline preload="metadata" aria-hidden
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* velo oscuro (negro/gris) para legibilidad */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/70"
        aria-hidden
      />
      <div className="texture-weave absolute inset-0 opacity-15" aria-hidden />
      <motion.div
        aria-hidden
        className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/25 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-12">
        {/* texto */}
        <motion.div
          className="lg:col-span-7"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.span
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Venta por mayor · Despacho a todo Chile
          </motion.span>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="mt-6 text-balance font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Huaipes y paños{" "}
            <span className="text-accent">al por mayor</span> para tu empresa.
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-white/80"
          >
            Abastecemos a empresas e industrias en todo Chile. Compra directa o pide
            tu cotización por volumen.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg" variant="accent">
              <Link href="/productos">
                Ver productos <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Link href="/cotizador">Cotizar por volumen</Link>
            </Button>
          </motion.div>

          {/* features como pills de vidrio (reemplaza la franja inferior) */}
          <motion.ul
            className="mt-9 flex flex-wrap gap-2.5"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.5 } } }}
          >
            {features.map((f) => (
              <motion.li
                key={f.label}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.45, ease: easeOut }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-2 text-sm font-medium text-white/90 backdrop-blur-md"
              >
                <f.icon className="h-4 w-4 text-accent" />
                {f.label}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* tarjeta de producto real, rotando */}
        {current && (
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto w-full max-w-[300px]">
              {/* halo de marca detrás */}
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent/20 blur-2xl" aria-hidden />
              <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -18, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: easeOut }}
                    className="rounded-3xl bg-white/[0.06] p-2.5 ring-1 ring-white/15 shadow-2xl backdrop-blur-sm"
                  >
                    <ProductCard product={current} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {showcase.length > 1 && (
                <div className="mt-5 flex justify-center gap-1.5">
                  {showcase.map((_, idx) => (
                    <button
                      key={idx}
                      aria-label={`Producto ${idx + 1}`}
                      onClick={() => setI(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === i % showcase.length ? "w-6 bg-accent" : "w-2 bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
