const items = [
  "Diseño Residencial",
  "Arquitectura Comercial",
  "Interiores",
  "Renders 3D",
  "Urbanismo",
  "Restauración",
];

export const Marquee = () => {
  const loop = [...items, ...items];
  return (
    <div className="border-y border-border/70 overflow-hidden bg-background py-8">
      <div className="flex marquee-track whitespace-nowrap">
        {loop.map((it, i) => (
          <span
            key={i}
            className="font-serif italic text-3xl md:text-4xl text-foreground/80 px-10 flex items-center gap-10"
          >
            {it}
            <span className="text-gold not-italic">·</span>
          </span>
        ))}
      </div>
    </div>
  );
};
