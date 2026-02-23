"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    Building2,
    Briefcase,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    ShieldCheck,
    ClipboardList,
    History,
    Briefcase as LogoIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useQuery } from "@apollo/client/react"
import { ME } from "../graphql/mutations"
import { User } from "@/lib/type"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
    { name: 'Хянах самбар', href: '/admin', icon: LayoutDashboard },
    { name: 'Хэрэглэгчид', href: '/admin/users', icon: Users },
    { name: 'Компани баталгаажуулах', href: '/admin/verify', icon: ShieldCheck },
    { name: 'Компаниуд', href: '/admin/companies', icon: Building2 },
    { name: 'Ажлын зарууд', href: '/admin/jobs', icon: Briefcase },
    { name: 'Өргөдлүүд', href: '/admin/applications', icon: ClipboardList },
    { name: 'Аналитик', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Үйлдлийн бүртгэл', href: '/admin/logs', icon: History },
    { name: 'Тохиргоо', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const { data: userData, loading: userLoading } = useQuery<{ me: User }>(ME)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push('/login')
            return
        }

        if (!userLoading && userData?.me && userData.me.role !== 'admin') {
            toast.error("Unauthorized. Admin access only.")
            router.push('/')
        }
    }, [userData, userLoading, router])

    const handleLogout = () => {
        localStorage.removeItem("token")
        toast.success("Logged out successfully")
        router.push('/login')
    }

    if (userLoading) return null

    return (
        <div className="min-h-screen bg-secondary/10 flex flex-col">
            {/* Simple Header */}
            <header className="bg-background border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <LogoIcon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-semibold text-xl">InternMatch Admin</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden md:block">{userData?.me?.email}</span>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <LogOut className="w-4 h-4 mr-2" />
                            Гарах
                        </Button>
                        <ThemeToggle />
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            <Menu className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col gap-2 w-full md:w-64 shrink-0`}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "default" : "ghost"}
                                    className="w-full justify-start text-sm"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <item.icon className="w-4 h-4 mr-2" />
                                    {item.name}
                                </Button>
                            </Link>
                        )
                    })}
                </aside>

                {/* Content Area */}
                <section className="flex-1 min-w-0">
                    {children}
                </section>
            </main>
        </div>
    )
}
