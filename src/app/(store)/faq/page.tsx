import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { Parallax } from "@/components/ui/parallax";
import { BrandGlow, WaveMark } from "@/components/ui/brand-decor";
import { faqs } from "@/config/faq";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Respuestas sobre venta por mayor de huaipes y paños industriales: cotizaciones, despacho a todo Chile, formas de pago y más.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="relative isolate overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Parallax className="pointer-events-none absolute -left-24 top-24 -z-10 h-72 w-72 opacity-70" from={40} to={-50}>
        <BrandGlow color="accent" className="h-full w-full" />
      </Parallax>
      <Parallax className="pointer-events-none absolute -right-16 top-6 -z-10 h-40 w-72 opacity-20 sm:h-52 sm:w-96" from={-30} to={50} rotate={[-10, 8]}>
        <WaveMark className="h-full w-full" />
      </Parallax>

      <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Encabezado con Huaipesito */}
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <header>
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            Preguntas frecuentes
          </span>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
            ¿Tienes dudas? Huaipesito te ayuda
          </h1>
          <p className="mt-3 max-w-md text-ink-soft">
            Esto es lo que más nos preguntan sobre la venta por mayor de huaipes y
            paños industriales. Si no encuentras tu respuesta, escríbenos.
          </p>
        </header>

        <div className="flex justify-center lg:justify-end">
          <div className="relative aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-3xl border border-line bg-paper-2 shadow-xl">
            <Image
              src="/img/huaipesito-taller.webp"
              alt="Huaipesito, la mascota de Norte Sur"
              fill
              sizes="280px"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <FaqAccordion items={faqs} />
      </div>

      <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-line bg-paper-2/60 px-6 py-8 text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight">
          ¿No resolvimos tu duda?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-ink-soft">
          Escríbenos y te respondemos a la brevedad, o pide directamente tu cotización
          por volumen.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="accent" size="lg">
            <Link href="/cotizador">Pedir cotización</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={siteConfig.contact.whatsappHref} target="_blank" rel="noopener noreferrer">
              Escribir por WhatsApp
            </a>
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}
