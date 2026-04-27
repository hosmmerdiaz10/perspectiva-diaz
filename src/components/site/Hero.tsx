import heroImg from "@/assets/hero-architecture.jpg";

export const Hero = () => (
  <section id="top" className="relative min-h-screen flex flex-col justify-end pb-24 pt-32 overflow-hidden">
    {/* Background image */}
    <img
      src={heroImg}
      alt="Interior arquitectónico minimalista con luz natural"
      width={1280}
      height={1600}
      className="absolute inset-0 w-full h-full object-cover opacity-30"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background" />

    <div className="relative max-w-7xl mx-auto w-full px-6 lg:px-10 fade-up">
      <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-10">
        Arquitectura · Diseño · Espacio
      </p>
      <h1 className="font-serif font-light leading-[0.95] text-5xl sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl">
        Espacios que <span className="italic-serif">trascienden</span>
        <br /> lo ordinario
      </h1>
      <p className="mt-10 max-w-md text-base text-muted-foreground leading-relaxed">
        Creamos arquitectura que responde a la naturaleza del lugar, la luz y las personas que lo habitan.
        Guacara · Valencia · Venezuela.
      </p>
      <div className="mt-12 flex flex-wrap items-center gap-6">
        <a
          href="#proyectos"
          className="text-[11px] tracking-[0.35em] uppercase border-b border-foreground pb-2 hover:text-gold hover:border-gold transition-colors"
        >
          Ver proyectos
        </a>
        <a
          href="#cotizar"
          className="text-[11px] tracking-[0.35em] uppercase bg-foreground text-background px-7 py-4 hover:bg-gold transition-colors"
        >
          Solicitar cotización
        </a>
      </div>
    </div>

    <div className="absolute right-8 bottom-8 hidden lg:flex items-center gap-3 text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
      <span>Scroll</span>
      <span className="block w-px h-12 bg-muted-foreground/40" />
    </div>
  </section>
);
