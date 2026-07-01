"use server";

import { quoteSchema, type QuoteInput } from "@/lib/validations";
import { sendEmail, getQuoteNotifyEmails } from "@/lib/email";
import { isSupabaseConfigured } from "@/lib/data/products";
import { siteConfig } from "@/config/site";

export interface QuoteResult {
  ok: boolean;
  quoteNumber?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function submitQuote(input: QuoteInput): Promise<QuoteResult> {
  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, error: "Revisa los campos.", fieldErrors };
  }
  const data = parsed.data;

  let quoteNumber = `COT-${Date.now().toString().slice(-6)}`;

  // 1) Guardar en Supabase (si está configurado)
  if (isSupabaseConfigured()) {
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const supabase = createAdminClient();

      const { data: quote, error } = await supabase
        .from("quotes")
        .insert({
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone,
          company: data.company,
          rut: data.rut,
          region: data.region,
          comuna: data.comuna,
          message: data.message,
        })
        .select("id, quote_number")
        .single();

      if (error || !quote) throw error ?? new Error("No se pudo crear la cotización");
      quoteNumber = quote.quote_number;

      const items = data.items.map((it) => ({
        quote_id: quote.id,
        product_id: it.productId ?? null,
        name_snapshot: it.name,
        unit: it.unit ?? "",
        quantity: it.quantity ?? null,
      }));
      await supabase.from("quote_items").insert(items);
    } catch (e) {
      console.error("[submitQuote] error guardando en Supabase:", e);
      // Continuamos: igual intentamos notificar por correo.
    }
  }

  // 2) Enviar correos (admin/marca + confirmación al cliente)
  const notify = await getQuoteNotifyEmails();
  const esc = (s: unknown) =>
    String(s ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
    );

  const itemsRows = data.items
    .map((it) => {
      const cant = it.quantity
        ? `${esc(it.quantity)} ${esc(it.unit ?? "")}`.trim()
        : "Cantidad a definir";
      return (
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee">${esc(it.name)}</td>` +
        `<td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right">${cant}</td></tr>`
      );
    })
    .join("");

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#12304a">Nueva solicitud de cotización · ${quoteNumber}</h2>
      <p><strong>Cliente:</strong> ${esc(data.customer_name)}<br/>
      <strong>Correo:</strong> ${esc(data.customer_email)}<br/>
      <strong>Teléfono:</strong> ${esc(data.customer_phone ?? "—")}<br/>
      <strong>Empresa:</strong> ${esc(data.company ?? "—")} ${data.rut ? `(${esc(data.rut)})` : ""}<br/>
      <strong>Ubicación:</strong> ${esc(data.comuna ?? "—")}, ${esc(data.region ?? "—")}</p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px">
        <thead><tr><th align="left" style="padding:6px 12px;border-bottom:2px solid #12304a">Producto</th><th align="right" style="padding:6px 12px;border-bottom:2px solid #12304a">Cantidad</th></tr></thead>
        <tbody>${itemsRows}</tbody>
      </table>
      ${data.message ? `<p style="margin-top:12px"><strong>Mensaje:</strong><br/>${esc(data.message)}</p>` : ""}
    </div>`;

  await sendEmail({
    to: notify,
    subject: `Cotización ${quoteNumber} · ${data.customer_name}`,
    html: adminHtml,
    replyTo: data.customer_email,
  });

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#12304a">Recibimos tu solicitud de cotización</h2>
      <p>Hola ${esc(data.customer_name)}, gracias por contactar a ${siteConfig.name}.
      Tu solicitud <strong>${quoteNumber}</strong> fue recibida y la responderemos a la brevedad.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px">
        <tbody>${itemsRows}</tbody>
      </table>
      <p style="margin-top:16px;color:#514a42">Cualquier duda, escríbenos a ${siteConfig.contact.email} o al WhatsApp ${siteConfig.contact.whatsapp}.</p>
    </div>`;

  await sendEmail({
    to: [data.customer_email],
    subject: `Tu cotización ${quoteNumber} · ${siteConfig.name}`,
    html: customerHtml,
  });

  return { ok: true, quoteNumber };
}
