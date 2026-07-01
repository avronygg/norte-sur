import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminAjustesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("key, value");
  const map = new Map((data ?? []).map((s) => [s.key, s.value]));

  const notifyEmails = (map.get("quote_notify_emails") as string[] | undefined) ?? [
    "ventas@huaipesypanos.cl",
  ];
  const contact =
    (map.get("contact") as Record<string, string> | undefined) ?? {};

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold tracking-tight">Ajustes</h1>
      <p className="text-sm text-ink-soft">Configuración general de la tienda.</p>
      <div className="mt-6">
        <SettingsForm notifyEmails={notifyEmails} contact={contact} />
      </div>
    </div>
  );
}
