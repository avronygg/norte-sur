import { Mail, Phone, MapPin } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/server";
import { StatusSelect } from "@/components/admin/status-select";
import { updateOrderStatus } from "./actions";
import { formatCLP } from "@/lib/utils";
import type { Order, OrderItem } from "@/types/database";

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

export default async function AdminPedidosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as unknown as (Order & { items: OrderItem[] })[];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-2xl font-bold tracking-tight">Pedidos</h1>
      <p className="text-sm text-ink-soft">{orders.length} pedidos.</p>

      {orders.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-line bg-surface px-4 py-12 text-center text-sm text-ink-soft">
          Aún no hay pedidos. Aparecerán aquí cuando alguien compre online.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
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

              {o.notes && (
                <p className="mt-3 text-sm text-ink-soft">Nota: {o.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
