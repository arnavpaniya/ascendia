'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
}

export default function LoginPage() {
    const [email, setEmail] = useState('test.user.ascendia.1234@gmail.com')
    const [password, setPassword] = useState('password123')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        setLoading(false)

        if (error) {
            setError(error.message)
            return
        }

        if (data.user) {
            const { data: userData } = await supabase.from('users').select('role').eq('id', data.user.id).single();
            if (userData && userData.role === 'admin') {
                router.push('/dashboard/admin')
            } else {
                router.push('/dashboard')
            }
        }
        router.refresh()
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants} className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back 👋</h2>
                <p className="text-white/60 text-sm font-medium">Continue Your Learning Journey</p>
            </motion.div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.9 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.9 }}
                        className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-2"
                    >
                        <AlertCircle className="w-4 h-4 shrink-0" /> <span className="flex-1">{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5 flex flex-col">
                    <label className="text-sm font-medium text-white/80 ml-1">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 transition-colors group-focus-within:text-indigo-400" />
                        <Input
                            type="email"
                            placeholder="name@example.com"
                            className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all duration-300 shadow-inner"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5 flex flex-col">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-medium text-white/80">Password</label>
                        <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">Forgot password?</Link>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 transition-colors group-focus-within:text-indigo-400" />
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-11 pr-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all duration-300 shadow-inner"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full h-12 text-base font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] hover:bg-right rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 transition-all duration-500"
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        "Login"
                    )}
                </motion.button>
            </motion.form>

            <motion.div variants={itemVariants} className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/10" />
                <span className="flex-shrink-0 mx-4 text-white/30 text-xs uppercase tracking-wider font-semibold">Or continue with</span>
                <div className="flex-grow border-t border-white/10" />
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
                <motion.button 
                    whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium transition-colors"
                >
                    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Google
                </motion.button>
                <motion.button 
                    whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 h-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium transition-colors"
                >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.45v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>
                    Github
                </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center text-sm pt-2">
                <span className="text-white/50">Don&apos;t have an account? </span>
                <Link href="/signup" className="text-indigo-400 font-semibold hover:text-indigo-300 hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.5)] transition-all duration-300">
                    Sign Up
                </Link>
            </motion.div>
        </motion.div>
    )
}
