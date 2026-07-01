"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight } from "@/components/ui/icons";
import type { Category, ProductWithCategory } from "@/types/database";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

/**
 * Fila por categoría: muestra ~4 productos visibles y permite deslizar
 * el resto de esa misma categoría hacia el lado.
 */
export function CategoryCarousel({
  category,
  products,
}: {
  category: Category;
  products: ProductWithCategory[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: false,
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (products.length === 0) return null;

  const hasControls = canPrev || canNext;

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4 border-b border-line pb-3">
        <div>
          <h3 className="font-display text-2xl font-bold tracking-tight">{category.name}</h3>
          {category.description && (
            <p className="mt-1 max-w-xl text-sm text-ink-soft">{category.description}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {hasControls && (
            <>
              <button
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canPrev}
                aria-label="Anterior"
                className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canNext}
                aria-label="Siguiente"
                className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          <Link
            href={`/productos?categoria=${category.slug}`}
            className="hidden items-center gap-1 text-sm font-semibold text-accent hover:underline sm:inline-flex"
          >
            Ver todo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className={cn(
                "min-w-0 flex-[0_0_82%] sm:flex-[0_0_46%] lg:flex-[0_0_31%] xl:flex-[0_0_23.5%]",
              )}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <Link
        href={`/productos?categoria=${category.slug}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline sm:hidden"
      >
        Ver todos los {category.name.toLowerCase()} <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
