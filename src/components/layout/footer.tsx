import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";

export function Footer() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    siteConfig.contact.mapsQuery,
  )}`;
  return (
    <footer className="mt-24 border-t border-line bg-primary text-primary-foreground/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo variant="white" height={48} />
          <p className="mt-5 text-sm leading-relaxed text-primary-foreground/70">
            {siteConfig.shortDescription} +{siteConfig.yearsOfExperience} años de experiencia.
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-white">
            Productos
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/productos?categoria=huaipes" className="hover:text-white">Huaipes</Link></li>
            <li><Link href="/productos?categoria=panos" className="hover:text-white">Paños</Link></li>
            <li><Link href="/productos?categoria=trapos" className="hover:text-white">Trapos</Link></li>
            <li><Link href="/productos" className="hover:text-white">Ver todo el catálogo</Link></li>
            <li><Link href="/cotizador" className="hover:text-white">Cotizar por volumen</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-white">
            Empresa
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">Inicio</Link></li>
            <li><Link href="/nosotros" className="hover:text-white">Nosotros</Link></li>
            <li><Link href="/faq" className="hover:text-white">Preguntas frecuentes</Link></li>
            <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-white">
            Contacto
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                {siteConfig.contact.address}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-accent" />
              <a href={siteConfig.contact.phoneHref} className="hover:text-white">{siteConfig.contact.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 shrink-0 text-accent" />
              <a href={siteConfig.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {siteConfig.contact.whatsapp}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white">{siteConfig.contact.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-5 text-xs text-primary-foreground/60 md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} {siteConfig.legalName}. Todos los derechos reservados.</span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/terminos" className="hover:text-white">Términos y condiciones</Link>
            <Link href="/privacidad" className="hover:text-white">Privacidad</Link>
            <Link href="/despacho-devoluciones" className="hover:text-white">Despacho y devoluciones</Link>
            <Link href="/admin" className="hover:text-white">Acceso administrador</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
