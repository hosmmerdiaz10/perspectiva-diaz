import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICES } from "@/data/site";
import { buildQuoteMessage, whatsappLink, type QuoteForm as QF } from "@/lib/whatsapp";
import { toast } from "@/hooks/use-toast";

const empty: QF = {
  nombre: "", email: "", telefono: "", servicio: "",
  tipoProyecto: "", ubicacion: "", area: "", presupuesto: "", mensaje: "",
};

export const QuoteForm = () => {
  const [form, setForm] = useState<QF>(empty);

  const link = useMemo(() => whatsappLink(buildQuoteMessage(form)), [form]);

  const update = (k: keyof QF) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.servicio || !form.mensaje) {
      toast({ title: "Faltan datos", description: "Completa al menos nombre, servicio y mensaje." });
      return;
    }
    window.open(link, "_blank");
  };

  return (
    <section id="cotizar" className="py-32 px-6 lg:px-10 border-t border-border/70">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
          <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-6">
            Solicitar Cotización
          </p>
          <h2 className="font-serif font-light text-4xl md:text-5xl leading-[1.05]">
            Conversemos sobre tu <span className="italic-serif">proyecto</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Completa el formulario y te llevaremos directo a WhatsApp con un mensaje listo para enviar.
            Respondemos en menos de 24 horas hábiles.
          </p>
          <ul className="mt-10 space-y-3 text-sm text-muted-foreground">
            <li>· Atención personalizada</li>
            <li>· Presupuesto sin compromiso</li>
            <li>· Visita técnica opcional</li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
          <Field label="Nombre completo *">
            <Input value={form.nombre} onChange={(e) => update("nombre")(e.target.value)} />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => update("email")(e.target.value)} />
          </Field>
          <Field label="Teléfono">
            <Input value={form.telefono} onChange={(e) => update("telefono")(e.target.value)} />
          </Field>
          <Field label="Ubicación">
            <Input value={form.ubicacion} onChange={(e) => update("ubicacion")(e.target.value)} placeholder="Ciudad, estado" />
          </Field>
          <Field label="Servicio *">
            <Select value={form.servicio} onValueChange={update("servicio")}>
              <SelectTrigger><SelectValue placeholder="Elige un servicio" /></SelectTrigger>
              <SelectContent>
                {SERVICES.map((s) => (
                  <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Tipo de proyecto">
            <Select value={form.tipoProyecto} onValueChange={update("tipoProyecto")}>
              <SelectTrigger><SelectValue placeholder="Obra nueva, remodelación..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Obra nueva">Obra nueva</SelectItem>
                <SelectItem value="Remodelación">Remodelación</SelectItem>
                <SelectItem value="Ampliación">Ampliación</SelectItem>
                <SelectItem value="Diseño únicamente">Diseño únicamente</SelectItem>
                <SelectItem value="Visualización 3D">Visualización 3D</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Área aproximada (m²)">
            <Input type="number" min="0" value={form.area} onChange={(e) => update("area")(e.target.value)} />
          </Field>
          <Field label="Presupuesto estimado (USD)">
            <Input value={form.presupuesto} onChange={(e) => update("presupuesto")(e.target.value)} placeholder="Opcional" />
          </Field>
          <Field label="Cuéntanos sobre tu proyecto *" className="sm:col-span-2">
            <Textarea
              rows={5}
              value={form.mensaje}
              onChange={(e) => update("mensaje")(e.target.value)}
              placeholder="Describe ideas, referencias, plazos..."
            />
          </Field>

          <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-2">
            <p className="text-xs text-muted-foreground">
              Al enviar abriremos WhatsApp con tu solicitud lista.
            </p>
            <button
              type="submit"
              className="text-[11px] tracking-[0.3em] uppercase bg-foreground text-background px-8 py-4 hover:bg-gold transition-colors"
            >
              Enviar por WhatsApp
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

const Field = ({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <Label className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{label}</Label>
    {children}
  </div>
);
