import type { Metadata } from "next";
import { getProducts } from "@/lib/data/products";
import { QuoteBuilder, type PickerProduct } from "@/components/cotizador/quote-builder";
import { Parallax } from "@/components/ui/parallax";
import { BrandGlow, WaveMark } from "@/components/ui/brand-decor";

export const metadata: Metadata = {
  title: "Cotizador",
  description:
    "Arma tu cotización por volumen: elige los productos, ajusta cantidades y recibe un precio por mayor a tu correo.",
};

export default async function CotizadorPage() {
  const products = await getProducts();
  const picker: PickerProduct[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    unit: p.unit,
    image: p.images?.[0] ?? null,
    category: p.category?.name ?? null,
  }));

  return (
    <div className="relative isolate overflow-hidden">
      <Parallax className="pointer-events-none absolute -right-24 top-20 -z-10 h-80 w-80 opacity-70" from={50} to={-60}>
        <BrandGlow color="accent" className="h-full w-full" />
      </Parallax>
      <Parallax className="pointer-events-none absolute -left-16 top-4 -z-10 h-40 w-72 opacity-[0.18] sm:h-52 sm:w-96" from={-30} to={50} rotate={[-10, 8]}>
        <WaveMark className="h-full w-full" />
      </Parallax>

      <QuoteBuilder products={picker} />
    </div>
  );
}
