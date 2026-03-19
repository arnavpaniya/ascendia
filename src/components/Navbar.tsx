'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import DashboardSidebar from './DashboardSidebar'

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`pointer-events-auto flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 max-w-7xl w-full ${isScrolled
                        ? 'bg-[#0f172a]/95 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 backdrop-blur-md translate-y-2'
                        : 'bg-transparent'
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                            <Menu size={24} />
                        </button>
                        <Link href="/" className="flex items-center space-x-2 shrink-0">
                            <img
                                src="/logo.png"
                                alt="Ascendia Logo"
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm font-bold text-white/70 hover:text-primary transition-colors">
                            Features
                        </Link>
                        <Link href="#courses" className="text-sm font-bold text-white/70 hover:text-primary transition-colors">
                            Courses
                        </Link>
                        <Link href="#pricing" className="text-sm font-bold text-white/70 hover:text-primary transition-colors">
                            Pricing
                        </Link>

                        <div className="h-6 w-[1px] bg-white/10 mx-2" />

                        <Link
                            href="/get-started"
                            className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-black uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 bg-primary/10 text-primary rounded-xl"
                        >
                            <LayoutDashboard size={20} />
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white/70 p-2"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </motion.nav>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="fixed top-24 left-4 right-4 z-[51] md:hidden bg-[#0f172a] border border-white/5 rounded-2xl p-6 shadow-2xl"
                    >
                        <div className="flex flex-col space-y-4">
                            <Link href="#features" className="text-white/70 font-bold py-2" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
                            <Link href="#courses" className="text-white/70 font-bold py-2" onClick={() => setIsMobileMenuOpen(false)}>Courses</Link>
                            <Link href="#pricing" className="text-white/70 font-bold py-2" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
                            <div className="h-[1px] bg-white/5 my-2" />
                            <Link href="/get-started" className="bg-primary text-white px-6 py-4 rounded-xl text-center font-black uppercase tracking-widest">
                                Start Preparing
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
    )
}

export default Navbar
