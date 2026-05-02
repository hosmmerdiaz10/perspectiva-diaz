import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import PortalApp from "@/components/portal/PortalApp";
import { Loader2, Lock, ShieldAlert } from "lucide-react";

export default function Portal() {
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user) return <PortalApp />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email.trim().toLowerCase(), password);
    setBusy(false);
    if (error) {
      toast.error("Credenciales inválidas o correo no autorizado.");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex w-14 h-14 rounded-full bg-secondary items-center justify-center mb-5 shadow-sm">
            <Lock className="w-6 h-6 text-foreground" />
          </div>
          <h1 className="font-serif text-3xl tracking-tight">Portal privado</h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Acceso restringido por invitación.<br />
            Solo correos autorizados pueden entrar.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Entrar
          </Button>
        </form>

        <div className="mt-8 flex items-start gap-2 text-xs text-muted-foreground bg-secondary/50 border border-border rounded-md px-3 py-2.5">
          <ShieldAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>El registro está cerrado. Si necesitas acceso, contacta al administrador.</span>
        </div>
      </div>
    </div>
  );
}
