import { useState } from "react";
import { SERVICES, type Service } from "@/data/site";
import { ServicePortfolioDialog } from "./ServicePortfolioDialog";

export const Services = () => {
  const [active, setActive] = useState<Service | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="servicios" className="svc-root">
      <style>{`
        .svc-root {
          padding: 8rem 0;
          font-family: 'DM Sans', sans-serif;
          background: var(--bg, #111010);
          position: relative;
          overflow: hidden;
        }

        /* Ambient rose glow */
        .svc-root::before {
          content: '';
          position: absolute; top: -200px; right: -200px;
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(232,196,184,0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .svc-inner {
          max-width: 1400px; margin: 0 auto; padding: 0 2.5rem;
          position: relative;
        }

        /* Header */
        .svc-header {
          display: grid; grid-template-columns: 5fr 7fr;
          gap: 3rem; align-items: end;
          margin-bottom: 5rem;
        }
        .svc-eyebrow {
          font-size: 0.62rem; letter-spacing: 0.4em; text-transform: uppercase;
          color: var(--rose, #e8c4b8); font-weight: 300; margin-bottom: 1.5rem;
          display: flex; align-items: center; gap: 1rem;
        }
        .svc-eyebrow::before {
          content: ''; width: 28px; height: 1px;
          background: rgba(232,196,184,0.35);
        }
        .svc-h2 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: clamp(2.8rem, 4vw, 3.8rem);
          line-height: 1; color: var(--ink, #f5f0ee);
          letter-spacing: -0.01em;
        }
        .svc-h2 em { font-style: italic; color: var(--rose-soft, #f2ddd6); }
        .svc-header-desc {
          font-size: 0.85rem; color: var(--dim, rgba(245,240,238,0.4));
          line-height: 1.8; font-weight: 300; align-self: end;
          padding-bottom: 0.25rem; max-width: 480px;
        }

        /* Service list */
        .svc-list {
          border-top: 1px solid var(--line, rgba(245,240,238,0.08));
        }
        .svc-item {
          width: 100%; display: grid;
          grid-template-columns: 56px 1fr auto auto;
          gap: 2.5rem; align-items: center;
          padding: 2.75rem 0;
          border-bottom: 1px solid var(--line, rgba(245,240,238,0.08));
          background: none; border-left: none; border-right: none;
          text-align: left; cursor: pointer;
          position: relative;
          transition: padding 0.5s cubic-bezier(0.16,1,0.3,1), background 0.4s;
        }
        .svc-item:hover {
          padding-left: 1rem;
          background: rgba(232,196,184,0.02);
        }

        /* Left accent */
        .svc-item::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 1px;
          background: var(--rose, #e8c4b8);
          transform: scaleY(0); transform-origin: bottom;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .svc-item:hover::before { transform: scaleY(1); }

        .svc-num {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic; font-size: 1.1rem; font-weight: 300;
          color: var(--rose, #e8c4b8); letter-spacing: 0.05em;
        }

        .svc-main { }
        .svc-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300; font-size: clamp(1.8rem, 2.5vw, 2.4rem);
          line-height: 1.1; color: var(--ink, #f5f0ee);
          letter-spacing: -0.01em; transition: color 0.3s;
        }
        .svc-item:hover .svc-title { color: var(--rose-soft, #f2ddd6); }
        .svc-desc {
          margin-top: 0.6rem;
          font-size: 0.78rem; color: var(--dim, rgba(245,240,238,0.4));
          line-height: 1.65; font-weight: 300; max-width: 480px;
        }

        .svc-tag {
          font-size: 0.6rem; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--dim, rgba(245,240,238,0.4)); font-weight: 300;
          white-space: nowrap;
        }

        .svc-cta-btn {
          font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--rose, #e8c4b8); font-weight: 300;
          display: flex; align-items: center; gap: 0.5rem;
          white-space: nowrap; transition: gap 0.3s;
        }
        .svc-item:hover .svc-cta-btn { gap: 0.9rem; }
        .svc-cta-btn::after {
          content: ''; display: block; width: 20px; height: 1px;
          background: var(--rose, #e8c4b8); transition: width 0.3s;
        }
        .svc-item:hover .svc-cta-btn::after { width: 32px; }

        @media (max-width: 900px) {
          .svc-header { grid-template-columns: 1fr; }
          .svc-item { grid-template-columns: 44px 1fr; gap: 1.25rem; }
          .svc-tag, .svc-cta-btn { display: none; }
        }
        @media (max-width: 640px) {
          .svc-root { padding: 5rem 0; }
          .svc-inner { padding: 0 1.25rem; }
          .svc-header { margin-bottom: 3rem; }
          .svc-item { padding: 2rem 0; }
          .svc-item:hover { padding-left: 0.5rem; }
        }
      `}</style>

      <div className="svc-inner">
        {/* Header */}
        <div className="svc-header">
          <div>
            <p className="svc-eyebrow">Nuestros Servicios</p>
            <h2 className="svc-h2">
              Lo que <em>construimos</em><br />juntos
            </h2>
          </div>
          <p className="svc-header-desc">
            Cada proyecto nace de una conversación profunda sobre el espacio, la vida y los sueños
            de quienes lo habitarán. Ofrecemos un servicio integral desde el concepto hasta la entrega final.
          </p>
        </div>

        {/* List */}
        <ul className="svc-list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {SERVICES.map((s) => (
            <li key={s.id}>
              <button
                className="svc-item"
                onClick={() => setActive(s)}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="svc-num">{s.number}</span>
                <div className="svc-main">
                  <h3 className="svc-title">{s.title}</h3>
                  <p className="svc-desc">{s.description}</p>
                </div>
                <span className="svc-tag">{s.tag}</span>
                <span className="svc-cta-btn">Portafolio</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ServicePortfolioDialog service={active} onClose={() => setActive(null)} />
    </section>
  );
};
