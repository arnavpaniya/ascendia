'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Mail, Lock, User as UserIcon, Loader2, AlertCircle, Eye, EyeOff, BookOpen, Presentation, CheckCircle2 } from 'lucide-react'
import { auth, googleProvider, db } from '@/lib/firebase/config'
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

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
    const [googleLoading, setGoogleLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)
        setError(null)
        setSuccessMessage(null)
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            
            // Update profile with name
            await updateProfile(user, { displayName: name })
            
            // Create user document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                full_name: name,
                role: role,
                createdAt: new Date().toISOString()
            })

            setSuccessMessage("Signup successful! Redirecting...")
            
            setTimeout(() => {
                if (role === 'admin') router.push('/dashboard/admin')
                else router.push('/dashboard')
            }, 1000)

        } catch (err: any) {
            setError(err.message || 'Failed to create account')
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

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    email: user.email,
                    full_name: user.displayName || 'Google User',
                    role: role, // Use selected role for new google signups
                    createdAt: new Date().toISOString()
                })
                router.push('/dashboard')
            } else if (userDoc.data().role === 'admin') {
                router.push('/dashboard/admin')
            } else {
                router.push('/dashboard')
            }
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google')
        } finally {
            setGoogleLoading(false)
        }
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
                    disabled={loading || googleLoading}
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        "Sign Up"
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
                <span className="text-white/50">Already have an account? </span>
                <Link href="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.5)] transition-all duration-300">
                    Login
                </Link>
            </motion.div>
        </motion.div>
    )
}
