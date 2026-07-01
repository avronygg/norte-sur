import Link from "next/link";
import { Plus, Pencil, Package } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/server";
import { formatCLP } from "@/lib/utils";
import { Badge } from "@/components/admin/ui";
import { productIssues, ISSUE_LABEL } from "@/lib/product-health";
import type { ProductWithCategory } from "@/types/database";

export default async function AdminProductosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .order("sort_order");
  const products = (data ?? []) as unknown as ProductWithCategory[];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Productos</h1>
          <p className="text-sm text-ink-soft">{products.length} productos en el catálogo.</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-600"
        >
          <Plus className="h-4 w-4" /> Nuevo producto
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="hidden grid-cols-[2.5fr_1fr_1.2fr_1fr_0.8fr_auto] gap-3 border-b border-line px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink-soft sm:grid">
          <span>Producto</span>
          <span>Categoría</span>
          <span>Modalidad</span>
          <span>Precio</span>
          <span>Stock</span>
          <span></span>
        </div>
        <div className="divide-y divide-line">
          {products.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-ink-soft">
              Aún no hay productos. Crea el primero.
            </p>
          ) : (
            products.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-1 gap-3 px-4 py-3 text-sm sm:grid-cols-[2.5fr_1fr_1.2fr_1fr_0.8fr_auto] sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-paper-2">
                    {p.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-ink-soft/40">
                        <Package className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.name}</p>
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      {!p.is_active && <Badge tone="danger">Inactivo</Badge>}
                      {productIssues(p).map((i) => (
                        <Badge key={i} tone="warning">{ISSUE_LABEL[i]}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-ink-soft">{p.category?.name ?? "—"}</span>

                <span>
                  {p.sale_mode === "direct" ? (
                    <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-bold text-accent-600">
                      Compra directa
                    </span>
                  ) : (
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                      Cotización
                    </span>
                  )}
                </span>

                <span className="font-medium">
                  {p.sale_mode === "direct" ? formatCLP(p.price) : "—"}
                </span>

                <span className="text-ink-soft">
                  {p.sale_mode === "direct" ? `${p.stock} ${p.unit}` : "—"}
                </span>

                <Link
                  href={`/admin/productos/${p.id}`}
                  className="inline-flex items-center gap-1.5 justify-self-start rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent sm:justify-self-end"
                >
                  <Pencil className="h-4 w-4" /> Editar
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
