"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, ShoppingCart, X } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/productos", label: "Productos" },
  { href: "/cotizador", label: "Cotizador" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const { count, openCart } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar menú al navegar
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50">
      {/* Barra: misma altura/posición estructural siempre. Al bajar se
          transforma en una píldora flotante totalmente redondeada que baja
          suave. Solo se animan transform/radio/color/sombra → sin reflow. */}
      <motion.div
        initial={false}
        animate={{
          y: scrolled ? 12 : 0,
          borderRadius: scrolled ? 999 : 16,
          backgroundColor: scrolled ? "rgba(246,243,238,0.82)" : "rgba(246,243,238,0)",
          borderColor: scrolled ? "rgba(227,221,210,0.7)" : "rgba(227,221,210,0)",
          boxShadow: scrolled
            ? "0 14px 38px -16px rgba(23,19,15,0.28)"
            : "0 0 0 0 rgba(23,19,15,0)",
        }}
        transition={{ type: "spring", stiffness: 240, damping: 28, mass: 0.7 }}
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 border border-transparent px-5 py-2.5 backdrop-blur-md sm:px-6"
      >
        <Link
          href="/"
          aria-label="Inicio Norte Sur"
          className="transition-transform hover:scale-[1.02]"
        >
          <Logo height={42} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-ink-soft hover:text-ink",
                )}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-accent"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="accent" size="sm" className="hidden sm:inline-flex">
            <Link href="/cotizador">Cotizar</Link>
          </Button>

          <button
            onClick={openCart}
            aria-label={`Carrito (${count})`}
            className="relative grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.06]"
          >
            <ShoppingCart className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.78rem] font-bold text-accent-foreground"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            type="button"
            aria-label="Menú"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.06] lg:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      {/* menú móvil animado */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "mx-auto overflow-hidden lg:hidden",
              scrolled
                ? "mt-3 max-w-6xl rounded-3xl border border-line/80 bg-paper/95 shadow-lg backdrop-blur-xl"
                : "max-w-7xl border-t border-line bg-paper",
            )}
          >
            <motion.nav
              className="flex flex-col gap-1 px-5 py-3"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
            >
              {nav.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}
                >
                  <Link
                    href={item.href}
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-ink/[0.05]"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }} className="pt-2">
                <Button asChild variant="accent" className="w-full">
                  <Link href="/cotizador">Cotizar ahora</Link>
                </Button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
