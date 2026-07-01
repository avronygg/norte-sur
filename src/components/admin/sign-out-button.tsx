"use client";

import { useRouter } from "next/navigation";
import { SignOut } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  async function onClick() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={onClick}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-danger/10 hover:text-danger"
      }
    >
      <SignOut className="h-5 w-5" /> Cerrar sesión
    </button>
  );
}
