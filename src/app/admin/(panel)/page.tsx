import Link from "next/link";
import {
  Package,
  ShoppingCart,
  FileText,
  Plus,
  ArrowRight,
  Warning,
  CheckCircle2,
  Pencil,
} from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { formatCLP } from "@/lib/utils";
import { Badge } from "@/components/admin/ui";
import { productIssues, ISSUE_LABEL, type ProductIssue } from "@/lib/product-health";
import type { Product } from "@/types/database";

const quoteTone: Record<string, "accent" | "warning" | "primary" | "neutral"> = {
  nueva: "accent",
  en_proceso: "warning",
  enviada: "primary",
  cerrada: "neutral",
};

function fmtShort(iso: string) {
  return new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "short" }).format(new Date(iso));
}

export default async function AdminDashboard() {
  const { profile } = await requireAdmin();
  const supabase = await createClient();

  const [productsRes, ordersCount, quotesNew, recentQuotes, recentOrders] = await Promise.all([
    supabase.from("products").select("id, name, images, short_description, description, sale_mode, stock, category_id, is_active"),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("quotes").select("id", { count: "exact", head: true }).eq("status", "nueva"),
    supabase.from("quotes").select("quote_number, customer_name, created_at, status").order("created_at", { ascending: false }).limit(5),
    supabase.from("orders").select("order_number, customer_name, total, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const products = (productsRes.data ?? []) as Product[];
  const total = products.length;

  // Salud del catálogo
  const analyzed = products.map((p) => ({ p, issues: productIssues(p) }));
  const needAttention = analyzed.filter((x) => x.issues.length > 0);
  const completeCount = total - needAttention.length;
  const pct = total === 0 ? 100 : Math.round((completeCount / total) * 100);

  const issueCounts: Record<ProductIssue, number> = { foto: 0, descripción: 0, stock: 0, categoría: 0 };
  for (const { issues } of analyzed) for (const i of issues) issueCounts[i]++;

  const firstName = (profile.full_name || profile.email || "").split(/[@ ]/)[0];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Encabezado */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Hola{firstName ? `, ${firstName}` : ""} 👋
          </h1>
          <p className="text-sm text-ink-soft">Esto es lo que pasa en Norte Sur hoy.</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-600"
        >
          <Plus className="h-4 w-4" /> Nuevo producto
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard href="/admin/productos" icon={Package} label="Productos en catálogo" value={total} />
        <StatCard
          href="/admin/cotizaciones"
          icon={FileText}
          label="Cotizaciones por responder"
          value={quotesNew.count ?? 0}
          highlight={(quotesNew.count ?? 0) > 0}
        />
        <StatCard href="/admin/pedidos" icon={ShoppingCart} label="Pedidos totales" value={ordersCount.count ?? 0} />
      </div>

      {/* Estado del catálogo */}
      <section className="mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight">Estado del catálogo</h2>
            <p className="text-sm text-ink-soft">
              {needAttention.length === 0
                ? "Todos los productos están completos."
                : `${needAttention.length} de ${total} necesitan atención.`}
            </p>
          </div>
          <div className="text-right">
            <span className="font-display text-3xl font-bold tabular-nums">{pct}%</span>
            <p className="text-xs text-ink-soft">completos</p>
          </div>
        </div>

        {/* barra de progreso */}
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-paper-2">
          <div
            className={`h-full rounded-full transition-all ${pct === 100 ? "bg-success" : "bg-accent"}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* desglose por tipo de problema */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(Object.keys(issueCounts) as ProductIssue[])
            .filter((k) => issueCounts[k] > 0)
            .map((k) => (
              <Link
                key={k}
                href={`/admin/productos?filtro=${encodeURIComponent(k)}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent"
              >
                <Warning className="h-3.5 w-3.5 text-warning" />
                {ISSUE_LABEL[k]}: <strong className="text-ink">{issueCounts[k]}</strong>
              </Link>
            ))}
        </div>

        {/* lista de productos con problemas */}
        {needAttention.length === 0 ? (
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-success/[0.08] px-4 py-4 text-sm text-success">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            Todo en orden: cada producto tiene foto, descripción y los datos necesarios.
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-line">
            {needAttention.slice(0, 6).map(({ p, issues }) => (
              <li key={p.id} className="flex items-center gap-3 py-2.5">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-paper-2">
                  {p.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-ink-soft/40">
                      <Package className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {issues.map((i) => (
                      <Badge key={i} tone="warning">{ISSUE_LABEL[i]}</Badge>
                    ))}
                    {!p.is_active && <Badge tone="danger">Inactivo</Badge>}
                  </div>
                </div>
                <Link
                  href={`/admin/productos/${p.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  <Pencil className="h-3.5 w-3.5" /> Completar
                </Link>
              </li>
            ))}
            {needAttention.length > 6 && (
              <li className="pt-3">
                <Link href="/admin/productos" className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
                  Ver los {needAttention.length} productos por completar <ArrowRight className="h-4 w-4" />
                </Link>
              </li>
            )}
          </ul>
        )}
      </section>

      {/* Actividad */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ActivityCard
          title="Cotizaciones recientes"
          href="/admin/cotizaciones"
          empty="Sin cotizaciones aún."
          rows={(recentQuotes.data ?? []).map((q) => ({
            id: q.quote_number,
            title: q.customer_name,
            sub: `${q.quote_number} · ${fmtShort(q.created_at)}`,
            right: <Badge tone={quoteTone[q.status] ?? "neutral"}>{q.status.replace("_", " ")}</Badge>,
          }))}
        />
        <ActivityCard
          title="Pedidos recientes"
          href="/admin/pedidos"
          empty="Sin pedidos aún."
          rows={(recentOrders.data ?? []).map((o) => ({
            id: o.order_number,
            title: o.customer_name,
            sub: `${o.order_number} · ${fmtShort(o.created_at)}`,
            right: <span className="font-display text-sm font-bold">{formatCLP(o.total)}</span>,
          }))}
        />
      </div>
    </div>
  );
}

function StatCard({
  href,
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        highlight
          ? "group rounded-2xl bg-accent p-5 text-accent-foreground shadow-sm transition-transform hover:-translate-y-0.5"
          : "group rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
      }
    >
      <div className="flex items-center justify-between">
        <span className={highlight ? "grid h-10 w-10 place-items-center rounded-xl bg-white/20" : "grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"}>
          <Icon className="h-5 w-5" />
        </span>
        <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${highlight ? "text-accent-foreground/70" : "text-ink-soft/50"}`} />
      </div>
      <p className="mt-4 font-display text-3xl font-bold tabular-nums">{value}</p>
      <p className={`text-sm ${highlight ? "text-accent-foreground/85" : "text-ink-soft"}`}>{label}</p>
    </Link>
  );
}

function ActivityCard({
  title,
  href,
  rows,
  empty,
}: {
  title: string;
  href: string;
  rows: { id: string; title: string; sub: string; right: React.ReactNode }[];
  empty: string;
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
          Ver todas <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-soft">{empty}</p>
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{r.title}</p>
                <p className="truncate text-xs text-ink-soft">{r.sub}</p>
              </div>
              {r.right}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
