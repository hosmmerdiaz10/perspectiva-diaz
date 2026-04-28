export interface PortfolioItem {
  title: string;
  image?: string;        // ruta de imagen principal (ej: "/src/assets/casa-1.jpg" o import)
  images?: string[];     // galería opcional
  video?: string;        // URL de YouTube/Vimeo o archivo .mp4
  description?: string;  // descripción del proyecto
  year?: string;
  area?: string;         // ej: "180 m²"
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
      { title: "Casa Bosque Norte", year: "2024", area: "240 m²", location: "Guacara" },
      { title: "Residencia Las Acacias", year: "2023", area: "180 m²", location: "Valencia" },
      { title: "Apartamento Mañongo", year: "2024", area: "120 m²", location: "Naguanagua" },
      { title: "Casa Patio Interior", year: "2022", area: "210 m²", location: "Guacara" },
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
      { title: "Oficinas Atelier", year: "2023", area: "320 m²", location: "Valencia" },
      { title: "Boutique Centro", year: "2024", area: "85 m²", location: "Valencia" },
      { title: "Café Industrial", year: "2023", area: "140 m²", location: "Guacara" },
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
      { title: "Loft Valencia", year: "2024", area: "95 m²", location: "Valencia" },
      { title: "Penthouse Guacara", year: "2023", area: "260 m²", location: "Guacara" },
      { title: "Suite Master", year: "2024", area: "45 m²", location: "Naguanagua" },
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
      { title: "Render Casa Bosque", year: "2024" },
      { title: "Recorrido Oficinas", year: "2023" },
      { title: "Vista aérea conjunto", year: "2024" },
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
      { title: "Obra Residencia A.", year: "2024", location: "Guacara" },
      { title: "Remodelación local 12", year: "2023", location: "Valencia" },
      { title: "Ampliación quinta", year: "2024", location: "Guacara" },
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
  image?: string;
  images?: string[];
  video?: string;
  area?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "casa-bosque-norte",
    title: "Casa Bosque Norte",
    category: "Residencial",
    year: "2024",
    location: "Guacara, Carabobo",
    area: "240 m²",
    description:
      "Una vivienda unifamiliar pensada como un patio interior que organiza la vida alrededor del verde.",
  },
  {
    id: "restaurante-k'tsu",
    title: "K'tsu",
    category: "Comercial",
    year: "2024",
    location: "Valencia, Carabobo",
    area: "320 m²",
    description:
      "Diseño elegante y sensorial que traduce su arquitectura moderna y atmósfera envolvente en una experiencia visual coherente, premium y orientada al detalle.",
  },
  {
    id: "loft-valencia",
    title: "Loft Valencia",
    category: "Interiores",
    year: "2024",
    location: "Valencia, Carabobo",
    area: "95 m²",
    description:
      "Reinterpretación de un apartamento existente con materiales nobles, paleta cálida y una atmósfera serena.",
  },
];
