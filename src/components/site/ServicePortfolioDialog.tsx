import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Service } from "@/data/site";

interface Props {
  service: Service | null;
  onClose: () => void;
}

export const ServicePortfolioDialog = ({ service, onClose }: Props) => {
  return (
    <Dialog open={!!service} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl bg-background border-border max-h-[90vh] overflow-y-auto">
        {service && (
          <>
            <DialogHeader>
              <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-2">
                {service.number} · {service.tag}
              </p>
              <DialogTitle className="font-serif font-light text-3xl md:text-4xl">
                {service.title}
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground max-w-2xl">
                {service.description}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm">
              {service.bullets.map((b) => (
                <div key={b} className="border border-border/70 px-4 py-3 text-muted-foreground">
                  {b}
                </div>
              ))}
            </div>

            <div className="mt-10">
              <p className="text-[11px] tracking-[0.35em] uppercase text-muted-foreground mb-5">
                Portafolio del servicio
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {service.portfolio.map((p) => (
                  <figure key={p.title} className="group">
                    <div className="aspect-[4/5] bg-muted overflow-hidden relative">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                          Imagen pronto
                        </div>
                      )}
                    </div>
                    <figcaption className="mt-3 font-serif text-lg">{p.title}</figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 items-center justify-between border-t border-border/70 pt-6">
              <p className="text-sm text-muted-foreground">¿Te interesa este servicio?</p>
              <a
                href="#cotizar"
                onClick={onClose}
                className="text-[11px] tracking-[0.3em] uppercase bg-foreground text-background px-6 py-3 hover:bg-gold transition-colors"
              >
                Cotizar por WhatsApp
              </a>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
