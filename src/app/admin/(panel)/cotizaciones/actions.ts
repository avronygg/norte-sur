"use server";

import { revalidatePath } from "next/cache";
import { ensureAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED = ["nueva", "en_proceso", "enviada", "cerrada"];

export async function updateQuoteStatus(id: string, status: string) {
  await ensureAdmin();
  if (!ALLOWED.includes(status)) throw new Error("Estado inválido");
  const admin = createAdminClient();
  await admin.from("quotes").update({ status: status as never }).eq("id", id);
  revalidatePath("/admin/cotizaciones");
  revalidatePath("/admin");
}
