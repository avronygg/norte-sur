import "server-only";
import type { Category, ProductWithCategory, SaleMode } from "@/types/database";
import { seedCategories, seedProducts } from "./seed-products";

/**
 * Capa de acceso a productos.
 * Si Supabase está configurado, lee de la base. Si no, usa datos de ejemplo
 * (seed) para que la tienda sea navegable en desarrollo sin credenciales.
 */

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

async function db() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return seedCategories;
  const supabase = await db();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  if (error || !data) return seedCategories;
  return data as Category[];
}

export async function getProducts(opts?: {
  categorySlug?: string;
  featuredOnly?: boolean;
  mode?: SaleMode;
}): Promise<ProductWithCategory[]> {
  if (!isSupabaseConfigured()) {
    let items = seedProducts.filter((p) => p.is_active);
    if (opts?.featuredOnly) items = items.filter((p) => p.is_featured);
    if (opts?.mode) items = items.filter((p) => p.sale_mode === opts.mode);
    if (opts?.categorySlug) {
      const cat = seedCategories.find((c) => c.slug === opts.categorySlug);
      items = items.filter((p) => p.category_id === cat?.id);
    }
    return items
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((p) => ({
        ...p,
        category: seedCategories.find((c) => c.id === p.category_id) ?? null,
      }));
  }

  const supabase = await db();
  let query = supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .order("sort_order");

  if (opts?.featuredOnly) query = query.eq("is_featured", true);
  if (opts?.mode) query = query.eq("sale_mode", opts.mode);

  const { data, error } = await query;
  if (error || !data) return [];

  let items = data as unknown as ProductWithCategory[];
  if (opts?.categorySlug) {
    items = items.filter((p) => p.category?.slug === opts.categorySlug);
  }
  return items;
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithCategory | null> {
  if (!isSupabaseConfigured()) {
    const product = seedProducts.find((p) => p.slug === slug);
    if (!product) return null;
    return {
      ...product,
      category: seedCategories.find((c) => c.id === product.category_id) ?? null,
    };
  }

  const supabase = await db();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  return data as unknown as ProductWithCategory;
}
