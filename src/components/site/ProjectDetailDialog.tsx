import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import type { PortfolioItem } from "@/data/site";

interface Props {
  project: PortfolioItem | null;
  onClose: () => void;
}

const isVideoFile = (src: string) => /\.(mp4|webm|ogg)$/i.test(src);
const isYouTubeOrVimeo = (src: string) =>
  /youtube\.com|youtu\.be|vimeo\.com/i.test(src);

export const ProjectDetailDialog = ({ project, onClose }: Props) => {
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
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  // Reset al cambiar proyecto o imagen
  useEffect(() => {
    setIndex(0);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setIsFullscreen(false);
  }, [project]);

  useEffect(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [index]);

  // Teclado
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % media.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + media.length) % media.length);
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.25, 4));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.25, 1));
      if (e.key === "0") { setZoom(1); setOffset({ x: 0, y: 0 }); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, media.length, isFullscreen]);

  const current = media[index];
  const isImage = current && !isVideoFile(current) && !isYouTubeOrVimeo(current);

  const handleWheel = (e: React.WheelEvent) => {
    if (!isImage) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setZoom((z) => {
      const next = Math.min(Math.max(z + delta, 1), 4);
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1 || !isImage) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setOffset({
      x: dragRef.current.ox + (e.clientX - dragRef.current.x),
      y: dragRef.current.oy + (e.clientY - dragRef.current.y),
    });
  };
  const onPointerUp = () => { dragRef.current = null; };

  const toggleZoom = () => {
    if (zoom > 1) { setZoom(1); setOffset({ x: 0, y: 0 }); }
    else setZoom(2);
  };

  const renderViewer = (full: boolean) => (
    <div
      className={`relative bg-neutral-950 overflow-hidden group ${
        full ? "w-screen h-screen" : "w-full aspect-[16/10] rounded-md"
      }`}
      onWheel={handleWheel}
    >
      {current ? (
        isVideoFile(current) ? (
          <video src={current} controls className="w-full h-full object-contain bg-black" />
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
            alt={`${project?.title} ${index + 1}`}
            draggable={false}
            onDoubleClick={toggleZoom}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              transition: dragRef.current ? "none" : "transform 0.25s ease-out",
              cursor: zoom > 1 ? (dragRef.current ? "grabbing" : "grab") : "zoom-in",
            }}
            className="w-full h-full object-contain select-none"
          />
        )
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] tracking-[0.35em] uppercase text-neutral-500">
          Imágenes pronto
        </div>
      )}

      {/* Flechas */}
      {media.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => setIndex((i) => (i - 1 + media.length) % media.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => setIndex((i) => (i + 1) % media.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Toolbar */}
      {isImage && (
        <div className="absolute top-3 right-3 flex gap-1 bg-black/50 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            aria-label="Alejar"
            onClick={() => setZoom((z) => Math.max(z - 0.5, 1))}
            className="text-white p-2 hover:bg-white/10 rounded-full"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Acercar"
            onClick={() => setZoom((z) => Math.min(z + 0.5, 4))}
            className="text-white p-2 hover:bg-white/10 rounded-full"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label={full ? "Salir pantalla completa" : "Pantalla completa"}
            onClick={() => setIsFullscreen((v) => !v)}
            className="text-white p-2 hover:bg-white/10 rounded-full"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Contador */}
      {media.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-white">
          {index + 1} / {media.length}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Dialog open={!!project && !isFullscreen} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-6xl bg-background border-border max-h-[92vh] overflow-y-auto p-6 md:p-8">
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

              {/* Layout: visor + miniaturas */}
              <div className="mt-6 grid lg:grid-cols-[1fr_120px] gap-4">
                {renderViewer(false)}

                {/* Miniaturas (lateral en desktop, debajo en móvil) */}
                {media.length > 1 && (
                  <div className="lg:max-h-[60vh] lg:overflow-y-auto">
                    <div className="grid grid-cols-6 lg:grid-cols-1 gap-2">
                      {media.map((m, i) => (
                        <button
                          key={m + i}
                          type="button"
                          onClick={() => setIndex(i)}
                          className={`aspect-square overflow-hidden bg-muted rounded transition-all ${
                            i === index
                              ? "ring-2 ring-gold ring-offset-2 ring-offset-background"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          {isVideoFile(m) || isYouTubeOrVimeo(m) ? (
                            <div className="w-full h-full flex items-center justify-center text-[9px] tracking-[0.3em] uppercase text-muted-foreground bg-neutral-900 text-white">
                              Video
                            </div>
                          ) : (
                            <img src={m} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <p className="mt-4 text-[10px] tracking-[0.3em] uppercase text-muted-foreground text-center">
                Doble clic para zoom · rueda del mouse · arrastra para mover · ← →
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modo pantalla completa */}
      {isFullscreen && project && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          {renderViewer(true)}
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 left-4 text-[10px] tracking-[0.3em] uppercase text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            Cerrar
          </button>
        </div>
      )}
    </>
  );
};
