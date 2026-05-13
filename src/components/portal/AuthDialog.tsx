import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, Lock, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function AuthDialog({
  open, onOpenChange,
}: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const fn = mode === "signin" ? signIn : signUp;
    const { error } = await fn(email.trim().toLowerCase(), password);
    setBusy(false);
    if (error) {
      const msg = error.toLowerCase();
      if (msg.includes("autorizado") || msg.includes("not allowed") || msg.includes("database error")) {
        toast.error("Este correo no está autorizado para crear cuenta.");
      } else if (msg.includes("invalid") || msg.includes("credentials")) {
        toast.error("Credenciales inválidas.");
      } else {
        toast.error(error);
      }
    } else {
      if (mode === "signup") {
        toast.success("Cuenta creada. Bienvenido.");
      } else {
        toast.success("Sesión iniciada.");
      }
      onOpenChange(false);
      setEmail(""); setPassword("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-secondary grid place-items-center mb-2">
            <Lock className="w-5 h-5 text-foreground" />
          </div>
          <DialogTitle className="text-center font-serif text-2xl">
            {mode === "signin" ? "Acceso de administrador" : "Crear cuenta"}
          </DialogTitle>
          <DialogDescription className="text-center">
            Solo correos autorizados pueden acceder.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email" type="email" required autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password" type="password" required minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {mode === "signin" ? "Entrar" : "Crear cuenta"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="block w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "Primera vez — crear cuenta" : "Ya tengo cuenta — entrar"}
        </button>

        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/50 border border-border rounded-md px-3 py-2.5">
          <ShieldAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>Si tu correo no está en la lista de autorizados, no podrás registrarte.</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
