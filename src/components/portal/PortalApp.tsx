import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  ChevronRight, FolderPlus, Folder, Upload, LogOut, Home,
  Trash2, Image as ImageIcon, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import PhotoViewer from "./PhotoViewer";

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
  const [uploading, setUploading] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const parentId = currentFolder?.id ?? null;
    const fq = supabase.from("folders").select("*").order("position").order("created_at");
    const { data: f } = parentId
      ? await fq.eq("parent_id", parentId)
      : await fq.is("parent_id", null);
    const pq = supabase.from("photos").select("*").order("position").order("created_at");
    const { data: p } = parentId
      ? await pq.eq("folder_id", parentId)
      : await pq.is("folder_id", null);
    setFolders((f ?? []) as FolderRow[]);
    setPhotos((p ?? []) as PhotoRow[]);

    // signed urls
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

  const deletePhoto = async (p: PhotoRow) => {
    if (!confirm("¿Eliminar esta foto?")) return;
    await supabase.storage.from("portfolio").remove([p.storage_path]);
    await supabase.from("photos").delete().eq("id", p.id);
    toast.success("Foto eliminada");
    load();
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !user) return;
    setUploading(true);
    let ok = 0;
    for (const file of files) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("portfolio").upload(path, file, { contentType: file.type });
      if (upErr) { toast.error(`${file.name}: ${upErr.message}`); continue; }
      const { error: dbErr } = await supabase.from("photos").insert({
        owner_id: user.id,
        folder_id: currentFolder?.id ?? null,
        storage_path: path,
        title: file.name,
        size_bytes: file.size,
      });
      if (dbErr) { toast.error(dbErr.message); continue; }
      ok++;
    }
    setUploading(false);
    e.target.value = "";
    if (ok) toast.success(`${ok} foto(s) subida(s)`);
    load();
  };

  const photoUrls = photos.map((p) => signedUrls[p.storage_path]).filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => goTo(-1)} className="flex items-center gap-1.5 hover:text-foreground text-muted-foreground transition-colors">
              <Home className="w-4 h-4" /> Portafolio
            </button>
            {breadcrumbs.map((b, i) => (
              <span key={b.id} className="flex items-center gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                <button
                  onClick={() => goTo(i)}
                  className={`hover:text-foreground transition-colors ${i === breadcrumbs.length - 1 ? "text-foreground font-medium" : "text-muted-foreground"}`}
                >
                  {b.name}
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-muted-foreground mr-2">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 flex flex-wrap items-center gap-2">
        <h1 className="font-serif text-2xl sm:text-3xl tracking-tight mr-auto">
          {currentFolder?.name ?? "Mi portafolio"}
        </h1>
        <Button variant="outline" size="sm" onClick={() => setNewFolderOpen(true)}>
          <FolderPlus className="w-4 h-4 mr-1.5" /> Nueva carpeta
        </Button>
        <label>
          <input type="file" accept="image/*" multiple hidden onChange={onUpload} disabled={uploading} />
          <Button asChild size="sm" disabled={uploading}>
            <span className="cursor-pointer">
              {uploading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Upload className="w-4 h-4 mr-1.5" />}
              Subir fotos
            </span>
          </Button>
        </label>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : folders.length === 0 && photos.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border rounded-lg">
            <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">
              Esta carpeta está vacía. Crea una subcarpeta o sube fotos.
            </p>
          </div>
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
                        className="w-full aspect-[4/3] bg-secondary hover:bg-accent/30 border border-border rounded-md flex flex-col items-center justify-center gap-2 transition-colors"
                      >
                        <Folder className="w-8 h-8 text-foreground/70 group-hover:text-foreground transition-colors" />
                        <span className="text-sm font-medium px-2 truncate max-w-full">{f.name}</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteFolder(f); }}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
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
                    return (
                      <div key={p.id} className="group relative aspect-square overflow-hidden rounded-md bg-secondary">
                        {url ? (
                          <img
                            src={url}
                            alt={p.title ?? ""}
                            loading="lazy"
                            onClick={() => setViewerIndex(idx)}
                            className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center">
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          </div>
                        )}
                        <button
                          onClick={() => deletePhoto(p)}
                          className="absolute top-2 right-2 p-1.5 rounded-md bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                          aria-label="Eliminar foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
