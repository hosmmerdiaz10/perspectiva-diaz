import heroImg from "@/assets/hero-architecture.jpg";

export const Hero = () => (
  <section id="top" className="hero-root">
    <style>{`
      .hero-root {
        position: relative;
        min-height: 100svh;
        display: flex; flex-direction: column; justify-content: flex-end;
        padding-bottom: 6rem; padding-top: 8rem;
        overflow: hidden;
        font-family: 'DM Sans', sans-serif;
      }
      .hero-bg {
        position: absolute; inset: 0;
        width: 100%; height: 100%; object-fit: cover;
        opacity: 0.22;
        filter: saturate(0.6);
      }
      .hero-gradient {
        position: absolute; inset: 0;
        background: linear-gradient(
          to bottom,
          rgba(17,16,16,0.5) 0%,
          rgba(17,16,16,0.1) 40%,
          rgba(17,16,16,0.85) 80%,
          rgba(17,16,16,1) 100%
        );
      }
      /* Subtle grain overlay */
      .hero-grain {
        position: absolute; inset: 0; pointer-events: none; opacity: 0.03;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        background-size: 200px;
      }

      .hero-content {
        position: relative;
        max-width: 1400px; margin: 0 auto; width: 100%;
        padding: 0 2.5rem;
      }
      .hero-eyebrow {
        font-size: 0.62rem; letter-spacing: 0.4em; text-transform: uppercase;
        color: var(--rose); font-weight: 300; margin-bottom: 2.5rem;
        display: flex; align-items: center; gap: 1rem;
      }
      .hero-eyebrow::before {
        content: ''; display: block; width: 32px; height: 1px; background: var(--rose-dim);
      }
      .hero-h1 {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-weight: 300; line-height: 0.92;
        font-size: clamp(3.5rem, 8vw, 7.5rem);
        color: var(--ink); letter-spacing: -0.01em;
        max-width: 900px;
      }
      .hero-h1 em {
        font-style: italic; color: var(--rose-soft);
      }
      .hero-body {
        margin-top: 2.5rem; max-width: 380px;
        font-size: 0.88rem; line-height: 1.75;
        color: var(--dim); font-weight: 300;
      }
      .hero-actions {
        margin-top: 3rem;
        display: flex; flex-wrap: wrap; align-items: center; gap: 2rem;
      }
      .hero-link-outline {
        font-size: 0.62rem; letter-spacing: 0.35em; text-transform: uppercase;
        color: var(--ink); text-decoration: none; font-weight: 300;
        padding-bottom: 4px; border-bottom: 1px solid rgba(245,240,238,0.3);
        transition: color 0.3s, border-color 0.3s;
      }
      .hero-link-outline:hover { color: var(--rose); border-color: var(--rose); }

      .hero-link-fill {
        font-size: 0.62rem; letter-spacing: 0.32em; text-transform: uppercase;
        background: var(--rose); color: #111010; font-weight: 400;
        padding: 0.9rem 2rem; text-decoration: none;
        transition: background 0.3s, transform 0.3s;
        font-family: 'DM Sans', sans-serif;
      }
      .hero-link-fill:hover { background: var(--rose-soft); transform: translateY(-2px); }

      /* Side scroll indicator */
      .hero-scroll {
        position: absolute; right: 2.5rem; bottom: 2.5rem;
        display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
        font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase;
        color: var(--dim); font-family: 'DM Sans', sans-serif; font-weight: 300;
        writing-mode: vertical-rl;
      }
      .hero-scroll-line {
        width: 1px; height: 48px;
        background: linear-gradient(to bottom, var(--rose-dim), transparent);
        animation: scrollPulse 2s ease-in-out infinite;
      }
      @keyframes scrollPulse {
        0%, 100% { opacity: 0.4; transform: scaleY(1); }
        50% { opacity: 1; transform: scaleY(1.15); }
      }

      /* Counter row */
      .hero-stats {
        position: absolute; left: 2.5rem; bottom: 2.5rem;
        display: flex; gap: 3rem;
      }
      .hero-stat-num {
        font-family: 'Cormorant Garamond', serif;
        font-size: 2rem; font-weight: 300; color: var(--rose-soft);
        line-height: 1;
      }
      .hero-stat-label {
        font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase;
        color: var(--dim); margin-top: 0.2rem; font-weight: 300;
      }

      @media (max-width: 640px) {
        .hero-content { padding: 0 1.25rem; }
        .hero-stats { display: none; }
        .hero-scroll { display: none; }
        .hero-root { padding-bottom: 4rem; }
      }
    `}</style>

    <img src={heroImg} alt="Interior arquitectónico" className="hero-bg" />
    <div className="hero-gradient" />
    <div className="hero-grain" />

    <div className="hero-content">
      <p className="hero-eyebrow">Arquitectura · Diseño · Espacio</p>
      <h1 className="hero-h1">
        Espacios que<br />
        <em>trascienden</em><br />
        lo ordinario
      </h1>
      <p className="hero-body">
        Creamos arquitectura que responde a la naturaleza del lugar, la luz y las personas que lo habitan.
        Guacara · Valencia · Venezuela.
      </p>
      <div className="hero-actions">
        <a href="#proyectos" className="hero-link-outline">Ver proyectos</a>
        <a href="#cotizar" className="hero-link-fill">Solicitar cotización</a>
      </div>
    </div>

    <div className="hero-stats">
      <div>
        <div className="hero-stat-num">12+</div>
        <div className="hero-stat-label">Años</div>
      </div>
      <div>
        <div className="hero-stat-num">80+</div>
        <div className="hero-stat-label">Proyectos</div>
      </div>
      <div>
        <div className="hero-stat-num">100%</div>
        <div className="hero-stat-label">Dedicación</div>
      </div>
    </div>

    <div className="hero-scroll">
      <div className="hero-scroll-line" />
      <span>Scroll</span>
    </div>
  </section>
);
