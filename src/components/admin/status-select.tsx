"use client";

import { useState, useTransition } from "react";
import { ChevronDown } from "@/components/ui/icons";

export function StatusSelect({
  id,
  value,
  options,
  action,
}: {
  id: string;
  value: string;
  options: { value: string; label: string }[];
  action: (id: string, status: string) => Promise<void>;
}) {
  const [current, setCurrent] = useState(value);
  const [pending, startTransition] = useTransition();

  return (
    <div className="relative inline-flex items-center">
      <select
        value={current}
        disabled={pending}
        onChange={(e) => {
          const v = e.target.value;
          setCurrent(v);
          startTransition(() => action(id, v));
        }}
        className="appearance-none rounded-full border border-line bg-surface py-1.5 pl-3 pr-8 text-xs font-semibold text-ink outline-none focus:border-accent disabled:opacity-60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-ink-soft" />
    </div>
  );
}
