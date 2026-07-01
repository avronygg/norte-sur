import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Cliente de servicio (service_role) — SOLO en servidor.
 * Omite RLS: usar exclusivamente en operaciones de confianza
 * (webhooks de pago, tareas de sistema, seeds). Nunca importar en el cliente.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}
