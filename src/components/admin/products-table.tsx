"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Package,
  Funnel,
  Star,
  Eye,
  Trash2,
  Loader2,
} from "@/components/ui/icons";
import { Badge } from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";
import { productIssues, ISSUE_LABEL, type ProductIssue } from "@/lib/product-health";
import { cn, formatCLP } from "@/lib/utils";
import {
  updateProductFields,
  duplicateProduct,
  deleteProduct,
} from "@/app/admin/(panel)/productos/actions";
import type { Category, ProductWithCategory } from "@/types/database";

const LOW_STOCK = 10;

type ModeFilter = "all" | "direct" | "quote";
type StatusFilter = "all" | "active" | "inactive";
type IssueFilter = "all" | ProductIssue;

export function ProductsTable({
  initialProducts,
  categories,
  initialFilter,
}: {
  initialProducts: ProductWithCategory[];
  categories: Category[];
  initialFilter?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [products, setProducts] = useState(initialProducts);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [mode, setMode] = useState<ModeFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [issue, setIssue] = useState<IssueFilter>(
    (["foto", "descripción", "stock", "categoría"] as const).includes(initialFilter as ProductIssue)
      ? (initialFilter as ProductIssue)
      : "all",
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !(p.material ?? "").toLowerCase().includes(q)) return false;
      if (category !== "all" && p.category_id !== category) return false;
      if (mode !== "all" && p.sale_mode !== mode) return false;
      if (status === "active" && !p.is_active) return false;
      if (status === "inactive" && p.is_active) return false;
      if (issue !== "all" && !productIssues(p).includes(issue)) return false;
      return true;
    });
  }, [products, search, category, mode, status, issue]);

  const activeFilters =
    (category !== "all" ? 1 : 0) +
    (mode !== "all" ? 1 : 0) +
    (status !== "all" ? 1 : 0) +
    (issue !== "all" ? 1 : 0);

  function patchLocal(id: string, fields: Partial<ProductWithCategory>) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...fields } : p)));
  }

  async function saveField(
    id: string,
    fields: Parameters<typeof updateProductFields>[1],
    okMsg: string,
  ) {
    const res = await updateProductFields(id, fields);
    if (res.ok) toast(okMsg);
    else toast(res.error ?? "No se pudo guardar", "error");
    return res.ok;
  }

  function clearFilters() {
    setCategory("all");
    setMode("all");
    setStatus("all");
    setIssue("all");
    setSearch("");
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Productos</h1>
          <p className="text-sm text-ink-soft">
            {filtered.length === products.length
              ? `${products.length} productos en el catálogo.`
              : `${filtered.length} de ${products.length} productos.`}
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-600"
        >
          <Plus className="h-4 w-4" /> Nuevo producto
        </Link>
      </div>

      {/* Buscador + filtros */}
      <div className="mt-5 rounded-2xl border border-line bg-surface p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o material…"
            className="h-10 min-w-[12rem] flex-1 rounded-xl border border-line bg-paper px-3.5 text-sm outline-none transition-shadow placeholder:text-ink-soft/55 focus:border-accent focus:ring-4 focus:ring-accent/15"
          />
          <FilterSelect value={category} onChange={setCategory} label="Categoría">
            <option value="all">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </FilterSelect>
          <FilterSelect value={mode} onChange={(v) => setMode(v as ModeFilter)} label="Modalidad">
            <option value="all">Toda modalidad</option>
            <option value="direct">Compra directa</option>
            <option value="quote">Cotización</option>
          </FilterSelect>
          <FilterSelect value={status} onChange={(v) => setStatus(v as StatusFilter)} label="Estado">
            <option value="all">Activos e inactivos</option>
            <option value="active">Solo activos</option>
            <option value="inactive">Solo inactivos</option>
          </FilterSelect>
          <FilterSelect value={issue} onChange={(v) => setIssue(v as IssueFilter)} label="Problemas">
            <option value="all">Con y sin problemas</option>
            <option value="foto">Sin foto</option>
            <option value="descripción">Sin descripción</option>
            <option value="stock">Sin stock</option>
            <option value="categoría">Sin categoría</option>
          </FilterSelect>
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              <Funnel className="h-3.5 w-3.5" /> Limpiar ({activeFilters})
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="hidden grid-cols-[2.4fr_1fr_0.9fr_1.1fr_auto] gap-3 border-b border-line px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink-soft lg:grid">
          <span>Producto</span>
          <span>Precio</span>
          <span>Stock</span>
          <span>Estado</span>
          <span className="text-right">Acciones</span>
        </div>
        <div className="divide-y divide-line">
          {filtered.length === 0 ? (
            <p className="px-4 py-12 text-center text-sm text-ink-soft">
              {products.length === 0
                ? "Aún no hay productos. Crea el primero."
                : "Ningún producto coincide con los filtros."}
            </p>
          ) : (
            filtered.map((p) => (
              <ProductRow
                key={p.id}
                p={p}
                onPatch={patchLocal}
                onSaveField={saveField}
                onDuplicate={async () => {
                  const res = await duplicateProduct(p.id);
                  if (res.ok) {
                    toast("Producto duplicado");
                    router.refresh();
                    if (res.id) router.push(`/admin/productos/${res.id}`);
                  } else toast(res.error ?? "No se pudo duplicar", "error");
                }}
                onDelete={async () => {
                  const res = await deleteProduct(p.id);
                  if (res.ok) {
                    setProducts((prev) => prev.filter((x) => x.id !== p.id));
                    toast("Producto eliminado");
                  } else toast(res.error ?? "No se pudo eliminar", "error");
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 appearance-none rounded-xl border border-line bg-paper px-3 pr-8 text-sm text-ink outline-none transition-shadow focus:border-accent focus:ring-4 focus:ring-accent/15"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%2394a3b8'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.6rem center",
        backgroundSize: "0.9rem",
      }}
    >
      {children}
    </select>
  );
}

function ProductRow({
  p,
  onPatch,
  onSaveField,
  onDuplicate,
  onDelete,
}: {
  p: ProductWithCategory;
  onPatch: (id: string, fields: Partial<ProductWithCategory>) => void;
  onSaveField: (
    id: string,
    fields: Parameters<typeof updateProductFields>[1],
    okMsg: string,
  ) => Promise<boolean>;
  onDuplicate: () => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [busy, startBusy] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const isDirect = p.sale_mode === "direct";
  const issues = productIssues(p);
  const lowStock = isDirect && Number(p.stock) > 0 && Number(p.stock) < LOW_STOCK;

  return (
    <div className="grid grid-cols-1 gap-3 px-4 py-3 text-sm lg:grid-cols-[2.4fr_1fr_0.9fr_1.1fr_auto] lg:items-center">
      {/* Producto */}
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
          <div className="mt-0.5 flex flex-wrap items-center gap-1">
            <span className="text-xs text-ink-soft">{p.category?.name ?? "Sin categoría"}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[0.7rem] font-bold",
                isDirect ? "bg-accent/15 text-accent-600" : "bg-primary/10 text-primary",
              )}
            >
              {isDirect ? "Directa" : "Cotización"}
            </span>
            {!p.is_active && <Badge tone="danger">Inactivo</Badge>}
            {issues.map((i) => (
              <Badge key={i} tone="warning">{ISSUE_LABEL[i]}</Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Precio */}
      <div className="lg:block">
        {isDirect ? (
          <InlineNumber
            prefix="$"
            value={p.price ?? null}
            format={(v) => (v == null ? "" : String(v))}
            onCommit={async (v) => {
              const num = v === "" ? null : Number(v);
              onPatch(p.id, { price: num });
              await onSaveField(p.id, { price: num }, "Precio actualizado");
            }}
          />
        ) : (
          <span className="text-ink-soft">—</span>
        )}
      </div>

      {/* Stock */}
      <div>
        {isDirect ? (
          <div className="flex items-center gap-1.5">
            <InlineNumber
              value={p.stock ?? 0}
              format={(v) => String(v ?? 0)}
              onCommit={async (v) => {
                const num = v === "" ? 0 : Number(v);
                onPatch(p.id, { stock: num });
                await onSaveField(p.id, { stock: num }, "Stock actualizado");
              }}
            />
            {lowStock && <Badge tone="warning">bajo</Badge>}
          </div>
        ) : (
          <span className="text-ink-soft">—</span>
        )}
      </div>

      {/* Estado: activo + destacado */}
      <div className="flex items-center gap-2">
        <IconToggle
          on={p.is_active}
          onIcon={<Eye className="h-4 w-4" />}
          title={p.is_active ? "Activo (clic para ocultar)" : "Inactivo (clic para activar)"}
          onToggle={() =>
            startBusy(async () => {
              onPatch(p.id, { is_active: !p.is_active });
              await onSaveField(p.id, { is_active: !p.is_active }, p.is_active ? "Producto ocultado" : "Producto activado");
            })
          }
          activeClass="border-success/40 bg-success/10 text-success"
        />
        <IconToggle
          on={p.is_featured}
          onIcon={<Star className="h-4 w-4" />}
          title={p.is_featured ? "Destacado (clic para quitar)" : "Marcar como destacado"}
          onToggle={() =>
            startBusy(async () => {
              onPatch(p.id, { is_featured: !p.is_featured });
              await onSaveField(p.id, { is_featured: !p.is_featured }, p.is_featured ? "Quitado de destacados" : "Marcado como destacado");
            })
          }
          activeClass="border-accent/40 bg-accent/10 text-accent-600"
        />
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-1.5 lg:justify-end">
        <Link
          href={`/admin/productos/${p.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
        >
          <Pencil className="h-4 w-4" /> Editar
        </Link>
        <button
          type="button"
          title="Duplicar"
          disabled={busy}
          onClick={() => startBusy(onDuplicate)}
          className="grid h-8 w-8 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CopyGlyph />}
        </button>
        {confirming ? (
          <span className="inline-flex items-center gap-1">
            <button
              type="button"
              disabled={busy}
              onClick={() => startBusy(onDelete)}
              className="rounded-lg bg-danger px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-danger/90 disabled:opacity-50"
            >
              Eliminar
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-ink-soft hover:text-ink"
            >
              No
            </button>
          </span>
        ) : (
          <button
            type="button"
            title="Eliminar"
            onClick={() => setConfirming(true)}
            className="grid h-8 w-8 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:border-danger hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function InlineNumber({
  value,
  onCommit,
  format,
  prefix,
}: {
  value: number | null;
  onCommit: (raw: string) => Promise<void> | void;
  format: (v: number | null) => string;
  prefix?: string;
}) {
  const [draft, setDraft] = useState(format(value));
  const [saving, setSaving] = useState(false);
  const original = format(value);

  async function commit() {
    if (draft === original) return;
    setSaving(true);
    await onCommit(draft.trim());
    setSaving(false);
  }

  return (
    <span className="inline-flex items-center rounded-lg border border-line bg-paper focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15">
      {prefix && <span className="pl-2 text-xs text-ink-soft">{prefix}</span>}
      <input
        type="number"
        min={0}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          if (e.key === "Escape") setDraft(original);
        }}
        className="w-20 bg-transparent px-2 py-1.5 text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin text-ink-soft" />}
    </span>
  );
}

function IconToggle({
  on,
  onIcon,
  title,
  onToggle,
  activeClass,
}: {
  on: boolean;
  onIcon: React.ReactNode;
  title: string;
  onToggle: () => void;
  activeClass: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={on}
      onClick={onToggle}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-lg border transition-colors",
        on ? activeClass : "border-line text-ink-soft/40 hover:text-ink-soft",
      )}
    >
      {onIcon}
    </button>
  );
}

/** Glifo simple de "duplicar" (dos hojas) sin depender de un icono nuevo. */
function CopyGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M15 2H6a2 2 0 0 0-2 2v11h2V4h9V2Z" />
      <path d="M18 6H10a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Z" />
    </svg>
  );
}
