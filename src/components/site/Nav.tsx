import { useEffect, useState } from "react";
import { Wordmark } from "./Logo";

const links = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#portafolio", label: "Portafolio" },
  { href: "#contacto", label: "Contacto" },
];

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-md border-b border-border/60" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <a href="#top" className="text-foreground"><Wordmark /></a>
        <ul className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.3em] uppercase text-muted-foreground">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="link-underline hover:text-foreground transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#cotizar"
          className="hidden md:inline-block text-[11px] tracking-[0.3em] uppercase border border-foreground/40 px-5 py-3 hover:bg-foreground hover:text-background transition-colors"
        >
          Cotizar
        </a>
      </nav>
    </header>
  );
};
