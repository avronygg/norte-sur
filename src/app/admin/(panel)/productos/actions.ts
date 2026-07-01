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

/**
 * Actualiza campos sueltos de un producto (edición inline en la lista):
 * precio, stock, activo, destacado. Valida y revalida.
 */
export async function updateProductFields(
  id: string,
  fields: {
    price?: number | null;
    stock?: number;
    is_active?: boolean;
    is_featured?: boolean;
  },
): Promise<ActionResult> {
  try {
    await ensureAdmin();
  } catch {
    return { ok: false, error: "Sin permisos." };
  }

  const payload: Record<string, unknown> = {};
  if ("price" in fields) {
    const v = fields.price;
    if (v != null && (Number.isNaN(v) || v < 0)) {
      return { ok: false, error: "Precio inválido." };
    }
    payload.price = v;
  }
  if ("stock" in fields) {
    const v = Number(fields.stock);
    if (Number.isNaN(v) || v < 0) return { ok: false, error: "Stock inválido." };
    payload.stock = v;
  }
  if ("is_active" in fields) payload.is_active = Boolean(fields.is_active);
  if ("is_featured" in fields) payload.is_featured = Boolean(fields.is_featured);

  if (Object.keys(payload).length === 0) return { ok: true, id };

  const admin = createAdminClient();
  const { error } = await admin.from("products").update(payload as never).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll();
  return { ok: true, id };
}

/** Duplica un producto (crea una copia inactiva lista para editar). */
export async function duplicateProduct(id: string): Promise<ActionResult> {
  try {
    await ensureAdmin();
  } catch {
    return { ok: false, error: "Sin permisos." };
  }
  const admin = createAdminClient();
  const { data: orig, error: readErr } = await admin
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (readErr || !orig) return { ok: false, error: readErr?.message ?? "No se encontró el producto." };

  const rnd = randomUUID().slice(0, 6);
  const {
    id: _omitId,
    created_at: _omitCreated,
    updated_at: _omitUpdated,
    ...rest
  } = orig as Record<string, unknown>;

  const payload = {
    ...rest,
    name: `${orig.name} (copia)`,
    slug: `${orig.slug}-copia-${rnd}`,
    is_active: false,
    is_featured: false,
  };

  const { data: created, error } = await admin
    .from("products")
    .insert(payload as never)
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidateAll();
  return { ok: true, id: created?.id };
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
