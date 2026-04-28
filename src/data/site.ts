export interface Service {
  id: string;
  number: string;
  title: string;
  tag: string;
  description: string;
  bullets: string[];
  portfolio: { title: string; image?: string }[]; // image optional → placeholder
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
  description: string;
}

export const PROJECTS: Project[] = [
  {
    id: "casa-bosque-norte",
    title: "Casa Bosque Norte",
    category: "Residencial",
    year: "2024",
    location: "Guacara, Carabobo",
    description:
      "Una vivienda unifamiliar pensada como un patio interior que organiza la vida alrededor del verde.",
  },
  {
    id: "restaurante-k'tsu",
    title: "K'tsu",
    category: "Comercial",
    year: "2024",
    location: "Valencia, Carabobo",
    description:
      "Diseño elegante y sensorial que traduce su arquitectura moderna y atmósfera envolvente en una experiencia visual coherente, premium y orientada al detalle.",
  },
  {
    id: "loft-valencia",
    title: "Loft Valencia",
    category: "Interiores",
    year: "2024",
    location: "Valencia, Carabobo",
    description:
      "Reinterpretación de un apartamento existente con materiales nobles, paleta cálida y una atmósfera serena.",
  },
];
