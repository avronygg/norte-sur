import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import type { Category } from "@/types/database";

export default async function NuevoProductoPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return <ProductForm categories={(data ?? []) as Category[]} />;
}
