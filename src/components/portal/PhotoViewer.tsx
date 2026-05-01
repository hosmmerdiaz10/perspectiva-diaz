import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

type Props = {
  urls: string[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
};

export default function PhotoViewer({ urls, index, onClose, onIndex }: Props) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => { setZoom(1); }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onIndex((index + 1) % urls.length);
      else if (e.key === "ArrowLeft") onIndex((index - 1 + urls.length) % urls.length);
      else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.25, 4));
      else if (e.key === "-") setZoom((z) => Math.max(z - 0.25, 1));
      else if (e.key === "0") setZoom(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, urls.length, onClose, onIndex]);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border">
        <span className="text-xs text-muted-foreground tabular-nums">
          {index + 1} / {urls.length}
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom((z) => Math.max(z - 0.25, 1))} className="p-2 hover:bg-secondary rounded-md">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground tabular-nums w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(z + 0.25, 4))} className="p-2 hover:bg-secondary rounded-md">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-md ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-auto grid place-items-center">
        <button
          onClick={() => onIndex((index - 1 + urls.length) % urls.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 hover:bg-background border border-border z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <img
          src={urls[index]}
          alt=""
          style={{ transform: `scale(${zoom})`, transition: "transform 0.2s" }}
          className="max-w-[90vw] max-h-[80vh] object-contain select-none"
          draggable={false}
          onDoubleClick={() => setZoom((z) => (z === 1 ? 2 : 1))}
        />
        <button
          onClick={() => onIndex((index + 1) % urls.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 hover:bg-background border border-border z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
