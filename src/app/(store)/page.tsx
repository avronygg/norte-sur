import Link from "next/link";
import {
  ArrowRight,
  FileText,
  ShoppingCart,
  Sparkles,
  Grid3x3,
  Buildings,
  ShieldCheck,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/home/hero";
import { LocationSection } from "@/components/layout/location-section";
import { FeaturedCarousel } from "@/components/products/featured-carousel";
import { CategoryCarousel } from "@/components/products/category-carousel";
import { ProductCard } from "@/components/products/product-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { Parallax } from "@/components/ui/parallax";
import { BrandGlow, WaveMark } from "@/components/ui/brand-decor";
import { BrandVideo } from "@/components/ui/brand-video";
import { getCategories, getProducts } from "@/lib/data/products";
import { siteConfig } from "@/config/site";

const categories = [
  {
    name: "Huaipes",
    slug: "huaipes",
    blurb: "Alta absorción para máquinas, herramientas y grasas.",
    items: "7 variedades",
    gradient: "from-[#004b95] to-[#06325f]",
  },
  {
    name: "Paños",
    slug: "panos",
    blurb: "Algodón, franela y jersey para limpieza fina y pulido.",
    items: "3 variedades",
    gradient: "from-[#3f8e64] to-[#2c6d4b]",
  },
  {
    name: "Trapos",
    slug: "trapos",
    blurb: "Jersey resistente para uso general en taller.",
    items: "1 variedad",
    gradient: "from-[#0e6bbf] to-[#004b95]",
  },
];

export default async function Home() {
  const [allProducts, categoryList] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const featuredOnly = allProducts.filter((p) => p.is_featured);

  // Categorías con sus productos
  const categoriesWithProducts = categoryList
    .map((cat) => ({
      category: cat,
      products: allProducts.filter((p) => p.category?.id === cat.id),
    }))
    .filter((c) => c.products.length > 0);

  // Categorías grandes (≥4 productos) → fila-slider propia.
  // Categorías chicas (<4) → se agrupan para no verse vacías.
  const BIG = 4;
  const bigCats = categoriesWithProducts.filter((c) => c.products.length >= BIG);
  const smallCats = categoriesWithProducts.filter((c) => c.products.length < BIG);
  const smallTitle = smallCats.map((c) => c.category.name).join(" y ");

  const heroShowcase = (featuredOnly.length > 0 ? featuredOnly : allProducts).slice(0, 5);

  return (
    <>
      <Hero products={heroShowcase} />

      {/* ===================== DESTACADOS (CARRUSEL) ===================== */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
              <Sparkles className="h-4 w-4" /> Productos destacados
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Los más pedidos por las empresas
            </h2>
          </div>
          <Button asChild variant="subtle">
            <Link href="/productos">
              Ver todo el catálogo <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>

        <Reveal className="mt-10" delay={0.1}>
          <FeaturedCarousel products={allProducts} />
        </Reveal>
      </section>

      {/* ===================== CATEGORÍAS ===================== */}
      <section className="border-y border-line bg-paper-2">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              Nuestro catálogo
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Encuentra el material para tu rubro
            </h2>
          </Reveal>

          <RevealGroup className="mt-10 grid gap-6 md:grid-cols-3">
            {categories.map((c) => (
              <RevealItem key={c.slug}>
                <Link
                  href={`/productos?categoria=${c.slug}`}
                  className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-3xl border border-line p-7 text-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`} aria-hidden />
                  <div className="texture-weave absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30" aria-hidden />
                  <div
                    className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl transition-transform duration-500 group-hover:scale-150"
                    aria-hidden
                  />
                  <div className="relative">
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
                      {c.items}
                    </span>
                    <h3 className="mt-2 font-display text-3xl font-bold">{c.name}</h3>
                    <p className="mt-2 text-sm text-white/80">{c.blurb}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-foreground">
                      <span className="rounded-full bg-accent px-3 py-1.5 transition-transform group-hover:translate-x-1">
                        Explorar →
                      </span>
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ===================== SHOWCASE: VARIEDAD DE PAÑOS ===================== */}
      <section className="relative isolate overflow-hidden bg-primary py-20 text-primary-foreground">
        <div className="texture-felpa absolute inset-0 opacity-70" aria-hidden />
        <div className="texture-weave absolute inset-0 opacity-10" aria-hidden />
        <Parallax className="pointer-events-none absolute -right-24 top-6 -z-10 h-80 w-80 opacity-70" from={60} to={-70}>
          <BrandGlow color="accent" className="h-full w-full" />
        </Parallax>
        <Parallax className="pointer-events-none absolute -left-6 bottom-4 -z-10 h-40 w-72 opacity-25 sm:h-52 sm:w-96" from={-30} to={50} rotate={[-10, 8]}>
          <WaveMark className="h-full w-full" />
        </Parallax>

        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 lg:flex-row lg:items-center lg:gap-14">
          <Reveal className="w-full max-w-[360px] shrink-0">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-accent to-primary p-[3px] shadow-2xl">
              <div className="h-full w-full overflow-hidden rounded-[1.4rem]">
                <video
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="/video/mascota-panos.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:flex-1">
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">
              Nuestra gama
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Un paño para cada trabajo
            </h2>
            <p className="mt-4 max-w-md text-primary-foreground/75">
              Huaipes, paños y trapos en distintos materiales y colores, para talleres
              mecánicos, pintura automotriz, imprentas, serigrafía y mueblerías. Elige el
              que mejor rinde para tu operación y pídelo por volumen.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href="/productos">Ver catálogo</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Link href="/cotizador">Cotizar por volumen</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== PRODUCTOS POR CATEGORÍA ===================== */}
      <section className="relative isolate overflow-hidden">
        <Parallax className="pointer-events-none absolute -right-24 top-8 -z-10 h-80 w-80" from={60} to={-80}>
          <BrandGlow color="accent" className="h-full w-full" />
        </Parallax>
        <div className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
              <Grid3x3 className="h-4 w-4" /> Por categoría
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Explora cada línea
            </h2>
          </div>
          <Button asChild variant="subtle">
            <Link href="/productos">
              Catálogo con filtros <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>

        {/* Categorías grandes → su propia fila con slider */}
        <div className="mt-12 space-y-16">
          {bigCats.map(({ category, products }) => (
            <Reveal key={category.id}>
              <CategoryCarousel category={category} products={products} />
            </Reveal>
          ))}
        </div>

        {/* Categorías chicas → juntas en una grilla compacta */}
        {smallCats.length > 0 && (
          <Reveal className="mt-16">
            <div className="mb-5 flex items-end justify-between gap-4 border-b border-line pb-3">
              <h3 className="font-display text-2xl font-bold tracking-tight">{smallTitle}</h3>
              <Link
                href="/productos"
                className="shrink-0 text-sm font-semibold text-accent hover:underline"
              >
                Ver todo →
              </Link>
            </div>
            <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {smallCats.flatMap(({ products }) =>
                products.map((product) => (
                  <RevealItem key={product.id}>
                    <ProductCard product={product} />
                  </RevealItem>
                )),
              )}
            </RevealGroup>
          </Reveal>
        )}
        </div>
      </section>

      {/* ===================== CALIDAD Y COMPROMISO + VIDEO ===================== */}
      <section className="relative isolate overflow-hidden border-y border-line bg-paper-2">
        <Parallax className="pointer-events-none absolute -left-24 -top-10 -z-10 h-80 w-80 opacity-70" from={-40} to={70}>
          <BrandGlow color="primary" className="h-full w-full" />
        </Parallax>
        <Parallax className="pointer-events-none absolute -right-6 top-6 -z-10 h-32 w-56 opacity-25 sm:h-44 sm:w-80" from={40} to={-50} rotate={[8, -10]}>
          <WaveMark className="h-full w-full" />
        </Parallax>
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-20 lg:flex-row lg:items-center lg:gap-14">
          <Reveal className="lg:flex-1">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent">
              <Buildings className="h-4 w-4" /> Nuestra empresa
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Calidad y compromiso industrial
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Contamos con una amplia gama de clientes a nivel nacional. Norte Sur
              ofrece soluciones industriales prácticas y de la más alta calidad, tanto
              para empresas de gran escala como para clientes particulares.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Nuestros productos son la solución ideal para talleres mecánicos, pintura
              automotriz, imprentas, talleres de serigrafía, mueblerías y la industria
              en general.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {siteConfig.industries.map((i) => (
                <span
                  key={i}
                  className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-ink-soft"
                >
                  {i}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="primary">
                <Link href="/nosotros">Conoce más de nosotros</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/cotizador">Cotizar</Link>
              </Button>
            </div>
          </Reveal>

          {/* Video institucional: Huaipesito hablando (con toggle de sonido) */}
          <Reveal delay={0.1} className="w-full max-w-[320px] shrink-0">
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-3xl border border-line bg-primary shadow-2xl">
              <BrandVideo src="/video/norte-sur.mp4" />
              <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-accent" /> +30 años de experiencia
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== EXPLICATIVO: COMPRA vs COTIZA ===================== */}
      <section className="relative isolate overflow-hidden py-20">
        <Parallax className="pointer-events-none absolute -left-16 top-4 -z-10 h-40 w-72 opacity-20 sm:h-52 sm:w-[26rem]" from={-40} to={60} rotate={[-12, 6]}>
          <WaveMark className="h-full w-full" />
        </Parallax>
        <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            Dos formas de comprar
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Compra al instante o cotiza por volumen
          </h2>
          <p className="mt-4 text-ink-soft">
            Cada producto indica su modalidad. Algunos los compras y pagas online;
            otros, por su naturaleza mayorista, se gestionan con una cotización.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2">
          <RevealItem>
            <div className="group h-full rounded-3xl border border-line bg-surface p-8 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent transition-transform group-hover:scale-110">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold">Compra directa</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Productos con precio y stock publicado. Los agregas al carrito y pagas
                online con tarjeta o transferencia. Recibes tu boleta y coordinamos el
                despacho.
              </p>
              <Button asChild variant="primary" className="mt-6">
                <Link href="/productos">Ver productos en venta</Link>
              </Button>
            </div>
          </RevealItem>

          <RevealItem>
            <div className="group h-full rounded-3xl border border-line bg-surface p-8 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold">Por cotización</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Para grandes volúmenes o precios especiales. Armas tu lista de productos
                y cantidades, y te enviamos una cotización formal a tu correo en el menor
                tiempo posible.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/cotizador">Solicitar cotización</Link>
              </Button>
            </div>
          </RevealItem>
        </RevealGroup>
        </div>
      </section>

      {/* ===================== CTA FINAL ===================== */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground md:px-16">
            <div className="texture-felpa absolute inset-0 opacity-80" aria-hidden />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                ¿Necesitas abastecer tu empresa?
              </h2>
              <p className="mt-4 text-primary-foreground/75">
                Cuéntanos qué necesita tu empresa y te preparamos una cotización por
                volumen. Atención directa y despacho a todo Chile.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" variant="accent">
                  <Link href="/cotizador">Cotizar ahora</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <a href={siteConfig.contact.whatsappHref} target="_blank" rel="noopener noreferrer">
                    Escríbenos por WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===================== UBICACIÓN ===================== */}
      <LocationSection />
    </>
  );
}
