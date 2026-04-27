import { useEffect } from "react";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Services } from "@/components/site/Services";
import { Projects } from "@/components/site/Projects";
import { QuoteForm } from "@/components/site/QuoteForm";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";

const Index = () => {
  useEffect(() => {
    document.title = "Perspectiva Díaz · Arquitectura y Diseño · Guacara, Venezuela";
    const desc = "Estudio de arquitectura y diseño en Guacara, Venezuela. Proyectos residenciales, comerciales, interiores y renders 3D. Cotiza por WhatsApp.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  return (
    <main className="bg-background text-foreground">
      <Nav />
      <Hero />
      <Marquee />
      <Services />
      <Projects />
      <QuoteForm />
      <Footer />
      <WhatsAppFab />
    </main>
  );
};

export default Index;
