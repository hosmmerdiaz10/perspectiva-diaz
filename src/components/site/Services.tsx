import { useState } from "react";
import { SERVICES, type Service } from "@/data/site";
import { ServicePortfolioDialog } from "./ServicePortfolioDialog";

export const Services = () => {
  const [active, setActive] = useState<Service | null>(null);

  return (
    <section id="servicios" className="py-32 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-4">
            <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-6">
              Nuestros Servicios
            </p>
            <h2 className="font-serif font-light text-4xl md:text-5xl leading-[1.05]">
              Lo que <span className="italic-serif">construimos</span> juntos
            </h2>
          </div>
          <p className="lg:col-span-7 lg:col-start-6 text-muted-foreground leading-relaxed self-end max-w-xl">
            Cada proyecto nace de una conversación profunda sobre el espacio, la vida y los sueños
            de quienes lo habitarán. Ofrecemos un servicio integral desde el concepto hasta la entrega final.
          </p>
        </div>

        <ul className="divide-y divide-border/70 border-y border-border/70">
          {SERVICES.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => setActive(s)}
                className="w-full grid grid-cols-12 gap-6 items-center py-10 text-left group hover:px-4 transition-all duration-500"
              >
                <span className="col-span-2 md:col-span-1 font-serif italic text-gold text-lg">{s.number}</span>
                <div className="col-span-10 md:col-span-7">
                  <h3 className="font-serif font-light text-3xl md:text-4xl leading-tight group-hover:text-gold transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground max-w-xl">{s.description}</p>
                </div>
                <span className="hidden md:block col-span-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                  {s.tag}
                </span>
                <span className="hidden md:flex col-span-2 justify-end text-[11px] tracking-[0.3em] uppercase">
                  Portafolio →
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ServicePortfolioDialog service={active} onClose={() => setActive(null)} />
    </section>
  );
};
