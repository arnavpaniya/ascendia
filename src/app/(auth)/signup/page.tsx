'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, Variants } from 'framer-motion'
import { Eye, EyeOff, Loader2, Lock, Mail, User as UserIcon } from 'lucide-react'
import { AuthRoleSelector } from '@/features/auth/components/AuthRoleSelector'
import { AuthStatusMessage } from '@/features/auth/components/AuthStatusMessage'
import { AuthTextField } from '@/features/auth/components/AuthTextField'
import { GoogleAuthButton } from '@/features/auth/components/GoogleAuthButton'
import type { AppUserRole } from '@/features/auth/types'
import { prototypeQuickAccess, prototypeSignUp } from '@/features/auth/firebase-auth'
import { getRedirectPathForRole, getReadableAuthError } from '@/features/auth/utils'
import { useAuthStore } from '@/stores/auth.store'

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
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState<AppUserRole>('student')
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const router = useRouter()
    const setSession = useAuthStore((state) => state.setSession)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        setError(null)
        setSuccessMessage(null)

        try {
            const session = await prototypeSignUp({ name, email, password, role })
            setSession(session)
            setSuccessMessage('Account created. Redirecting...')
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
        setSuccessMessage(null)

        try {
            const session = await prototypeQuickAccess(role)
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
                <h2 className="text-3xl font-bold tracking-tight text-white">Create Account</h2>
                <p className="text-sm font-medium text-white/60">Prototype mode saves the form to Firebase without verifying credentials.</p>
            </motion.div>

            <AuthStatusMessage error={error} success={successMessage} />

            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
                <AuthRoleSelector value={role} onChange={setRole} />

                <AuthTextField
                    label="Full Name"
                    icon={UserIcon}
                    type="text"
                    placeholder="Hero Scholar"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    autoComplete="name"
                />

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

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <AuthTextField
                        label="Password"
                        icon={Lock}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        autoComplete="new-password"
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

                    <AuthTextField
                        label="Confirm Password"
                        icon={Lock}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] text-base font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-500 hover:bg-right"
                    disabled={loading || googleLoading}
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign Up"}
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
                <span className="text-white/50">Already have an account? </span>
                <Link href="/login" className="font-semibold text-indigo-400 transition-all duration-300 hover:text-indigo-300 hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]">
                    Login
                </Link>
            </motion.div>
        </motion.div>
    )
}
