# Puesta en marcha · Norte Sur

## 1. Ver el sitio ahora mismo (sin configurar nada)
```bash
npm run dev
```
Abre http://localhost:3000 — la tienda funciona con **datos de ejemplo** (los
productos reales extraídos del sitio actual). Puedes navegar: inicio, productos,
detalle, carrito y cotizador.

> El cotizador, sin Resend configurado, **no enviará correos** pero no falla:
> registra el aviso en la consola. Con Supabase + Resend, guarda y envía de verdad.

## 2. Conectar Supabase (base de datos + admin + imágenes)
1. Crea una cuenta gratis en https://supabase.com y un **proyecto nuevo**.
2. Ve a **SQL Editor → New query**, pega el contenido de `supabase/schema.sql` y *Run*.
3. (Opcional) Repite con `supabase/seed.sql` para cargar los productos iniciales.
4. Ve a **Settings → API** y copia los valores a un archivo `.env.local`
   (usa `.env.example` como plantilla):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Crea tu **usuario admin**: en Supabase → **Authentication → Users → Add user**
   (con tu correo y contraseña). Luego, en **SQL Editor**, marca ese usuario como admin:
   ```sql
   update profiles set is_admin = true where email = 'TU-CORREO';
   ```

## 3. Correos de cotización (Resend)
1. Crea cuenta en https://resend.com y genera un **API Key**.
2. En `.env.local`:
   - `RESEND_API_KEY=...`
   - `QUOTE_NOTIFY_EMAILS=ventas@huaipesypanos.cl, otro@correo.cl`
3. Para enviar desde `@huaipesypanos.cl`, verifica el dominio en Resend y ajusta `EMAIL_FROM`.

## 4. Pasarela de pago (cuando tengas credenciales)
- **Flow (recomendado para partir):** crea cuenta comercial en https://www.flow.cl,
  obtén `apiKey` y `secretKey`, y los ponemos en `.env.local`. Yo dejo el checkout
  conectado.
- **Transbank Webpay Plus:** alternativa más "formal"; se puede migrar después.

## 5. Subir a producción (Vercel)
1. Sube el proyecto a GitHub.
2. Importa el repo en https://vercel.com, pega las mismas variables de entorno.
3. Conecta el dominio (`huaipesypanos.cl` u otro).

---
**Estado actual:** storefront completo (inicio, catálogo, detalle, carrito,
cotizador, nosotros, contacto). Pendiente: panel admin, checkout con pago real e
integración de pasarela — siguiente ronda.
