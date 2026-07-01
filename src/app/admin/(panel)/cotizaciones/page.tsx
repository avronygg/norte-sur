import { createClient } from "@/lib/supabase/server";
import { QuotesList } from "@/components/admin/quotes-list";
import type { Quote, QuoteItem } from "@/types/database";

export default async function AdminCotizacionesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("quotes")
    .select("*, items:quote_items(*)")
    .order("created_at", { ascending: false });
  const quotes = (data ?? []) as unknown as (Quote & { items: QuoteItem[] })[];

  return <QuotesList quotes={quotes} />;
}
