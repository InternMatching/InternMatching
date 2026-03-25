"use client"

import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react"

interface FooterProps {
    compact?: boolean
}

export function Footer({ compact }: FooterProps) {
    return (
        <footer className={`border-t border-border bg-background ${compact ? "py-8" : "py-16"}`}>
            <div className="container mx-auto px-6 lg:px-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                    {/* AI туслах */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-primary text-lg">AI туслах</h4>
                        <ul className="space-y-3 text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    AI - CV Хөрвүүлэгч
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Inter match гэж юу вэ? */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-primary text-lg">Intern match гэж юу вэ?</h4>
                        <ul className="space-y-3 text-muted-foreground">
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    Бидний алсын хараа
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    Үнийн санал
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    Холбоо барих
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Холбоо барих */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-primary text-lg">Холбоо барих</h4>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                +976 99119911
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                Internmatch@gmail.com
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                Eco tower, Хан-уул дүүрэг, Улаанбаатар
                            </li>
                        </ul>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3 pt-2">
                            <Link
                                href="#"
                                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                            >
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link
                                href="#"
                                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                            >
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link
                                href="#"
                                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                            >
                                <Linkedin className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
                    <div className="flex flex-wrap justify-center items-center gap-4">
                        <Link href="#" className="hover:text-primary transition-colors">
                            Үйлчилгээний нөхцөл
                        </Link>
                        <Link href="#" className="hover:text-primary transition-colors">
                            Нууцлалын бодлого
                        </Link>
                        <span>@2026 Internmatch</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
