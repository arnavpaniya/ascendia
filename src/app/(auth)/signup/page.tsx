'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Mail, Lock, User as UserIcon, Loader2, AlertCircle, Eye, EyeOff, BookOpen, Presentation, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
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

export default function SignupPage() {
    const [name, setName] = useState('Demo User')
    const [email, setEmail] = useState('test.user.ascendia.1234@gmail.com')
    const [password, setPassword] = useState('password123')
    const [confirmPassword, setConfirmPassword] = useState('password123')
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState<'student' | 'admin'>('student')
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)
        setError(null)
        setSuccessMessage(null)
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    role: role
                }
            }
        })

        setLoading(false)

        if (error) {
            setError(error.message)
            return
        }

        if (!data.session) {
            setSuccessMessage("Signup successful! Please check your email to verify your account.")
            return
        }

        router.push('/dashboard')
        router.refresh()
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants} className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white tracking-tight">Create Account 🚀</h2>
                <p className="text-white/60 text-sm font-medium">Start Learning Today</p>
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
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.9 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.9 }}
                        className="p-3 text-sm bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(74,222,128,0.2)]"
                    >
                        <CheckCircle2 className="w-4 h-4 shrink-0" /> <span className="flex-1">{successMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
                
                <div className="flex gap-3">
                   <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     type="button" 
                     onClick={() => setRole('student')}
                     className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all duration-300 ${role === 'student' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'}`}
                   >
                     <BookOpen className="w-4 h-4" />
                     <span className="text-sm font-semibold">Student</span>
                   </motion.button>
                   <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     type="button" 
                     onClick={() => setRole('admin')}
                     className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all duration-300 ${role === 'admin' ? 'border-purple-500 bg-purple-500/10 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'}`}
                   >
                     <Presentation className="w-4 h-4" />
                     <span className="text-sm font-semibold">Teacher</span>
                   </motion.button>
                </div>

                <div className="space-y-1.5 flex flex-col">
                    <label className="text-sm font-medium text-white/80 ml-1">Full Name</label>
                    <div className="relative group">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 transition-colors group-focus-within:text-indigo-400" />
                        <Input
                            type="text"
                            placeholder="Hero Scholar"
                            className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-xl focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all duration-300 shadow-inner"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5 flex flex-col">
                    <label className="text-sm font-medium text-white/80 ml-1">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 transition-colors group-focus-within:text-indigo-400" />
                        <Input
                            type="email"
                            placeholder="name@example.com"
                            className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-xl focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all duration-300 shadow-inner"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5 flex flex-col">
                        <label className="text-sm font-medium text-white/80 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 transition-colors group-focus-within:text-indigo-400" />
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-9 pr-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-xl focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all duration-300 text-sm shadow-inner"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5 flex flex-col">
                        <label className="text-sm font-medium text-white/80 ml-1">Confirm</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 transition-colors group-focus-within:text-indigo-400" />
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-9 pr-2 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-xl focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-all duration-300 text-sm shadow-inner"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full h-12 mt-2 text-base font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] hover:bg-right rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 transition-all duration-500"
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        "Sign Up"
                    )}
                </motion.button>
            </motion.form>

            <motion.div variants={itemVariants} className="text-center text-sm pt-2">
                <span className="text-white/50">Already have an account? </span>
                <Link href="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.5)] transition-all duration-300">
                    Login
                </Link>
            </motion.div>
        </motion.div>
    )
}
