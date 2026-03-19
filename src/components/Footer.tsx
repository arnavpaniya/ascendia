'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-card border-t border-border pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="inline-block mb-6">
                            <img
                                src="/logo.png"
                                alt="Ascendia Logo"
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-foreground/60 mb-6 leading-relaxed">
                            Empowering the next generation of civil servants with world-class education and technology.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 bg-white/5 rounded-lg hover:bg-primary/20 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-lg hover:bg-primary/20 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-lg hover:bg-primary/20 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Platform</h4>
                        <ul className="space-y-4">
                            <li><Link href="#features" className="text-foreground/60 hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="#courses" className="text-foreground/60 hover:text-primary transition-colors">Courses</Link></li>
                            <li><Link href="#pricing" className="text-foreground/60 hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="/dashboard" className="text-foreground/60 hover:text-primary transition-colors">Student Portal</Link></li>
                            <li><Link href="/dashboard/teacher" className="text-foreground/60 hover:text-primary transition-colors">Teacher Portal</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Resources</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-foreground/60 hover:text-primary transition-colors">Syllabus Guide</Link></li>
                            <li><Link href="#" className="text-foreground/60 hover:text-primary transition-colors">Mock Test Series</Link></li>
                            <li><Link href="#" className="text-foreground/60 hover:text-primary transition-colors">UPSC Trends</Link></li>
                            <li><Link href="#" className="text-foreground/60 hover:text-primary transition-colors">Mentorship</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-foreground/60">
                                <Mail className="w-5 h-5 text-primary" />
                                <span>support@ascendia.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-foreground/60">
                                <Phone className="w-5 h-5 text-primary" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="text-foreground/60 mt-4 italic">
                                123, Civil Lines, New Delhi, India
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:row justify-between items-center gap-4 text-sm text-foreground/40">
                    <p>© 2026 Ascendia EdTech Solutions. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
                        <Link href="/refund" className="hover:text-primary">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
