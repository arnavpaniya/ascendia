'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c] relative overflow-hidden px-4">
            {/* Deep Dynamic Gradients Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-900/40 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/30 rounded-full blur-[150px]" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
                
                {/* Subtle Grain Overlay (Optional/EdTech Touch) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            </div>

            {/* Floating Orbs for extra Premium EdTech touch */}
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-500/20 rounded-full blur-[60px] z-0 pointer-events-none"
            />
            <motion.div
                animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-[70px] z-0 pointer-events-none"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[420px]"
            >
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block relative group">
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent p-1 drop-shadow-sm"
                        >
                            ASCENDIA
                        </motion.div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-300 group-hover:w-full" />
                    </Link>
                </div>

                <div className="backdrop-blur-2xl bg-[#0a0f1c]/40 p-10 rounded-[2rem] border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden">
                     {/* Subtle inner glow for depth */}
                    <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] pointer-events-none" />
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
