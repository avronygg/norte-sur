import { Mail, Phone, MapPin } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/server";
import { StatusSelect } from "@/components/admin/status-select";
import { updateQuoteStatus } from "./actions";
import type { Quote, QuoteItem } from "@/types/database";

const QUOTE_STATUS = [
  { value: "nueva", label: "Nueva" },
  { value: "en_proceso", label: "En proceso" },
  { value: "enviada", label: "Enviada" },
  { value: "cerrada", label: "Cerrada" },
];

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

export default async function AdminCotizacionesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("quotes")
    .select("*, items:quote_items(*)")
    .order("created_at", { ascending: false });
  const quotes = (data ?? []) as unknown as (Quote & { items: QuoteItem[] })[];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-2xl font-bold tracking-tight">Cotizaciones</h1>
      <p className="text-sm text-ink-soft">{quotes.length} solicitudes recibidas.</p>

      {quotes.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-line bg-surface px-4 py-12 text-center text-sm text-ink-soft">
          Aún no hay solicitudes de cotización.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {quotes.map((q) => (
            <div key={q.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-bold">{q.customer_name}</h2>
                    {q.company && <span className="text-sm text-ink-soft">· {q.company}</span>}
                  </div>
                  <p className="text-xs text-ink-soft">{q.quote_number} · {fmtDate(q.created_at)}</p>
                </div>
                <StatusSelect id={q.id} value={q.status} options={QUOTE_STATUS} action={updateQuoteStatus} />
              </div>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-soft">
                <a href={`mailto:${q.customer_email}`} className="inline-flex items-center gap-1.5 hover:text-accent">
                  <Mail className="h-4 w-4" /> {q.customer_email}
                </a>
                {q.customer_phone && (
                  <a href={`tel:${q.customer_phone}`} className="inline-flex items-center gap-1.5 hover:text-accent">
                    <Phone className="h-4 w-4" /> {q.customer_phone}
                  </a>
                )}
                {(q.comuna || q.region) && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {[q.comuna, q.region].filter(Boolean).join(", ")}
                  </span>
                )}
                {q.rut && <span>RUT: {q.rut}</span>}
              </div>

              <div className="mt-4 rounded-xl bg-paper-2 p-3">
                <table className="w-full text-sm">
                  <tbody>
                    {q.items?.map((it) => (
                      <tr key={it.id} className="border-b border-line/60 last:border-0">
                        <td className="py-1.5">{it.name_snapshot}</td>
                        <td className="py-1.5 text-right font-medium">
                          {it.quantity
                            ? `${it.quantity} ${it.unit ?? ""}`.trim()
                            : <span className="text-ink-soft">Cantidad a definir</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {q.message && (
                <p className="mt-3 rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink-soft">
                  “{q.message}”
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
