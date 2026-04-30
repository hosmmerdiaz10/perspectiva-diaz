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
      {
        title: "Cocina LT",
        image: "/servicios/residencial/cocina-lt/portada.JPEG",
        year: "2025",
        location: "Valencia, Carabobo",
        description:
          "Diseño, renderizado y ejecución integral de cocina, combinando funcionalidad, elegancia y una distribución pensada al detalle.",
        images: [
          "/servicios/residencial/cocina-lt/antes1.jpg",
          "/servicios/residencial/cocina-lt/antes2.jpg",
          "/servicios/residencial/cocina-lt/antes3.jpg",
          "/servicios/residencial/cocina-lt/render1.png",
          "/servicios/residencial/cocina-lt/render2.png",
          "/servicios/residencial/cocina-lt/render3.png",
          "/servicios/residencial/cocina-lt/final1.JPEG",
          "/servicios/residencial/cocina-lt/final2.JPEG",
          "/servicios/residencial/cocina-lt/final3.JPEG",
          "/servicios/residencial/cocina-lt/final4.JPG",
          // Agrega aquí más imágenes/gifs cuando subas:
        ],
        // video: "https://www.youtube.com/watch?v=XXXXX",
      },
      { title: "Cocina OA",
        image: "/servicios/residencial/cocina-oa/portada.png",
        year: "2025",
        location: "Valencia, Carabobo",
        description:
          "Diseño y renderizado de cocina, con foco en la estética, la iluminación y una composición moderna y equilibrada.",
        images: [
          "/servicios/residencial/cocina-oa/01.png",
          "/servicios/residencial/cocina-oa/02.png",
          "/servicios/residencial/cocina-oa/03.png",
          "/servicios/residencial/cocina-oa/04.png",
          "/servicios/residencial/cocina-oa/05.png",
          "/servicios/residencial/cocina-oa/06.png",
          "/servicios/residencial/cocina-oa/07.png",
          // Agrega aquí más imágenes/gifs cuando subas:
        ],
      },
      { title: "Baño y Habitación Principal",
        image: "/servicios/residencial/cocinayhabitacion/portada.png",
        year: "2025",
        location: "Valencia, Carabobo",
        description:
          "Diseño y renderizado de habitación principal y baño, combinando confort, funcionalidad y una estética moderna con detalles cuidadosamente integrados.",
        images: [
          "/servicios/residencial/cocinayhabitacion/bano1.png",
          "/servicios/residencial/cocinayhabitacion/bano2.png",
          "/servicios/residencial/cocinayhabitacion/bano3.png",
          "/servicios/residencial/cocinayhabitacion/01.png",
          "/servicios/residencial/cocinayhabitacion/02.png",
          "/servicios/residencial/cocinayhabitacion/03.png",
          // Agrega aquí más imágenes/gifs cuando subas:
        ],
      },  
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
      { title: "SPA",
              image: "/servicios/comercial/spa/portada.JPG",
        year: "2025",
        location: "Valencia, Carabobo",
        description:
          "Diseño, renderizado y ejecución de spa comercial, desarrollando una experiencia sofisticada mediante una ambientación relajante, iluminación envolvente y una identidad estética equilibrada.",
        images: [
          "/servicios/comercial/spa/antes1.jpeg",
          "/servicios/comercial/spa/antes2.JPG",
          "/servicios/comercial/spa/antes3.JPG",
          "/servicios/comercial/spa/antes4.JPG",
          "/servicios/comercial/spa/render1.png",
          "/servicios/comercial/spa/render2.png",
          "/servicios/comercial/spa/render3.png",
          "/servicios/comercial/spa/1.JPG",
          "/servicios/comercial/spa/2.JPG",
          "/servicios/comercial/spa/3.JPG",
          "/servicios/comercial/spa/4.JPG",
        ],
      },
      { title: "Consultorio",
              image: "/servicios/comercial/consultorio/portada.jpg",
        year: "2025",
        location: "Valencia, Carabobo",
        description:
          "Diseño y renderizado de consultorio de cirugía plástica, combinando una estética sofisticada, iluminación equilibrada y una atmósfera moderna orientada al confort y la confianza.",
        images: [
          "/servicios/comercial/consultorio/antes1.jpg",
          "/servicios/comercial/consultorio/antes2.jpg",
          "/servicios/comercial/consultorio/antes3.jpg",
          "/servicios/comercial/consultorio/render1.jpg",
          "/servicios/comercial/consultorio/render2.jpg",
          "/servicios/comercial/consultorio/1.JPG",
          "/servicios/comercial/consultorio/2.JPG",
          "/servicios/comercial/consultorio/3.JPEG",
          "/servicios/comercial/consultorio/4.JPEG",
        ],      
      },  
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
      { title: "Salon de Pilates",
        image: "/servicios/comercial/pilates/portada.png",
        year: "2025",
        location: "Valencia, Carabobo",
        description:
          "Diseño y renderizado, desarrollando una experiencia sofisticada mediante una ambientación relajante, iluminación envolvente y una identidad estética equilibrada.",
        images: [
          "/servicios/comercial/pilates/1.png",
          "/servicios/comercial/pilates/2.png",
          "/servicios/comercial/pilates/3.png",
          "/servicios/comercial/pilates/4.png",
          "/servicios/comercial/pilates/5.png",
          "/servicios/comercial/pilates/6.png",
        ],
      },
      { title: "Tienda de Bebes",
        image: "/servicios/comercial/pilates/portada.png",
        year: "2025",
        location: "Valencia, Carabobo",
        description:
          "Diseño y renderizado, desarrollando una experiencia sofisticada mediante una ambientación relajante, iluminación envolvente y una identidad estética equilibrada.",
        images: [
          "/servicios/comercial/pilates/1.png",
          "/servicios/comercial/pilates/2.png",
          "/servicios/comercial/pilates/3.png",
          "/servicios/comercial/pilates/4.png",
          "/servicios/comercial/pilates/5.png",
          "/servicios/comercial/pilates/6.png",
        ],
      },
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
       { 
        title: "Habitación GB", 
        image: "/servicios/residencial/habitacion-gb/portada.png",
        year: "2025",
        location: "Valencia, Carabobo",
        description:
          "Diseño y visualización de habitación integrando calidez, equilibrio espacial y una ambientación cuidada en cada detalle.",
        images: [
          "/servicios/residencial/habitacion-gb/01.png",
          "/servicios/residencial/habitacion-gb/02.png",
          "/servicios/residencial/habitacion-gb/03.png",
          "/servicios/residencial/habitacion-gb/04.png",
          "/servicios/residencial/habitacion-gb/05.png",
          "/servicios/residencial/habitacion-gb/06.png",
          "/servicios/residencial/habitacion-gb/07.png",
        ],
      }, 
      { title: "Panadería",
              image: "/servicios/residencial/panaderia/portada.png",
        year: "2025",
        location: "Valencia, Carabobo",
        description:
          "Diseño y visualización de panadería integrando calidez, equilibrio espacial y una ambientación cuidada en cada detalle.",
        images: [
          "/servicios/residencial/panaderia/01.png",
          "/servicios/residencial/panaderia/02.png",
          "/servicios/residencial/panaderia/03.png",
          "/servicios/residencial/panaderia/04.png",
          "/servicios/residencial/panaderia/05.png",
          "/servicios/residencial/panaderia/06.png",
        ],
      },
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
      { title: "K'tsu.",
              image: "/servicios/comercial/ktsu/portada.JPG",
        year: "2025",
        location: "Valencia, Carabobo",
        description:
          "Diseño y visualización de habitación integrando calidez, equilibrio espacial y una ambientación cuidada en cada detalle.",
        images: [
          "/servicios/comercial/ktsu/render1.png",
          "/servicios/comercial/ktsu/render2.png",
          "/servicios/comercial/ktsu/render3.png",
          "/servicios/comercial/ktsu/render4.png",
          "/servicios/comercial/ktsu/01.JPEG",
          "/servicios/comercial/ktsu/02.JPEG",
          "/servicios/comercial/ktsu/03.JPEG",
          "/servicios/comercial/ktsu/04.JPEG",
        ],
      },
      { title: "Cocina y Living" },
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
    category: "Comercial",
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
