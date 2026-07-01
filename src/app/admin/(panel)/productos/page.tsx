import { createClient } from "@/lib/supabase/server";
import { ProductsTable } from "@/components/admin/products-table";
import type { Category, ProductWithCategory } from "@/types/database";

export default async function AdminProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string }>;
}) {
  const { filtro } = await searchParams;
  const supabase = await createClient();
  const [productsRes, categoriesRes] = await Promise.all([
    supabase.from("products").select("*, category:categories(*)").order("sort_order"),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  const products = (productsRes.data ?? []) as unknown as ProductWithCategory[];
  const categories = (categoriesRes.data ?? []) as Category[];

  return (
    <ProductsTable
      initialProducts={products}
      categories={categories}
      initialFilter={filtro}
    />
  );
}
