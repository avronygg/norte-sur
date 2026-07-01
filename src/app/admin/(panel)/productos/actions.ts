"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { ensureAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { productSchema, type ProductInput } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export interface ActionResult {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  id?: string;
}

function revalidateAll() {
  revalidatePath("/admin/productos");
  revalidatePath("/productos");
  revalidatePath("/");
}

/**
 * Genera una URL firmada para subir una imagen DIRECTO a Supabase Storage
 * desde el navegador (sin pasar por el server → sin límite de 1MB).
 * Devuelve path + token (para uploadToSignedUrl) y la URL pública final.
 */
export async function createImageUploadUrl(
  ext: string,
): Promise<{ path?: string; token?: string; publicUrl?: string; error?: string }> {
  try {
    await ensureAdmin();
    const safeExt =
      (ext || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "jpg";
    const path = `${randomUUID()}.${safeExt}`;
    const admin = createAdminClient();
    const { data, error } = await admin.storage
      .from("products")
      .createSignedUploadUrl(path);
    if (error || !data) {
      return { error: error?.message ?? "No se pudo preparar la subida" };
    }
    const {
      data: { publicUrl },
    } = admin.storage.from("products").getPublicUrl(path);
    return { path: data.path, token: data.token, publicUrl };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Error al preparar la subida" };
  }
}

/** Crea o actualiza un producto. */
export async function saveProduct(
  input: ProductInput,
  id?: string,
): Promise<ActionResult> {
  try {
    await ensureAdmin();
  } catch {
    return { ok: false, error: "Sin permisos." };
  }

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, error: "Revisa los campos.", fieldErrors };
  }
  const data = parsed.data;
  const slug = data.slug?.trim() ? slugify(data.slug) : slugify(data.name);

  const payload = {
    name: data.name,
    slug,
    short_description: data.short_description || null,
    description: data.description || null,
    category_id: data.category_id || null,
    material: data.material || null,
    images: data.images ?? [],
    sale_mode: data.sale_mode,
    price: data.sale_mode === "direct" ? data.price : null,
    unit: data.unit || "kg",
    stock: data.stock ?? 0,
    is_active: data.is_active,
    is_featured: data.is_featured,
    sort_order: data.sort_order ?? 0,
  };

  const admin = createAdminClient();

  if (id) {
    const { error } = await admin.from("products").update(payload).eq("id", id);
    if (error) {
      if (error.code === "23505") {
        return { ok: false, fieldErrors: { slug: "Ya existe otro producto con ese slug." }, error: "Slug duplicado." };
      }
      return { ok: false, error: error.message };
    }
  } else {
    const { data: created, error } = await admin
      .from("products")
      .insert(payload)
      .select("id")
      .single();
    if (error) {
      if (error.code === "23505") {
        return { ok: false, fieldErrors: { slug: "Ya existe un producto con ese slug." }, error: "Slug duplicado." };
      }
      return { ok: false, error: error.message };
    }
    revalidateAll();
    return { ok: true, id: created?.id };
  }

  revalidateAll();
  return { ok: true, id };
}

/** Elimina un producto. */
export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    await ensureAdmin();
  } catch {
    return { ok: false, error: "Sin permisos." };
  }
  const admin = createAdminClient();
  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll();
  return { ok: true };
}
