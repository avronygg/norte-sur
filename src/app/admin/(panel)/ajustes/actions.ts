"use server";

import { revalidatePath } from "next/cache";
import { ensureAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function saveSetting(
  key: string,
  value: unknown,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await ensureAdmin();
  } catch {
    return { ok: false, error: "Sin permisos." };
  }
  const admin = createAdminClient();
  const { error } = await admin
    .from("settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/ajustes");
  revalidatePath("/");
  return { ok: true };
}
