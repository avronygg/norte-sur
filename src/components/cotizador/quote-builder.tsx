"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, Trash2, CheckCircle2, Loader2, Package, FileText, X } from "@/components/ui/icons";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Input, Field, Card } from "@/components/admin/ui";
import { submitQuote, type QuoteResult } from "@/app/(store)/cotizador/actions";

export interface PickerProduct {
  id: string;
  name: string;
  slug: string;
  unit: string;
  image: string | null;
  category: string | null;
}

interface Row {
  productId: string | null;
  name: string;
  unit: string;
  quantity: number | null;
  image: string | null;
  detail: boolean; // si está activada la cantidad/unidad
}

const UNITS = ["", "kg", "unidades", "bolsas", "rollos", "cajas", "metros", "pallets"];
const REGIONS = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo",
  "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío",
  "La Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes",
];

export function QuoteBuilder({ products }: { products: PickerProduct[] }) {
  const { quoteLines, lines, remove } = useCart();
  const [rows, setRows] = useState<Row[]>([]);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<QuoteResult | null>(null);

  useEffect(() => {
    const source = quoteLines.length > 0 ? quoteLines : lines;
    const initial: Row[] = source.map((l) => ({
      productId: l.productId,
      name: l.name,
      unit: l.unit,
      quantity: l.quantity,
      image: l.image ?? null,
      detail: true, // si venían del carrito, ya traen cantidad
    }));

    const params = new URLSearchParams(window.location.search);
    const nombre = params.get("nombre");
    if (nombre) {
      const unidad = params.get("unidad") ?? "";
      const cantidad = Math.max(1, Number(params.get("cantidad")) || 1);
      if (!initial.some((r) => r.name.toLowerCase() === nombre.toLowerCase())) {
        const match = products.find((p) => p.name.toLowerCase() === nombre.toLowerCase());
        initial.push({
          productId: match?.id ?? null,
          name: nombre,
          unit: unidad,
          quantity: cantidad,
          image: match?.image ?? null,
          detail: true,
        });
      }
    }
    setRows(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addProduct(p: PickerProduct) {
    setRows((rs) => {
      if (rs.some((r) => r.productId === p.id)) return rs;
      return [...rs, { productId: p.id, name: p.name, unit: "", quantity: null, image: p.image, detail: false }];
    });
  }
  function addCustom() {
    setRows((rs) => [...rs, { productId: null, name: "", unit: "", quantity: null, image: null, detail: false }]);
  }
  function patch(i: number, p: Partial<Row>) {
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...p } : r)));
  }
  function removeRow(i: number) {
    setRows((rs) => rs.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setResult(null);
    const fd = new FormData(e.currentTarget);
    const items = rows
      .filter((r) => r.name.trim())
      .map((r) => ({
        productId: r.productId,
        name: r.name,
        unit: r.detail ? r.unit : "",
        quantity: r.detail && r.quantity ? r.quantity : undefined,
      }));

    const res = await submitQuote({
      customer_name: String(fd.get("customer_name") ?? ""),
      customer_email: String(fd.get("customer_email") ?? ""),
      customer_phone: String(fd.get("customer_phone") ?? ""),
      company: String(fd.get("company") ?? ""),
      rut: String(fd.get("rut") ?? ""),
      region: String(fd.get("region") ?? ""),
      comuna: String(fd.get("comuna") ?? ""),
      message: String(fd.get("message") ?? ""),
      items,
    });
    setResult(res);
    setPending(false);
    if (res.ok) quoteLines.forEach((l) => remove(l.productId));
  }

  if (result?.ok) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
        <h1 className="mt-6 font-display text-3xl font-bold">¡Cotización enviada!</h1>
        <p className="mt-3 text-ink-soft">
          Tu solicitud <strong>{result.quoteNumber}</strong> fue recibida. Te enviamos
          una confirmación por correo y te responderemos a la brevedad.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild variant="accent"><Link href="/productos">Seguir explorando</Link></Button>
          <Button asChild variant="outline"><Link href="/">Volver al inicio</Link></Button>
        </div>
      </div>
    );
  }

  const itemCount = rows.filter((r) => r.name.trim()).length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <header className="flex items-start gap-4">
        <Image
          src="/img/huaipesito.png"
          alt="Huaipesito"
          width={64}
          height={64}
          className="hidden h-16 w-16 shrink-0 rounded-2xl object-cover shadow-md ring-2 ring-accent/30 sm:block"
        />
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Cotizador</span>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
            Arma tu cotización por volumen
          </h1>
          <p className="mt-3 text-ink-soft">
            Elige los productos que te interesan y déjanos tus datos. Si quieres, agrega
            la cantidad y la unidad de medida; si no, lo afinamos contigo en la cotización.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <Card title="Productos a cotizar" description={itemCount > 0 ? `${itemCount} en tu lista` : "Busca y agrega los que necesitas"}>
          <ProductPicker products={products} onPick={addProduct} />

          <div className="mt-4 space-y-2.5">
            {rows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line bg-paper-2/50 px-4 py-8 text-center text-sm text-ink-soft">
                Aún no agregas productos. Búscalos arriba o{" "}
                <button type="button" onClick={addCustom} className="font-semibold text-accent hover:underline">
                  agrega uno manual
                </button>
                .
              </div>
            ) : (
              rows.map((row, i) => (
                <QuoteRow
                  key={i}
                  row={row}
                  onPatch={(p) => patch(i, p)}
                  onRemove={() => removeRow(i)}
                />
              ))
            )}
          </div>

          <button
            type="button"
            onClick={addCustom}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            <Plus className="h-4 w-4" /> Agregar producto manual
          </button>

          {result?.fieldErrors?.items && (
            <p className="mt-2 text-sm text-danger">{result.fieldErrors.items}</p>
          )}
        </Card>

        <Card title="Tus datos">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre *" error={result?.fieldErrors?.customer_name}>
              <Input name="customer_name" placeholder="Tu nombre" />
            </Field>
            <Field label="Correo *" error={result?.fieldErrors?.customer_email}>
              <Input name="customer_email" type="email" placeholder="tu@empresa.cl" />
            </Field>
            <Field label="Teléfono"><Input name="customer_phone" placeholder="+56 9 ..." /></Field>
            <Field label="Empresa"><Input name="company" placeholder="Nombre de tu empresa" /></Field>
            <Field label="RUT"><Input name="rut" placeholder="76.xxx.xxx-x" /></Field>
            <Field label="Región">
              <select name="region" className="h-11 w-full appearance-none rounded-xl border border-line bg-paper px-3.5 text-sm outline-none focus:border-accent">
                <option value="">Selecciona…</option>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Comuna"><Input name="comuna" placeholder="Tu comuna" /></Field>
          </div>
          <div className="mt-4">
            <Field label="Mensaje (opcional)">
              <textarea
                name="message"
                rows={3}
                placeholder="Frecuencia de compra, detalles del despacho, etc."
                className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-accent"
              />
            </Field>
          </div>
        </Card>

        {result && !result.ok && !result.fieldErrors && (
          <p className="text-sm text-danger">{result.error}</p>
        )}

        <Button type="submit" size="lg" variant="accent" disabled={pending} className="w-full sm:w-auto">
          {pending ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Enviando…</>
          ) : (
            <><FileText className="h-5 w-5" /> Enviar solicitud de cotización</>
          )}
        </Button>
      </form>
    </div>
  );
}

