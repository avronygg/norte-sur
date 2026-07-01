import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Truck, Factory, Target, Recycle, Award } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Nosotros",
  description: siteConfig.description,
};

const values = [
  { icon: Award, title: "+30 años de experiencia", text: "Tres décadas abasteciendo a la industria nacional con productos de limpieza confiables." },
  { icon: ShieldCheck, title: "Garantía 100%", text: "Respaldamos la calidad de cada producto que despachamos." },
  { icon: Truck, title: "Despacho a todo Chile", text: "Cobertura nacional, con entregas directas en la Región Metropolitana según volumen." },
  { icon: Recycle, title: "Materiales de alto rendimiento", text: "Huaipes y paños de gran absorción que rinden más por kilo." },
];

export default function NosotrosPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="texture-felpa absolute inset-0 opacity-80" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            Quiénes somos
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {siteConfig.legalName}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-primary-foreground/75">
            {siteConfig.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 text-accent">
              <Target className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Nuestro propósito</span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
              Tu proveedor de huaipes y paños al por mayor
            </h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Desde hace más de 30 años abastecemos a empresas e industrias de todo
              Chile con huaipes, paños y trapos de limpieza. Trabajamos con compras por
              volumen, precios de mayorista y atención directa, para que tu operación
              nunca se quede sin material.
            </p>
            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                Rubros que atendemos
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {siteConfig.industries.map((i) => (
                  <span key={i} className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm">
                    {i}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <Button asChild variant="accent">
                <Link href="/productos">Ver productos</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/cotizador">Cotizar</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-line bg-surface p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold">{v.title}</h3>
                <p className="mt-1.5 text-sm text-ink-soft">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper-2">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-16 text-center">
          <Factory className="h-10 w-10 text-accent" />
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            ¿Abasteces una empresa o taller?
          </h2>
          <p className="max-w-xl text-ink-soft">
            Conversemos sobre tus necesidades de limpieza industrial. Te cotizamos
            por volumen con precios especiales.
          </p>
          <Button asChild size="lg" variant="primary">
            <Link href="/cotizador">Solicitar cotización</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
