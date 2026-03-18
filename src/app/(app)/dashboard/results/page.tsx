'use client'

import { motion } from 'framer-motion'
import { Trophy, ArrowUpRight, ArrowDownRight, Target, Clock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const previousResults = [
    {
        id: 'r1',
        testName: 'Polity Revision #12',
        date: 'Feb 28, 2026',
        score: '32/40',
        accuracy: '80%',
        timeTaken: '22:14',
        status: 'improved'
    },
    {
        id: 'r2',
        testName: 'CSAT Weekly Mock',
        date: 'Feb 21, 2026',
        score: '45/50',
        accuracy: '90%',
        timeTaken: '48:30',
        status: 'stable'
    },
    {
        id: 'r3',
        testName: 'General Studies I',
        date: 'Feb 14, 2026',
        score: '112/200',
        accuracy: '56%',
        timeTaken: '118:00',
        status: 'dropped'
    }
]

export default function Results() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Performance Analysis</h1>
                <p className="text-foreground/60">Analyze your progress and focus on weak areas.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass p-8 rounded-3xl border border-white/5 lg:col-span-1 bg-primary/5">
                    <Trophy className="w-12 h-12 text-primary mb-6" />
                    <h2 className="text-2xl font-bold mb-2">Excellent Progress!</h2>
                    <p className="text-sm text-foreground/60 mb-6 italic leading-relaxed">
                        "Your accuracy in Polity has increased by 15% over the last 3 tests. Focus on Modern History next."
                    </p>
                    <Button className="w-full">View Detailed Roadmap</Button>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { label: 'Total Points', value: '1,240', icon: Zap, color: 'text-yellow-500' },
                        { label: 'Avg. Accuracy', value: '72%', icon: Target, color: 'text-accent' },
                        { label: 'Tests Taken', value: '24', icon: Trophy, color: 'text-primary' },
                        { label: 'Time Invested', value: '48h', icon: Clock, color: 'text-blue-500' },
                    ].map((stat, i) => (
                        <div key={i} className="glass p-6 rounded-2xl border border-white/10 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-foreground/40 font-bold uppercase mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                            <stat.icon className={`w-8 h-8 ${stat.color} opacity-20`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold">Recent Test History</h3>
                <div className="glass rounded-3xl border border-white/5 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-xs text-foreground/40 font-bold uppercase">
                            <tr>
                                <th className="px-6 py-4">Test Name</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Score</th>
                                <th className="px-6 py-4">Accuracy</th>
                                <th className="px-6 py-4 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {previousResults.map((res) => (
                                <tr key={res.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold">{res.testName}</span>
                                            {res.status === 'improved' && <ArrowUpRight className="w-4 h-4 text-green-500" />}
                                            {res.status === 'dropped' && <ArrowDownRight className="w-4 h-4 text-red-500" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-foreground/60 text-sm">{res.date}</td>
                                    <td className="px-6 py-6 font-bold">{res.score}</td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-white/5 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full" style={{ width: res.accuracy }} />
                                            </div>
                                            <span className="text-sm font-medium">{res.accuracy}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <Button size="sm" variant="ghost" className="hover:text-primary">View Report</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
