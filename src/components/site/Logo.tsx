import logoImg from "@/assets/logo.jpeg";

interface Props { className?: string }

export const LogoMark = ({ className = "h-9 w-9" }: Props) => (
  <img
    src={logoImg}
    alt="Perspectiva Díaz"
    className={`${className} object-contain rounded-sm`}
  />
);

export const Wordmark = ({ className = "" }: Props) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <LogoMark />
    <span className="font-serif text-base tracking-[0.25em] uppercase">
      Perspectiva Díaz
    </span>
  </div>
);
