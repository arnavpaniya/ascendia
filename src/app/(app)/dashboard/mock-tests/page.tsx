'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PenTool, Calendar, Clock, Trophy, ChevronRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const mockTests = [
    {
        id: 't1',
        title: 'UPSC CSE Prelims Mock #15',
        subject: 'General Studies Paper I',
        date: 'March 15, 2026',
        duration: '120 mins',
        questions: 100,
        status: 'scheduled'
    },
    {
        id: 't2',
        title: 'CSAT Weekly Revision Test',
        subject: 'Aptitude & Reasoning',
        date: 'March 10, 2026',
        duration: '60 mins',
        questions: 50,
        status: 'available'
    },
    {
        id: 't3',
        title: 'Indian Economy Sectional Test',
        subject: 'Economics',
        date: 'March 05, 2026',
        duration: '45 mins',
        questions: 40,
        status: 'completed',
        score: '32/40'
    }
]

export default function MockTests() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Mock Tests</h1>
                <p className="text-foreground/60">Simulate the real UPSC exam experience.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats Summary */}
                <div className="glass p-6 rounded-3xl border border-white/5 bg-primary/5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Trophy className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-foreground/40 uppercase tracking-wider font-bold">Average Score</p>
                            <p className="text-2xl font-bold text-primary">74.5%</p>
                        </div>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[74.5%]" />
                    </div>
                </div>

                <div className="glass p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-accent/10 rounded-xl">
                            <Calendar className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <p className="text-xs text-foreground/40 uppercase tracking-wider font-bold">Tests Remaining</p>
                            <p className="text-2xl font-bold">12</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {mockTests.map((test) => (
                    <div
                        key={test.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-6 glass rounded-2xl border border-white/5 hover:border-primary/20 transition-all duration-300 group"
                    >
                        <div className="flex items-center gap-6 mb-4 md:mb-0">
                            <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center border",
                                test.status === 'completed' ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-primary/10 border-primary/20 text-primary"
                            )}>
                                <PenTool className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{test.title}</h3>
                                <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-foreground/40">
                                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {test.duration}</span>
                                    <span className="flex items-center gap-1"><PenTool className="w-3.5 h-3.5" /> {test.questions} Questions</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {test.date}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 px-4">
                            {test.status === 'completed' ? (
                                <div className="text-right">
                                    <p className="text-xs text-foreground/40 font-bold uppercase">Result</p>
                                    <p className="font-bold text-green-500">{test.score}</p>
                                </div>
                            ) : test.status === 'scheduled' ? (
                                <Button variant="outline" size="sm" disabled>Starting soon</Button>
                            ) : (
                                <Link href={`/dashboard/mock-tests/${test.id}`}>
                                    <Button size="sm" className="hidden md:flex">
                                        <Play className="w-4 h-4 mr-2" /> Start Test
                                    </Button>
                                </Link>
                            )}
                            {test.status !== 'scheduled' && (
                                <Link href={`/dashboard/mock-tests/${test.id}`} className="md:hidden w-full">
                                    <Button size="sm" className="w-full">
                                        <Play className="w-4 h-4 mr-2" /> Start Test
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

