"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, FileText, ArrowRight } from "@/components/ui/icons";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { formatCLP } from "@/lib/utils";
import type { CartLine } from "@/types/database";

export default function CarritoPage() {
  const { directLines, quoteLines, subtotal, lines } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-paper-2">
          <ShoppingCart className="h-8 w-8 text-ink-soft" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-2 text-ink-soft">
          Explora el catálogo y agrega productos para comprar o cotizar.
        </p>
        <Button asChild variant="accent" className="mt-6">
          <Link href="/productos">Ver productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold tracking-tight">Tu carrito</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          {/* Compra directa */}
          {directLines.length > 0 && (
            <section>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
                <ShoppingCart className="h-4 w-4" /> Compra directa
              </div>
              <div className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
                {directLines.map((line) => (
                  <CartRow key={line.productId} line={line} />
                ))}
              </div>
            </section>
          )}

          {/* Cotización */}
          {quoteLines.length > 0 && (
            <section>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
                <FileText className="h-4 w-4" /> Para cotizar
              </div>
              <div className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
                {quoteLines.map((line) => (
                  <CartRow key={line.productId} line={line} />
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3 text-sm">
                <span className="text-ink-soft">
                  Estos productos se gestionan por cotización.
                </span>
                <Button asChild size="sm" variant="primary">
                  <Link href="/cotizador">
                    Solicitar cotización <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </section>
          )}
        </div>

        {/* Resumen */}
        <aside className="h-fit rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-lg font-bold">Resumen</h2>

          {directLines.length > 0 ? (
            <>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Subtotal (compra directa)</span>
                  <span className="font-semibold">{formatCLP(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Despacho</span>
                  <span className="text-ink-soft">Se calcula al finalizar</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between border-t border-line pt-4">
                <span className="font-display font-bold">Total</span>
                <span className="font-display text-xl font-bold">{formatCLP(subtotal)}</span>
              </div>
              <Button asChild variant="accent" size="lg" className="mt-5 w-full">
                <Link href="/checkout">Pagar ahora</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="mt-2 w-full">
                <Link href="/cotizador">Generar cotización</Link>
              </Button>
              <p className="mt-2 text-center text-xs text-ink-soft">
                Pago seguro · tarjeta o transferencia
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm text-ink-soft">
              Tu carrito solo tiene productos por cotización. Continúa al cotizador
              para enviar tu solicitud.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function CartRow({ line }: { line: CartLine }) {
  const { setQty, remove } = useCart();
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-paper-2">
        {line.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={line.image} alt={line.name} className="h-full w-full object-cover" />
        ) : (
          <div className="texture-weave h-full w-full" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <Link href={`/productos/${line.slug}`} className="font-medium hover:text-accent">
          {line.name}
        </Link>
        <p className="text-sm text-ink-soft">
          {line.price != null ? `${formatCLP(line.price)} / ${line.unit}` : "Por cotización"}
        </p>
      </div>

      <div className="inline-flex items-center rounded-full border border-line">
        <button
          aria-label="Disminuir"
          onClick={() => setQty(line.productId, line.quantity - 1)}
          className="grid h-9 w-9 place-items-center text-ink-soft hover:text-ink"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-9 text-center text-sm font-semibold">{line.quantity}</span>
        <button
          aria-label="Aumentar"
          onClick={() => setQty(line.productId, line.quantity + 1)}
          className="grid h-9 w-9 place-items-center text-ink-soft hover:text-ink"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="hidden w-24 text-right font-semibold sm:block">
        {line.price != null ? formatCLP(line.price * line.quantity) : "—"}
      </div>

      <button
        aria-label="Eliminar"
        onClick={() => remove(line.productId)}
        className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-danger/10 hover:text-danger"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
