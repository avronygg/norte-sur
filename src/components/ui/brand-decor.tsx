import { cn } from "@/lib/utils";

/** Resplandor difuso con color de marca (para fondos de sección). */
export function BrandGlow({
  color = "accent",
  className,
}: {
  color?: "accent" | "primary";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none rounded-full blur-3xl",
        color === "accent" ? "bg-accent/25" : "bg-primary/20",
        className,
      )}
    />
  );
}

/** Motivo de olas del logo (azul + verde), como viñeta de marca. */
export function WaveMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 120"
      className={cn("pointer-events-none", className)}
      fill="none"
    >
      <path
        d="M10 72 C 52 30, 122 30, 192 56 C 130 50, 70 56, 10 72 Z"
        fill="var(--color-primary)"
      />
      <path
        d="M22 56 C 56 20, 112 20, 152 38 C 100 32, 60 42, 22 56 Z"
        fill="var(--color-accent)"
      />
    </svg>
  );
}
