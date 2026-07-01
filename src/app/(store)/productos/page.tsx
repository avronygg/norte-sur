import type { Metadata } from "next";
import { ShoppingCart, FileText } from "@/components/ui/icons";
import { getCategories, getProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/products/product-card";
import { ProductFilters } from "@/components/products/product-filters";
import type { ProductWithCategory, SaleMode } from "@/types/database";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Catálogo de huaipes, paños y trapos industriales. Compra directa o cotización por volumen.",
};

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; modalidad?: string }>;
}) {
  const { categoria, modalidad } = await searchParams;
  const mode: SaleMode | undefined =
    modalidad === "direct" || modalidad === "quote" ? modalidad : undefined;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug: categoria, mode }),
  ]);

  const activeCat = categories.find((c) => c.slug === categoria) ?? null;
  const directProducts = products.filter((p) => p.sale_mode === "direct");
  const quoteProducts = products.filter((p) => p.sale_mode === "quote");

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="max-w-2xl">
        <span className="text-sm font-semibold uppercase tracking-wider text-accent">
          Catálogo
        </span>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
          {activeCat ? activeCat.name : "Huaipes, paños y trapos"}
        </h1>
        <p className="mt-3 text-ink-soft">
          {activeCat?.description ??
            "Materiales de alta absorción para limpieza industrial. Compra directa o cotización por volumen."}
        </p>
      </header>

      {/* filtros (menús desplegables, una sola fila) */}
      <div className="mt-8 rounded-2xl border border-line bg-paper-2/60 px-4 py-3">
        <ProductFilters
          categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
          categoria={categoria}
          modalidad={modalidad}
          total={products.length}
        />
      </div>

      {/* contenido separado por modalidad */}
      {products.length === 0 ? (
        <p className="mt-16 text-center text-ink-soft">
          No hay productos con estos filtros. Prueba con otra combinación.
        </p>
      ) : (
        <div className="mt-10 space-y-16">
          <ModalitySection
            title="Compra directa"
            subtitle="Productos con precio y stock, listos para comprar y pagar online."
            icon="cart"
            products={directProducts}
          />
          <ModalitySection
            title="Cotización"
            subtitle="Productos por volumen. Solicita una cotización formal a tu correo."
            icon="quote"
            products={quoteProducts}
          />
        </div>
      )}
    </div>
  );
}

function ModalitySection({
  title,
  subtitle,
  icon,
  products,
}: {
  title: string;
  subtitle: string;
  icon: "cart" | "quote";
  products: ProductWithCategory[];
}) {
  if (products.length === 0) return null;
  const isDirect = icon === "cart";
  return (
    <section>
      <div className="mb-6 flex items-start gap-3 border-b border-line pb-4">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
            isDirect ? "bg-accent/15 text-accent" : "bg-primary/10 text-primary"
          }`}
        >
          {isDirect ? (
            <ShoppingCart className="h-5 w-5" />
          ) : (
            <FileText className="h-5 w-5" />
          )}
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            {title}{" "}
            <span className="align-middle text-base font-medium text-ink-soft">
              ({products.length})
            </span>
          </h2>
          <p className="mt-0.5 text-sm text-ink-soft">{subtitle}</p>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
