import { z } from "zod";

export const quoteItemSchema = z.object({
  productId: z.string().nullable().optional(),
  name: z.string().min(1),
  unit: z.string().optional().default(""),
  // cantidad opcional: el cliente puede pedir cotizar sin especificar cuánto
  quantity: z.coerce.number().positive().nullish(),
});

export const quoteSchema = z.object({
  customer_name: z.string().min(2, "Ingresa tu nombre"),
  customer_email: z.string().email("Correo inválido"),
  customer_phone: z.string().optional(),
  company: z.string().optional(),
  rut: z.string().optional(),
  region: z.string().optional(),
  comuna: z.string().optional(),
  message: z.string().optional(),
  items: z.array(quoteItemSchema).min(1, "Agrega al menos un producto"),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export const orderCustomerSchema = z.object({
  customer_name: z.string().min(2, "Ingresa tu nombre"),
  customer_email: z.string().email("Correo inválido"),
  customer_phone: z.string().min(6, "Ingresa un teléfono"),
  company: z.string().optional(),
  rut: z.string().optional(),
  region: z.string().min(2, "Selecciona una región"),
  comuna: z.string().min(2, "Ingresa tu comuna"),
  address: z.string().min(4, "Ingresa tu dirección"),
  notes: z.string().optional(),
});

export type OrderCustomerInput = z.infer<typeof orderCustomerSchema>;

export const productSchema = z
  .object({
    name: z.string().min(2, "Ingresa un nombre"),
    slug: z.string().min(1).optional(),
    short_description: z.string().optional(),
    description: z.string().optional(),
    category_id: z.string().uuid().nullable().optional(),
    material: z.string().optional(),
    images: z.array(z.string()).default([]),
    sale_mode: z.enum(["direct", "quote"]),
    price: z.coerce.number().nonnegative().nullable().optional(),
    unit: z.string().default("kg"),
    stock: z.coerce.number().nonnegative().default(0),
    is_active: z.boolean().default(true),
    is_featured: z.boolean().default(false),
    sort_order: z.coerce.number().int().default(0),
  })
  .refine((d) => d.sale_mode !== "direct" || (d.price != null && d.price > 0), {
    message: "Los productos de compra directa necesitan un precio.",
    path: ["price"],
  });

export type ProductInput = z.infer<typeof productSchema>;
