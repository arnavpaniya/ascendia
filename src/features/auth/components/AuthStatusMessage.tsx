"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface AuthStatusMessageProps {
  error?: string | null;
  success?: string | null;
}

export function AuthStatusMessage({ error, success }: AuthStatusMessageProps) {
  return (
    <AnimatePresence>
      {error ? (
        <motion.div
          initial={{ opacity: 0, height: 0, scale: 0.96 }}
          animate={{ opacity: 1, height: "auto", scale: 1 }}
          exit={{ opacity: 0, height: 0, scale: 0.96 }}
          className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </motion.div>
      ) : null}
      {!error && success ? (
        <motion.div
          initial={{ opacity: 0, height: 0, scale: 0.96 }}
          animate={{ opacity: 1, height: "auto", scale: 1 }}
          exit={{ opacity: 0, height: 0, scale: 0.96 }}
          className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
