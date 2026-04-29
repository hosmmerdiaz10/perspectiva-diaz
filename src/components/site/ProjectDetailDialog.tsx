import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PortfolioItem } from "@/data/site";

interface Props {
  project: PortfolioItem | null;
  onClose: () => void;
}

const isVideoFile = (src: string) => /\.(mp4|webm|ogg)$/i.test(src);
const isYouTubeOrVimeo = (src: string) =>
  /youtube\.com|youtu\.be|vimeo\.com/i.test(src);

export const ProjectDetailDialog = ({ project, onClose }: Props) => {
  // Construir lista de medios: imágenes + (video al final si existe)
  const media: string[] = project
    ? [
        ...(project.images && project.images.length > 0
          ? project.images
          : project.image
          ? [project.image]
          : []),
        ...(project.video ? [project.video] : []),
      ]
    : [];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % media.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + media.length) % media.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, media.length]);

  const current = media[index];

  return (
    <Dialog open={!!project} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl bg-background border-border max-h-[90vh] overflow-y-auto">
        {project && (
          <>
            <DialogHeader>
              <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-2">
                {[project.year, project.location].filter(Boolean).join(" · ") || "Proyecto"}
              </p>
              <DialogTitle className="font-serif font-light text-3xl md:text-4xl">
                {project.title}
              </DialogTitle>
              {project.description && (
                <DialogDescription className="text-base text-muted-foreground max-w-2xl">
                  {project.description}
                </DialogDescription>
              )}
            </DialogHeader>

            {/* Carrusel principal */}
            <div className="mt-6 relative bg-muted aspect-[16/10] overflow-hidden">
              {current ? (
                isVideoFile(current) ? (
                  <video
                    src={current}
                    controls
                    className="w-full h-full object-contain bg-black"
                  />
                ) : isYouTubeOrVimeo(current) ? (
                  <iframe
                    src={current}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={current}
                    alt={`${project.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
                  Imágenes pronto
                </div>
              )}

              {media.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Anterior"
                    onClick={() =>
                      setIndex((i) => (i - 1 + media.length) % media.length)
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background text-foreground p-2 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Siguiente"
                    onClick={() => setIndex((i) => (i + 1) % media.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background text-foreground p-2 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 right-3 text-[10px] tracking-[0.3em] uppercase bg-background/70 px-2 py-1 text-muted-foreground">
                    {index + 1} / {media.length}
                  </div>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {media.length > 1 && (
              <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-2">
                {media.map((m, i) => (
                  <button
                    key={m + i}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`aspect-square overflow-hidden bg-muted border transition-colors ${
                      i === index ? "border-gold" : "border-transparent hover:border-border"
                    }`}
                  >
                    {isVideoFile(m) || isYouTubeOrVimeo(m) ? (
                      <div className="w-full h-full flex items-center justify-center text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
                        Video
                      </div>
                    ) : (
                      <img
                        src={m}
                        alt={`thumb ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
