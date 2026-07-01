import type { Product } from "@/types/database";

export type ProductIssue = "foto" | "descripción" | "stock" | "categoría";

type Checkable = Pick<
  Product,
  "images" | "short_description" | "description" | "sale_mode" | "stock" | "category_id"
>;

/** Devuelve la lista de problemas/datos faltantes de un producto. */
export function productIssues(p: Checkable): ProductIssue[] {
  const issues: ProductIssue[] = [];
  if (!p.images || p.images.length === 0) issues.push("foto");
  if (!p.short_description?.trim() && !p.description?.trim()) issues.push("descripción");
  if (p.sale_mode === "direct" && Number(p.stock) <= 0) issues.push("stock");
  if (!p.category_id) issues.push("categoría");
  return issues;
}

export const ISSUE_LABEL: Record<ProductIssue, string> = {
  foto: "Sin foto",
  descripción: "Sin descripción",
  stock: "Sin stock",
  categoría: "Sin categoría",
};
