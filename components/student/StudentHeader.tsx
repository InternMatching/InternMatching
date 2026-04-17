"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Briefcase, Menu, UserCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { StudentProfile } from "@/lib/type"

type Props = {
    profile?: StudentProfile | null
    email?: string
    isMenuOpen: boolean
    setIsMenuOpen: (open: boolean) => void
    sidebar: React.ReactNode
    onLogout: () => void
}

export function StudentHeader({ profile, email, isMenuOpen, setIsMenuOpen, sidebar, onLogout }: Props) {
    const router = useRouter()
    const displayName = profile?.firstName || "Оюутан"
    const fullName = profile?.firstName ? `${profile.firstName} ${profile.lastName || ""}` : "Оюутан"

    return (
        <header className="bg-background/60 backdrop-blur-xl border-b border-border/40 sticky top-0 z-40">
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[260px] p-0 bg-background border-r border-border/40">
                            <SheetHeader className="p-5 border-b border-border/40 text-left">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                                        <Briefcase className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                    <SheetTitle className="text-lg font-bold">InternMatch</SheetTitle>
                                </div>
                            </SheetHeader>
                            <div className="p-3">{sidebar}</div>
                        </SheetContent>
                    </Sheet>

                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push("/")}>
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/10 transition-all duration-300 ease-in-out">
                            <Briefcase className="w-4.5 h-4.5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-base hidden sm:block tracking-tight text-foreground">
                            InternMatch <span className="text-primary/70 font-medium">Student</span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-3">
                    <ThemeToggle />
                    <span className="h-6 w-px bg-border/40 hidden sm:block" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-9 px-2.5 rounded-xl gap-2 hover:bg-secondary">
                                <div className="w-6.5 h-6.5 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10 overflow-hidden">
                                    {profile?.profilePictureUrl ? (
                                        <Image src={profile.profilePictureUrl} alt="Profile" width={26} height={26} className="object-cover w-full h-full" />
                                    ) : (
                                        <UserCircle className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                                <span className="text-xs font-bold text-foreground hidden sm:inline-block max-w-[100px] truncate">
                                    {displayName}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-2 rounded-2xl shadow-xl border-border/40 bg-background">
                            <div className="px-3 py-3 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10 overflow-hidden shrink-0">
                                    {profile?.profilePictureUrl ? (
                                        <Image src={profile.profilePictureUrl} alt="Profile" width={40} height={40} className="object-cover w-full h-full" />
                                    ) : (
                                        <UserCircle className="h-5 w-5 text-primary" />
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <p className="text-sm font-bold leading-tight truncate text-foreground">{fullName}</p>
                                    <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">{email}</p>
                                </div>
                            </div>
                            <DropdownMenuSeparator className="bg-border/40 my-1" />
                            <DropdownMenuItem
                                onClick={onLogout}
                                className="rounded-xl px-3 py-2.5 transition-all cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-bold text-xs gap-2.5"
                            >
                                <LogOut className="h-4 w-4" />
                                Системээс гарах
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
