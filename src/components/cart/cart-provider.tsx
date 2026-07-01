"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "@/types/database";

const STORAGE_KEY = "norte-sur-cart-v1";

type State = { lines: CartLine[] };

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: CartLine }
  | { type: "setQty"; productId: string; quantity: number }
  | { type: "remove"; productId: string }
  | { type: "clear" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines };
    case "add": {
      const existing = state.lines.find(
        (l) => l.productId === action.line.productId,
      );
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.productId === action.line.productId
              ? { ...l, quantity: l.quantity + action.line.quantity }
              : l,
          ),
        };
      }
      return { lines: [...state.lines, action.line] };
    }
    case "setQty":
      return {
        lines: state.lines.map((l) =>
          l.productId === action.productId
            ? { ...l, quantity: Math.max(1, action.quantity) }
            : l,
        ),
      };
    case "remove":
      return { lines: state.lines.filter((l) => l.productId !== action.productId) };
    case "clear":
      return { lines: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  lines: CartLine[];
  /** Líneas de compra directa (con precio). */
  directLines: CartLine[];
  /** Líneas de cotización (sin compra online). */
  quoteLines: CartLine[];
  count: number;
  subtotal: number;
  add: (line: CartLine) => void;
  setQty: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  /** Estado del panel lateral (drawer). */
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [isOpen, setIsOpen] = useState(false);

  // Hidratar desde localStorage al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", lines: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  // Persistir
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      /* ignore */
    }
  }, [state.lines]);

  const value = useMemo<CartContextValue>(() => {
    const directLines = state.lines.filter((l) => l.saleMode === "direct");
    const quoteLines = state.lines.filter((l) => l.saleMode === "quote");
    const subtotal = directLines.reduce(
      (sum, l) => sum + (l.price ?? 0) * l.quantity,
      0,
    );
    const count = state.lines.reduce((sum, l) => sum + l.quantity, 0);
    return {
      lines: state.lines,
      directLines,
      quoteLines,
      count,
      subtotal,
      add: (line) => {
        dispatch({ type: "add", line });
        setIsOpen(true);
      },
      setQty: (productId, quantity) =>
        dispatch({ type: "setQty", productId, quantity }),
      remove: (productId) => dispatch({ type: "remove", productId }),
      clear: () => dispatch({ type: "clear" }),
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    };
  }, [state.lines, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
