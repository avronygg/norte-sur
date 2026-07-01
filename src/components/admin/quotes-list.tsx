"use client";

import { useMemo, useState } from "react";
import { Mail, Phone, MapPin, MessageCircle } from "@/components/ui/icons";
import { StatusSelect } from "@/components/admin/status-select";
import { updateQuoteStatus } from "@/app/admin/(panel)/cotizaciones/actions";
import { waLink } from "@/lib/admin-format";
import type { Quote, QuoteItem } from "@/types/database";

type QuoteRow = Quote & { items: QuoteItem[] };

const QUOTE_STATUS = [
  { value: "nueva", label: "Nueva" },
  { value: "en_proceso", label: "En proceso" },
  { value: "enviada", label: "Enviada" },
  { value: "cerrada", label: "Cerrada" },
];

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

export function QuotesList({ quotes }: { quotes: QuoteRow[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: quotes.length };
    for (const q of quotes) c[q.status] = (c[q.status] ?? 0) + 1;
    return c;
  }, [quotes]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return quotes.filter((q) => {
      if (status !== "all" && q.status !== status) return false;
      if (!s) return true;
      return [q.customer_name, q.company, q.customer_email, q.quote_number]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(s));
    });
  }, [quotes, search, status]);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-2xl font-bold tracking-tight">Cotizaciones</h1>
      <p className="text-sm text-ink-soft">{quotes.length} solicitudes recibidas.</p>

      {/* Filtros */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, empresa, correo o N°…"
          className="h-10 min-w-[14rem] flex-1 rounded-xl border border-line bg-surface px-3.5 text-sm outline-none transition-shadow placeholder:text-ink-soft/55 focus:border-accent focus:ring-4 focus:ring-accent/15"
        />
        <div className="flex flex-wrap gap-1.5">
          <Chip active={status === "all"} onClick={() => setStatus("all")} label="Todas" count={counts.all} />
          {QUOTE_STATUS.map((s) => (
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
          {quotes.length === 0
            ? "Aún no hay solicitudes de cotización."
            : "Ninguna cotización coincide con la búsqueda."}
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {filtered.map((q) => {
            const itemsText = q.items
              ?.map((it) => `- ${it.name_snapshot}${it.quantity ? ` (${it.quantity} ${it.unit ?? ""})` : ""}`)
              .join("\n");
            const mailBody = `Hola ${q.customer_name},\n\nGracias por tu solicitud de cotización ${q.quote_number} en Norte Sur.\n\nProductos solicitados:\n${itemsText}\n\n`;
            const mailHref = `mailto:${q.customer_email}?subject=${encodeURIComponent(`Cotización ${q.quote_number} · Norte Sur`)}&body=${encodeURIComponent(mailBody)}`;
            const wa = q.customer_phone ? waLink(q.customer_phone, `Hola ${q.customer_name}, te contactamos de Norte Sur por tu cotización ${q.quote_number}.`) : null;

            return (
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

                {/* Respuesta rápida */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={mailHref}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Mail className="h-4 w-4" /> Responder por correo
                  </a>
                  {wa && (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-line px-3.5 py-2 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      <MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp
                    </a>
                  )}
                </div>
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
