'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, AlertCircle, BookOpen, Presentation } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState<'student' | 'admin'>('student')
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
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
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Create Account</h2>
                <p className="text-foreground/60 text-sm mt-1">Start your UPSC preparation today</p>
            </div>

            {error && (
                <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                </div>
            )}

            {successMessage && (
                <div className="p-3 text-sm bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-4">
                   <button 
                     type="button" 
                     onClick={() => setRole('student')}
                     className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === 'student' ? 'border-[#6c63ff] bg-[#6c63ff]/10 text-white' : 'border-white/10 text-white/50 hover:bg-white/5'}`}
                   >
                     <BookOpen className="w-6 h-6" />
                     <span className="text-sm font-medium">Student</span>
                   </button>
                   <button 
                     type="button" 
                     onClick={() => setRole('admin')}
                     className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === 'admin' ? 'border-[#f59e0b] bg-[#f59e0b]/10 text-white' : 'border-white/10 text-white/50 hover:bg-white/5'}`}
                   >
                     <Presentation className="w-6 h-6" />
                     <span className="text-sm font-medium">Teacher</span>
                   </button>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Full Name</label>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                        <Input
                            type="text"
                            placeholder="Hero Scholar"
                            className="pl-11"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                        <Input
                            type="email"
                            placeholder="name@example.com"
                            className="pl-11"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                        <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-11"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 text-base"
                    variant="accent"
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Sign Up <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                    )}
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-foreground/60">Already have an account? </span>
                <Link href="/login" className="text-primary font-semibold hover:underline">
                    Login
                </Link>
            </div>

            <p className="text-[10px] text-center text-foreground/40 leading-tight">
                By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
    )
}
