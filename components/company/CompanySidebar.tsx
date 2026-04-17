"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Building, Briefcase, Users, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type CompanyTabId = "profile" | "jobs" | "applicants" | "students"

const NAV_ITEMS: { id: CompanyTabId; name: string; icon: LucideIcon }[] = [
    { id: "profile", name: "Компаний мэдээлэл", icon: Building },
    { id: "jobs", name: "Дадлагын зарууд", icon: Briefcase },
    { id: "applicants", name: "Хүсэлтүүд", icon: Users },
    { id: "students", name: "Оюутнууд", icon: Users },
]

type Props = {
    activeTab: CompanyTabId
    onSelect: (tab: CompanyTabId) => void
}

export function CompanySidebar({ activeTab, onSelect }: Props) {
    return (
        <div className="flex flex-col gap-1.5 py-4">
            {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id
                return (
                    <Button
                        key={item.id}
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                            "w-full justify-start h-10 px-3 rounded-xl transition-all duration-200 text-sm",
                            isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => onSelect(item.id)}
                    >
                        <item.icon className={cn("w-4 h-4 mr-3", isActive ? "text-primary" : "text-muted-foreground")} />
                        <span className="font-bold">{item.name}</span>
                        {isActive && <div className="ml-auto w-1 h-3 bg-primary rounded-full" />}
                    </Button>
                )
            })}
        </div>
    )
}
