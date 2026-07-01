"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";
import type { ProductWithCategory } from "@/types/database";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

export function FeaturedCarousel({
  products,
}: {
  products: ProductWithCategory[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: false },
    [Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })],
  );
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (products.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5 pl-0.5">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_48%] lg:flex-[0_0_31%] xl:flex-[0_0_24%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* controles */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-1.5">
          {snaps.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir al grupo ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === selected ? "w-6 bg-accent" : "w-2 bg-line hover:bg-ink/30",
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            aria-label="Anterior"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-accent hover:text-accent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Siguiente"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-accent hover:text-accent"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
