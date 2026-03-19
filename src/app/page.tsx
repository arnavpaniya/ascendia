"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, PlayCircle, BookOpen, Star, CheckCircle, MonitorPlay, Users, Target, ShieldCheck, Clock, Quote, Code, Trophy, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { ParticleCanvas } from "@/components/three/ParticleCanvas";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { PageTransition } from "@/components/layout/PageTransition";
import { AuthRoleSelector } from "@/features/auth/components/AuthRoleSelector";
import { createRoleSession } from "@/features/auth/local-auth";
import { getRedirectPathForRole } from "@/features/auth/utils";
import type { AppUserRole } from "@/features/auth/types";
import { useAuthStore } from "@/stores/auth.store";

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

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

function RoleSelectionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [role, setRole] = useState<AppUserRole>("student");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      const session = await createRoleSession(role);
      setSession(session);
      router.push(getRedirectPathForRole(role));
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#0a0f1c]/95 p-8 md:p-10 shadow-[0_0_60px_rgba(99,102,241,0.15)] backdrop-blur-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="mb-8 text-center relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-syne font-bold text-white"
              >
                Choose Your Workspace
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-3 text-sm text-white/60"
              >
                Pick how you want to enter Ascendia. Students go to learning tools, teachers go to the teaching dashboard.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AuthRoleSelector value={role} onChange={setRole} />
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              type="button"
              onClick={handleContinue}
              disabled={loading}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-base font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:opacity-95 hover:-translate-y-0.5 disabled:opacity-70 cursor-pointer"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LandingPage() {
  const brand = "ASCENDIA";
  const [showRoleModal, setShowRoleModal] = useState(false);

  return (
    <PageTransition>
      <div className="w-full min-h-screen bg-[#060913] text-white selection:bg-indigo-500/30 overflow-x-hidden">
        
        {/* Role Selection Modal */}
        <RoleSelectionModal isOpen={showRoleModal} onClose={() => setShowRoleModal(false)} />

        {/* =========================================
            HERO SECTION (ENHANCED EXISTING LAYOUT)
            ========================================= */}
        <section className="relative w-full h-screen flex flex-col items-center justify-center pt-20">
          <ParticleCanvas />

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute top-8 z-20 flex gap-6 md:gap-12 px-6 md:px-10 py-3 md:py-4 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)]"
          >
            <div className="flex flex-col items-center">
              <span className="text-indigo-400 font-syne font-bold text-lg md:text-2xl drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"><AnimatedCounter to={100} />+</span>
              <span className="text-white/50 text-[10px] md:text-xs uppercase tracking-widest font-semibold mt-1">Courses</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-purple-400 font-syne font-bold text-lg md:text-2xl drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"><AnimatedCounter to={10000} />+</span>
              <span className="text-white/50 text-[10px] md:text-xs uppercase tracking-widest font-semibold mt-1">Students</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-blue-400 font-syne font-bold text-lg md:text-2xl drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]"><AnimatedCounter to={98} />%</span>
              <span className="text-white/50 text-[10px] md:text-xs uppercase tracking-widest font-semibold mt-1">Success</span>
            </div>
          </motion.div>

          {/* Background Ambient Glows */}
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mt-12 w-full">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex overflow-hidden mb-6 drop-shadow-lg"
            >
              {brand.split("").map((letter, i) => (
                <motion.span
                  key={i}
                  variants={letterVariants}
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-syne font-bold tracking-tighter bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-3xl md:text-5xl lg:text-5xl text-white font-bold tracking-tight mb-6 drop-shadow-sm"
            >
              Learn. Build. Grow.
            </motion.h1>

            <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 1.0, duration: 0.8 }}
               className="text-base md:text-lg lg:text-xl text-white/60 font-medium mb-10 max-w-2xl leading-relaxed"
            >
              Master high-demand skills through structured courses, rigorous practice tests, and detailed progress tracking designed to accelerate your career.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-5 items-center w-full sm:w-auto"
            >
              <button
                onClick={() => setShowRoleModal(true)}
                className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-bold text-base transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden cursor-pointer"
              >
                <span className="relative z-10">Start Learning</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </button>
              <Link href="#courses" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 rounded-xl font-bold text-base backdrop-blur-md transition-all duration-300 hover:-translate-y-1">
                  Explore Courses
                </button>
              </Link>
            </motion.div>
          </div>

          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-8 z-20 text-white/30 hidden md:block" >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </section>

        {/* =========================================
            COURSE CATEGORIES SECTION
            ========================================= */}
        <section id="categories" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Master Your Path</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Choose from meticulously curated domains structured to guide absolute beginners to advanced mastery.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Programming", icon: Code, desc: "Web dev, DSA, & System Design", color: "text-blue-400" },
              { title: "Core Engineering", icon: Target, desc: "Mechanical, Civil, & Electrical", color: "text-indigo-400" },
              { title: "Aptitude Prep", icon: Trophy, desc: "Placement & Logical Reasoning", color: "text-purple-400" },
              { title: "School Subjects", icon: BookOpen, desc: "K-12 Foundations & Boards", color: "text-pink-400" }
            ].map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer shadow-lg relative overflow-hidden"
              >
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${cat.color}`}>
                  <cat.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
                <p className="text-sm text-white/50">{cat.desc}</p>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* =========================================
            FEATURES SECTION
            ========================================= */}
        <section className="py-24 px-6 bg-white/[0.01] border-y border-white/[0.03] relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariants} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Built for Serious Learners</h2>
              <p className="text-white/50 text-lg max-w-2xl mx-auto">Everything you need to succeed, packed into a clean, distraction-free environment.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                { title: "HD Recorded Lectures", icon: MonitorPlay, desc: "Access high-quality, structured video content anytime, anywhere. Pause, rewind, and learn at your optimal pace." },
                { title: "Live Doubt Solving", icon: Users, desc: "Connect directly with mentors and peers in interactive live sessions to clear roadblocks instantly." },
                { title: "Rigorous Practice", icon: ShieldCheck, desc: "Test your knowledge with chapter-wise quizzes and full-length mock exams modeled after real standards." }
              ].map((feat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-[2rem] bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] flex flex-col items-center text-center hover:border-indigo-500/30 transition-colors duration-500"
                >
                  <feat.icon className="w-10 h-10 text-indigo-400 mb-6" />
                  <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                  <p className="text-white/60 leading-relaxed text-sm">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            FEATURED COURSES SECTION
            ========================================= */}
        <section id="courses" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariants} className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Trending Courses</h2>
              <p className="text-white/50 text-lg max-w-xl">Curriculum designed by experts. Hands-on projects included.</p>
            </div>
            <Link href="/courses">
              <button className="flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                View All Catalog <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Full-Stack Web Engineering", level: "Beginner to Pro", duration: "12 Weeks", rating: "4.9", imagebg: "from-blue-900/40 to-indigo-900/10" },
              { title: "Data Structures & Algorithms", level: "Intermediate", duration: "8 Weeks", rating: "4.8", imagebg: "from-purple-900/40 to-pink-900/10" },
              { title: "UPSC General Studies Mastery", level: "Comprehensive", duration: "24 Weeks", rating: "5.0", imagebg: "from-emerald-900/40 to-teal-900/10" }
            ].map((course, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group flex flex-col rounded-[2rem] bg-white/[0.02] border border-white/10 overflow-hidden hover:shadow-[0_0_40px_rgba(99,102,241,0.1)] transition-all duration-300"
              >
                {/* Mock Image Placeholder */}
                <div className={`h-48 w-full bg-gradient-to-br ${course.imagebg} relative overflow-hidden flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 mix-blend-overlay" />
                  <PlayCircle className="w-12 h-12 text-white/50 group-hover:scale-110 group-hover:text-white transition-all duration-300" />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                    <span className="flex items-center gap-1 text-amber-400/90"><Star className="w-3 h-3 fill-current" /> {course.rating}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-indigo-400 mb-8">{course.level}</p>
                  
                  <div className="mt-auto pt-6 border-t border-white/10">
                    <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors flex justify-center items-center gap-2">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* =========================================
            DASHBOARD PREVIEW SECTION
            ========================================= */}
        <section className="py-24 px-6 relative z-10 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariants} className="text-3xl md:text-5xl font-bold mb-4">Your Central Command</motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariants} className="text-white/50 text-lg max-w-2xl mx-auto mb-16">Track exactly where you stand. The student dashboard provides real-time insights into your progress, upcoming lessons, and performance metrics.</motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative mx-auto max-w-5xl rounded-t-[2.5rem] border-x border-t border-white/10 bg-white/[0.02] p-4 md:p-8 backdrop-blur-sm shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="w-full aspect-video rounded-2xl bg-[#0a0f1c] border border-white/5 relative overflow-hidden flex flex-col p-6 shadow-inner">
                {/* Mock Dashboard Header */}
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20" />
                    <div className="h-4 w-32 bg-white/10 rounded-full" />
                  </div>
                  <div className="flex gap-2">
                     <div className="h-8 w-8 rounded-lg bg-white/5" />
                     <div className="h-8 w-24 rounded-lg bg-white/5" />
                  </div>
                </div>
                {/* Mock Dashboard Body */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                     <div className="h-40 w-full rounded-xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-white/5" />
                     <div className="flex gap-4">
                       <div className="h-24 flex-1 rounded-xl bg-white/5" />
                       <div className="h-24 flex-1 rounded-xl bg-white/5" />
                     </div>
                  </div>
                  <div className="w-full rounded-xl bg-white/[0.02] border border-white/5 p-4 flex flex-col gap-3">
                     <div className="h-6 w-1/2 bg-white/10 rounded-full mb-2" />
                     <div className="h-12 w-full bg-white/5 rounded-lg" />
                     <div className="h-12 w-full bg-white/5 rounded-lg" />
                     <div className="h-12 w-full bg-white/5 rounded-lg" />
                  </div>
                </div>
                {/* Overlay Blur for style */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* =========================================
            WHY CHOOSE US & TESTIMONIALS 
            ========================================= */}
        <section className="py-24 px-6 bg-white/[0.01] border-y border-white/[0.03] relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariants} className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">We focus on <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">outcomes</span>, not just output.</h2>
              <p className="text-white/60 text-lg leading-relaxed">Most platforms throw endless videos at you. Ascendia is built around structured learning paths, immediate application, and expert guidance to ensure you actually learn.</p>
              
              <ul className="space-y-5">
                {[
                  "No generic fluff. Highly concentrated syllabus topics.",
                  "Affordable pricing to ensure accessibility for everyone.",
                  "Frequent mock tests to guarantee exam readiness."
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-white/80 font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariants} className="flex flex-col gap-6">
               {[
                 { name: "Rahul Sharma", role: "Software Engineer", comment: "The structured approach towards DSA here completely shifted my perspective. Landed my first major tech role right after." },
                 { name: "Priya Singh", role: "UPSC Aspirant", comment: "Finally, a platform that understands exactly what is needed for the exam without overwhelming the student. The mock tests are incredibly accurate." }
               ].map((test, i) => (
                 <div key={i} className="p-8 rounded-[2rem] bg-white/[0.03] border border-white-[0.05] relative">
                   <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5" />
                   <p className="text-white/80 leading-relaxed mb-6 italic relative z-10">&quot;{test.comment}&quot;</p>
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                     <div>
                       <h4 className="font-bold text-white">{test.name}</h4>
                       <p className="text-xs text-white/40">{test.role}</p>
                     </div>
                   </div>
                 </div>
               ))}
            </motion.div>

          </div>
        </section>

        {/* =========================================
            FINAL CTA SECTION
            ========================================= */}
        <section className="py-32 px-6 relative z-10 flex justify-center text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariants} className="max-w-3xl flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Ready to Elevate?</h2>
            <p className="text-xl text-white/50 mb-10 max-w-xl">Join thousands of students who have already transformed their careers with Ascendia&apos;s structured roadmap.</p>
            <button
              onClick={() => setShowRoleModal(true)}
              className="px-10 py-5 bg-white text-[#060913] rounded-xl font-extrabold text-lg hover:bg-indigo-50 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:-translate-y-1 cursor-pointer"
            >
              Start Your Journey Today
            </button>
          </motion.div>
        </section>

      </div>
    </PageTransition>
  );
}
