import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { Logo } from "@/components/ui/logo";
import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { ToastProvider } from "@/components/admin/toast";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Administración" };

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();
  const supabase = await createClient();
  const { count: newQuotes } = await supabase
    .from("quotes")
    .select("id", { count: "exact", head: true })
    .eq("status", "nueva");

  return (
    <ToastProvider>
    <div className="min-h-screen bg-paper-2 lg:flex">
      {/* Sidebar (escritorio) */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface p-4 lg:flex">
        <Link href="/admin" className="mb-6 px-2 pt-2">
          <Logo variant="color" height={38} />
        </Link>
        <p className="mb-1 px-3.5 text-[0.84rem] font-semibold uppercase tracking-wider text-ink-soft/60">
          Menú
        </p>
        <AdminNav newQuotes={newQuotes ?? 0} />
        <div className="mt-auto space-y-1 border-t border-line pt-3">
          <div className="flex items-center gap-2.5 px-2 pb-1">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {(profile.email ?? "?").charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-ink">
                {profile.full_name || "Administrador"}
              </span>
              <span className="block truncate text-xs text-ink-soft">{profile.email}</span>
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-ink/[0.05] hover:text-ink"
          >
            Ver tienda ↗
          </Link>
          <SignOutButton />
        </div>
      </aside>

      {/* Top bar (móvil) */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin">
            <Logo variant="color" height={32} />
          </Link>
          <SignOutButton className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-soft hover:text-danger" />
        </div>
        <div className="border-t border-line px-2 py-2">
          <AdminNav orientation="horizontal" newQuotes={newQuotes ?? 0} />
        </div>
      </header>

      {/* Contenido */}
      <main className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
    </div>
    </ToastProvider>
  );
}