/* ---------------- Selector de productos ---------------- */
function ProductPicker({
  products,
  onPick,
}: {
  products: PickerProduct[];
  onPick: (p: PickerProduct) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const q = query.trim().toLowerCase();
  const matches = (q ? products.filter((p) => p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)) : products).slice(0, 6);

  return (
    <div className="relative" ref={ref}>
      <Input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Buscar un producto del catálogo…"
      />
      {open && matches.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-auto rounded-2xl border border-line bg-surface p-1.5 shadow-xl">
          {matches.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => { onPick(p); setQuery(""); setOpen(false); }}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-ink/[0.05]"
            >
              <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-paper-2">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-ink-soft/40"><Package className="h-5 w-5" /></span>
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-ink">{p.name}</span>
                {p.category && <span className="block text-xs text-ink-soft">{p.category}</span>}
              </span>
              <Plus className="ml-auto h-4 w-4 text-accent" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Fila / mini-tarjeta ---------------- */
function QuoteRow({
  row,
  onPatch,
  onRemove,
}: {
  row: Row;
  onPatch: (p: Partial<Row>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-2.5">
      <div className="flex items-center gap-3">
        <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-paper-2">
          {row.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={row.image} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-ink-soft/40"><Package className="h-5 w-5" /></span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          {row.productId ? (
            <p className="truncate text-sm font-medium text-ink">{row.name}</p>
          ) : (
            <input
              value={row.name}
              onChange={(e) => onPatch({ name: e.target.value })}
              placeholder="Nombre del producto"
              className="w-full rounded-lg border border-line bg-paper px-2.5 py-1.5 text-sm outline-none focus:border-accent"
            />
          )}
          {!row.detail && (
            <button
              type="button"
              onClick={() => onPatch({ detail: true, quantity: row.quantity ?? 1 })}
              className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
            >
              <Plus className="h-3.5 w-3.5" /> Agregar cantidad y unidad
            </button>
          )}
        </div>

        <button type="button" onClick={onRemove} aria-label="Quitar" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-soft hover:bg-danger/10 hover:text-danger">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* cantidad + unidad (opcional, activable) */}
      {row.detail && (
        <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-line pt-2.5 pl-[3.75rem]">
          <span className="text-xs font-medium text-ink-soft">Cantidad:</span>
          <div className="inline-flex items-center rounded-full border border-line bg-paper">
            <button type="button" aria-label="Disminuir" onClick={() => onPatch({ quantity: Math.max(1, (row.quantity ?? 1) - 1) })} className="grid h-9 w-9 place-items-center text-ink-soft hover:text-ink">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <input
              type="number"
              min={1}
              value={row.quantity ?? 1}
              onChange={(e) => onPatch({ quantity: Math.max(1, Number(e.target.value) || 1) })}
              className="w-12 bg-transparent text-center text-sm font-semibold outline-none"
            />
            <button type="button" aria-label="Aumentar" onClick={() => onPatch({ quantity: (row.quantity ?? 1) + 1 })} className="grid h-9 w-9 place-items-center text-ink-soft hover:text-ink">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <select
            value={row.unit}
            onChange={(e) => onPatch({ unit: e.target.value })}
            className="h-9 rounded-lg border border-line bg-paper px-2 text-sm outline-none focus:border-accent"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>{u === "" ? "Sin unidad" : u}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onPatch({ detail: false, quantity: null, unit: "" })}
            className="inline-flex items-center gap-1 text-xs font-medium text-ink-soft hover:text-danger"
          >
            <X className="h-3.5 w-3.5" /> Quitar
          </button>
        </div>
      )}
    </div>
  );
}
