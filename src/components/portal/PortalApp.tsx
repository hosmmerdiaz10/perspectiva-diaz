import { useEffect, useState, useCallback, useMemo } from "react";
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
  LogIn, Lock, Grid, LayoutGrid, ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import PhotoViewer from "./PhotoViewer";
import AuthDialog from "./AuthDialog";
import { cn } from "@/lib/utils";

type FolderRow = {
  id: string; parent_id: string | null; name: string;
  description: string | null; created_at: string;
};
type PhotoRow = {
  id: string; folder_id: string | null; storage_path: string;
  title: string | null; created_at: string;
};
type UploadItem = {
  id: string; file: File; preview: string;
  progress: number; status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const publicUrl = (path: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/portfolio/${path}`;

export default function PortalApp() {
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();

  const [currentFolder, setCurrentFolder] = useState<FolderRow | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<FolderRow[]>([]);
  const [folders, setFolders] = useState<FolderRow[]>([]);
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridDense, setGridDense] = useState(false);

  const [authOpen, setAuthOpen] = useState(false);
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
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [currentFolder?.id]);
  useEffect(() => { setSelectedPhotos(new Set()); setSelectMode(false); }, [currentFolder?.id]);

  const enter = (f: FolderRow) => { setBreadcrumbs([...breadcrumbs, f]); setCurrentFolder(f); };
  const goTo = (idx: number) => {
    if (idx === -1) { setBreadcrumbs([]); setCurrentFolder(null); }
    else { const next = breadcrumbs.slice(0, idx + 1); setBreadcrumbs(next); setCurrentFolder(next[next.length - 1]); }
  };

  const createFolder = async () => {
    if (!newFolderName.trim() || !user) return;
    const { error } = await supabase.from("folders").insert({
      owner_id: user.id, parent_id: currentFolder?.id ?? null, name: newFolderName.trim(),
    });
    if (error) { toast.error(error.message); return; }
    setNewFolderName(""); setNewFolderOpen(false);
    toast.success("Carpeta creada"); load();
  };

  const deleteFolder = async (f: FolderRow) => {
    if (!confirm(`¿Eliminar "${f.name}" y todo su contenido?`)) return;
    const { error } = await supabase.from("folders").delete().eq("id", f.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Carpeta eliminada"); load();
  };

  // ---- Upload ----
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
      owner_id: user.id, folder_id: currentFolder?.id ?? null,
      storage_path: path, title: item.file.name, size_bytes: item.file.size,
    });
    if (dbErr) {
      setUploadQueue((q) => q.map((x) => x.id === item.id ? { ...x, status: "error", error: dbErr.message } : x));
      return;
    }
    setUploadQueue((q) => q.map((x) => x.id === item.id ? { ...x, status: "done", progress: 100 } : x));
  };

  const onDrop = useCallback((accepted: File[]) => {
    if (!accepted.length || !isAdmin) return;
    const items: UploadItem[] = accepted.map((file) => ({
      id: crypto.randomUUID(), file, preview: URL.createObjectURL(file),
      progress: 0, status: "pending",
    }));
    setUploadQueue((q) => [...q, ...items]);
    setUploadOpen(true);
  }, [isAdmin]);

  const startUploads = async () => {
    const pending = uploadQueue.filter((x) => x.status === "pending");
    for (const item of pending) await uploadOne(item);
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
    setUploadQueue([]); setUploadOpen(false);
  };

  const { getRootProps, getInputProps, isDragActive, open: openFilePicker } = useDropzone({
    onDrop, accept: { "image/*": [] }, noClick: true, noKeyboard: true,
    disabled: !isAdmin,
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
    setSelectedPhotos(new Set()); setSelectMode(false); load();
  };

  const photoUrls = useMemo(() => photos.map((p) => publicUrl(p.storage_path)), [photos]);

  if (authLoading) {
    return (
      <div className="min-h-screen grid place-items-center" style={{ background: "#0a0a0a" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border border-white/20 border-t-white/80 rounded-full animate-spin" />
          <span className="text-white/30 text-xs tracking-[0.3em] uppercase font-light">Cargando</span>
        </div>
      </div>
    );
  }

  const isEmpty = folders.length === 0 && photos.length === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@200;300;400&display=swap');
        
        .portal-root {
          --col: #c8b89a;
          --ink: #e8e0d5;
          --dim: rgba(232,224,213,0.35);
          --line: rgba(232,224,213,0.08);
          --glass: rgba(255,255,255,0.03);
          background: #080808;
          color: var(--ink);
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          min-height: 100vh;
        }
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        
        /* Header */
        .p-header {
          position: sticky; top: 0; z-index: 40;
          background: rgba(8,8,8,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--line);
        }
        .p-header-inner {
          max-width: 1400px; margin: 0 auto;
          padding: 0 2rem;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 1.5rem;
        }
        .p-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem; font-weight: 400; letter-spacing: 0.12em;
          color: var(--ink); text-decoration: none;
        }
        .p-logo span { color: var(--col); }
        
        /* Breadcrumb */
        .p-bread { display: flex; align-items: center; gap: 0.5rem; flex: 1; overflow: hidden; }
        .p-bread-btn {
          font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--dim); background: none; border: none; cursor: pointer;
          transition: color 0.2s; white-space: nowrap; padding: 0;
          font-family: 'DM Sans', sans-serif; font-weight: 300;
        }
        .p-bread-btn:hover, .p-bread-btn.active { color: var(--ink); }
        .p-bread-sep { color: var(--line); font-size: 0.8rem; flex-shrink: 0; }
        
        /* Nav actions */
        .p-nav-actions { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
        
        /* Ghost button */
        .btn-ghost {
          background: none; border: 1px solid var(--line); border-radius: 2px;
          color: var(--dim); cursor: pointer; display: flex; align-items: center;
          gap: 0.4rem; padding: 0.4rem 0.85rem;
          font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
          font-family: 'DM Sans', sans-serif; font-weight: 300;
          transition: all 0.2s;
        }
        .btn-ghost:hover { border-color: rgba(232,224,213,0.25); color: var(--ink); background: var(--glass); }
        
        /* Primary button */
        .btn-primary {
          background: var(--col); border: none; border-radius: 2px;
          color: #080808; cursor: pointer; display: flex; align-items: center;
          gap: 0.4rem; padding: 0.45rem 1rem;
          font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
          font-family: 'DM Sans', sans-serif; font-weight: 400;
          transition: all 0.2s;
        }
        .btn-primary:hover { background: #d4c4ab; transform: translateY(-1px); }
        
        /* Danger button */
        .btn-danger {
          background: rgba(180,60,60,0.15); border: 1px solid rgba(180,60,60,0.3);
          border-radius: 2px; color: #e07070; cursor: pointer;
          display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.85rem;
          font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
          font-family: 'DM Sans', sans-serif; font-weight: 300;
          transition: all 0.2s;
        }
        .btn-danger:hover { background: rgba(180,60,60,0.25); color: #f09090; }
        .btn-danger:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Icon button */
        .btn-icon {
          background: none; border: 1px solid var(--line); border-radius: 2px;
          color: var(--dim); cursor: pointer; display: flex; align-items: center;
          justify-content: center; width: 34px; height: 34px;
          transition: all 0.2s;
        }
        .btn-icon:hover { border-color: rgba(232,224,213,0.2); color: var(--ink); }
        .btn-icon.active { border-color: var(--col); color: var(--col); }

        /* Page layout */
        .p-page { max-width: 1400px; margin: 0 auto; padding: 0 2rem 4rem; }
        
        /* Page header area */
        .p-hero {
          padding: 3.5rem 0 2.5rem;
          border-bottom: 1px solid var(--line);
          margin-bottom: 2.5rem;
          display: flex; align-items: flex-end; justify-content: space-between;
          flex-wrap: wrap; gap: 1.5rem;
        }
        .p-hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.8rem, 5vw, 4.5rem);
          font-weight: 300; line-height: 1; letter-spacing: -0.01em;
          color: var(--ink);
        }
        .p-hero-title em {
          font-style: italic; color: var(--col);
        }
        .p-hero-sub {
          font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--dim); margin-top: 0.75rem; font-weight: 300;
        }
        .p-hero-count {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.8rem; letter-spacing: 0.1em;
          color: var(--dim); text-align: right;
        }
        .p-hero-count strong {
          display: block; font-size: 2.5rem; font-weight: 300; color: var(--ink);
          line-height: 1; letter-spacing: -0.02em;
        }

        /* Toolbar */
        .p-toolbar {
          display: flex; align-items: center; gap: 0.75rem;
          margin-bottom: 2.5rem; flex-wrap: wrap;
        }
        .p-toolbar-left { display: flex; align-items: center; gap: 0.75rem; flex: 1; flex-wrap: wrap; }
        .p-toolbar-right { display: flex; align-items: center; gap: 0.75rem; }
        .p-select-info {
          font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--col);
        }

        /* Section label */
        .p-section-label {
          font-size: 0.62rem; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--dim); margin-bottom: 1.25rem;
          display: flex; align-items: center; gap: 1rem;
        }
        .p-section-label::after {
          content: ''; flex: 1; height: 1px; background: var(--line);
        }

        /* Folder grid */
        .p-folders { margin-bottom: 3rem; }
        .p-folder-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1px;
          border: 1px solid var(--line);
        }
        .p-folder-card {
          position: relative;
          aspect-ratio: 4/3;
          background: var(--glass);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 0.75rem;
          cursor: pointer; transition: background 0.25s;
          border: none; color: var(--ink);
          overflow: hidden;
        }
        .p-folder-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(200,184,154,0.05) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s;
        }
        .p-folder-card:hover { background: rgba(255,255,255,0.05); }
        .p-folder-card:hover::before { opacity: 1; }
        .p-folder-icon {
          width: 2rem; height: 2rem; color: var(--col); opacity: 0.7;
          transition: opacity 0.2s, transform 0.3s;
        }
        .p-folder-card:hover .p-folder-icon { opacity: 1; transform: scale(1.1); }
        .p-folder-name {
          font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;
          font-weight: 300; max-width: 80%; text-align: center;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .p-folder-delete {
          position: absolute; top: 0.5rem; right: 0.5rem;
          width: 28px; height: 28px;
          background: rgba(8,8,8,0.85); border: 1px solid var(--line);
          border-radius: 2px; color: var(--dim); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: all 0.2s;
        }
        .p-folder-card:hover .p-folder-delete { opacity: 1; }
        .p-folder-delete:hover { color: #e07070; border-color: rgba(180,60,60,0.4); background: rgba(180,60,60,0.1); }
        .p-folder-arrow {
          position: absolute; bottom: 0.5rem; right: 0.5rem;
          color: var(--dim); opacity: 0; transition: opacity 0.2s;
        }
        .p-folder-card:hover .p-folder-arrow { opacity: 0.5; }

        /* Photo grid */
        .p-photos { }
        .p-photo-grid {
          display: grid;
          gap: 2px;
        }
        .p-photo-grid.grid-normal {
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        }
        .p-photo-grid.grid-dense {
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        }
        .p-photo-card {
          position: relative; overflow: hidden;
          background: #111; aspect-ratio: 1;
          cursor: zoom-in;
        }
        .p-photo-card.select-mode { cursor: pointer; }
        .p-photo-card img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.4s;
          display: block;
        }
        .p-photo-card:hover img { transform: scale(1.06); }
        .p-photo-card .p-photo-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%);
          opacity: 0; transition: opacity 0.3s; pointer-events: none;
        }
        .p-photo-card:hover .p-photo-overlay { opacity: 1; }
        .p-photo-card.selected { outline: 2px solid var(--col); outline-offset: -2px; }
        .p-photo-card.selected img { transform: scale(0.96); filter: brightness(0.7); }
        .p-photo-check {
          position: absolute; top: 0.6rem; left: 0.6rem; z-index: 2;
          width: 22px; height: 22px;
          background: rgba(8,8,8,0.9); border: 1px solid var(--line);
          border-radius: 2px; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .p-photo-check.checked { background: var(--col); border-color: var(--col); }
        .p-photo-title {
          position: absolute; bottom: 0.75rem; left: 0.75rem; right: 0.75rem;
          font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(232,224,213,0.8);
          opacity: 0; transition: opacity 0.3s;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .p-photo-card:hover .p-photo-title { opacity: 1; }

        /* Empty state */
        .p-empty {
          border: 1px dashed var(--line);
          padding: 6rem 2rem; text-align: center;
          transition: border-color 0.2s, background 0.2s;
          cursor: default;
        }
        .p-empty.clickable { cursor: pointer; }
        .p-empty:hover { border-color: rgba(200,184,154,0.2); background: rgba(200,184,154,0.02); }
        .p-empty-icon { color: var(--col); opacity: 0.3; margin: 0 auto 1.25rem; }
        .p-empty-title {
          font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 300;
          color: var(--ink); letter-spacing: 0.04em; margin-bottom: 0.5rem;
        }
        .p-empty-sub {
          font-size: 0.7rem; letter-spacing: 0.1em; color: var(--dim);
        }

        /* Drag overlay */
        .p-drag-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(8,8,8,0.92);
          border: 2px dashed rgba(200,184,154,0.4);
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
        }
        .p-drag-content { text-align: center; }
        .p-drag-icon {
          width: 3rem; height: 3rem; color: var(--col); margin: 0 auto 1.25rem;
          animation: float 1.5s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .p-drag-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 300; color: var(--ink); letter-spacing: 0.05em;
        }
        .p-drag-sub {
          font-size: 0.7rem; letter-spacing: 0.15em; color: var(--dim);
          text-transform: uppercase; margin-top: 0.5rem;
        }

        /* Dialogs */
        .p-dialog-overlay {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; padding: 1rem;
        }
        .p-dialog {
          background: #111; border: 1px solid var(--line);
          border-radius: 2px; width: 100%; max-width: 480px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6);
        }
        .p-dialog-header {
          padding: 1.75rem 2rem 1.25rem;
          border-bottom: 1px solid var(--line);
        }
        .p-dialog-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 300; color: var(--ink); letter-spacing: 0.03em;
        }
        .p-dialog-body { padding: 1.5rem 2rem; }
        .p-dialog-footer {
          padding: 1rem 2rem 1.75rem;
          display: flex; gap: 0.75rem; justify-content: flex-end;
        }
        
        /* Premium input */
        .p-input {
          width: 100%;
          background: rgba(255,255,255,0.04); border: 1px solid var(--line);
          border-radius: 2px; color: var(--ink); padding: 0.75rem 1rem;
          font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 300;
          outline: none; transition: border-color 0.2s;
        }
        .p-input::placeholder { color: var(--dim); }
        .p-input:focus { border-color: rgba(200,184,154,0.35); }

        /* Upload queue */
        .p-upload-dialog {
          max-height: 80vh; display: flex; flex-direction: column;
          max-width: 520px;
        }
        .p-upload-list { flex: 1; overflow-y: auto; padding: 1rem 2rem; }
        .p-upload-item {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.75rem 0; border-bottom: 1px solid var(--line);
        }
        .p-upload-item:last-child { border-bottom: none; }
        .p-upload-thumb {
          width: 52px; height: 52px; object-fit: cover;
          border-radius: 2px; flex-shrink: 0; filter: brightness(0.85);
        }
        .p-upload-info { flex: 1; min-width: 0; }
        .p-upload-name {
          font-size: 0.75rem; letter-spacing: 0.06em; color: var(--ink);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 0.2rem;
        }
        .p-upload-size {
          font-size: 0.65rem; letter-spacing: 0.08em; color: var(--dim);
          text-transform: uppercase;
        }
        .p-upload-bar-wrap {
          height: 2px; background: rgba(255,255,255,0.07);
          border-radius: 2px; overflow: hidden; margin-top: 0.5rem;
        }
        .p-upload-bar {
          height: 100%; transition: width 0.3s ease, background 0.2s;
          background: var(--col);
        }
        .p-upload-bar.error { background: #e07070; }
        .p-upload-status {
          font-size: 0.65rem; color: var(--col); letter-spacing: 0.08em;
          flex-shrink: 0;
        }
        .p-upload-remove {
          background: none; border: none; color: var(--dim);
          cursor: pointer; padding: 0.25rem; transition: color 0.2s; flex-shrink: 0;
        }
        .p-upload-remove:hover { color: #e07070; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--line); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(232,224,213,0.15); }

        /* Responsive */
        @media (max-width: 640px) {
          .p-header-inner { padding: 0 1rem; }
          .p-page { padding: 0 1rem 3rem; }
          .p-hero { padding: 2rem 0 1.5rem; }
          .p-folder-grid { grid-template-columns: repeat(2, 1fr); }
          .p-dialog { max-width: 100%; }
          .hide-mobile { display: none; }
        }
      `}</style>

      <div className="portal-root" {...getRootProps()}>
        <input {...getInputProps()} />

        {/* Drag overlay */}
        {isDragActive && isAdmin && (
          <div className="p-drag-overlay">
            <div className="p-drag-content">
              <Upload className="p-drag-icon" />
              <p className="p-drag-title">Suelta para subir</p>
              <p className="p-drag-sub">
                → {currentFolder?.name ?? "Portafolio"}
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="p-header">
          <div className="p-header-inner">
            {/* Logo + Breadcrumb */}
            <div className="flex items-center gap-4 min-w-0 flex-1 overflow-hidden">
              <span className="p-logo serif">
                ARCH<span>.</span>FOLIO
              </span>
              <div className="p-bread">
                <div className="w-px h-4 bg-white/10 flex-shrink-0" />
                <button className={cn("p-bread-btn", breadcrumbs.length === 0 && "active")} onClick={() => goTo(-1)}>
                  Inicio
                </button>
                {breadcrumbs.map((b, i) => (
                  <span key={b.id} className="flex items-center gap-0.5 min-w-0">
                    <ChevronRight className="p-bread-sep w-3 h-3 flex-shrink-0" />
                    <button
                      onClick={() => goTo(i)}
                      className={cn("p-bread-btn truncate max-w-[120px]", i === breadcrumbs.length - 1 && "active")}
                    >
                      {b.name}
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-nav-actions">
              {user && !isAdmin && (
                <span className="flex items-center gap-1.5" style={{ fontSize: "0.65rem", letterSpacing: "0.12em", color: "var(--dim)", textTransform: "uppercase" }}>
                  <Lock className="w-3 h-3" /> Lectura
                </span>
              )}
              {user ? (
                <button className="btn-ghost" onClick={signOut}>
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hide-mobile">Salir</span>
                </button>
              ) : (
                <button className="btn-ghost" onClick={() => setAuthOpen(true)}>
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hide-mobile">Acceder</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page */}
        <div className="p-page">
          {/* Hero */}
          <div className="p-hero">
            <div>
              <h1 className="p-hero-title serif">
                {currentFolder
                  ? <>{currentFolder.name}</>
                  : <>Port<em>afolio</em></>}
              </h1>
              {!isAdmin && !user && breadcrumbs.length === 0 && (
                <p className="p-hero-sub">Una colección visual.</p>
              )}
            </div>
            {(folders.length > 0 || photos.length > 0) && (
              <div className="p-hero-count">
                <strong>{folders.length + photos.length}</strong>
                {folders.length > 0 && photos.length > 0
                  ? `${folders.length} carpeta${folders.length !== 1 ? "s" : ""}, ${photos.length} foto${photos.length !== 1 ? "s" : ""}`
                  : folders.length > 0
                  ? `carpeta${folders.length !== 1 ? "s" : ""}`
                  : `foto${photos.length !== 1 ? "s" : ""}`}
              </div>
            )}
          </div>

          {/* Toolbar */}
          {isAdmin && (
            <div className="p-toolbar">
              {selectMode ? (
                <div className="p-toolbar-left">
                  <span className="p-select-info">{selectedPhotos.size} seleccionada(s)</span>
                  <button className="btn-ghost" onClick={selectAll}>
                    {selectedPhotos.size === photos.length && photos.length > 0
                      ? <CheckSquare className="w-3.5 h-3.5" />
                      : <Square className="w-3.5 h-3.5" />}
                    {selectedPhotos.size === photos.length && photos.length > 0 ? "Ninguna" : "Todas"}
                  </button>
                  <button className="btn-danger" onClick={deleteSelected} disabled={!selectedPhotos.size}>
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
                  </button>
                  <button className="btn-icon" onClick={() => { setSelectMode(false); setSelectedPhotos(new Set()); }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="p-toolbar-left">
                  {photos.length > 0 && (
                    <button className="btn-ghost" onClick={() => setSelectMode(true)}>
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span className="hide-mobile">Seleccionar</span>
                    </button>
                  )}
                  <button className="btn-ghost" onClick={() => setNewFolderOpen(true)}>
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span className="hide-mobile">Nueva carpeta</span>
                  </button>
                  <button className="btn-primary" onClick={openFilePicker}>
                    <Upload className="w-3.5 h-3.5" />
                    <span className="hide-mobile">Subir fotos</span>
                  </button>
                </div>
              )}
              {!selectMode && photos.length > 0 && (
                <div className="p-toolbar-right">
                  <button className={cn("btn-icon", !gridDense && "active")} onClick={() => setGridDense(false)} title="Grid normal">
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button className={cn("btn-icon", gridDense && "active")} onClick={() => setGridDense(true)} title="Grid denso">
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "6rem 0" }}>
              <div style={{ width: 32, height: 32, border: "1px solid rgba(200,184,154,0.15)", borderTopColor: "var(--col)", borderRadius: "50%" }}
                className="animate-spin" />
            </div>
          ) : isEmpty ? (
            <div className={cn("p-empty", isAdmin && "clickable")} onClick={isAdmin ? openFilePicker : undefined}>
              <ImageIcon className="p-empty-icon w-10 h-10" />
              <p className="p-empty-title serif">
                {isAdmin ? "Comenzar el portafolio" : "Sin contenido todavía"}
              </p>
              <p className="p-empty-sub">
                {isAdmin ? "Arrastrá fotos aquí o tocá para subir" : "Volvé pronto."}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
              {/* Folders */}
              {folders.length > 0 && (
                <section className="p-folders">
                  <p className="p-section-label">Carpetas</p>
                  <div className="p-folder-grid">
                    {folders.map((f) => (
                      <div key={f.id} style={{ position: "relative" }}>
                        <button className="p-folder-card" onClick={() => enter(f)}>
                          <Folder className="p-folder-icon" strokeWidth={1} />
                          <span className="p-folder-name">{f.name}</span>
                          <ArrowUpRight className="p-folder-arrow w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button
                            className="p-folder-delete"
                            onClick={(e) => { e.stopPropagation(); deleteFolder(f); }}
                            aria-label="Eliminar carpeta"
                          >
                            <Trash2 style={{ width: 13, height: 13 }} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Photos */}
              {photos.length > 0 && (
                <section className="p-photos">
                  <p className="p-section-label">Fotografías</p>
                  <div className={cn("p-photo-grid", gridDense ? "grid-dense" : "grid-normal")}>
                    {photos.map((p, idx) => {
                      const url = publicUrl(p.storage_path);
                      const isSelected = selectedPhotos.has(p.id);
                      return (
                        <div
                          key={p.id}
                          className={cn(
                            "p-photo-card",
                            selectMode && isAdmin && "select-mode",
                            isSelected && "selected"
                          )}
                          onClick={() => selectMode && isAdmin ? togglePhoto(p.id) : setViewerIndex(idx)}
                        >
                          <img src={url} alt={p.title ?? ""} loading="lazy" />
                          <div className="p-photo-overlay" />
                          {p.title && <span className="p-photo-title">{p.title}</span>}
                          {isAdmin && selectMode && (
                            <div className={cn("p-photo-check", isSelected && "checked")}>
                              {isSelected && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#080808" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
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
        </div>

        {/* ── New folder dialog ── */}
        {newFolderOpen && (
          <div className="p-dialog-overlay" onClick={(e) => e.target === e.currentTarget && setNewFolderOpen(false)}>
            <div className="p-dialog">
              <div className="p-dialog-header">
                <h2 className="p-dialog-title serif">Nueva carpeta</h2>
              </div>
              <div className="p-dialog-body">
                <input
                  className="p-input"
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createFolder()}
                  placeholder="Nombre de la carpeta"
                />
              </div>
              <div className="p-dialog-footer">
                <button className="btn-ghost" onClick={() => setNewFolderOpen(false)}>Cancelar</button>
                <button className="btn-primary" onClick={createFolder}>Crear</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Upload queue dialog ── */}
        {uploadOpen && (
          <div className="p-dialog-overlay" onClick={(e) => e.target === e.currentTarget && closeUploadDialog()}>
            <div className="p-dialog p-upload-dialog">
              <div className="p-dialog-header">
                <h2 className="p-dialog-title serif">
                  Subir {uploadQueue.length} archivo{uploadQueue.length !== 1 ? "s" : ""}
                </h2>
              </div>
              <div className="p-upload-list">
                {uploadQueue.map((item) => (
                  <div key={item.id} className="p-upload-item">
                    <img src={item.preview} alt="" className="p-upload-thumb" />
                    <div className="p-upload-info">
                      <p className="p-upload-name">{item.file.name}</p>
                      <p className="p-upload-size">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                      {item.status !== "pending" && (
                        <div className="p-upload-bar-wrap">
                          <div
                            className={cn("p-upload-bar", item.status === "error" && "error")}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}
                      {item.error && (
                        <p style={{ fontSize: "0.65rem", color: "#e07070", marginTop: "0.25rem" }}>{item.error}</p>
                      )}
                    </div>
                    {item.status === "pending" && (
                      <button className="p-upload-remove" onClick={() => removeFromQueue(item.id)}>
                        <X style={{ width: 14, height: 14 }} />
                      </button>
                    )}
                    {item.status === "uploading" && (
                      <Loader2 style={{ width: 14, height: 14, color: "var(--col)" }} className="animate-spin flex-shrink-0" />
                    )}
                    {item.status === "done" && (
                      <span className="p-upload-status">✓</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-dialog-footer">
                <button className="btn-ghost" onClick={closeUploadDialog}>
                  {uploadQueue.every((x) => x.status === "done" || x.status === "error") ? "Cerrar" : "Cancelar"}
                </button>
                <button
                  className="btn-primary"
                  onClick={startUploads}
                  disabled={!uploadQueue.some((x) => x.status === "pending")}
                  style={{ opacity: uploadQueue.some((x) => x.status === "pending") ? 1 : 0.4 }}
                >
                  Subir todas
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Auth dialog — unchanged component */}
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />

        {/* Photo viewer — unchanged component */}
        {viewerIndex !== null && photoUrls.length > 0 && (
          <PhotoViewer
            urls={photoUrls}
            index={viewerIndex}
            onClose={() => setViewerIndex(null)}
            onIndex={setViewerIndex}
          />
        )}
      </div>
    </>
  );
}
