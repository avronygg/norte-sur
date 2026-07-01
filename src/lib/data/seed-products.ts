import type { Category, Product } from "@/types/database";

/**
 * Datos de ejemplo (espejo de supabase/seed.sql).
 * Se usan como FALLBACK cuando Supabase aún no está configurado, para poder
 * ver y navegar la tienda en desarrollo. Con Supabase activo, no se usan.
 */

export const seedCategories: Category[] = [
  { id: "cat-huaipes", name: "Huaipes", slug: "huaipes", description: "Huaipes industriales de alta absorción.", sort_order: 1, created_at: "" },
  { id: "cat-panos", name: "Paños", slug: "panos", description: "Paños de algodón, franela y jersey.", sort_order: 2, created_at: "" },
  { id: "cat-trapos", name: "Trapos", slug: "trapos", description: "Trapos industriales de jersey.", sort_order: 3, created_at: "" },
];

function p(partial: Partial<Product> & Pick<Product, "name" | "slug" | "category_id">): Product {
  return {
    id: partial.slug,
    short_description: null,
    description: null,
    material: null,
    images: ["/img/huaipe-blanco.webp"],
    sale_mode: "quote",
    price: null,
    unit: "kg",
    stock: 0,
    is_active: true,
    is_featured: false,
    sort_order: 0,
    created_at: "",
    updated_at: "",
    ...partial,
  } as Product;
}

export const seedProducts: Product[] = [
  // Huaipes
  p({ name: "Hilacha Blanca Capa", slug: "hilacha-blanca-capa", category_id: "cat-huaipes", material: "Huaipe", images: ["/img/huaipe-blanco.webp"], short_description: "Hilacha blanca de capa, alta absorción para limpieza general.", is_featured: true, sort_order: 1, sale_mode: "direct", price: 4490, stock: 80 }),
  p({ name: "Hilacha Fina Blanca", slug: "hilacha-fina-blanca", category_id: "cat-huaipes", material: "Huaipe", images: ["/img/huaipe-blanco.webp"], short_description: "Hilacha fina blanca, ideal para superficies delicadas.", sort_order: 2 }),
  p({ name: "Hilacha Color", slug: "hilacha-color", category_id: "cat-huaipes", material: "Huaipe", short_description: "Hilacha de color para limpieza pesada en taller.", sort_order: 3 }),
  p({ name: "Huaipe Mecánico Blanco", slug: "huaipe-mecanico-blanco", category_id: "cat-huaipes", material: "Huaipe", images: ["/img/huaipe-blanco.webp"], short_description: "Huaipe mecánico blanco, absorción de aceites y grasas.", is_featured: true, sort_order: 4, sale_mode: "direct", price: 3990, stock: 120 }),
  p({ name: "Huaipe Mecánico Blanco Especial", slug: "huaipe-mecanico-blanco-especial", category_id: "cat-huaipes", material: "Huaipe", images: ["/img/huaipe-blanco.webp"], short_description: "Versión especial de mayor rendimiento.", sort_order: 5 }),
  p({ name: "Huaipe Mecánico Color", slug: "huaipe-mecanico-color", category_id: "cat-huaipes", material: "Huaipe", short_description: "Huaipe mecánico de color, uso industrial general.", sort_order: 6 }),
  p({ name: "Huaipe Seda Blanco", slug: "huaipe-seda-blanco", category_id: "cat-huaipes", material: "Huaipe", images: ["/img/huaipe-blanco.webp"], short_description: "Huaipe seda blanco, suave y de alta absorción.", sort_order: 7 }),
  // Paños
  p({ name: "Paño Algodón Color", slug: "pano-algodon-color", category_id: "cat-panos", material: "Paño", short_description: "Paño de algodón de color para limpieza y pulido.", is_featured: true, sort_order: 1, sale_mode: "direct", price: 5990, stock: 60 }),
  p({ name: "Paño Franela Blanca Gris", slug: "pano-franela-blanca-gris", category_id: "cat-panos", material: "Paño", images: ["/img/huaipe-blanco.webp"], short_description: "Paño de franela blanca/gris, suave para acabados.", sort_order: 2 }),
  p({ name: "Paño Jersey Color", slug: "pano-jersey-color", category_id: "cat-panos", material: "Paño", short_description: "Paño de jersey de color, versátil y resistente.", sort_order: 3 }),
  // Trapos
  p({ name: "Jersey Blanco", slug: "jersey-blanco", category_id: "cat-trapos", material: "Trapo", images: ["/img/huaipe-blanco.webp"], short_description: "Trapo de jersey blanco para uso general en taller.", sort_order: 1, sale_mode: "direct", price: 3490, stock: 150 }),
];
