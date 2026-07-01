"use client";

import { useState } from "react";
import { Loader2, Check } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { saveSetting } from "@/app/admin/(panel)/ajustes/actions";

interface Contact {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
}

export function SettingsForm({
  notifyEmails,
  contact,
}: {
  notifyEmails: string[];
  contact: Contact;
}) {
  const [emails, setEmails] = useState(notifyEmails.join(", "));
  const [c, setC] = useState<Contact>(contact);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function save(key: string, value: unknown) {
    setSaving(key);
    setSaved(null);
    const res = await saveSetting(key, value);
    setSaving(null);
    if (res.ok) {
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } else {
      alert(res.error ?? "No se pudo guardar");
    }
  }

  return (
    <div className="space-y-6">
      {/* Correos de aviso */}
      <section className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-display text-lg font-bold">Correos de aviso de cotización</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Cuando llega una cotización, se notifica a estos correos (separados por coma).
        </p>
        <input
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          className="mt-3 h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-accent"
          placeholder="ventas@huaipesypanos.cl, otro@correo.cl"
        />
        <Button
          type="button"
          className="mt-3"
          onClick={() =>
            save(
              "quote_notify_emails",
              emails.split(",").map((s) => s.trim()).filter(Boolean),
            )
          }
          disabled={saving === "quote_notify_emails"}
        >
          {saving === "quote_notify_emails" ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Guardando…</>
          ) : saved === "quote_notify_emails" ? (
            <><Check className="h-4 w-4" /> Guardado</>
          ) : (
            "Guardar correos"
          )}
        </Button>
      </section>

      {/* Contacto */}
      <section className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-display text-lg font-bold">Datos de contacto</h2>
        <p className="mt-1 text-sm text-ink-soft">Se muestran en el sitio (footer y contacto).</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <FieldInput label="Teléfono" value={c.phone ?? ""} onChange={(v) => setC({ ...c, phone: v })} />
          <FieldInput label="WhatsApp" value={c.whatsapp ?? ""} onChange={(v) => setC({ ...c, whatsapp: v })} />
          <FieldInput label="Correo" value={c.email ?? ""} onChange={(v) => setC({ ...c, email: v })} />
          <FieldInput label="Dirección" value={c.address ?? ""} onChange={(v) => setC({ ...c, address: v })} />
        </div>
        <Button
          type="button"
          className="mt-4"
          onClick={() => save("contact", c)}
          disabled={saving === "contact"}
        >
          {saving === "contact" ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Guardando…</>
          ) : saved === "contact" ? (
            <><Check className="h-4 w-4" /> Guardado</>
          ) : (
            "Guardar contacto"
          )}
        </Button>
      </section>
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-accent"
      />
    </label>
  );
}
