import { PROJECTS } from "@/data/site";

export const Projects = () => (
  <section id="proyectos" className="py-32 px-6 lg:px-10 bg-secondary/40">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
        <div>
          <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-6">
            Proyectos Seleccionados
          </p>
          <h2 className="font-serif font-light text-4xl md:text-5xl leading-[1.05]">
            Obra <span className="italic-serif">reciente</span>
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm">
          Una selección de proyectos donde la materialidad y la luz construyen la atmósfera del lugar.
        </p>
      </div>

      <div id="portafolio" className="grid md:grid-cols-3 gap-6 lg:gap-10">
        {PROJECTS.map((p, i) => (
          <article key={p.id} className={`group hover-lift ${i === 1 ? "md:mt-16" : ""}`}>
            <div className="aspect-[4/5] bg-muted relative overflow-hidden">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                  Imagen pronto
                </div>
              )}
              <div className="absolute top-4 left-4 text-[10px] tracking-[0.3em] uppercase bg-background/80 backdrop-blur px-3 py-1.5">
                {p.category}
              </div>
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <h3 className="font-serif text-2xl">{p.title}</h3>
              <span className="text-[11px] tracking-[0.25em] text-muted-foreground">{p.year}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {p.location}{p.area ? ` · ${p.area}` : ""}
            </p>
            <p className="text-sm mt-3 leading-relaxed text-foreground/80">{p.description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);
