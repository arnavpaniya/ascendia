'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, CreditCard, ShieldCheck, Zap, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const plans = [
    {
        id: 'monthly',
        name: 'Monthly Pro',
        price: 1499,
        savings: null,
        features: ['All Mock Tests', 'PDF Downloads', 'Email Support']
    },
    {
        id: 'quarterly',
        name: 'Quarterly Elite',
        price: 3999,
        savings: '11% OFF',
        popular: true,
        features: ['Universal Access', 'Video Lectures', 'Priority Support']
    },
    {
        id: 'yearly',
        name: 'Annual Legend',
        price: 12499,
        savings: '30% OFF',
        features: ['Personal Mentor', 'Interview Prep', 'Physical Books']
    }
]

export default function SubscriptionPage() {
    const handleContact = () => {
        alert("Subscriptions are currently disabled. Please contact support@ascendia.com for manual enrollment.")
    }

    return (
        <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">Choose Your Path to Success</h1>
                <p className="text-foreground/60">Unlock the full power of Ascendia and accelerate your preparation journey with our premium plans.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <motion.div
                        key={plan.id}
                        whileHover={{ y: -8 }}
                        className={cn(
                            "glass p-8 rounded-3xl border flex flex-col relative overflow-hidden",
                            plan.popular ? "border-primary shadow-2xl shadow-primary/10" : "border-white/5"
                        )}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-0 px-4 py-1 bg-primary text-white text-[10px] font-bold rounded-bl-xl uppercase tracking-widest">
                                Most Popular
                            </div>
                        )}

                        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold">₹{plan.price}</span>
                            <span className="text-foreground/40 text-sm">/period</span>
                            {plan.savings && (
                                <span className="ml-2 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">{plan.savings}</span>
                            )}
                        </div>

                        <div className="space-y-4 mb-10 flex-grow">
                            {plan.features.map((feat, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                                    <Check className="w-4 h-4 text-primary" /> {feat}
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={handleContact}
                            variant={plan.popular ? 'default' : 'outline'}
                            className="w-full h-12"
                        >
                            Get Started
                        </Button>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
                <div className="flex items-center gap-4 p-6 glass rounded-2xl border border-white/5">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    <div>
                        <p className="font-bold">Expert Support</p>
                        <p className="text-xs text-foreground/40">Dedicated assistance for your journey.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-6 glass rounded-2xl border border-white/5">
                    <Zap className="w-8 h-8 text-accent" />
                    <div>
                        <p className="font-bold">Instant Activation</p>
                        <p className="text-xs text-foreground/40">Unlock features after enrollment.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-6 glass rounded-2xl border border-white/5">
                    <CreditCard className="w-8 h-8 text-primary" />
                    <div>
                        <p className="font-bold">Flexible Plans</p>
                        <p className="text-xs text-foreground/40">Tailored to your preparation needs.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

