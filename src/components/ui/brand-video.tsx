"use client";

import { useRef, useState } from "react";
import { SpeakerHigh, SpeakerSlash } from "@/components/ui/icons";

/**
 * Video de fondo que se reproduce solo (silenciado, en loop) con un botón
 * para activar/silenciar el sonido. Pensado para llenar un marco con overflow.
 */
export function BrandVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  }

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
      </video>

      <button
        type="button"
        onClick={toggle}
        aria-label={muted ? "Activar sonido" : "Silenciar"}
        className="absolute bottom-3 right-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/65"
      >
        {muted ? <SpeakerSlash className="h-5 w-5" /> : <SpeakerHigh className="h-5 w-5" />}
      </button>
    </>
  );
}
