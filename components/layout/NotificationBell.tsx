"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Bell,
    BellDot,
    CheckCheck,
    Megaphone,
    Mail,
    FileCheck,
    Briefcase,
    ShieldCheck,
    UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useNotifications, AppNotification } from "@/lib/notification-context"

const NOTIF_ICONS: Record<string, React.ElementType> = {
    INVITATION_RECEIVED: Mail,
    INVITATION_ACCEPTED: CheckCheck,
    INVITATION_REJECTED: CheckCheck,
    APPLICATION_RECEIVED: FileCheck,
    APPLICATION_STATUS_CHANGED: FileCheck,
    NEW_JOB_POSTED: Briefcase,
    COMPANY_PENDING_VERIFICATION: ShieldCheck,
    NEW_USER_REGISTERED: UserPlus,
}

// Maps each notification type to the URL the user should land on
const NOTIF_URL: Record<string, string> = {
    // Student receives these
    INVITATION_RECEIVED:         "/student?tab=invitations",
    APPLICATION_STATUS_CHANGED:  "/student?tab=applications",
    NEW_JOB_POSTED:              "/student?tab=jobs",
    // Company receives these
    APPLICATION_RECEIVED:        "/company?tab=applicants",
    INVITATION_ACCEPTED:         "/company?tab=applicants",
    INVITATION_REJECTED:         "/company?tab=applicants",
    // Admin receives these
    NEW_USER_REGISTERED:         "/admin/users",
    COMPANY_PENDING_VERIFICATION:"/admin/verify",
}

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return "Саяхан"
    if (m < 60) return `${m}м өмнө`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}ц өмнө`
    return `${Math.floor(h / 24)}ө өмнө`
}

export function NotificationBell() {
    const { notifications, unreadCount, markAllRead, removeNotification } = useNotifications()
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleOpenChange = (next: boolean) => {
        setOpen(next)
        // Mark all as read as soon as the bell is opened
        if (next && unreadCount > 0) markAllRead()
    }

    const handleClick = (n: AppNotification) => {
        setOpen(false)
        removeNotification(n.id)
        const url = NOTIF_URL[n.type]
        if (url) router.push(url)
    }

    return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                    {unreadCount > 0
                        ? <BellDot className="h-5 w-5 text-primary" />
                        : <Bell className="h-5 w-5" />
                    }
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-80 p-0 rounded-2xl shadow-lg border-border/40 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
                    <DropdownMenuLabel className="p-0 font-bold text-sm">
                        Мэдэгдэл
                    </DropdownMenuLabel>
                </div>

                {/* List */}
                <div className="max-h-[360px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
                            <Megaphone className="w-8 h-8 opacity-30" />
                            <p className="text-sm">Мэдэгдэл байхгүй байна</p>
                        </div>
                    ) : (
                        notifications.map((n) => {
                            const Icon = NOTIF_ICONS[n.type] ?? Bell
                            const hasUrl = !!NOTIF_URL[n.type]
                            return (
                                <DropdownMenuItem
                                    key={n.id}
                                    onClick={() => handleClick(n)}
                                    className={cn(
                                        "flex items-start gap-3 px-4 py-3 rounded-none border-b border-border/20 last:border-0 focus:bg-muted/50",
                                        !n.read && "bg-primary/5",
                                        hasUrl ? "cursor-pointer" : "cursor-default"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                                        !n.read ? "bg-primary/10" : "bg-muted"
                                    )}>
                                        <Icon className={cn("w-4 h-4", !n.read ? "text-primary" : "text-muted-foreground")} />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-0.5">
                                        <p className={cn("text-sm leading-snug", !n.read ? "font-semibold" : "font-medium")}>
                                            {n.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                                            {n.message}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground/60">{timeAgo(n.createdAt)}</p>
                                    </div>
                                    {!n.read && (
                                        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                                    )}
                                </DropdownMenuItem>
                            )
                        })
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
