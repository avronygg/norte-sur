import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoVariant = "color" | "white" | "black";

const SRC: Record<LogoVariant, string> = {
  color: "/brand/logo.png", // solo navbar
  white: "/brand/logo-blanco.png", // fondos oscuros (footer, secciones color)
  black: "/brand/logo-negro.png", // fondos claros sin color
};

/**
 * Logo oficial Norte Sur (variantes color/blanco/negro).
 * `height` controla el tamaño; el ancho se ajusta por proporción (~2.18:1).
 */
export function Logo({
  className,
  height = 40,
  variant = "color",
}: {
  className?: string;
  height?: number;
  variant?: LogoVariant;
}) {
  const width = Math.round(height * 2.18);
  return (
    <Image
      src={SRC[variant]}
      alt="Norte Sur · Grupo Industrial"
      width={width}
      height={height}
      priority
      className={cn("select-none", className)}
      style={{ height: `${height}px`, width: "auto" }}
    />
  );
}
