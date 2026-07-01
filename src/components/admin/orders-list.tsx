"use client";

import { useMemo, useState } from "react";
import { Mail, Phone, MapPin, MessageCircle } from "@/components/ui/icons";
import { StatusSelect } from "@/components/admin/status-select";
import { updateOrderStatus } from "@/app/admin/(panel)/pedidos/actions";
import { formatCLP } from "@/lib/utils";
import { waLink } from "@/lib/admin-format";
import type { Order, OrderItem } from "@/types/database";

type OrderRow = Order & { items: OrderItem[] };

const ORDER_STATUS = [
  { value: "pendiente", label: "Pendiente" },
  { value: "pagado", label: "Pagado" },
  { value: "preparando", label: "Preparando" },
  { value: "enviado", label: "Enviado" },
  { value: "entregado", label: "Entregado" },
  { value: "cancelado", label: "Cancelado" },
];

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

export function OrdersList({ orders }: { orders: OrderRow[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    for (const o of orders) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (!s) return true;
      return [o.customer_name, o.company, o.customer_email, o.order_number]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(s));
    });
  }, [orders, search, status]);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-2xl font-bold tracking-tight">Pedidos</h1>
      <p className="text-sm text-ink-soft">{orders.length} pedidos.</p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, empresa, correo o N°…"
          className="h-10 min-w-[14rem] flex-1 rounded-xl border border-line bg-surface px-3.5 text-sm outline-none transition-shadow placeholder:text-ink-soft/55 focus:border-accent focus:ring-4 focus:ring-accent/15"
        />
        <div className="flex flex-wrap gap-1.5">
          <Chip active={status === "all"} onClick={() => setStatus("all")} label="Todos" count={counts.all} />
          {ORDER_STATUS.map((s) => (
            <Chip
              key={s.value}
              active={status === s.value}
              onClick={() => setStatus(s.value)}
              label={s.label}
              count={counts[s.value] ?? 0}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-line bg-surface px-4 py-12 text-center text-sm text-ink-soft">
          {orders.length === 0
            ? "Aún no hay pedidos. Aparecerán aquí cuando alguien compre online."
            : "Ningún pedido coincide con la búsqueda."}
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {filtered.map((o) => {
            const wa = o.customer_phone
              ? waLink(o.customer_phone, `Hola ${o.customer_name}, te contactamos de Norte Sur por tu pedido ${o.order_number}.`)
              : null;
            return (
              <div key={o.id} className="rounded-2xl border border-line bg-surface p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-lg font-bold">{o.customer_name}</h2>
                      {o.company && <span className="text-sm text-ink-soft">· {o.company}</span>}
                    </div>
                    <p className="text-xs text-ink-soft">{o.order_number} · {fmtDate(o.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold">{formatCLP(o.total)}</p>
                    <div className="mt-1 flex items-center justify-end gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${o.payment_status === "aprobado" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                        {o.payment_status}
                      </span>
                      <StatusSelect id={o.id} value={o.status} options={ORDER_STATUS} action={updateOrderStatus} />
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-soft">
                  <a href={`mailto:${o.customer_email}`} className="inline-flex items-center gap-1.5 hover:text-accent">
                    <Mail className="h-4 w-4" /> {o.customer_email}
                  </a>
                  {o.customer_phone && (
                    <a href={`tel:${o.customer_phone}`} className="inline-flex items-center gap-1.5 hover:text-accent">
                      <Phone className="h-4 w-4" /> {o.customer_phone}
                    </a>
                  )}
                  {(o.address || o.comuna) && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {[o.address, o.comuna, o.region].filter(Boolean).join(", ")}
                    </span>
                  )}
                </div>

                <div className="mt-4 rounded-xl bg-paper-2 p-3">
                  <table className="w-full text-sm">
                    <tbody>
                      {o.items?.map((it) => (
                        <tr key={it.id} className="border-b border-line/60 last:border-0">
                          <td className="py-1.5">{it.name_snapshot} <span className="text-ink-soft">× {it.quantity} {it.unit}</span></td>
                          <td className="py-1.5 text-right font-medium">{formatCLP(it.line_total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {o.notes && <p className="mt-3 text-sm text-ink-soft">Nota: {o.notes}</p>}

                {wa && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-line px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      <MessageCircle className="h-4 w-4 text-[#25D366]" /> Escribir por WhatsApp
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground"
          : "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent"
      }
    >
      {label}
      <span className={active ? "text-accent-foreground/80" : "text-ink-soft/60"}>{count}</span>
    </button>
  );
}
