"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Minus, Plus, ShoppingCart, FileText, ArrowRight } from "@/components/ui/icons";
import type { ProductWithCategory } from "@/types/database";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";

export function ProductActions({ product }: { product: ProductWithCategory }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const isDirect = product.sale_mode === "direct";
  const stock = Number(product.stock) || 0;

  function handleAdd() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      unit: product.unit,
      saleMode: product.sale_mode,
      price: product.price,
      image: product.images[0] ?? null,
      quantity: qty,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  const quoteHref = `/cotizador?nombre=${encodeURIComponent(product.name)}&unidad=${encodeURIComponent(
    product.unit,
  )}&cantidad=${qty}`;

  return (
    <div className="mt-8">
      {/* Selector de cantidad */}
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-line bg-surface">
          <button
            type="button"
            aria-label="Disminuir"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-11 w-11 place-items-center text-ink-soft hover:text-ink"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-14 bg-transparent text-center font-display text-lg font-bold outline-none"
          />
          <button
            type="button"
            aria-label="Aumentar"
            onClick={() => setQty((q) => q + 1)}
            className="grid h-11 w-11 place-items-center text-ink-soft hover:text-ink"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="text-sm text-ink-soft">{product.unit}</span>
        {isDirect && stock > 0 && (
          <span className="text-sm text-ink-soft">
            · {stock.toLocaleString("es-CL")} disponibles
          </span>
        )}
      </div>

      {/* Acciones principales */}
      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          size="lg"
          variant={isDirect ? "accent" : "primary"}
          onClick={handleAdd}
          className="min-w-48"
        >
          {added ? (
            <>
              <Check className="h-5 w-5" /> Agregado
            </>
          ) : isDirect ? (
            <>
              <ShoppingCart className="h-5 w-5" /> Agregar al carrito
            </>
          ) : (
            <>
              <FileText className="h-5 w-5" /> Agregar a cotización
            </>
          )}
        </Button>

        <Button asChild size="lg" variant="outline">
          <Link href={isDirect ? "/carrito" : "/cotizador"}>
            {isDirect ? "Ir al carrito" : "Ir al cotizador"}
          </Link>
        </Button>
      </div>

      {/* Cotización siempre disponible */}
      {isDirect ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-paper-2/70 px-4 py-3.5">
          <p className="text-sm text-ink-soft">
            ¿Compras por mayor? Pide una <strong className="text-ink">cotización</strong> con
            precio especial por volumen.
          </p>
          <Button asChild variant="primary" size="sm">
            <Link href={quoteHref}>
              <FileText className="h-4 w-4" /> Cotizar por mayor
            </Link>
          </Button>
        </div>
      ) : (
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-soft">
          <ArrowRight className="h-4 w-4 text-accent" />
          Arma tu lista y pide la cotización completa en el{" "}
          <Link href="/cotizador" className="font-semibold text-accent hover:underline">
            cotizador
          </Link>
          .
        </p>
      )}
    </div>
  );
}
