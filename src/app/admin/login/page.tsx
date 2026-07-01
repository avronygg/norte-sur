import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/ui/logo";
import { LoginForm } from "@/components/admin/login-form";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Acceso administrador" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  // Si ya hay sesión válida, intenta entrar al panel.
  const user = await getUser();
  if (user && error !== "forbidden") redirect("/admin");

  return (
    <div className="grid min-h-screen place-items-center bg-paper-2 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo variant="color" height={48} />
        </div>
        <div className="rounded-3xl border border-line bg-surface p-8 shadow-sm">
          <h1 className="font-display text-2xl font-bold">Panel de administración</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Ingresa con tu cuenta para gestionar la tienda.
          </p>
          <div className="mt-6">
            <LoginForm initialError={error} />
          </div>
        </div>
        <div className="mt-5 text-center">
          <Link href="/" className="text-sm text-ink-soft hover:text-accent">
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
