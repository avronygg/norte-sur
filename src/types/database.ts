/**
 * Tipos de la base de datos Norte Sur.
 * Mantener sincronizado con supabase/schema.sql.
 * (Se puede regenerar con: `npx supabase gen types typescript`.)
 */

export type SaleMode = "direct" | "quote";
export type OrderStatus =
  | "pendiente"
  | "pagado"
  | "preparando"
  | "enviado"
  | "entregado"
  | "cancelado";
export type PaymentStatus = "pendiente" | "aprobado" | "rechazado" | "reembolsado";
export type QuoteStatus = "nueva" | "en_proceso" | "enviada" | "cerrada";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  category_id: string | null;
  material: string | null;
  images: string[];
  sale_mode: SaleMode;
  price: number | null;
  unit: string;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  company: string | null;
  rut: string | null;
  region: string | null;
  comuna: string | null;
  address: string | null;
  notes: string | null;
  status: OrderStatus;
  payment_method: string | null;
  payment_status: PaymentStatus;
  payment_ref: string | null;
  subtotal: number;
  shipping_cost: number;
  total: number;
  created_at: string;
}

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  name_snapshot: string;
  unit: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export type Quote = {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  company: string | null;
  rut: string | null;
  region: string | null;
  comuna: string | null;
  message: string | null;
  status: QuoteStatus;
  created_at: string;
}

export type QuoteItem = {
  id: string;
  quote_id: string;
  product_id: string | null;
  name_snapshot: string;
  unit: string;
  quantity: number | null;
}

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
}

export type Setting = {
  key: string;
  value: unknown;
  updated_at: string;
};

/** Helpers genéricos para tipar el cliente de Supabase. */
type Row<T> = T;
type Insert<T> = Partial<T>;
type Update<T> = Partial<T>;

interface TableDef<T> {
  Row: Row<T>;
  Insert: Insert<T>;
  Update: Update<T>;
  Relationships: [];
}

export interface Database {
  public: {
    Tables: {
      categories: TableDef<Category>;
      products: TableDef<Product>;
      orders: TableDef<Order>;
      order_items: TableDef<OrderItem>;
      quotes: TableDef<Quote>;
      quote_items: TableDef<QuoteItem>;
      profiles: TableDef<Profile>;
      settings: TableDef<Setting>;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      sale_mode: SaleMode;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      quote_status: QuoteStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}

/** Producto con su categoría incluida (join). */
export type ProductWithCategory = Product & { category: Category | null };

/** Línea genérica del carrito (sirve para compra y cotización). */
export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  unit: string;
  saleMode: SaleMode;
  price: number | null;
  image: string | null;
  quantity: number;
  stock: number;
}
