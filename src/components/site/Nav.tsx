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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@200;300;400&display=swap');

        :root {
          --rose: #e8c4b8;
          --rose-soft: #f2ddd6;
          --rose-dim: rgba(232,196,184,0.35);
          --ink: #f5f0ee;
          --dim: rgba(245,240,238,0.4);
          --line: rgba(245,240,238,0.08);
          --bg: #111010;
          --glass: rgba(245,240,238,0.03);
        }

        body { background: var(--bg); }

        .nav-root {
          position: fixed; top: 0; inset-x: 0; z-index: 50;
          transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
          font-family: 'DM Sans', sans-serif;
        }
        .nav-root.scrolled {
          background: rgba(17,16,16,0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--line);
        }
        .nav-inner {
          max-width: 1400px; margin: 0 auto;
          padding: 0 2.5rem;
          height: 72px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo { color: var(--ink); text-decoration: none; }

        .nav-links {
          display: flex; align-items: center; gap: 3rem;
          list-style: none; margin: 0; padding: 0;
        }
        .nav-link {
          font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase;
          color: var(--dim); text-decoration: none; font-weight: 300;
          position: relative; transition: color 0.3s; padding-bottom: 2px;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: -2px; left: 0; right: 0;
          height: 1px; background: var(--rose);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-link:hover { color: var(--ink); }
        .nav-link:hover::after { transform: scaleX(1); }

        .nav-cta {
          font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase;
          border: 1px solid rgba(232,196,184,0.3); color: var(--rose);
          padding: 0.6rem 1.4rem; text-decoration: none; font-weight: 300;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s; position: relative; overflow: hidden;
        }
        .nav-cta::before {
          content: ''; position: absolute; inset: 0;
          background: var(--rose); transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-cta:hover { color: var(--bg); border-color: var(--rose); }
        .nav-cta:hover::before { transform: translateX(0); }
        .nav-cta span { position: relative; z-index: 1; }

        /* Mobile menu button */
        .nav-burger {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 4px;
        }
        .nav-burger span {
          display: block; width: 22px; height: 1px;
          background: var(--dim); transition: all 0.3s;
        }

        @media (max-width: 768px) {
          .nav-links, .nav-cta { display: none; }
          .nav-burger { display: flex; }
          .nav-inner { padding: 0 1.25rem; }
        }
      `}</style>

      <header className={`nav-root${scrolled ? " scrolled" : ""}`}>
        <nav className="nav-inner">
          <a href="#top" className="nav-logo">
            <Wordmark />
          </a>

          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="nav-link">{l.label}</a>
              </li>
            ))}
          </ul>

          <a href="#cotizar" className="nav-cta">
            <span>Cotizar</span>
          </a>

          <button className="nav-burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
            <span style={{ transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "" }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "" }} />
          </button>
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div style={{
            background: "rgba(17,16,16,0.97)", borderTop: "1px solid var(--line)",
            padding: "1.5rem 1.25rem 2rem",
          }}>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block", padding: "0.9rem 0",
                  fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase",
                  color: "var(--dim)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 300, borderBottom: "1px solid var(--line)",
                }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#cotizar"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "inline-block", marginTop: "1.25rem",
                fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase",
                border: "1px solid rgba(232,196,184,0.3)", color: "var(--rose)",
                padding: "0.7rem 1.4rem", textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
              }}
            >
              Cotizar
            </a>
          </div>
        )}
      </header>
    </>
  );
};
