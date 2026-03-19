"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface GoogleAuthButtonProps {
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}

export function GoogleAuthButton({ disabled, loading, onClick }: GoogleAuthButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
      whileTap={{ scale: 0.98 }}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white transition-colors"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path d="M12 3l2.4 4.86 5.36.78-3.88 3.78.92 5.34L12 15.24l-4.8 2.52.92-5.34L4.24 8.64l5.36-.78L12 3z" fill="#f59e0b" />
          </svg>
          Continue
        </>
      )}
    </motion.button>
  );
}
