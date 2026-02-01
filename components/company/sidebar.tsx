"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Briefcase, LayoutDashboard, FileText, Users, Building2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
    { href: "/company/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/company/jobs", label: "Job Listings", icon: FileText },
    { href: "/company/applicants", label: "Applicants", icon: Users },
    { href: "/company/profile", label: "Company Profile", icon: Building2 },
]

export function CompanySidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 border-r border-border bg-card min-h-screen flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-border">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-semibold text-lg text-foreground">InternMatch</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* Company Section */}
            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">TechCorp</p>
                        <p className="text-xs text-muted-foreground truncate">company@techcorp.com</p>
                    </div>
                </div>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
                    <Link href="/login">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                    </Link>
                </Button>
            </div>
        </aside>
    )
}
