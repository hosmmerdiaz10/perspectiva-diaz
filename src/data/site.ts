// ============================================================
// CONTENIDO EDITABLE DEL SITIO
// ------------------------------------------------------------
// Para imágenes/videos:
//   - Coloca los archivos en /public/...  (ej: public/proyectos/ktsu/portada.jpg)
//   - Referéncialos como "/proyectos/ktsu/portada.jpg"  (SIN /src/, SIN /public/)
//   - Para video usa URL de YouTube/Vimeo o un .mp4 directo.
// ============================================================

export interface PortfolioItem {
  title: string;
  image?: string;
  images?: string[];
  video?: string;
  description?: string;
  year?: string;
  area?: string;
  location?: string;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  tag: string;
  description: string;
  bullets: string[];
  portfolio: PortfolioItem[];
}

export const SERVICES: Service[] = [
  {
    id: "residencial",
    number: "01",
    title: "Arquitectura Residencial",
    tag: "Vivienda",
    description:
      "Casas, apartamentos y viviendas unifamiliares diseñadas en función de quien las habita, la luz y el entorno.",
    bullets: ["Anteproyecto y diseño", "Planos ejecutivos", "Memoria descriptiva"],
    portfolio: [
      { title: "Casa Bosque Norte" },
      { title: "Residencia Las Acacias" },
      { title: "Apartamento Mañongo" },
      { title: "Casa Patio Interior" },
    ],
  },
  {
    id: "comercial",
    number: "02",
    title: "Arquitectura Comercial",
    tag: "Comercial",
    description:
      "Oficinas, locales y espacios de trabajo que comunican la identidad de cada marca con materialidad y luz.",
    bullets: ["Branding espacial", "Layout funcional", "Iluminación técnica"],
    portfolio: [
      { title: "Oficinas Atelier" },
      { title: "Boutique Centro" },
      { title: "Café Industrial" },
    ],
  },
  {
    id: "interiores",
    number: "03",
    title: "Diseño de Interiores",
    tag: "Interiorismo",
    description:
      "Materialidad, iluminación y mobiliario seleccionados para crear atmósferas que perduran en el tiempo.",
    bullets: ["Moodboard y paleta", "Selección de mobiliario", "Dirección de obra"],
    portfolio: [
      { title: "Loft Valencia" },
      { title: "Penthouse Guacara" },
      { title: "Suite Master" },
    ],
  },
  {
    id: "renders",
    number: "04",
    title: "Renders & Visualización 3D",
    tag: "Visualización",
    description:
      "Imágenes fotorrealistas para experimentar el proyecto antes de construirlo y tomar mejores decisiones.",
    bullets: ["Render exterior / interior", "Animaciones cortas", "Recorridos virtuales"],
    portfolio: [
      { title: "Render Casa Bosque" },
      { title: "Recorrido Oficinas" },
      { title: "Vista aérea conjunto" },
    ],
  },
  {
    id: "consultoria",
    number: "05",
    title: "Consultoría & Dirección de Obra",
    tag: "Gestión",
    description:
      "Control de calidad, tiempos y presupuesto durante toda la ejecución del proyecto.",
    bullets: ["Cronograma de obra", "Control de costos", "Supervisión técnica"],
    portfolio: [
      { title: "Obra Residencia A." },
      { title: "Remodelación local 12" },
      { title: "Ampliación quinta" },
    ],
  },
];

export interface Project {
  id: string;
  title: string;
  category: "Residencial" | "Comercial" | "Interiores";
  year: string;
  location: string;
  area?: string;
  description: string;
  image?: string;       // imagen de portada
  images?: string[];    // galería opcional
  video?: string;       // url youtube / vimeo / mp4
}

export const PROJECTS: Project[] = [
  {
    id: "spa",
    title: "SPA",
    category: "Arquitectura Comercial ",
    year: "2026",
    location: "Valencia, Carabobo",
    description:
      "Un diseño personalizado para un SPA donde la arquitectura acompaña el proceso: diseño limpio, proporciones equilibradas y una atmósfera pensada para generar seguridad y bienestar.",
    image: "/proyectos/spa/portada-3.jpg",   
    // images: ["/proyectos/spa/03.jpg", "/proyectos/spa/03.jpg"],
    // video: "https://www.youtube.com/watch?v=XXXXX",
  },
  {
    id: "restaurante-ktsu",
    title: "K'tsu",
    category: "Comercial",
    year: "2024",
    location: "Valencia, Carabobo",
    description:
      "Diseño elegante y sensorial que traduce su arquitectura moderna y atmósfera envolvente en una experiencia visual coherente, premium y orientada al detalle.",
    image: "/proyectos/ktsu/portada.jpg",
    // images: ["/proyectos/ktsu/01.jpg", "/proyectos/ktsu/02.jpg"],
    // video: "https://www.youtube.com/watch?v=XXXXX",
  },
  {
    id: "cocina-lt",
    title: "Diseño de Cocina",
    category: "Interiores",
    year: "2025",
    location: "Valencia, Carabobo",
    description:
      "Arquitectura de cocina que equilibra eficiencia y diseño: circulación fluida, iluminación estratégica y una composición sólida y elegante.",
     image: "/proyectos/cocina-lt/portada-2.JPEG",
    // images: ["/proyectos/cocina-lt/02.JPEG", "/proyectos/cocina-lt/02.JPEG"],
    // video: "https://www.youtube.com/watch?v=XXXXX",
  },
];
