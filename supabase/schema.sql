-- ============================================================================
--  Norte Sur · Esquema de base de datos (PostgreSQL / Supabase)
--  Ejecutar en: Supabase → SQL Editor → New query → pegar y Run.
--  Idempotente en lo posible (usa IF NOT EXISTS / create or replace).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
--  Tipos
-- ----------------------------------------------------------------------------
do $$ begin
  create type sale_mode as enum ('direct', 'quote');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('pendiente', 'pagado', 'preparando', 'enviado', 'entregado', 'cancelado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('pendiente', 'aprobado', 'rechazado', 'reembolsado');
exception when duplicate_object then null; end $$;

do $$ begin
  create type quote_status as enum ('nueva', 'en_proceso', 'enviada', 'cerrada');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
--  Perfiles + helper de rol admin
-- ----------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Crea automáticamente un perfil al registrarse un usuario
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ¿El usuario actual es admin?
create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles where id = auth.uid() and is_admin = true
  );
$$;

-- ----------------------------------------------------------------------------
--  Categorías
-- ----------------------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
--  Productos  (modalidad: 'direct' = compra online | 'quote' = cotización)
-- ----------------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  category_id uuid references categories(id) on delete set null,
  material text,                       -- huaipe / paño / trapo / felpa, etc.
  images text[] not null default '{}', -- URLs (Supabase Storage)
  sale_mode sale_mode not null default 'quote',
  price numeric(12,2),                 -- requerido si sale_mode = 'direct'
  unit text not null default 'kg',     -- kg / unidad / bolsa / rollo
  stock numeric(12,2) not null default 0,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Si es precio directo, debe tener precio
  constraint price_required_for_direct
    check (sale_mode <> 'direct' or price is not null)
);

create index if not exists products_category_idx on products(category_id);
create index if not exists products_active_idx on products(is_active);

create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists products_touch on products;
create trigger products_touch before update on products
  for each row execute function touch_updated_at();

-- ----------------------------------------------------------------------------
--  Pedidos (compra directa)
-- ----------------------------------------------------------------------------
create sequence if not exists order_number_seq start 1000;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('NS-' || nextval('order_number_seq')::text),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  company text,
  rut text,
  region text,
  comuna text,
  address text,
  notes text,
  status order_status not null default 'pendiente',
  payment_method text,                 -- 'flow' | 'transbank' | ...
  payment_status payment_status not null default 'pendiente',
  payment_ref text,                    -- token / flowOrder / buyOrder
  subtotal numeric(12,2) not null default 0,
  shipping_cost numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  name_snapshot text not null,
  unit text not null default 'kg',
  unit_price numeric(12,2) not null,
  quantity numeric(12,2) not null,
  line_total numeric(12,2) not null
);
create index if not exists order_items_order_idx on order_items(order_id);

-- ----------------------------------------------------------------------------
--  Cotizaciones (solicitudes)
-- ----------------------------------------------------------------------------
create sequence if not exists quote_number_seq start 1000;

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  quote_number text not null unique default ('COT-' || nextval('quote_number_seq')::text),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  company text,
  rut text,
  region text,
  comuna text,
  message text,
  status quote_status not null default 'nueva',
  created_at timestamptz not null default now()
);

create table if not exists quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  name_snapshot text not null,
  unit text not null default '',
  quantity numeric(12,2) -- opcional: el cliente puede cotizar sin especificar cantidad
);
create index if not exists quote_items_quote_idx on quote_items(quote_id);

-- ----------------------------------------------------------------------------
--  Settings (clave/valor JSON) — contacto, correos de aviso, etc.
-- ----------------------------------------------------------------------------
create table if not exists settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into settings (key, value) values
  ('quote_notify_emails', '["ventas@huaipesypanos.cl"]'::jsonb),
  ('contact', '{"phone":"+56 2 2772 4630","whatsapp":"+56 9 3408 0189","email":"ventas@huaipesypanos.cl","address":"Rondizzoni N° 2596, Santiago"}'::jsonb),
  ('shipping', '{"flat_rate":0,"free_over":null,"note":"Despacho a nivel nacional según volumen."}'::jsonb)
on conflict (key) do nothing;

-- ============================================================================
--  ROW LEVEL SECURITY
-- ============================================================================
alter table profiles    enable row level security;
alter table categories  enable row level security;
alter table products    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;
alter table quotes      enable row level security;
alter table quote_items enable row level security;
alter table settings    enable row level security;

-- Profiles: cada uno ve/edita el suyo; admin ve todo
drop policy if exists "profiles self read" on profiles;
create policy "profiles self read" on profiles for select
  using (auth.uid() = id or is_admin());

-- Categorías: lectura pública, escritura admin
drop policy if exists "categories public read" on categories;
create policy "categories public read" on categories for select using (true);
drop policy if exists "categories admin write" on categories;
create policy "categories admin write" on categories for all
  using (is_admin()) with check (is_admin());

-- Productos: público ve activos; admin ve/edita todo
drop policy if exists "products public read" on products;
create policy "products public read" on products for select
  using (is_active = true or is_admin());
drop policy if exists "products admin write" on products;
create policy "products admin write" on products for all
  using (is_admin()) with check (is_admin());

-- Pedidos: cualquiera puede crear (checkout); solo admin lee/edita
drop policy if exists "orders public insert" on orders;
create policy "orders public insert" on orders for insert with check (true);
drop policy if exists "orders admin read" on orders;
create policy "orders admin read" on orders for select using (is_admin());
drop policy if exists "orders admin update" on orders;
create policy "orders admin update" on orders for update using (is_admin());

drop policy if exists "order_items public insert" on order_items;
create policy "order_items public insert" on order_items for insert with check (true);
drop policy if exists "order_items admin read" on order_items;
create policy "order_items admin read" on order_items for select using (is_admin());

-- Cotizaciones: cualquiera crea; solo admin lee/edita
drop policy if exists "quotes public insert" on quotes;
create policy "quotes public insert" on quotes for insert with check (true);
drop policy if exists "quotes admin read" on quotes;
create policy "quotes admin read" on quotes for select using (is_admin());
drop policy if exists "quotes admin update" on quotes;
create policy "quotes admin update" on quotes for update using (is_admin());

drop policy if exists "quote_items public insert" on quote_items;
create policy "quote_items public insert" on quote_items for insert with check (true);
drop policy if exists "quote_items admin read" on quote_items;
create policy "quote_items admin read" on quote_items for select using (is_admin());

-- Settings: lectura pública (contacto), escritura admin
drop policy if exists "settings public read" on settings;
create policy "settings public read" on settings for select using (true);
drop policy if exists "settings admin write" on settings;
create policy "settings admin write" on settings for all
  using (is_admin()) with check (is_admin());

-- ============================================================================
--  STORAGE (imágenes de productos)
--  El bucket 'products' se crea desde la UI (Storage → New bucket → público),
--  o descomentando la línea de abajo. NO se crean políticas sobre
--  storage.objects aquí: las subidas van por el servidor con la service_role
--  (que omite RLS) y la lectura es pública por ser un bucket público.
-- ============================================================================
-- insert into storage.buckets (id, name, public)
-- values ('products', 'products', true)
-- on conflict (id) do nothing;
