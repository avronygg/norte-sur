import { MapPin, Phone, MessageCircle, Clock, ExternalLink } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

export function LocationSection() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    siteConfig.contact.mapsQuery,
  )}`;
  const mapsEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    siteConfig.contact.mapsQuery,
  )}&output=embed`;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-sm">
        <div className="grid lg:grid-cols-5">
          {/* Información */}
          <div className="flex flex-col justify-center gap-6 p-8 sm:p-10 lg:col-span-2">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight">Visítanos</h2>
              <p className="mt-2 text-ink-soft">
                Estamos en Santiago y despachamos a todo Chile.
              </p>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                  <MapPin className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-medium text-ink">{siteConfig.contact.address}</span>
                  <span className="block text-sm text-ink-soft">{siteConfig.contact.addressRegion}</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                  <Phone className="h-5 w-5" />
                </span>
                <span>
                  <a href={siteConfig.contact.phoneHref} className="block font-medium text-ink hover:text-accent">
                    {siteConfig.contact.phone}
                  </a>
                  <span className="block text-sm text-ink-soft">Lun a Vie · horario comercial</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                  <Clock className="h-5 w-5" />
                </span>
                <span className="text-sm text-ink-soft">{siteConfig.shipping.note}</span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-3">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-600"
              >
                Cómo llegar <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <MessageCircle className="h-4 w-4 text-accent" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Mapa */}
          <div className="relative min-h-72 lg:col-span-3">
            <iframe
              title="Ubicación Norte Sur en Google Maps"
              src={mapsEmbedSrc}
              className="absolute inset-0 h-full w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
