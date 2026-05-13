"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { User, FileText, Search, Mail, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type StudentTabId = "profile" | "jobs" | "applications" | "invitations"

const NAV_ITEMS: { id: StudentTabId; name: string; icon: LucideIcon }[] = [
    { id: "profile", name: "Профайл", icon: User },
    { id: "jobs", name: "Дадлагууд", icon: Search },
    { id: "applications", name: "Миний хүсэлтүүд", icon: FileText },
    { id: "invitations", name: "Ирсэн урилгууд", icon: Mail },
]

type Props = {
    activeTab: StudentTabId
    onSelect: (tab: StudentTabId) => void
}

export function StudentSidebar({ activeTab, onSelect }: Props) {
    return (
        <div className="flex flex-col gap-1.5 py-4">
            {NAV_ITEMS.map((item, i) => {
                const isActive = activeTab === item.id
                return (
                    <div
                        key={item.id}
                        className="animate-in fade-in slide-in-from-left-2 duration-300"
                        style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}
                    >
                        <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start h-10 px-3 rounded-xl transition-all duration-200 text-sm",
                                isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                            )}
                            onClick={() => onSelect(item.id)}
                        >
                            <item.icon className={cn("w-4 h-4 mr-3 transition-colors duration-200", isActive ? "text-primary" : "text-muted-foreground")} />
                            <span className="font-bold">{item.name}</span>
                            <div className={cn("ml-auto w-1 rounded-full bg-primary transition-all duration-200", isActive ? "h-3 opacity-100 scale-100" : "h-0 opacity-0 scale-75")} />
                        </Button>
                    </div>
                )
            })}
        </div>
    )
}
