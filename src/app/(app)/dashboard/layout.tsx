'use client'

import Sidebar from '@/components/dashboard/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Sidebar />

            <main className="lg:ml-64 min-h-screen">
                {/* Topbar / Mobile Header */}
                <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-background/50 backdrop-blur-md sticky top-0 z-30">
                    <div>
                        <h1 className="text-sm font-medium text-foreground/40 capitalize">
                            Dashboard / {pathname.split('/').pop()}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent" />
                        <span className="text-sm font-medium hidden sm:block">Aarav Sharma</span>
                    </div>
                </header>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}
