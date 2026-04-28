import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Service, PortfolioItem } from "@/data/site";

interface Props {
  service: Service | null;
  onClose: () => void;
}

const isYouTube = (url: string) => /youtube\.com|youtu\.be/.test(url);
const isVimeo = (url: string) => /vimeo\.com/.test(url);

const VideoEmbed = ({ url }: { url: string }) => {
  if (isYouTube(url)) {
    const id = url.match(/(?:v=|youtu\.be\/)([\w-]+)/)?.[1];
    if (id)
      return (
        <iframe
          className="w-full aspect-video"
          src={`https://www.youtube.com/embed/${id}`}
          title="Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
  }
  if (isVimeo(url)) {
    const id = url.match(/vimeo\.com\/(\d+)/)?.[1];
    if (id)
      return <iframe className="w-full aspect-video" src={`https://player.vimeo.com/video/${id}`} allowFullScreen />;
  }
  return <video className="w-full aspect-video" src={url} controls />;
};

const PortfolioCard = ({ p }: { p: PortfolioItem }) => {
  const gallery = p.images?.length ? p.images : p.image ? [p.image] : [];
  return (
    <figure className="group border border-border/60">
      <div className="aspect-[4/5] bg-muted overflow-hidden relative">
        {gallery[0] ? (
          <img
            src={gallery[0]}
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

      {gallery.length > 1 && (
        <div className="grid grid-cols-3 gap-1 p-1 bg-background">
          {gallery.slice(1, 4).map((src, i) => (
            <img key={i} src={src} alt={`${p.title} ${i + 2}`} loading="lazy" className="aspect-square object-cover" />
          ))}
        </div>
      )}

      {p.video && (
        <div className="border-t border-border/60">
          <VideoEmbed url={p.video} />
        </div>
      )}

      <figcaption className="p-4">
        <h4 className="font-serif text-lg leading-tight">{p.title}</h4>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
          {p.year && <span>{p.year}</span>}
          {p.area && <span>· {p.area}</span>}
          {p.location && <span>· {p.location}</span>}
        </div>
        {p.description && (
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">{p.description}</p>
        )}
      </figcaption>
    </figure>
  );
};

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
                  <PortfolioCard key={p.title} p={p} />
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
