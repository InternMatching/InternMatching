"use client"

import React, { useEffect, useState } from "react"
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
    Briefcase as LogoIcon,
    UserCircle,
    ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useQuery, useApolloClient } from "@apollo/client/react"
import { ME } from "../graphql/mutations"
import { User } from "@/lib/type"
import { ThemeToggle } from "@/components/theme-toggle"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navItems = [
    { name: 'Хянах самбар', href: '/admin', icon: LayoutDashboard },
    { name: 'Хэрэглэгчид', href: '/admin/users', icon: Users },
    { name: 'Баталгаажуулах', href: '/admin/verify', icon: ShieldCheck },
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
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push('/login')
            return
        }

        if (!userLoading && userData?.me && userData.me.role !== 'admin') {
            toast.error("Зөвхөн админ нэвтрэх боломжтой.")
            router.push('/')
        }
    }, [userData, userLoading, router])

    const client = useApolloClient()

    const handleLogout = async () => {
        localStorage.removeItem("token")
        await client.clearStore()
        toast.success("Амжилттай гарлаа")
        router.push('/login')
    }

    if (userLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    )

    const SidebarContent = () => (
        <div className="flex flex-col gap-1 py-4">
            {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                        <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start h-9 px-3 rounded-xl transition-all duration-200 text-xs",
                                isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("w-3.5 h-3.5 mr-3", isActive ? "text-primary" : "text-muted-foreground")} />
                            <span className="font-bold">{item.name}</span>
                        </Button>
                    </Link>
                )
            })}
        </div>
    )

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
            {/* Header */}
            <header className="bg-background/60 backdrop-blur-xl border-b border-border/40 sticky top-0 z-40">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[260px] p-0 bg-background border-r border-border/40">
                                <SheetHeader className="p-5 border-b border-border/40 text-left">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                                            <LogoIcon className="w-4 h-4 text-primary-foreground" />
                                        </div>
                                        <SheetTitle className="text-lg font-bold">InternMatch</SheetTitle>
                                    </div>
                                </SheetHeader>
                                <div className="p-3">
                                    <SidebarContent />
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Logo */}
                        <Link href="/admin" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/10 transition-all duration-300 ease-in-out">
                                <LogoIcon className="w-4.5 h-4.5 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-base hidden sm:block tracking-tight text-foreground">
                                InternMatch <span className="text-primary font-medium tracking-normal">Admin</span>
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-3">
                        <ThemeToggle />
                        <span className="h-6 w-px bg-border/40 hidden sm:block" />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-9 px-2.5 rounded-xl gap-2 hover:bg-secondary">
                                    <div className="w-6.5 h-6.5 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
                                        <UserCircle className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-xs font-bold text-foreground hidden sm:inline-block">Админ</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" sideOffset={8} className="w-52 p-1.5 rounded-2xl shadow-xl border-border/40 bg-background">
                                <DropdownMenuLabel className="font-normal px-3 py-2">
                                    <div className="flex flex-col space-y-0.5">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Систем хариуцагч</p>
                                        <p className="text-sm font-bold leading-none truncate text-foreground">
                                            {userData?.me?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border/40" />
                                <DropdownMenuItem asChild className="rounded-xl px-3 py-2 transition-all cursor-pointer font-bold text-xs">
                                    <Link href="/admin/settings" className="flex items-center">
                                        <Settings className="mr-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                        <span>Тохиргоо</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="rounded-xl px-3 py-2 transition-all cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-bold text-xs"
                                >
                                    <LogOut className="mr-2.5 h-3.5 w-3.5" />
                                    <span>Гарах</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-60 shrink-0">
                        <div className="sticky top-24">
                            <SidebarContent />
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
