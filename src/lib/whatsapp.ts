// 🔧 Reemplaza este número con el real (formato internacional, sin "+", sin espacios)
export const WHATSAPP_NUMBER = "584125018878";

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
  const lines = [
    "*Nueva solicitud de cotización — Perspectiva Díaz*",
    "",
    `• *Nombre:* ${d.nombre || "—"}`,
    `• *Email:* ${d.email || "—"}`,
    `• *Teléfono:* ${d.telefono || "—"}`,
    `• *Servicio:* ${d.servicio || "—"}`,
    `• *Tipo de proyecto:* ${d.tipoProyecto || "—"}`,
    `• *Ubicación:* ${d.ubicacion || "—"}`,
    `• *Área aprox. (m²):* ${d.area || "—"}`,
    "",
    "*Mensaje:*",
    d.mensaje || "—",
  ];
  return lines.join("\n");
}

export function whatsappLink(message: string, number = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
