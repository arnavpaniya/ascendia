'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { auth, googleProvider, db } from '@/lib/firebase/config'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

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
    const [googleLoading, setGoogleLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            const userDoc = await getDoc(doc(db, 'users', user.uid))
            
            if (userDoc.exists() && userDoc.data().role === 'admin') {
                router.push('/dashboard/admin')
            } else {
                router.push('/dashboard')
            }
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to sign in')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true)
        setError(null)

        try {
            const userCredential = await signInWithPopup(auth, googleProvider)
            const user = userCredential.user
            const userDocRef = doc(db, 'users', user.uid)
            const userDoc = await getDoc(userDocRef)

            // If logging in via Google for the first time, create their document
            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    email: user.email,
                    full_name: user.displayName || 'Google User',
                    role: 'student',
                    createdAt: new Date().toISOString()
                })
                router.push('/dashboard')
            } else if (userDoc.data().role === 'admin') {
                router.push('/dashboard/admin')
            } else {
                router.push('/dashboard')
            }
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google')
        } finally {
            setGoogleLoading(false)
        }
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
                    disabled={loading || googleLoading}
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

            <motion.div variants={itemVariants} className="flex justify-center">
                <motion.button 
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading || loading}
                    whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium transition-colors"
                >
                    {googleLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            Continue with Google
                        </>
                    )}
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
