import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Truck, ShieldCheck, Package } from "@/components/ui/icons";
import { getProductBySlug, getProducts } from "@/lib/data/products";
import { ProductActions } from "@/components/products/product-actions";
import { ProductCard } from "@/components/products/product-card";
import { formatCLP } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.short_description ?? undefined,
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const isDirect = product.sale_mode === "direct";
  const related = (
    await getProducts({ categorySlug: product.category?.slug })
  )
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Link
        href="/productos"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al catálogo
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* imagen */}
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-paper-2">
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="texture-weave grain flex h-full w-full items-center justify-center bg-gradient-to-br from-paper to-paper-2">
              <span className="font-display text-lg font-bold uppercase tracking-widest text-ink-soft/50">
                {product.material ?? "Norte Sur"}
              </span>
            </div>
          )}
        </div>

        {/* info */}
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            {product.category?.name ?? product.material}
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4">
            {isDirect ? (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-600">
                  Compra directa
                </span>
                <p className="mt-3">
                  <span className="font-display text-3xl font-bold text-ink">
                    {formatCLP(product.price)}
                  </span>
                  <span className="text-ink-soft"> / {product.unit}</span>
                </p>
                {product.stock > 0 ? (
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-success">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    {Number(product.stock).toLocaleString("es-CL")} {product.unit} en stock
                  </p>
                ) : (
                  <p className="mt-1.5 text-sm font-medium text-warning">Sin stock por ahora</p>
                )}
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                  Por cotización
                </span>
                <p className="mt-3 text-ink-soft">
                  Este producto se gestiona con cotización. Agrégalo y te enviamos un
                  precio por volumen a tu correo.
                </p>
              </>
            )}
          </div>

          {product.short_description && (
            <p className="mt-5 leading-relaxed text-ink-soft">
              {product.short_description}
            </p>
          )}
          {product.description && (
            <p className="mt-3 leading-relaxed text-ink-soft">{product.description}</p>
          )}

          <ProductActions product={product} />

          <ul className="mt-8 grid gap-3 border-t border-line pt-6 text-sm sm:grid-cols-3">
            <li className="flex items-center gap-2 text-ink-soft">
              <Truck className="h-4 w-4 text-accent" /> Despacho nacional
            </li>
            <li className="flex items-center gap-2 text-ink-soft">
              <ShieldCheck className="h-4 w-4 text-accent" /> Garantía 100%
            </li>
            <li className="flex items-center gap-2 text-ink-soft">
              <Package className="h-4 w-4 text-accent" /> Venta por {product.unit}
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            También te puede servir
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
