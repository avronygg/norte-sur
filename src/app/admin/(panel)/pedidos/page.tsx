import { createClient } from "@/lib/supabase/server";
import { OrdersList } from "@/components/admin/orders-list";
import type { Order, OrderItem } from "@/types/database";

export default async function AdminPedidosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as unknown as (Order & { items: OrderItem[] })[];

  return <OrdersList orders={orders} />;
}
