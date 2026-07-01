@AGENTS.md

# Norte Sur — E-commerce + Cotizador

Tienda industrial (huaipes, paños, trapos) con **doble modalidad por producto**:
`direct` (compra + pago online) o `quote` (solicitud de cotización).

## Stack
- Next.js 16 (App Router) + React + TypeScript + Tailwind v4
- Supabase: Postgres + Auth + Storage (`src/lib/supabase/`)
- Resend para correos (`src/lib/email.ts`)
- Pasarela enchufable (Flow / Transbank) — pendiente de credenciales

## Estructura clave
- `src/config/site.ts` — datos de marca/contacto (extraídos de huaipesypanos.cl)
- `src/types/database.ts` — tipos de la BD (usar `type`, NO `interface`, o Supabase los rechaza)
- `src/lib/data/products.ts` — acceso a productos con **fallback a seed** si Supabase no está configurado (`isSupabaseConfigured()`)
- `src/lib/data/seed-products.ts` — datos de ejemplo (espejo de `supabase/seed.sql`)
- `src/components/cart/cart-provider.tsx` — carrito (localStorage), separa `directLines` / `quoteLines`
- `src/app/cotizador/actions.ts` — server action: guarda cotización + envía correos
- `supabase/schema.sql` + `supabase/seed.sql` — ejecutar en Supabase SQL Editor

## Diseño
Paleta en `globals.css`: `paper` (fondo cálido), `primary` (azul #12304a), `accent` (cobre #c0612f).
Texturas de tela: clases `.texture-weave`, `.texture-felpa`, `.grain`. Fuentes: Inter (body) + Space Grotesk (display).

## Pendiente (próxima ronda)
- Panel admin (login Supabase, CRUD productos/stock, pedidos, cotizaciones, settings)
- Checkout real + integración de pasarela (Flow primero)
- Subida de imágenes a Supabase Storage (bucket `products`)

## Comandos
- `npm run dev` · `npm run build` · `npm run start`
