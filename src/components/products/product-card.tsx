"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, FileText, Plus, ShoppingCart } from "@/components/ui/icons";
import type { ProductWithCategory } from "@/types/database";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { cn, formatCLP } from "@/lib/utils";

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const isDirect = product.sale_mode === "direct";

  function handleAdd() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      unit: product.unit,
      saleMode: product.sale_mode,
      price: product.price,
      image: product.images[0] ?? null,
      quantity: 1,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/productos/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-paper-2"
      >
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="texture-weave grain flex h-full w-full items-center justify-center bg-gradient-to-br from-paper to-paper-2">
            <span className="font-display text-sm font-semibold uppercase tracking-widest text-ink-soft/60">
              {product.material ?? "Norte Sur"}
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-[0.78rem] font-bold uppercase tracking-wider text-ink-soft backdrop-blur">
          {product.category?.name ?? product.material}
        </span>
        <span
          className={cn(
            "absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.78rem] font-bold backdrop-blur",
            isDirect
              ? "bg-accent text-accent-foreground"
              : "bg-primary/90 text-primary-foreground",
          )}
        >
          {isDirect ? (
            <>
              <ShoppingCart className="h-3 w-3" /> Compra directa
            </>
          ) : (
            <>
              <FileText className="h-3 w-3" /> Cotización
            </>
          )}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-bold leading-snug text-ink">
          <Link href={`/productos/${product.slug}`} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        {product.short_description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">
            {product.short_description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            {isDirect ? (
              <>
                <div>
                  <span className="font-display text-lg font-bold text-ink">
                    {formatCLP(product.price)}
                  </span>
                  <span className="text-xs text-ink-soft"> / {product.unit}</span>
                </div>
                {Number(product.stock) > 0 && (
                  <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    {Number(product.stock).toLocaleString("es-CL")} disp.
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm font-semibold text-primary">
                Precio por cotización
              </span>
            )}
          </div>

          <Button
            size="sm"
            variant={isDirect ? "accent" : "outline"}
            onClick={handleAdd}
            aria-label={isDirect ? "Agregar al carrito" : "Agregar a cotización"}
          >
            {added ? (
              <Check className="h-4 w-4" />
            ) : (
              <>
                <Plus className="h-4 w-4" />
                {isDirect ? "Agregar" : "Cotizar"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
