"use client";

import { motion, Variants } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ParticleCanvas } from "@/components/three/ParticleCanvas";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { PageTransition } from "@/components/layout/PageTransition";

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.6 } }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

export default function LandingPage() {
  const brand = "ASCENDIA";

  return (
    <PageTransition>
      <div className="relative w-full h-screen overflow-hidden bg-[#080b12] text-white flex flex-col items-center justify-center">
        {/* Background 3D Particles */}
        <ParticleCanvas />

        {/* Floating Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute top-8 z-20 flex gap-8 px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10"
        >
          <div className="flex flex-col items-center">
            <span className="text-[#38bdf8] font-syne font-bold text-xl"><AnimatedCounter to={48231} />+</span>
            <span className="text-white/60 text-xs uppercase tracking-wider">Students</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-[#f59e0b] font-syne font-bold text-xl"><AnimatedCounter to={340} /></span>
            <span className="text-white/60 text-xs uppercase tracking-wider">Courses</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-[#6c63ff] font-syne font-bold text-xl"><AnimatedCounter to={98} />%</span>
            <span className="text-white/60 text-xs uppercase tracking-wider">Pass Rate</span>
          </div>
        </motion.div>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex overflow-hidden mb-6"
          >
            {brand.split("").map((letter, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                className="text-7xl md:text-9xl font-syne font-bold tracking-tighter text-glow"
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-xl md:text-3xl text-white/80 font-light mb-12"
          >
            The next-generation <span className="text-[#f59e0b] font-medium">elite</span> learning platform.
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link href="/dashboard">
              <button className="group relative px-8 py-4 bg-[#6c63ff] hover:bg-[#5b54d6] text-white rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(108,99,255,0.4)] flex items-center gap-3 overflow-hidden">
                <span className="relative z-10">Start Your Ascent</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </button>
            </Link>
            <Link href="/courses">
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-bold text-lg backdrop-blur-md transition-all duration-300">
                Explore Courses
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 z-20 text-white/50"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </div>
    </PageTransition>
  );
}
