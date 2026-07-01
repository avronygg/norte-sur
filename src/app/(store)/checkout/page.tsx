"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock, ShieldCheck } from "@/components/ui/icons";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { formatCLP } from "@/lib/utils";

const REGIONS = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo",
  "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío",
  "La Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes",
];

export default function CheckoutPage() {
  const { directLines, subtotal } = useCart();
  const [notice, setNotice] = useState(false);

  if (directLines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">No hay productos para pagar</h1>
        <p className="mt-2 text-ink-soft">
          Agrega productos de compra directa a tu carrito.
        </p>
        <Button asChild variant="accent" className="mt-6">
          <Link href="/productos">Ver productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold tracking-tight">Finalizar compra</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <form
          className="space-y-6 lg:col-span-2"
          onSubmit={(e) => {
            e.preventDefault();
            setNotice(true);
          }}
        >
          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-lg font-bold">Datos de despacho</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Nombre *" name="customer_name" required />
              <Field label="Correo *" name="customer_email" type="email" required />
              <Field label="Teléfono *" name="customer_phone" required />
              <Field label="Empresa" name="company" />
              <Field label="RUT" name="rut" />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Región *</label>
                <select
                  name="region"
                  required
                  className="h-11 rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-accent"
                >
                  <option value="">Selecciona…</option>
                  {REGIONS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <Field label="Comuna *" name="comuna" required />
              <Field label="Dirección *" name="address" required />
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-lg font-bold">Pago</h2>
            <p className="mt-2 text-sm text-ink-soft">
              El pago en línea se procesa de forma segura. Tarjetas de crédito/débito
              y transferencia.
            </p>
            {notice && (
              <div className="mt-4 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-ink">
                <strong>Pasarela en configuración.</strong> El checkout está listo;
                falta conectar las credenciales de la pasarela (Flow o Transbank)
                para procesar pagos reales. Mientras tanto puedes{" "}
                <Link href="/cotizador" className="font-medium text-accent">
                  enviar tu pedido como cotización
                </Link>{" "}
                o contactarnos directamente.
              </div>
            )}
            <Button type="submit" size="lg" variant="accent" className="mt-5 w-full sm:w-auto">
              <Lock className="h-4 w-4" /> Pagar {formatCLP(subtotal)}
            </Button>
          </section>
        </form>

        <aside className="h-fit rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-lg font-bold">Tu pedido</h2>
          <ul className="mt-4 space-y-3">
            {directLines.map((l) => (
              <li key={l.productId} className="flex justify-between text-sm">
                <span className="text-ink-soft">
                  {l.name} <span className="text-ink-soft/70">× {l.quantity} {l.unit}</span>
                </span>
                <span className="font-semibold">{formatCLP((l.price ?? 0) * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-line pt-4">
            <span className="font-display font-bold">Total</span>
            <span className="font-display text-xl font-bold">{formatCLP(subtotal)}</span>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs text-ink-soft">
            <ShieldCheck className="h-4 w-4 text-success" /> Compra protegida
          </p>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="h-11 rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-accent"
      />
    </div>
  );
}
