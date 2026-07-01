import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo Norte Sur trata y protege tus datos personales.",
};

export default function PrivacidadPage() {
  const { legal, contact } = siteConfig;
  return (
    <LegalPage
      title="Política de privacidad"
      intro="Explicamos qué datos recopilamos, para qué los usamos y cuáles son tus derechos."
    >
      <h2>1. Responsable de los datos</h2>
      <p>
        El responsable del tratamiento es <strong>{legal.razonSocial}</strong>, RUT{" "}
        {legal.rut}, domicilio en {contact.address}. Contacto para temas de datos:{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>

      <h2>2. Qué datos recopilamos</h2>
      <ul>
        <li>Datos de contacto que nos entregas: nombre, correo, teléfono, empresa y RUT.</li>
        <li>Datos de despacho: dirección, comuna y región.</li>
        <li>Datos de tus pedidos y cotizaciones (productos y cantidades).</li>
        <li>Datos técnicos básicos de navegación necesarios para operar el sitio.</li>
      </ul>

      <h2>3. Para qué usamos tus datos</h2>
      <ul>
        <li>Procesar y despachar tus pedidos.</li>
        <li>Responder y gestionar tus solicitudes de cotización.</li>
        <li>Contactarte por temas relacionados con tu compra o cotización.</li>
        <li>Cumplir obligaciones legales y tributarias.</li>
      </ul>

      <h2>4. Con quién compartimos datos</h2>
      <p>
        No vendemos tus datos. Los compartimos únicamente con proveedores que nos ayudan
        a operar el sitio (por ejemplo, alojamiento de la base de datos, envío de correos
        y procesamiento de pagos), quienes solo pueden usarlos para prestarnos ese
        servicio. También podremos entregarlos cuando la ley lo exija.
      </p>

      <h2>5. Tus derechos</h2>
      <p>
        De acuerdo con la Ley N° 19.628 sobre Protección de la Vida Privada (y su
        actualización mediante la Ley N° 21.719), puedes solicitar el acceso,
        rectificación, eliminación u oposición al tratamiento de tus datos escribiéndonos
        a <a href={`mailto:${contact.email}`}>{contact.email}</a>. Responderemos en los
        plazos que fija la ley.
      </p>

      <h2>6. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas razonables para proteger tus datos,
        incluyendo control de acceso y almacenamiento seguro. Ningún sistema es
        completamente infalible, por lo que no podemos garantizar seguridad absoluta.
      </p>

      <h2>7. Cookies</h2>
      <p>
        Usamos cookies y tecnologías similares estrictamente necesarias para el
        funcionamiento del sitio (por ejemplo, mantener tu carrito y tu sesión). Puedes
        administrar las cookies desde la configuración de tu navegador.
      </p>

      <h2>8. Cambios</h2>
      <p>
        Podremos actualizar esta política. Publicaremos la versión vigente en esta misma
        página con su fecha de actualización.
      </p>
    </LegalPage>
  );
}
