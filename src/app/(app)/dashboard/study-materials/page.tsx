'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FileText,
    Video,
    Download,
    Lock,
    ChevronDown,
    Play,
    FileSearch,
    BookMarked
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const subjects = [
    {
        id: 'history',
        name: 'History of India',
        topics: [
            {
                id: 'ancient',
                name: 'Ancient India',
                resources: [
                    { id: 'h1', title: 'Indus Valley Civilization', type: 'PDF', isPremium: false },
                    { id: 'h2', title: 'Vedic Period Lectures', type: 'Video', isPremium: true },
                    { id: 'h3', title: 'Buddhism & Jainism', type: 'PDF', isPremium: true },
                ]
            },
            {
                id: 'modern',
                name: 'Modern India',
                resources: [
                    { id: 'h4', title: '1857 Revolt Analysis', type: 'PDF', isPremium: true },
                    { id: 'h5', title: 'Indian National Congress', type: 'Video', isPremium: true },
                ]
            }
        ]
    },
    {
        id: 'polity',
        name: 'Indian Polity',
        topics: [
            {
                id: 'constitution',
                name: 'Preamble & Fundamental Rights',
                resources: [
                    { id: 'p1', title: 'The Preamble Notes', type: 'PDF', isPremium: false },
                    { id: 'p2', title: 'Fundamental Rights Crash Course', type: 'Video', isPremium: true },
                ]
            }
        ]
    }
]

export default function StudyMaterials() {
    const [expandedTopics, setExpandedTopics] = useState<string[]>([])
    const isSubscribed = true // Mock subscription status

    const toggleTopic = (id: string) => {
        setExpandedTopics(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Study Materials</h1>
                    <p className="text-foreground/60">Access all your UPSC resources in one place.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search resources..."
                            className="pl-10 pr-4 py-2 rounded-xl glass border border-white/5 focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
                        />
                        <FileSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {subjects.map((subject) => (
                    <div key={subject.id} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <BookMarked className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold">{subject.name}</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {subject.topics.map((topic) => (
                                <div key={topic.id} className="glass rounded-2xl border border-white/5 overflow-hidden">
                                    <button
                                        onClick={() => toggleTopic(topic.id)}
                                        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
                                    >
                                        <span className="font-semibold">{topic.name}</span>
                                        <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", expandedTopics.includes(topic.id) && "rotate-180")} />
                                    </button>

                                    <AnimatePresence>
                                        {expandedTopics.includes(topic.id) && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-white/5"
                                            >
                                                <div className="p-4 space-y-2">
                                                    {topic.resources.map((res) => (
                                                        <div key={res.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all group">
                                                            <div className="flex items-center gap-4">
                                                                <div className={cn(
                                                                    "w-10 h-10 rounded-lg flex items-center justify-center",
                                                                    res.type === 'PDF' ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                                                                )}>
                                                                    {res.type === 'PDF' ? <FileText className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <h4 className="font-medium">{res.title}</h4>
                                                                        {res.isPremium && (
                                                                            <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[8px] font-bold border border-accent/20">PREMIUM</span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-xs text-foreground/40">{res.type} • 12 MB</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                {res.isPremium && !isSubscribed ? (
                                                                    <Button size="sm" variant="ghost" className="text-foreground/40 cursor-not-allowed">
                                                                        <Lock className="w-4 h-4 mr-2" /> Unlock
                                                                    </Button>
                                                                ) : (
                                                                    <>
                                                                        {res.type === 'Video' ? (
                                                                            <Button size="sm" variant="ghost" className="hover:text-primary">
                                                                                <Play className="w-4 h-4 mr-2" /> Watch
                                                                            </Button>
                                                                        ) : (
                                                                            <Button size="sm" variant="ghost" className="hover:text-primary">
                                                                                <Download className="w-4 h-4 mr-2" /> Download
                                                                            </Button>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

