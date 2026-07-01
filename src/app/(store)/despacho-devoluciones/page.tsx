import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Despacho y devoluciones",
  description: "Cobertura, plazos y condiciones de despacho, cambios y devoluciones en Norte Sur.",
};

export default function DespachoPage() {
  const { contact } = siteConfig;
  return (
    <LegalPage
      title="Despacho y devoluciones"
      intro="Todo lo que necesitas saber sobre cómo enviamos tus productos y cómo gestionar cambios o devoluciones."
    >
      <h2>1. Cobertura</h2>
      <p>
        Realizamos despacho a todo Chile. En la {contact.addressRegion} coordinamos
        entregas directas según el volumen del pedido. También puedes retirar en nuestra
        dirección: {contact.address}.
      </p>

      <h2>2. Plazos y costos</h2>
      <p>
        Los plazos y costos de despacho dependen del destino y del volumen del pedido, y
        se informan antes de finalizar la compra o dentro de la cotización. Para pedidos
        grandes por mayor, coordinamos la logística directamente contigo.
      </p>

      <h2>3. Recepción del pedido</h2>
      <p>
        Al recibir tu pedido, te recomendamos revisar que los productos y cantidades
        correspondan a lo solicitado. Si detectas un problema, contáctanos dentro de las
        24 horas siguientes a la entrega.
      </p>

      <h2>4. Cambios y devoluciones</h2>
      <ul>
        <li>
          <strong>Producto con falla o error en el despacho:</strong> lo cambiamos o
          reembolsamos sin costo para ti, conforme a la garantía legal.
        </li>
        <li>
          <strong>Derecho de retracto (compras a distancia):</strong> según la Ley
          N° 19.496, dispones de 10 días corridos desde la recepción para retractarte, en
          los casos y con las excepciones que la ley contempla. El producto debe estar sin
          uso y en su estado original.
        </li>
      </ul>

      <h2>5. Cómo solicitar un cambio o devolución</h2>
      <p>
        Escríbenos a <a href={`mailto:${contact.email}`}>{contact.email}</a> o al WhatsApp{" "}
        {contact.whatsapp}, indicando tu número de pedido y el motivo. Te guiaremos en el
        proceso y coordinaremos el retiro o reenvío según corresponda.
      </p>
    </LegalPage>
  );
}
