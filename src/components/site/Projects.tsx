import { PROJECTS } from "@/data/site";

export const Projects = () => (
  <section id="proyectos" className="proj-root">
    <style>{`
      .proj-root {
        padding: 8rem 0;
        font-family: 'DM Sans', sans-serif;
        background: var(--bg, #111010);
        position: relative;
      }

      /* Section header */
      .proj-header {
        max-width: 1400px; margin: 0 auto;
        padding: 0 2.5rem;
        display: grid; grid-template-columns: 1fr 1fr;
        align-items: end; gap: 2rem;
        margin-bottom: 5rem;
      }
      .proj-eyebrow {
        font-size: 0.62rem; letter-spacing: 0.4em; text-transform: uppercase;
        color: var(--rose, #e8c4b8); font-weight: 300; margin-bottom: 1.5rem;
        display: flex; align-items: center; gap: 1rem;
      }
      .proj-eyebrow::before {
        content: ''; width: 28px; height: 1px;
        background: rgba(232,196,184,0.35);
      }
      .proj-h2 {
        font-family: 'Cormorant Garamond', serif;
        font-weight: 300; font-size: clamp(2.8rem, 4.5vw, 4rem);
        line-height: 1; color: var(--ink, #f5f0ee);
        letter-spacing: -0.01em;
      }
      .proj-h2 em { font-style: italic; color: var(--rose-soft, #f2ddd6); }
      .proj-header-desc {
        font-size: 0.85rem; color: var(--dim, rgba(245,240,238,0.4));
        line-height: 1.75; font-weight: 300;
        align-self: end; padding-bottom: 0.4rem;
      }

      /* Divider */
      .proj-divider {
        max-width: 1400px; margin: 0 auto;
        padding: 0 2.5rem; margin-bottom: 4rem;
      }
      .proj-divider hr { border: none; border-top: 1px solid var(--line, rgba(245,240,238,0.08)); }

      /* Project list — cinematic stacked layout */
      .proj-list {
        max-width: 1400px; margin: 0 auto;
        padding: 0 2.5rem;
        display: flex; flex-direction: column;
        gap: 0;
      }

      .proj-item {
        display: grid;
        grid-template-columns: 80px 1fr 1fr;
        gap: 3rem; align-items: center;
        padding: 3.5rem 0;
        border-bottom: 1px solid var(--line, rgba(245,240,238,0.08));
        cursor: pointer; position: relative;
        transition: padding 0.5s cubic-bezier(0.16,1,0.3,1);
        text-decoration: none; color: inherit;
      }
      .proj-item:first-child { border-top: 1px solid var(--line, rgba(245,240,238,0.08)); }
      .proj-item:hover { padding-left: 1.5rem; }

      /* Hover accent line */
      .proj-item::before {
        content: ''; position: absolute; left: 0; top: 0; bottom: 0;
        width: 1px; background: var(--rose, #e8c4b8);
        transform: scaleY(0); transform-origin: bottom;
        transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
      }
      .proj-item:hover::before { transform: scaleY(1); }

      .proj-num {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1rem; font-weight: 300; color: var(--rose, #e8c4b8);
        font-style: italic; letter-spacing: 0.05em;
      }

      .proj-info { }
      .proj-category {
        font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase;
        color: var(--rose, #e8c4b8); font-weight: 300; margin-bottom: 0.75rem;
        opacity: 0.7;
      }
      .proj-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(1.6rem, 2.5vw, 2.2rem); font-weight: 300;
        color: var(--ink, #f5f0ee); line-height: 1.1; letter-spacing: -0.01em;
        transition: color 0.3s;
      }
      .proj-item:hover .proj-title { color: var(--rose-soft, #f2ddd6); }
      .proj-meta {
        margin-top: 0.6rem;
        font-size: 0.72rem; color: var(--dim, rgba(245,240,238,0.4));
        display: flex; gap: 1rem; font-weight: 300;
      }
      .proj-desc {
        font-size: 0.8rem; color: var(--dim, rgba(245,240,238,0.4));
        line-height: 1.7; font-weight: 300; margin-top: 0.75rem;
        max-width: 380px;
      }

      /* Cover image on the right */
      .proj-cover {
        aspect-ratio: 16/10; overflow: hidden; position: relative;
        background: rgba(245,240,238,0.04);
      }
      .proj-cover img {
        width: 100%; height: 100%; object-fit: cover;
        transition: transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.5s;
        filter: saturate(0.75) brightness(0.85);
      }
      .proj-item:hover .proj-cover img {
        transform: scale(1.05);
        filter: saturate(0.9) brightness(0.95);
      }
      .proj-cover-placeholder {
        width: 100%; height: 100%;
        display: flex; align-items: center; justify-content: center;
        font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase;
        color: var(--dim, rgba(245,240,238,0.4));
        background: linear-gradient(135deg, rgba(232,196,184,0.05), rgba(245,240,238,0.02));
      }
      /* Subtle rose tint overlay on cover */
      .proj-cover::after {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(135deg, rgba(232,196,184,0.08) 0%, transparent 60%);
        pointer-events: none;
      }

      .proj-arrow {
        position: absolute; right: 0; top: 50%; transform: translateY(-50%);
        font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase;
        color: var(--rose, #e8c4b8); opacity: 0;
        transition: opacity 0.3s, right 0.4s cubic-bezier(0.16,1,0.3,1);
        font-family: 'DM Sans', sans-serif; font-weight: 300;
      }
      .proj-item:hover .proj-arrow { opacity: 1; right: 0; }

      /* View all CTA */
      .proj-cta {
        max-width: 1400px; margin: 4rem auto 0;
        padding: 0 2.5rem;
        display: flex; justify-content: flex-end;
      }
      .proj-cta-link {
        font-size: 0.65rem; letter-spacing: 0.28em; text-transform: uppercase;
        color: var(--rose, #e8c4b8); text-decoration: none; font-weight: 300;
        display: flex; align-items: center; gap: 1rem;
        transition: gap 0.3s;
      }
      .proj-cta-link::after {
        content: ''; width: 40px; height: 1px;
        background: var(--rose, #e8c4b8); opacity: 0.4;
        transition: width 0.3s;
      }
      .proj-cta-link:hover { gap: 1.5rem; }
      .proj-cta-link:hover::after { width: 60px; opacity: 0.7; }

      @media (max-width: 900px) {
        .proj-header { grid-template-columns: 1fr; }
        .proj-item { grid-template-columns: 48px 1fr; gap: 1.5rem; }
        .proj-cover { display: none; }
        .proj-item:hover { padding-left: 0.75rem; }
      }
      @media (max-width: 640px) {
        .proj-root { padding: 5rem 0; }
        .proj-header { padding: 0 1.25rem; margin-bottom: 3rem; }
        .proj-list { padding: 0 1.25rem; }
        .proj-divider { padding: 0 1.25rem; }
        .proj-cta { padding: 0 1.25rem; }
        .proj-item { grid-template-columns: 1fr; gap: 0.75rem; padding: 2.5rem 0; }
        .proj-num { font-size: 0.8rem; }
      }
    `}</style>

    {/* Header */}
    <div className="proj-header">
      <div>
        <p className="proj-eyebrow">Proyectos Seleccionados</p>
        <h2 className="proj-h2">
          Obra <em>reciente</em>
        </h2>
      </div>
      <p className="proj-header-desc">
        Una selección de proyectos donde la materialidad y la luz construyen la atmósfera del lugar.
      </p>
    </div>

    <div className="proj-divider"><hr /></div>

    {/* Project list */}
    <div id="portafolio" className="proj-list">
      {PROJECTS.map((p, i) => (
        <div key={p.id} className="proj-item">
          <span className="proj-num">0{i + 1}</span>

          <div className="proj-info">
            <p className="proj-category">{p.category}</p>
            <h3 className="proj-title">{p.title}</h3>
            <div className="proj-meta">
              <span>{p.location}</span>
              {p.area && <span>{p.area}</span>}
              {p.year && <span>{p.year}</span>}
            </div>
            <p className="proj-desc">{p.description}</p>
          </div>

          <div className="proj-cover">
            {p.image ? (
              <img src={p.image} alt={p.title} loading="lazy" />
            ) : (
              <div className="proj-cover-placeholder">Imagen próximamente</div>
            )}
          </div>

          <span className="proj-arrow">Ver proyecto →</span>
        </div>
      ))}
    </div>

    {/* CTA */}
    <div className="proj-cta">
      <a href="#portafolio" className="proj-cta-link">Ver portafolio completo</a>
    </div>
  </section>
);
