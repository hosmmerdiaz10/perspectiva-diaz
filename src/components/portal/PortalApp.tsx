import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  ChevronRight, FolderPlus, Folder, Upload, LogOut, Home,
  Trash2, Image as ImageIcon, Loader2, X, CheckSquare, Square,
} from "lucide-react";
import { toast } from "sonner";
import PhotoViewer from "./PhotoViewer";
import { cn } from "@/lib/utils";

type FolderRow = {
  id: string;
  parent_id: string | null;
  name: string;
  description: string | null;
  created_at: string;
};

type PhotoRow = {
  id: string;
  folder_id: string | null;
  storage_path: string;
  title: string | null;
  created_at: string;
};

type UploadItem = {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

export default function PortalApp() {
  const { user, signOut } = useAuth();
  const [currentFolder, setCurrentFolder] = useState<FolderRow | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<FolderRow[]>([]);
  const [folders, setFolders] = useState<FolderRow[]>([]);
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const [selectMode, setSelectMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const parentId = currentFolder?.id ?? null;
    const fq = supabase.from("folders").select("*").order("position").order("created_at");
    const { data: f } = parentId ? await fq.eq("parent_id", parentId) : await fq.is("parent_id", null);
    const pq = supabase.from("photos").select("*").order("position").order("created_at");
    const { data: p } = parentId ? await pq.eq("folder_id", parentId) : await pq.is("folder_id", null);
    setFolders((f ?? []) as FolderRow[]);
    setPhotos((p ?? []) as PhotoRow[]);

    if (p && p.length) {
      const paths = p.map((x: any) => x.storage_path);
      const { data: urls } = await supabase.storage.from("portfolio").createSignedUrls(paths, 3600);
      const map: Record<string, string> = {};
      urls?.forEach((u, i) => { if (u.signedUrl) map[paths[i]] = u.signedUrl; });
      setSignedUrls(map);
    } else {
      setSignedUrls({});
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [currentFolder?.id]);

  // Reset selection when changing folder
  useEffect(() => { setSelectedPhotos(new Set()); setSelectMode(false); }, [currentFolder?.id]);

  const enter = (f: FolderRow) => {
    setBreadcrumbs([...breadcrumbs, f]);
    setCurrentFolder(f);
  };

  const goTo = (idx: number) => {
    if (idx === -1) {
      setBreadcrumbs([]);
      setCurrentFolder(null);
    } else {
      const next = breadcrumbs.slice(0, idx + 1);
      setBreadcrumbs(next);
      setCurrentFolder(next[next.length - 1]);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim() || !user) return;
    const { error } = await supabase.from("folders").insert({
      owner_id: user.id,
      parent_id: currentFolder?.id ?? null,
      name: newFolderName.trim(),
    });
    if (error) { toast.error(error.message); return; }
    setNewFolderName("");
    setNewFolderOpen(false);
    toast.success("Carpeta creada");
    load();
  };

  const deleteFolder = async (f: FolderRow) => {
    if (!confirm(`¿Eliminar "${f.name}" y todo su contenido?`)) return;
    const { error } = await supabase.from("folders").delete().eq("id", f.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Carpeta eliminada");
    load();
  };

  // ---- Upload flow ----
  const uploadOne = async (item: UploadItem) => {
    if (!user) return;
    setUploadQueue((q) => q.map((x) => x.id === item.id ? { ...x, status: "uploading", progress: 10 } : x));
    const ext = item.file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("portfolio").upload(path, item.file, { contentType: item.file.type });
    if (upErr) {
      setUploadQueue((q) => q.map((x) => x.id === item.id ? { ...x, status: "error", error: upErr.message } : x));
      return;
    }
    setUploadQueue((q) => q.map((x) => x.id === item.id ? { ...x, progress: 70 } : x));
    const { error: dbErr } = await supabase.from("photos").insert({
      owner_id: user.id,
      folder_id: currentFolder?.id ?? null,
      storage_path: path,
      title: item.file.name,
      size_bytes: item.file.size,
    });
    if (dbErr) {
      setUploadQueue((q) => q.map((x) => x.id === item.id ? { ...x, status: "error", error: dbErr.message } : x));
      return;
    }
    setUploadQueue((q) => q.map((x) => x.id === item.id ? { ...x, status: "done", progress: 100 } : x));
  };

  const onDrop = useCallback((accepted: File[]) => {
    if (!accepted.length) return;
    const items: UploadItem[] = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: "pending",
    }));
    setUploadQueue((q) => [...q, ...items]);
    setUploadOpen(true);
  }, []);

  const startUploads = async () => {
    const pending = uploadQueue.filter((x) => x.status === "pending");
    // upload sequentially to respect storage rate
    for (const item of pending) {
      await uploadOne(item);
    }
    const failed = uploadQueue.filter((x) => x.status === "error").length;
    const done = uploadQueue.filter((x) => x.status === "done").length;
    if (done) toast.success(`${done} foto(s) subida(s)`);
    if (failed) toast.error(`${failed} fallaron`);
    load();
  };

  const removeFromQueue = (id: string) => {
    setUploadQueue((q) => {
      const item = q.find((x) => x.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return q.filter((x) => x.id !== id);
    });
  };

  const closeUploadDialog = () => {
    uploadQueue.forEach((x) => URL.revokeObjectURL(x.preview));
    setUploadQueue([]);
    setUploadOpen(false);
  };

  const { getRootProps, getInputProps, isDragActive, open: openFilePicker } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    noClick: true,
    noKeyboard: true,
  });

  // ---- Selection ----
  const togglePhoto = (id: string) => {
    setSelectedPhotos((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const selectAll = () => {
    if (selectedPhotos.size === photos.length) setSelectedPhotos(new Set());
    else setSelectedPhotos(new Set(photos.map((p) => p.id)));
  };

  const deleteSelected = async () => {
    if (!selectedPhotos.size) return;
    if (!confirm(`¿Eliminar ${selectedPhotos.size} foto(s)?`)) return;
    const toDelete = photos.filter((p) => selectedPhotos.has(p.id));
    await supabase.storage.from("portfolio").remove(toDelete.map((p) => p.storage_path));
    await supabase.from("photos").delete().in("id", toDelete.map((p) => p.id));
    toast.success(`${toDelete.length} foto(s) eliminada(s)`);
    setSelectedPhotos(new Set());
    setSelectMode(false);
    load();
  };

  const photoUrls = photos.map((p) => signedUrls[p.storage_path]).filter(Boolean) as string[];

  return (
    <div {...getRootProps()} className="min-h-screen bg-background relative">
      <input {...getInputProps()} />

      {/* Drag overlay */}
      {isDragActive && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm border-4 border-dashed border-primary grid place-items-center pointer-events-none">
          <div className="text-center">
            <Upload className="w-12 h-12 mx-auto mb-3 text-primary" />
            <p className="font-serif text-2xl">Suelta para subir</p>
            <p className="text-sm text-muted-foreground mt-1">Las fotos irán a {currentFolder?.name ?? "Mi portafolio"}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm min-w-0 flex-wrap">
            <button onClick={() => goTo(-1)} className="flex items-center gap-1.5 hover:text-foreground text-muted-foreground transition-colors">
              <Home className="w-4 h-4" /> <span className="hidden xs:inline">Portafolio</span>
            </button>
            {breadcrumbs.map((b, i) => (
              <span key={b.id} className="flex items-center gap-2 min-w-0">
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <button
                  onClick={() => goTo(i)}
                  className={cn("hover:text-foreground transition-colors truncate max-w-[140px]",
                    i === breadcrumbs.length - 1 ? "text-foreground font-medium" : "text-muted-foreground")}
                >
                  {b.name}
                </button>
              </span>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={signOut} className="shrink-0">
            <LogOut className="w-4 h-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 flex flex-wrap items-center gap-2">
        <h1 className="font-serif text-2xl sm:text-3xl tracking-tight mr-auto truncate">
          {currentFolder?.name ?? "Mi portafolio"}
        </h1>

        {selectMode ? (
          <>
            <span className="text-sm text-muted-foreground mr-1">
              {selectedPhotos.size} seleccionada(s)
            </span>
            <Button variant="outline" size="sm" onClick={selectAll}>
              {selectedPhotos.size === photos.length && photos.length > 0
                ? <CheckSquare className="w-4 h-4 mr-1.5" />
                : <Square className="w-4 h-4 mr-1.5" />}
              {selectedPhotos.size === photos.length && photos.length > 0 ? "Ninguna" : "Todas"}
            </Button>
            <Button variant="destructive" size="sm" onClick={deleteSelected} disabled={!selectedPhotos.size}>
              <Trash2 className="w-4 h-4 mr-1.5" /> Eliminar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setSelectMode(false); setSelectedPhotos(new Set()); }}>
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            {photos.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setSelectMode(true)}>
                <CheckSquare className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Seleccionar</span>
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setNewFolderOpen(true)}>
              <FolderPlus className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Nueva carpeta</span>
            </Button>
            <Button size="sm" onClick={openFilePicker}>
              <Upload className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Subir fotos</span>
            </Button>
          </>
        )}
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : folders.length === 0 && photos.length === 0 ? (
          <button
            onClick={openFilePicker}
            className="w-full text-center py-20 border-2 border-dashed border-border hover:border-primary/50 hover:bg-secondary/30 rounded-xl transition-colors group"
          >
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground group-hover:text-primary mb-3 transition-colors" />
            <p className="font-medium mb-1">Esta carpeta está vacía</p>
            <p className="text-sm text-muted-foreground">
              Arrastra fotos aquí o toca para subir
            </p>
          </button>
        ) : (
          <div className="space-y-10">
            {folders.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Carpetas</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {folders.map((f) => (
                    <div key={f.id} className="group relative">
                      <button
                        onClick={() => enter(f)}
                        className="w-full aspect-[4/3] bg-secondary hover:bg-accent/30 border border-border rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:shadow-md"
                      >
                        <Folder className="w-9 h-9 text-foreground/70 group-hover:text-foreground transition-colors" />
                        <span className="text-sm font-medium px-2 truncate max-w-full">{f.name}</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteFolder(f); }}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-background/90 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground touch:opacity-100"
                        aria-label="Eliminar carpeta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {photos.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Fotos</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {photos.map((p, idx) => {
                    const url = signedUrls[p.storage_path];
                    const isSelected = selectedPhotos.has(p.id);
                    return (
                      <div
                        key={p.id}
                        className={cn(
                          "group relative aspect-square overflow-hidden rounded-lg bg-secondary transition-all",
                          isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                        )}
                      >
                        {url ? (
                          <img
                            src={url}
                            alt={p.title ?? ""}
                            loading="lazy"
                            onClick={() => selectMode ? togglePhoto(p.id) : setViewerIndex(idx)}
                            className={cn(
                              "w-full h-full object-cover transition-transform duration-500",
                              selectMode ? "cursor-pointer" : "cursor-zoom-in group-hover:scale-105",
                              isSelected && "scale-95"
                            )}
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center">
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          </div>
                        )}

                        {/* Selection checkbox */}
                        {selectMode && (
                          <div
                            onClick={() => togglePhoto(p.id)}
                            className="absolute top-2 left-2 w-6 h-6 rounded-md bg-background/90 backdrop-blur grid place-items-center cursor-pointer shadow"
                          >
                            <Checkbox checked={isSelected} className="pointer-events-none" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* New folder dialog */}
      <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Nueva carpeta</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createFolder()}
            placeholder="Nombre de la carpeta"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewFolderOpen(false)}>Cancelar</Button>
            <Button onClick={createFolder}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload queue dialog */}
      <Dialog open={uploadOpen} onOpenChange={(o) => !o && closeUploadDialog()}>
        <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-serif">
              Subir {uploadQueue.length} foto(s)
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-2">
            {uploadQueue.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 border border-border rounded-md">
                <img src={item.preview} alt="" className="w-14 h-14 rounded object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm truncate">{item.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(item.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {item.status !== "pending" && (
                    <div className="mt-1.5 h-1 bg-secondary rounded overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all",
                          item.status === "error" ? "bg-destructive" :
                          item.status === "done" ? "bg-primary" : "bg-primary/60"
                        )}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                  {item.error && <p className="text-xs text-destructive mt-1">{item.error}</p>}
                </div>
                {item.status === "pending" && (
                  <button
                    onClick={() => removeFromQueue(item.id)}
                    className="p-1.5 rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {item.status === "uploading" && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                {item.status === "done" && <span className="text-xs text-primary font-medium">✓</span>}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeUploadDialog}>
              {uploadQueue.every((x) => x.status === "done" || x.status === "error") ? "Cerrar" : "Cancelar"}
            </Button>
            <Button
              onClick={startUploads}
              disabled={!uploadQueue.some((x) => x.status === "pending")}
            >
              Subir todas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Photo viewer */}
      {viewerIndex !== null && photoUrls.length > 0 && (
        <PhotoViewer
          urls={photoUrls}
          index={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onIndex={setViewerIndex}
        />
      )}
    </div>
  );
}
