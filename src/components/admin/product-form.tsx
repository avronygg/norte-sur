"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Upload,
  Trash2,
  ArrowLeft,
  ShoppingCart,
  FileText,
  Check,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select, Field, Card, Toggle } from "@/components/admin/ui";
import { cn, formatCLP } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Category, Product } from "@/types/database";
import {
  saveProduct,
  deleteProduct,
  createImageUploadUrl,
  type ActionResult,
} from "@/app/admin/(panel)/productos/actions";

const UNITS = ["kg", "unidad", "bolsa", "rollo", "caja"];

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [material, setMaterial] = useState(product?.material ?? "");
  const [shortDesc, setShortDesc] = useState(product?.short_description ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [saleMode, setSaleMode] = useState<"direct" | "quote">(product?.sale_mode ?? "quote");
  const [price, setPrice] = useState(product?.price != null ? String(product.price) : "");
  const [unit, setUnit] = useState(product?.unit ?? "kg");
  const [stock, setStock] = useState(product?.stock != null ? String(product.stock) : "0");
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [sortOrder, setSortOrder] = useState(product?.sort_order != null ? String(product.sort_order) : "0");
  const [images, setImages] = useState<string[]>(product?.images ?? []);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setResult(null);
    try {
      if (!file.type.startsWith("image/")) {
        setResult({ ok: false, error: "Solo se permiten imágenes." });
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setResult({ ok: false, error: "La imagen supera los 8MB." });
        return;
      }
      const ext = file.name.split(".").pop() ?? "jpg";
      const prep = await createImageUploadUrl(ext);
      if (prep.error || !prep.path || !prep.token || !prep.publicUrl) {
        setResult({ ok: false, error: prep.error ?? "No se pudo subir la imagen." });
        return;
      }
      const supabase = createClient();
      const { error } = await supabase.storage
        .from("products")
        .uploadToSignedUrl(prep.path, prep.token, file);
      if (error) {
        setResult({ ok: false, error: error.message });
        return;
      }
      setImages((prev) => [...prev, prep.publicUrl!]);
    } catch (err) {
      setResult({ ok: false, error: err instanceof Error ? err.message : "Error al subir." });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setResult(null);
    const res = await saveProduct(
      {
        name,
        slug: slug.trim() || undefined,
        short_description: shortDesc,
        description,
        category_id: categoryId || null,
        material,
        images,
        sale_mode: saleMode,
        price: saleMode === "direct" ? (price === "" ? null : Number(price)) : null,
        unit,
        stock: Number(stock) || 0,
        is_active: isActive,
        is_featured: isFeatured,
        sort_order: Number(sortOrder) || 0,
      },
      product?.id,
    );
    if (res.ok) {
      router.push("/admin/productos");
      router.refresh();
      return;
    }
    setSaving(false);
    setResult(res);
    // sube al primer error visible
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onDelete() {
    if (!product) return;
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(true);
    const res = await deleteProduct(product.id);
    if (res.ok) {
      router.push("/admin/productos");
      router.refresh();
    } else {
      setDeleting(false);
      setResult(res);
    }
  }

  const err = (field: string) => result?.fieldErrors?.[field];

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-5xl pb-4">
      <Link
        href="/admin/productos"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Productos
      </Link>

      <h1 className="mt-3 font-display text-2xl font-bold tracking-tight">
        {isEdit ? "Editar producto" : "Nuevo producto"}
      </h1>
      {isEdit && product && (
        <p className="text-sm text-ink-soft">{product.name}</p>
      )}

      {result && !result.ok && (
        <p className="mt-4 rounded-xl border border-danger/30 bg-danger/[0.07] px-3.5 py-2.5 text-sm text-danger">
          {result.error ?? "No se pudo guardar."}
        </p>
      )}

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Columna de campos */}
        <div className="order-2 space-y-5 lg:order-1">
        {/* Modalidad */}
        <Card title="Modalidad de venta">
          <div className="grid gap-3 sm:grid-cols-2">
            <ModeCard
              active={saleMode === "direct"}
              onClick={() => setSaleMode("direct")}
              icon={<ShoppingCart className="h-4 w-4" />}
              title="Compra directa"
              desc="Con precio y stock. Se compra y paga online."
            />
            <ModeCard
              active={saleMode === "quote"}
              onClick={() => setSaleMode("quote")}
              icon={<FileText className="h-4 w-4" />}
              title="Por cotización"
              desc="Sin pago. Genera una solicitud de cotización."
            />
          </div>
        </Card>

        {/* Datos */}
        <Card title="Información del producto">
          <div className="space-y-4">
            <Field label="Nombre" error={err("name")}>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Huaipe Mecánico Blanco" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Categoría">
                <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="">Sin categoría</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Material">
                <Input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Huaipe / Paño / Trapo" />
              </Field>
            </div>
            <Field label="Descripción corta" hint="Se muestra en la tarjeta del producto.">
              <Input value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} placeholder="Resumen breve" />
            </Field>
            <Field label="Descripción larga">
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Detalle, usos, características…" />
            </Field>
            <Field label="Slug (URL)" error={err("slug")} hint="Se genera del nombre si lo dejas vacío.">
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="huaipe-mecanico-blanco" />
            </Field>
          </div>
        </Card>

        {/* Precio / stock */}
        {saleMode === "direct" && (
          <Card title="Precio y stock">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Precio (CLP)" error={err("price")}>
                <Input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="3990" />
              </Field>
              <Field label="Unidad">
                <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </Select>
              </Field>
              <Field label="Stock">
                <Input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} />
              </Field>
            </div>
          </Card>
        )}

        {/* Imágenes */}
        <Card title="Imágenes" description="La primera es la principal. Máx. 8MB.">
          <div className="flex flex-wrap gap-3">
            {images.map((url, i) => (
              <div key={url} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                {i === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-primary/90 px-1.5 py-0.5 text-[0.72rem] font-bold text-primary-foreground">
                    Principal
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-white transition-colors hover:bg-danger"
                  aria-label="Quitar imagen"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="grid h-24 w-24 place-items-center rounded-xl border-2 border-dashed border-line text-ink-soft transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
            >
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
          </div>
        </Card>

        {/* Opciones */}
        <Card title="Visibilidad">
          <div className="grid gap-4 sm:grid-cols-3">
            <Toggle label="Activo" description="Visible en la tienda" checked={isActive} onChange={setIsActive} />
            <Toggle label="Destacado" description="Aparece en el inicio" checked={isFeatured} onChange={setIsFeatured} />
            <Field label="Orden">
              <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
            </Field>
          </div>
        </Card>

        {/* Acciones */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" variant="primary" disabled={saving || uploading}>
          {saving ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Guardando…</>
          ) : (
            <><Check className="h-5 w-5" /> {isEdit ? "Guardar cambios" : "Crear producto"}</>
          )}
        </Button>
        <Button asChild type="button" variant="outline" size="lg">
          <Link href="/admin/productos">Cancelar</Link>
        </Button>
        {isEdit && (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="ml-auto inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10 disabled:opacity-60"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Eliminar
          </button>
        )}
        </div>
        </div>{/* /columna de campos */}

        {/* Vista previa en vivo */}
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-6">
            <PreviewPanel
              name={name}
              shortDesc={shortDesc}
              image={images[0]}
              saleMode={saleMode}
              price={price}
              unit={unit}
              stock={stock}
              categoryName={categories.find((c) => c.id === categoryId)?.name}
              material={material}
              isFeatured={isFeatured}
              isActive={isActive}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

function PreviewPanel({
  name,
  shortDesc,
  image,
  saleMode,
  price,
  unit,
  stock,
  categoryName,
  material,
  isFeatured,
  isActive,
}: {
  name: string;
  shortDesc: string;
  image?: string;
  saleMode: "direct" | "quote";
  price: string;
  unit: string;
  stock: string;
  categoryName?: string;
  material: string;
  isFeatured: boolean;
  isActive: boolean;
}) {
  const isDirect = saleMode === "direct";
  const priceNum = Number(price);
  const stockNum = Number(stock);
  const topLabel = categoryName || material || "Norte Sur";

  return (
    <div>
      <p className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-soft">
        Vista previa
        {!isActive && (
          <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[0.68rem] font-bold normal-case tracking-normal text-ink-soft">
            Inactivo
          </span>
        )}
      </p>

      {/* Réplica de la tarjeta de la tienda */}
      <div className={cn("flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm", !isActive && "opacity-60")}>
        <div className="relative aspect-square overflow-hidden bg-paper-2">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="texture-weave grain flex h-full w-full items-center justify-center bg-gradient-to-br from-paper to-paper-2">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-ink-soft/60">
                {material || "Sin foto"}
              </span>
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-[0.78rem] font-bold uppercase tracking-wider text-ink-soft backdrop-blur">
            {topLabel}
          </span>
          <span
            className={cn(
              "absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.78rem] font-bold backdrop-blur",
              isDirect ? "bg-accent text-accent-foreground" : "bg-primary/90 text-primary-foreground",
            )}
          >
            {isDirect ? (
              <><ShoppingCart className="h-3 w-3" /> Compra directa</>
            ) : (
              <><FileText className="h-3 w-3" /> Cotización</>
            )}
          </span>
          {isFeatured && (
            <span className="absolute bottom-3 left-3 rounded-full bg-primary/90 px-2.5 py-1 text-[0.72rem] font-bold text-primary-foreground backdrop-blur">
              Destacado
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-display text-base font-bold leading-snug text-ink">
            {name || "Nombre del producto"}
          </h3>
          {shortDesc ? (
            <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{shortDesc}</p>
          ) : (
            <p className="mt-1.5 text-sm italic text-ink-soft/50">Descripción corta…</p>
          )}

          <div className="mt-auto flex items-end justify-between pt-4">
            <div>
              {isDirect ? (
                <>
                  <div>
                    <span className="font-display text-lg font-bold text-ink">
                      {price !== "" && !Number.isNaN(priceNum) ? formatCLP(priceNum) : "$—"}
                    </span>
                    <span className="text-xs text-ink-soft"> / {unit}</span>
                  </div>
                  {stockNum > 0 && (
                    <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      {stockNum.toLocaleString("es-CL")} disp.
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm font-semibold text-primary">Precio por cotización</span>
              )}
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold",
                isDirect ? "bg-accent text-accent-foreground" : "border border-primary/30 text-primary",
              )}
            >
              {isDirect ? "Agregar" : "Cotizar"}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-ink-soft/70">
        Así se verá en la tienda
      </p>
    </div>
  );
}

function ModeCard({
  active,
  onClick,
  title,
  desc,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border-2 p-4 text-left transition-all",
        active ? "border-accent bg-accent/[0.06]" : "border-line hover:border-ink/20",
      )}
    >
      <span className="flex items-center gap-2 font-semibold text-ink">
        <span
          className={cn(
            "grid h-7 w-7 place-items-center rounded-lg",
            active ? "bg-accent text-accent-foreground" : "bg-ink/[0.06] text-ink-soft",
          )}
        >
          {icon}
        </span>
        {title}
      </span>
      <span className="mt-2 block text-xs leading-relaxed text-ink-soft">{desc}</span>
    </button>
  );
}
