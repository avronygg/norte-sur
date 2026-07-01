"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, Warning, X } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error";
type Toast = { id: number; message: string; tone: ToastTone };

const ToastContext = createContext<(message: string, tone?: ToastTone) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

let counter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message: string, tone: ToastTone = "success") => {
      const id = ++counter;
      setToasts((prev) => [...prev, { id, message, tone }]);
      setTimeout(() => remove(id), 3500);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(92vw,22rem)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm shadow-lg backdrop-blur animate-[toast-in_.2s_ease-out]",
              t.tone === "success"
                ? "border-success/25 bg-success/[0.12] text-success"
                : "border-danger/25 bg-danger/[0.12] text-danger",
            )}
          >
            {t.tone === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <Warning className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span className="flex-1 font-medium text-ink">{t.message}</span>
            <button
              type="button"
              onClick={() => remove(t.id)}
              className="mt-0.5 text-ink-soft/60 transition-colors hover:text-ink"
              aria-label="Cerrar"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
