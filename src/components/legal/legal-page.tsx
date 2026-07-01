import Link from "next/link";
import { ArrowLeft } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al inicio
      </Link>

      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Última actualización: {siteConfig.legal.lastUpdated}
      </p>
      {intro && <p className="mt-4 text-ink-soft">{intro}</p>}

      <div className="mt-5 rounded-xl border border-warning/30 bg-warning/[0.07] px-4 py-3 text-sm text-ink-soft">
        <strong className="text-ink">Documento en borrador.</strong> Es una base
        general y debe ser revisada por un abogado, completando los datos de la empresa
        (razón social y RUT) antes de publicarse.
      </div>

      <article className="legal-prose mt-8">{children}</article>
    </div>
  );
}
