"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function LoginForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    initialError === "forbidden"
      ? "Esa cuenta no tiene permisos de administrador."
      : "",
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Correo</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-accent"
          placeholder="tu@correo.cl"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Contraseña</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-accent"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
      )}

      <Button type="submit" size="lg" variant="primary" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Ingresando…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" /> Iniciar sesión
          </>
        )}
      </Button>
    </form>
  );
}
