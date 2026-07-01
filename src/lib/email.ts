import "server-only";

/**
 * Envío de correos con Resend. Tolerante a falta de configuración:
 * si no hay RESEND_API_KEY, registra en consola y no rompe el flujo
 * (útil en desarrollo). Devuelve { sent: boolean }.
 */

interface SendArgs {
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendArgs): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Norte Sur <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn(
      `[email] RESEND_API_KEY no configurada — correo NO enviado.\n` +
        `  Para: ${to.join(", ")}\n  Asunto: ${subject}`,
    );
    return { sent: false, error: "email_not_configured" };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo,
    });
    if (error) return { sent: false, error: error.message };
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

/** Lee la lista de correos de aviso (settings de la BD → env → default). */
export async function getQuoteNotifyEmails(): Promise<string[]> {
  // 1) Tabla settings (editable desde el admin)
  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const admin = createAdminClient();
      const { data } = await admin
        .from("settings")
        .select("value")
        .eq("key", "quote_notify_emails")
        .single();
      const value = data?.value;
      if (Array.isArray(value) && value.length > 0) {
        return value.filter((v): v is string => typeof v === "string");
      }
    }
  } catch {
    /* ignore → fallback */
  }

  // 2) Variable de entorno
  const fromEnv = process.env.QUOTE_NOTIFY_EMAILS;
  if (fromEnv) {
    return fromEnv.split(",").map((s) => s.trim()).filter(Boolean);
  }
  // 3) Default
  return ["ventas@huaipesypanos.cl"];
}
