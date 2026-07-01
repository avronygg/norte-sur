import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de uso y compra en Norte Sur.",
};

export default function TerminosPage() {
  const { legal, contact, name } = siteConfig;
  return (
    <LegalPage
      title="Términos y condiciones"
      intro={`Estos términos regulan el uso del sitio y la compra de productos a ${legal.razonSocial} (“${name}”).`}
    >
      <h2>1. Identificación de la empresa</h2>
      <p>
        Este sitio es operado por <strong>{legal.razonSocial}</strong>, RUT {legal.rut},
        con domicilio en {contact.address}, {contact.addressRegion}. Para cualquier
        consulta puedes escribir a <a href={`mailto:${contact.email}`}>{contact.email}</a>{" "}
        o llamar al {contact.phone}.
      </p>

      <h2>2. Productos y precios</h2>
      <p>
        Vendemos huaipes, paños y trapos industriales. Algunos productos se ofrecen en
        modalidad de <strong>compra directa</strong> (con precio y stock publicado) y
        otros <strong>por cotización</strong> (venta por volumen). Los precios se
        expresan en pesos chilenos (CLP) e incluyen IVA, salvo que se indique lo
        contrario. Nos reservamos el derecho de modificar precios y disponibilidad sin
        previo aviso; el precio válido es el vigente al momento de confirmar la compra o
        la cotización.
      </p>

      <h2>3. Proceso de compra y cotización</h2>
      <ul>
        <li>
          <strong>Compra directa:</strong> agregas productos al carrito, completas tus
          datos y pagas en línea. La compra se entiende perfeccionada una vez confirmado
          el pago.
        </li>
        <li>
          <strong>Cotización:</strong> armas una lista de productos y nos la envías; te
          responderemos con una propuesta de precio por volumen. La cotización no obliga
          a comprar y no constituye una venta hasta que ambas partes la confirmen.
        </li>
      </ul>

      <h2>4. Formas de pago</h2>
      <p>
        Los medios de pago disponibles se indican durante el proceso de compra. Para
        ventas por volumen, el pago puede coordinarse al cerrar la cotización.
      </p>

      <h2>5. Despacho</h2>
      <p>
        Realizamos despacho a todo Chile. Los plazos y costos se informan antes de
        finalizar la compra o en la cotización. Para más detalle, revisa nuestra
        Política de despacho y devoluciones.
      </p>

      <h2>6. Derecho de retracto y garantía legal</h2>
      <p>
        En las compras a distancia, la Ley N° 19.496 sobre Protección de los Derechos de
        los Consumidores contempla un plazo de retracto de 10 días corridos desde la
        recepción del producto, en los casos y con las excepciones que la ley establece.
        Asimismo, todos los productos cuentan con la garantía legal correspondiente por
        fallas o disconformidades.
      </p>

      <h2>7. Responsabilidad</h2>
      <p>
        Nos esforzamos por mantener la información del sitio actualizada y correcta, pero
        no garantizamos la ausencia de errores tipográficos o de disponibilidad. Ante un
        error evidente de precio o stock, podremos anular la operación e informarte para
        buscar una solución.
      </p>

      <h2>8. Propiedad intelectual</h2>
      <p>
        Las marcas, logotipos, textos e imágenes del sitio son de propiedad de {name} o
        se usan con autorización, y no pueden reproducirse sin permiso.
      </p>

      <h2>9. Legislación aplicable</h2>
      <p>
        Estos términos se rigen por la legislación chilena. Cualquier controversia se
        someterá a los tribunales competentes de Chile, sin perjuicio de los derechos
        que la ley reconoce a los consumidores ante el SERNAC.
      </p>
    </LegalPage>
  );
}
