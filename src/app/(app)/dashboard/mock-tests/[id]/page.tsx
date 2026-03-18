'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChevronLeft, ChevronRight, Send, AlertCircle, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const mockQuestions = [
    {
        id: 1,
        question: "Which of the following Fundamental Rights cannot be suspended even during an emergency?",
        options: [
            "Right to speech and expression",
            "Right to move freely throughout the territory of India",
            "Right to protection in respect of conviction for offences",
            "Right to assemble peacefully"
        ],
        correct: 2
    },
    {
        id: 2,
        question: "The 'Preamble' of the Indian Constitution was inspired by the Constitution of which country?",
        options: ["UK", "USA", "USSR", "Ireland"],
        correct: 1
    },
    {
        id: 3,
        question: "In the context of Indian economy, what does 'Laffer Curve' represent?",
        options: [
            "Relation between interest rate and investment",
            "Relation between tax rates and tax revenue",
            "Relation between inflation and unemployment",
            "Relation between GDP and inequality"
        ],
        correct: 1
    }
]

export default function TestInterface() {
    const router = useRouter()
    const [currentIdx, setCurrentIdx] = useState(0)
    const [timeLeft, setTimeLeft] = useState(3600) // 1 hour
    const [answers, setAnswers] = useState<Record<number, number>>({})
    const [isSubmitted, setIsSubmitted] = useState(false)

    function handleAutoSubmit() {
        setIsSubmitted(true)
        // Here we would normally save to DB
    }

    useEffect(() => {
        if (timeLeft <= 0) {
            handleAutoSubmit()
            return
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
        return () => clearInterval(timer)
    }, [timeLeft])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleSelect = (optionIdx: number) => {
        setAnswers(prev => ({ ...prev, [mockQuestions[currentIdx].id]: optionIdx }))
    }

    const handleSubmit = () => {
        if (confirm("Are you sure you want to submit the test?")) {
            handleAutoSubmit()
        }
    }

    if (isSubmitted) {
        const score = Object.entries(answers).reduce((acc, [qId, ansIdx]) => {
            const q = mockQuestions.find(q => q.id === parseInt(qId))
            return q && q.correct === ansIdx ? acc + 1 : acc
        }, 0)

        return (
            <div className="max-w-3xl mx-auto py-12 px-4 text-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-green-500/20">
                        <Trophy className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Test Submitted!</h1>
                    <p className="text-xl text-foreground/60 mb-8">You have successfully completed the mock test.</p>

                    <div className="glass p-8 rounded-3xl mb-12 border border-white/5 bg-primary/5">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-sm text-foreground/40 font-bold uppercase mb-2">Your Score</p>
                                <p className="text-5xl font-bold text-primary">{score}/{mockQuestions.length}</p>
                            </div>
                            <div>
                                <p className="text-sm text-foreground/40 font-bold uppercase mb-2">Accuracy</p>
                                <p className="text-5xl font-bold text-accent">{Math.round((score / mockQuestions.length) * 100)}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <Button onClick={() => router.push('/dashboard/results')}>View Detailed Analysis</Button>
                        <Button variant="outline" onClick={() => router.push('/dashboard/mock-tests')}>Back to Tests</Button>
                    </div>
                </motion.div>
            </div>
        )
    }

    const currentQuestion = mockQuestions[currentIdx]

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Test Header */}
            <div className="flex items-center justify-between glass p-4 rounded-2xl border border-white/10 sticky top-20 z-20 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary">{currentIdx + 1}/{mockQuestions.length}</span>
                    </div>
                    <div>
                        <h2 className="font-bold hidden sm:block">UPSC Weekly Revision #15</h2>
                        <p className="text-[10px] text-foreground/40">Mode: Exam Mode</p>
                    </div>
                </div>

                <div className={cn(
                    "flex items-center gap-3 px-6 py-2 rounded-xl border-2 transition-colors",
                    timeLeft < 300 ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-white/5 border-white/10"
                )}>
                    <Clock className={cn("w-5 h-5", timeLeft < 300 && "animate-pulse")} />
                    <span className="text-xl font-mono font-bold">{formatTime(timeLeft)}</span>
                </div>

                <Button onClick={handleSubmit} variant="accent" size="sm">
                    Submit <Send className="ml-2 w-4 h-4" />
                </Button>
            </div>

            {/* Question Card */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    <motion.div
                        key={currentIdx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass p-8 rounded-3xl border border-white/10 min-h-[400px] flex flex-col"
                    >
                        <h3 className="text-xl font-medium mb-8 leading-relaxed">
                            {currentQuestion.question}
                        </h3>

                        <div className="space-y-4 flex-grow">
                            {currentQuestion.options.map((option, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSelect(i)}
                                    className={cn(
                                        "w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center gap-4 group",
                                        answers[currentQuestion.id] === i
                                            ? "bg-primary/20 border-primary text-primary"
                                            : "bg-white/5 border-white/5 hover:bg-white/10"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors",
                                        answers[currentQuestion.id] === i ? "bg-primary text-white" : "bg-white/10"
                                    )}>
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                    <span className="font-medium">{option}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                                disabled={currentIdx === 0}
                            >
                                <ChevronLeft className="mr-2 w-4 h-4" /> Previous
                            </Button>

                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-foreground/40">Clear Response</Button>
                                <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10">Mark for Review</Button>
                            </div>

                            <Button
                                onClick={() => setCurrentIdx(prev => Math.min(mockQuestions.length - 1, prev + 1))}
                                disabled={currentIdx === mockQuestions.length - 1}
                            >
                                Next <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Navigation Grid */}
                <div className="space-y-6">
                    <div className="glass p-6 rounded-3xl border border-white/10">
                        <h4 className="font-bold mb-4 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-primary" /> Questions Grid
                        </h4>
                        <div className="grid grid-cols-4 gap-2">
                            {mockQuestions.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIdx(i)}
                                    className={cn(
                                        "aspect-square rounded-lg flex items-center justify-center text-sm font-bold border transition-colors",
                                        currentIdx === i ? "border-primary bg-primary text-white" :
                                            answers[mockQuestions[i].id] !== undefined ? "border-green-500/50 bg-green-500/20 text-green-500" :
                                                "border-white/10 hover:bg-white/5"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-3 text-xs text-foreground/60">
                                <div className="w-3 h-3 rounded bg-green-500" /> Answered
                            </div>
                            <div className="flex items-center gap-3 text-xs text-foreground/60">
                                <div className="w-3 h-3 rounded bg-white/10 border border-white/10" /> Not Answered
                            </div>
                            <div className="flex items-center gap-3 text-xs text-foreground/60">
                                <div className="w-3 h-3 rounded bg-primary" /> Current
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-3xl border border-accent/20 bg-accent/5">
                        <p className="text-[10px] text-accent font-bold uppercase mb-2 tracking-widest text-center">Important</p>
                        <p className="text-xs text-foreground/60 leading-relaxed text-center">
                            The test will automatically submit once the timer hits zero. Please ensure all answers are marked before then.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

