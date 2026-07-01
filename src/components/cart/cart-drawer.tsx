"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, Trash2, ShoppingCart, FileText, ArrowRight } from "@/components/ui/icons";
import { useCart } from "./cart-provider";
import { Button } from "@/components/ui/button";
import { formatCLP } from "@/lib/utils";
import type { CartLine } from "@/types/database";

export function CartDrawer() {
  const { isOpen, closeCart, directLines, quoteLines, lines, subtotal } = useCart();

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-paper shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <ShoppingCart className="h-5 w-5 text-accent" /> Tu carrito
              </h2>
              <button
                onClick={closeCart}
                aria-label="Cerrar"
                className="grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-ink/[0.06]"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-paper-2">
                  <ShoppingCart className="h-8 w-8 text-ink-soft" />
                </div>
                <p className="text-ink-soft">Aún no agregas productos.</p>
                <Button asChild variant="accent" onClick={closeCart}>
                  <Link href="/productos">Ver productos</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
                  {directLines.length > 0 && (
                    <section>
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                        <ShoppingCart className="h-3.5 w-3.5" /> Compra directa
                      </p>
                      <div className="space-y-2">
                        {directLines.map((l) => (
                          <DrawerRow key={l.productId} line={l} />
                        ))}
                      </div>
                    </section>
                  )}
                  {quoteLines.length > 0 && (
                    <section>
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                        <FileText className="h-3.5 w-3.5" /> Para cotizar
                      </p>
                      <div className="space-y-2">
                        {quoteLines.map((l) => (
                          <DrawerRow key={l.productId} line={l} />
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <footer className="space-y-3 border-t border-line bg-surface px-5 py-5">
                  {directLines.length > 0 && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-ink-soft">Subtotal compra directa</span>
                        <span className="font-display text-lg font-bold">{formatCLP(subtotal)}</span>
                      </div>
                      <Button asChild variant="accent" size="lg" className="w-full" onClick={closeCart}>
                        <Link href="/checkout">
                          Pagar ahora <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </>
                  )}
                  <Button asChild variant="outline" size="lg" className="w-full" onClick={closeCart}>
                    <Link href="/cotizador">
                      <FileText className="h-4 w-4" /> Generar cotización
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="w-full" onClick={closeCart}>
                    <Link href="/carrito">Ver carrito completo</Link>
                  </Button>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function DrawerRow({ line }: { line: CartLine }) {
  const { setQty, remove } = useCart();
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-paper-2">
        {line.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={line.image} alt={line.name} className="h-full w-full object-cover" />
        ) : (
          <div className="texture-weave h-full w-full" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{line.name}</p>
        <p className="text-xs text-ink-soft">
          {line.price != null ? `${formatCLP(line.price)} / ${line.unit}` : "Por cotización"}
        </p>
        <div className="mt-1.5 inline-flex items-center rounded-full border border-line">
          <button
            aria-label="Disminuir"
            onClick={() => setQty(line.productId, line.quantity - 1)}
            className="grid h-7 w-7 place-items-center text-ink-soft hover:text-ink"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-7 text-center text-xs font-semibold">{line.quantity}</span>
          <button
            aria-label="Aumentar"
            onClick={() => setQty(line.productId, line.quantity + 1)}
            className="grid h-7 w-7 place-items-center text-ink-soft hover:text-ink"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
      <button
        aria-label="Eliminar"
        onClick={() => remove(line.productId)}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-danger/10 hover:text-danger"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
