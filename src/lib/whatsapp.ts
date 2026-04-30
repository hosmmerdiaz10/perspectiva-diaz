// 🔧 Reemplaza este número con el real (formato internacional, sin "+", sin espacios)
export const WHATSAPP_NUMBER = "+584125018878";

export interface QuoteForm {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  tipoProyecto: string;
  ubicacion: string;
  area: string;
  presupuesto?: string;
  mensaje: string;
}

export function buildQuoteMessage(d: Partial<QuoteForm>): string {
  const row = (label: string, value?: string) =>
    value && value.trim() ? `*${label}:* ${value.trim()}` : null;

  const fecha = new Date().toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const saludo = d.nombre?.trim()
    ? `Hola, soy *${d.nombre.trim()}* 👋`
    : "Hola 👋";

  const contacto = [
    row("Email", d.email),
    row("Teléfono", d.telefono),
    row("Ubicación", d.ubicacion),
  ].filter(Boolean);

  const proyecto = [
    row("Servicio", d.servicio),
    row("Tipo de proyecto", d.tipoProyecto),
    row("Área aprox.", d.area ? `${d.area} m²` : undefined),
    row("Presupuesto", d.presupuesto),
  ].filter(Boolean);

  const sections: string[] = [
    "🏛️ *PERSPECTIVA DÍAZ — Nueva cotización*",
    `_${fecha}_`,
    "",
    saludo,
    "Me gustaría recibir información para el siguiente proyecto:",
  ];

  if (contacto.length) {
    sections.push("", "👤 *Datos de contacto*", ...contacto);
  }

  if (proyecto.length) {
    sections.push("", "📐 *Detalles del proyecto*", ...proyecto);
  }

  if (d.mensaje?.trim()) {
    sections.push("", "📝 *Sobre el proyecto*", d.mensaje.trim());
  }

  sections.push("", "—", "Quedo atento a su respuesta. ¡Gracias!");

  return sections.join("\n");
}

export function whatsappLink(message: string, number = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
