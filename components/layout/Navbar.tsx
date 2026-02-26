"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Briefcase,
    Menu,
    LogOut,
    UserPlus,
    ChevronDown,
    Zap,
    Users,
    UserCircle,
    Settings,
    LayoutDashboard,
    LogIn
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useQuery, useApolloClient } from "@apollo/client/react"
import { ME } from "@/app/graphql/mutations"
import { User } from "@/lib/type"
import { toast } from "sonner"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const client = useApolloClient()

    const { data: userData } = useQuery<{ me: User }>(ME)
    const isLoggedIn = !!userData?.me

    const handleLogout = async () => {
        localStorage.removeItem("token")
        await client.clearStore()
        toast.success("Амжилттай гарлаа")
        router.push("/login")
        setIsOpen(false)
    }

    const AuthButtons = ({ className, mobile = false }: { className?: string, mobile?: boolean }) => (
        <div className={cn("flex items-center gap-3", className)}>
            <Button variant="ghost" size={mobile ? "lg" : "sm"} className="rounded-xl font-medium hover:bg-primary" asChild onClick={() => setIsOpen(false)}>
                <Link href="/login">
                    <LogIn className="w-4 h-4 mr-2 md:hidden " />
                    Нэвтрэх
                </Link>
            </Button>
            <Button size={mobile ? "lg" : "sm"} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold shadow-md shadow-primary/10 transition-all hover:-translate-y-0.5" asChild onClick={() => setIsOpen(false)}>
                <Link href="/signup">
                    <UserPlus className="w-4 h-4 mr-2 md:hidden" />
                    Бүртгүүлэх
                </Link>
            </Button>
        </div>
    )

    const UserProfileDropdown = ({ mobile = false }: { mobile?: boolean }) => {
        const user = userData?.me
        if (!user) return null

        const dashboardHref = user.role.toLowerCase() === 'admin' ? '/admin' : (user.role.toLowerCase() === 'company' ? '/company' : '/student')

        if (mobile) {
            return (
                <div className="space-y-4 px-2">
                    <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-2xl">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold truncate">{user.email}</span>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{user.role}</span>
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <Button variant="ghost" className="w-full justify-start h-12 rounded-xl" asChild onClick={() => setIsOpen(false)}>
                            <Link href={dashboardHref}>
                                <LayoutDashboard className="w-5 h-5 mr-3 text-muted-foreground" />
                                Хянах самбар
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start h-12 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleLogout}>
                            <LogOut className="w-5 h-5 mr-3" />
                            Гарах
                        </Button>
                    </div>
                </div>
            )
        }

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full ring-offset-background transition-all duration-300 ease-in-out hover:bg-secondary">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserCircle className="h-5 w-5 text-primary" />
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="w-56 p-2 rounded-2xl shadow-lg border-border/40 animate-in fade-in slide-in-from-top-2 duration-200">
                    <DropdownMenuLabel className="font-normal p-3">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-bold leading-none truncate">{user.email}</p>
                            <p className="text-[10px] uppercase tracking-widest leading-none text-muted-foreground">
                                {user.role}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/40" />
                    <DropdownMenuItem asChild className="rounded-xl p-2.5 transition-all duration-300 ease-in-out cursor-pointer">
                        <Link href={dashboardHref} className="flex items-center">
                            <LayoutDashboard className="mr-3 h-4 w-4 text-muted-foreground" />
                            <span>Хянах самбар</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="rounded-xl p-2.5 transition-all duration-300 ease-in-out cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span>Гарах</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50 w-full transition-all">
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-all">
                        <Briefcase className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-foreground">
                        Intern<span className="text-primary">Match</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-1">
                    {/* Jobs Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 px-4 rounded-xl font-semibold text-muted-foreground hover:text-white hover:bg-primary transition-all duration-300 ease-in-out data-[state=open]:text-primary group">
                                Ажлын байр
                                <ChevronDown className="ml-1.5 w-3.5 h-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180 opacity-60" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" sideOffset={8} className="w-48 p-2 rounded-2xl shadow-lg border-border/40 animate-in fade-in slide-in-from-top-2 duration-200 ">
                            <DropdownMenuItem asChild className="rounded-xl p-2.5 transition-all duration-300 ease-in-out  data-[highlighted]:bg-primary cursor-pointer group/item ">
                                <Link href="/jobs" className="flex items-center gap-3  ">
                                    <Briefcase className="w-4 h-4 text-muted-foreground group-hover/item:text-white  transition-all duration-300 ease-in-out " />
                                    <span className="text-sm font-medium  ">Бүх ажил</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-xl p-2.5 transition-all duration-300 ease-in-out  data-[highlighted]:bg-primary cursor-pointer group/item">
                                <Link href="/jobs?levels=intern" className="flex items-center gap-3">
                                    <Zap className="w-4 h-4 text-muted-foreground group-hover/item:text-white transition-all duration-300 ease-in-out" />
                                    <span className="text-sm font-medium">Бүх дадлага</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Students Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 px-4 rounded-xl font-semibold text-muted-foreground hover:text-white hover:bg-primary transition-all duration-300 ease-in-out data-[state=open]:text-primary group">
                                Оюутнууд
                                <ChevronDown className="ml-1.5 w-3.5 h-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180 opacity-60" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="start"
                            sideOffset={8}
                            className="w-56 p-2 rounded-2xl shadow-lg border-border/40 animate-in fade-in slide-in-from-top-2 duration-200"
                        >
                            <DropdownMenuItem
                                asChild
                                className="group rounded-xl p-0 cursor-pointer 
                                        data-[highlighted]:bg-primary 
                                        data-[highlighted]:text-white"
                            >
                                <Link
                                    href="/students"
                                    className="flex items-center gap-3 px-3 py-2 rounded-xl"
                                >
                                    <Users className="w-4 h-4 text-muted-foreground group-data-[highlighted]:text-white transition-colors duration-200" />

                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium group-data-[highlighted]:text-white transition-colors duration-200">
                                            Бүх оюутнууд
                                        </span>

                                        <span className="text-[9px] text-orange-600 font-bold uppercase tracking-tighter group-data-[highlighted]:text-white transition-colors duration-200">
                                            Зөвхөн Компани
                                        </span>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-2">
                    {/* Auth Status */}
                    {isLoggedIn ? (
                        <div className="hidden md:flex items-center gap-2">
                            <UserProfileDropdown />
                        </div>
                    ) : (
                        <AuthButtons className="hidden md:flex" />
                    )}

                    <div className="h-6 w-px bg-border/40 mx-2 hidden md:block" />

                    <ThemeToggle />

                    {/* Mobile Menu Trigger */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden rounded-xl hover:bg-secondary">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] p-0 border-l border-border/40">
                            <SheetHeader className="p-6 border-b border-border/40 text-left bg-secondary/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                        <Briefcase className="w-5 h-5 text-primary-foreground" />
                                    </div>
                                    <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
                                </div>
                            </SheetHeader>

                            <div className="flex flex-col gap-6 p-6">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 opacity-60">Ажлын байр</p>
                                    <div className="grid gap-1">
                                        <Link href="/jobs" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors font-medium text-sm" onClick={() => setIsOpen(false)}>
                                            <Briefcase className="w-5 h-5 text-muted-foreground" />
                                            Бие даасан ажил
                                        </Link>
                                        <Link href="/jobs?levels=intern" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors font-medium text-sm" onClick={() => setIsOpen(false)}>
                                            <Zap className="w-5 h-5 text-muted-foreground" />
                                            Дадлагын зар
                                        </Link>
                                    </div>
                                </div>

                                <div className="space-y-3 border-t border-border/40 pt-6">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 opacity-60">Оюутнууд</p>
                                    <div className="grid gap-1">
                                        <Link href="/students" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors font-medium text-sm" onClick={() => setIsOpen(false)}>
                                            <Users className="w-5 h-5 text-muted-foreground" />
                                            <div className="flex flex-col">
                                                <span>Бүх оюутнууд</span>
                                                <span className="text-[9px] text-orange-600 font-bold uppercase tracking-tighter">Зөвхөн Компани</span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                <div className="mt-4 border-t border-border/40 pt-6">
                                    {isLoggedIn ? (
                                        <UserProfileDropdown mobile />
                                    ) : (
                                        <AuthButtons className="flex-col w-full" mobile />
                                    )}
                                </div>
                            </div>

                            <div className="absolute bottom-8 left-0 right-0 px-6">
                                <p className="text-[10px] text-center text-muted-foreground opacity-50 font-medium">
                                    © 2026 InternMatch Platform. <br /> Бүх эрх хуулиар хамгаалагдсан.
                                </p>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    )
}
