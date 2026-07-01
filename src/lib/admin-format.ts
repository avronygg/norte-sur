/**
 * Construye un enlace de WhatsApp (wa.me) a partir de un teléfono ingresado
 * por el cliente, normalizando a formato internacional chileno cuando aplica.
 */
export function waLink(phone: string, message?: string): string {
  let digits = phone.replace(/\D/g, "");
  // Número local chileno de 9 dígitos que empieza en 9 → anteponer 56.
  if (digits.length === 9 && digits.startsWith("9")) digits = `56${digits}`;
  // 8 dígitos (sin el 9) → asumir móvil chileno.
  else if (digits.length === 8) digits = `569${digits}`;
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
