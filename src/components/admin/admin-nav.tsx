"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Package, ShoppingCart, FileText, Gear } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Inicio", icon: House, exact: true },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/cotizaciones", label: "Cotizaciones", icon: FileText, badgeKey: "quotes" },
  { href: "/admin/ajustes", label: "Ajustes", icon: Gear },
] as const;

export function AdminNav({
  orientation = "vertical",
  newQuotes = 0,
}: {
  orientation?: "vertical" | "horizontal";
  newQuotes?: number;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        orientation === "vertical"
          ? "flex flex-col gap-1"
          : "flex gap-1 overflow-x-auto",
      )}
    >
      {items.map((item) => {
        const active = "exact" in item && item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const badge = "badgeKey" in item && item.badgeKey === "quotes" ? newQuotes : 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group inline-flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-accent/12 text-accent-600"
                : "text-ink-soft hover:bg-ink/[0.05] hover:text-ink",
            )}
          >
            <item.icon className={cn("h-5 w-5", active ? "text-accent-600" : "text-ink-soft group-hover:text-ink")} />
            {item.label}
            {badge > 0 && (
              <span
                className={cn(
                  "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-accent-foreground",
                  orientation === "vertical" ? "ml-auto" : "ml-0.5",
                )}
              >
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
