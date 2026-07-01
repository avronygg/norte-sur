"use client";

import { AnimatePresence, motion } from "motion/react";
import { ShoppingCart } from "@/components/ui/icons";
import { useCart } from "./cart-provider";

/** Botón flotante de carrito, SIEMPRE visible. Abre el carrito lateral. */
export function FloatingCart() {
  const { count, openCart, isOpen } = useCart();

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          onClick={openCart}
          aria-label={`Abrir carrito${count > 0 ? ` (${count})` : ""}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", damping: 18, stiffness: 320 }}
          className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-xl shadow-accent/30 lg:bottom-7 lg:right-7"
        >
          <ShoppingCart className="h-6 w-6" />
          <AnimatePresence>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground ring-2 ring-paper"
              >
                {count}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
