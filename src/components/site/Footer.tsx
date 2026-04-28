import { Wordmark } from "./Logo";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export const Footer = () => (
  <footer id="contacto" className="bg-foreground text-background pt-24 pb-10 px-6 lg:px-10">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-12 gap-12 pb-16 border-b border-background/15">
        <div className="md:col-span-5">
          <div className="text-background"><Wordmark /></div>
          <p className="mt-8 font-serif font-light text-3xl md:text-4xl leading-[1.15] max-w-md">
            Diseñamos espacios que <span className="italic-serif">cuentan historias</span> y perduran en el tiempo.
          </p>
          <p className="mt-6 text-sm text-background/60 max-w-sm leading-relaxed">
            Estudio de arquitectura y diseño interior con base en Guacara, Carabobo. Trabajamos en todo
            el territorio venezolano y proyectos remotos.
          </p>
        </div>

        <div className="md:col-span-3 md:col-start-7">
          <p className="text-[10px] tracking-[0.4em] uppercase text-background/50 mb-5">Contacto</p>
          <ul className="space-y-3 text-sm">
            <li><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="link-underline">WhatsApp</a></li>
            <li><a href="mailto:perspectiva.diaz2@gmail.com" className="link-underline">perspectiva.diaz2@gmail.com</a></li>
            <li className="text-background/60">Guacara · Valencia</li>
            <li className="text-background/60">Venezuela</li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-[10px] tracking-[0.4em] uppercase text-background/50 mb-5">Navegación</p>
          <ul className="space-y-3 text-sm">
            <li><a href="#servicios" className="link-underline">Servicios</a></li>
            <li><a href="#proyectos" className="link-underline">Proyectos</a></li>
            <li><a href="#cotizar" className="link-underline">Cotizar</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-[10px] tracking-[0.3em] uppercase text-background/50">
        <span>© {new Date().getFullYear()} Perspectiva Díaz. Todos los derechos reservados.</span>
        <span>Arquitectura · Diseño · Espacio</span>
      </div>
    </div>
  </footer>
);
