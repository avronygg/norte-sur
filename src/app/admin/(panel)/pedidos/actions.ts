"use server";

import { revalidatePath } from "next/cache";
import { ensureAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED = ["pendiente", "pagado", "preparando", "enviado", "entregado", "cancelado"];

export async function updateOrderStatus(id: string, status: string) {
  await ensureAdmin();
  if (!ALLOWED.includes(status)) throw new Error("Estado inválido");
  const admin = createAdminClient();
  await admin.from("orders").update({ status: status as never }).eq("id", id);
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
}
