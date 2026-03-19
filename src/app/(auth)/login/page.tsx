'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, Variants } from 'framer-motion'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { AuthStatusMessage } from '@/features/auth/components/AuthStatusMessage'
import { AuthTextField } from '@/features/auth/components/AuthTextField'
import { GoogleAuthButton } from '@/features/auth/components/GoogleAuthButton'
import { prototypeQuickAccess, prototypeSignIn } from '@/features/auth/firebase-auth'
import { getRedirectPathForRole, getReadableAuthError } from '@/features/auth/utils'
import { useAuthStore } from '@/stores/auth.store'

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
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const router = useRouter()
    const setSession = useAuthStore((state) => state.setSession)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const session = await prototypeSignIn({ email, password })
            setSession(session)
            router.push(getRedirectPathForRole(session.profile.role))
            router.refresh()
        } catch (authError) {
            setError(getReadableAuthError(authError))
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true)
        setError(null)

        try {
            const session = await prototypeQuickAccess('student')
            setSession(session)
            router.push(getRedirectPathForRole(session.profile.role))
            router.refresh()
        } catch (authError) {
            setError(getReadableAuthError(authError))
        } finally {
            setGoogleLoading(false)
        }
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white">Welcome Back</h2>
                <p className="text-sm font-medium text-white/60">Prototype mode: your entry is saved to Firebase, then you are let in directly.</p>
            </motion.div>

            <AuthStatusMessage error={error} />

            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5">
                <AuthTextField
                    label="Email"
                    icon={Mail}
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                />

                <AuthTextField
                    label="Password"
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                    trailingAction={
                        <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            className="text-white/40 transition-colors hover:text-white/80"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    }
                />

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] text-base font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-500 hover:bg-right"
                    disabled={loading || googleLoading}
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login"}
                </motion.button>
            </motion.form>

            <motion.div variants={itemVariants} className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/10" />
                <span className="mx-4 flex-shrink-0 text-xs font-semibold uppercase tracking-wider text-white/30">Or continue with</span>
                <div className="flex-grow border-t border-white/10" />
            </motion.div>

            <motion.div variants={itemVariants}>
                <GoogleAuthButton onClick={handleGoogleSignIn} disabled={googleLoading || loading} loading={googleLoading} />
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2 text-center text-sm">
                <span className="text-white/50">Don&apos;t have an account? </span>
                <Link href="/signup" className="font-semibold text-indigo-400 transition-all duration-300 hover:text-indigo-300 hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]">
                    Sign Up
                </Link>
            </motion.div>
        </motion.div>
    )
}
