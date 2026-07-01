/**
 * Configuración central de la marca Norte Sur.
 * Datos extraídos del sitio actual (huaipesypanos.cl). Editables desde aquí
 * y, los de contacto, también desde el panel admin (tabla `settings`).
 */

export const siteConfig = {
  name: "Norte Sur",
  legalName: "Norte Sur · Grupo Industrial",
  tagline: "Huaipes y Paños Industriales al por Mayor",
  description:
    "Abastecemos a empresas e industrias de todo Chile con huaipes, paños y trapos de limpieza. Llevamos más de 30 años vendiendo por mayor a talleres mecánicos, pintura automotriz, imprentas, serigrafía y mueblerías.",
  shortDescription:
    "Venta por mayor de huaipes y paños industriales para empresas, con más de 30 años abasteciendo a la industria nacional.",
  url: "https://www.huaipesypanos.cl",
  yearsOfExperience: 30,

  contact: {
    phone: "+56 2 2772 4630",
    phoneHref: "tel:+56227724630",
    whatsapp: "+56 9 3408 0189",
    whatsappHref: "https://wa.me/56934080189",
    email: "ventas@huaipesypanos.cl",
    address: "Rondizzoni N° 2596, Santiago",
    addressRegion: "Región Metropolitana",
    mapsQuery: "Rondizzoni 2596, Santiago, Chile",
  },

  shipping: {
    nationalCoverage: true,
    note: "Despacho a nivel nacional. Entregas directas en Región Metropolitana según volumen.",
  },

  /** Datos legales (COMPLETAR con la información real de la empresa). */
  legal: {
    razonSocial: "Norte Sur Grupo Industrial SpA", // TODO: confirmar razón social real
    rut: "XX.XXX.XXX-X", // TODO: RUT de la empresa
    lastUpdated: "01 de julio de 2026",
  },

  social: {
    instagram: "",
    facebook: "",
  },

  /** Rubros a los que apunta el negocio (para sección explicativa). */
  industries: [
    "Talleres mecánicos",
    "Pintura automotriz",
    "Imprentas",
    "Serigrafía",
    "Mueblerías",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
