import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Parallax } from "@/components/ui/parallax";
import { BrandGlow, WaveMark } from "@/components/ui/brand-decor";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Contacta a ${siteConfig.name}: ${siteConfig.contact.phone} · ${siteConfig.contact.email} · ${siteConfig.contact.address}`,
};

export default function ContactoPage() {
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    siteConfig.contact.mapsQuery,
  )}&output=embed`;

  return (
    <div className="relative isolate overflow-hidden">
      <Parallax className="pointer-events-none absolute -right-24 top-24 -z-10 h-72 w-72 opacity-70" from={40} to={-50}>
        <BrandGlow color="primary" className="h-full w-full" />
      </Parallax>
      <Parallax className="pointer-events-none absolute -left-20 top-2 -z-10 h-40 w-72 opacity-[0.16] sm:h-52 sm:w-96" from={-30} to={50} rotate={[-10, 8]}>
        <WaveMark className="h-full w-full" />
      </Parallax>

      <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="flex items-start gap-4">
        <Image
          src="/img/huaipesito.png"
          alt="Huaipesito"
          width={64}
          height={64}
          className="hidden h-16 w-16 shrink-0 rounded-2xl object-cover shadow-md ring-2 ring-accent/30 sm:block"
        />
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            Contacto
          </span>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
            Hablemos
          </h1>
          <p className="mt-3 text-ink-soft">
            ¿Necesitas abastecer tu empresa? Escríbenos y te preparamos una cotización
            por volumen, o visítanos en Santiago.
          </p>
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <ContactRow icon={MapPin} title="Dirección">
            {siteConfig.contact.address}, {siteConfig.contact.addressRegion}
          </ContactRow>
          <ContactRow icon={Phone} title="Teléfono">
            <a href={siteConfig.contact.phoneHref} className="hover:text-accent">
              {siteConfig.contact.phone}
            </a>
          </ContactRow>
          <ContactRow icon={MessageCircle} title="WhatsApp">
            <a
              href={siteConfig.contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              {siteConfig.contact.whatsapp}
            </a>
          </ContactRow>
          <ContactRow icon={Mail} title="Correo">
            <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-accent">
              {siteConfig.contact.email}
            </a>
          </ContactRow>
          <ContactRow icon={Clock} title="Despacho">
            {siteConfig.shipping.note}
          </ContactRow>

          <div className="flex gap-3 pt-2">
            <Button asChild variant="accent">
              <a href={siteConfig.contact.whatsappHref} target="_blank" rel="noopener noreferrer">
                Escribir por WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={`mailto:${siteConfig.contact.email}`}>Enviar correo</a>
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-line bg-surface">
          <iframe
            title="Ubicación Norte Sur"
            src={mapsSrc}
            className="h-full min-h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-5">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-ink-soft">{title}</p>
        <p className="mt-0.5 text-ink">{children}</p>
      </div>
    </div>
  );
}
