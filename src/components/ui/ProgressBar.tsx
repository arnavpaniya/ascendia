import { motion } from "framer-motion";

export function ProgressBar({ progress, className = "", height = "h-1.5" }: { progress: number; className?: string; height?: string }) {
  return (
    <div className={`w-full bg-[#161820] rounded-full overflow-hidden ${height} ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-[#7c6df0] to-[#38bdf8] rounded-full"
      />
    </div>
  );
}
