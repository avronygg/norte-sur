import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import type { Category, Product } from "@/types/database";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  if (!product) notFound();

  return (
    <ProductForm
      categories={(categories ?? []) as Category[]}
      product={product as Product}
    />
  );
}
