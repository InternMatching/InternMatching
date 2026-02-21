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
    ChevronLeft,
    Menu,
    Search,
    Bell,
    UserRound,
    ShieldCheck,
    ClipboardList,
    History
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"
import { useTheme } from "next-themes"

const GET_ME = gql`
  query GetMe {
    me {
      id
      themeColor
    }
  }
`

interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    exp: number;
}

const navItems = [
    { name: 'Хянах самбар', href: '/admin', icon: LayoutDashboard },
    { name: 'Хэрэглэгчид', href: '/admin/users', icon: Users },
    { name: 'Компани баталгаажуулах', href: '/admin/verify', icon: ShieldCheck },
    { name: 'Компаниуд', href: '/admin/companies', icon: Building2 },
    { name: 'Ажлын зарууд', href: '/admin/jobs', icon: Briefcase },
    { name: 'Өргөдлүүд', href: '/admin/applications', icon: ClipboardList },
    { name: 'Аналитик', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Тохиргоо', href: '/admin/settings', icon: Settings },
    { name: 'Үйлдлийн бүртгэл', href: '/admin/logs', icon: History },
]

interface GetMeData {
    me: {
        id: string;
        themeColor?: string;
    }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
<<<<<<< HEAD
=======
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [user, setUser] = useState<JWTPayload | null>(null)
>>>>>>> 45fcd0d1879a0211dea6c8be8426c06bf96adb8b
    const pathname = usePathname()
    const router = useRouter()
    const { data: meData } = useQuery<GetMeData>(GET_ME)
    const { setTheme } = useTheme()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [user, setUser] = useState<JWTPayload | null>(null)
    const [hasSyncedTheme, setHasSyncedTheme] = useState(false)

    useEffect(() => {
        if (meData?.me?.themeColor && !hasSyncedTheme) {
            const savedTheme = meData.me.themeColor === 'dark' ? 'dark' : 'light'
            setTheme(savedTheme)
            setHasSyncedTheme(true)
        }
    }, [meData, setTheme, hasSyncedTheme])

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            try {
                const base64Url = token.split('.')[1]
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
                const decoded = JSON.parse(jsonPayload)

                if (decoded.role !== 'admin') {
                    toast.error("Unauthorized. Admin access only.")
                    router.push('/')
                } else {
                    setUser(decoded)
                }
            } catch (e) {
                router.push('/login')
            }
        } else {
            router.push('/login')
        }
    }, [router])

    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    const handleLogout = () => {
        localStorage.removeItem("token")
        toast.success("Logged out successfully")
        router.push('/login')
    }

    if (!user) return null

    const SidebarContent = ({ isMobile = false }) => (
        <div className="flex flex-col h-full">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
                {(isSidebarOpen || isMobile) ? (
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">InternMatch</span>
                ) : (
                    <span className="text-xl font-bold text-primary">IM</span>
                )}
                {!isMobile && (
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors hidden lg:block"
                    >
                        <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`} />
                    </button>
                )}
                {isMobile && (
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors lg:hidden"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 group ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary transition-colors duration-200'}`} />
                            <span className={`text-sm font-medium transition-opacity duration-300 ${(isSidebarOpen || isMobile) ? 'opacity-100' : 'opacity-0 invisible w-0'}`}>
                                {item.name}
                            </span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 group`}
                >
                    <LogOut className="w-5 h-5 shrink-0 group-hover:text-red-600" />
                    <span className={`text-sm font-medium transition-opacity duration-300 ${(isSidebarOpen || isMobile) ? 'opacity-100' : 'opacity-0 invisible w-0'}`}>
                        Гарах
                    </span>
                </button>
            </div>
        </div>
    )

    return (
        <div className="flex h-dvh bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* Desktop Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'
                    } fixed inset-y-0 left-0 z-50 transition-[width] duration-300 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col shadow-sm`}
            >
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            <div
                className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <div
                    className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                <aside
                    className={`absolute inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <SidebarContent isMobile />
                </aside>
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col h-full min-w-0 transition-[margin] duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-4 sm:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden text-slate-500"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden sm:block flex-1 max-w-xl">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Бүх хэсгээс хайх..."
                                    className="pl-10 h-10 w-64 md:w-80 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white dark:focus-visible:bg-slate-900 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:bg-slate-100 rounded-xl relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
<<<<<<< HEAD
                                <button className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 border border-transparent">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-200 dark:shadow-none">
                                        {(user.email?.[0] || 'A').toUpperCase()}
=======
                                <button className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-200 dark:shadow-none">
                                        {user.email[0].toUpperCase()}
>>>>>>> 45fcd0d1879a0211dea6c8be8426c06bf96adb8b
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-[10px] font-bold text-slate-900 dark:text-white leading-none mb-1">{user.email}</p>
                                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none">Админ</p>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 mt-2 rounded-xl" align="end">
                                <DropdownMenuLabel>Миний бүртгэл</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="rounded-lg cursor-pointer flex items-center gap-2">
                                    <UserRound className="w-4 h-4" /> Профайл
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg cursor-pointer flex items-center gap-2">
                                    <Settings className="w-4 h-4" /> Тохиргоо
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="rounded-lg cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 flex items-center gap-2">
                                    <LogOut className="w-4 h-4" /> Гарах
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    )
}
