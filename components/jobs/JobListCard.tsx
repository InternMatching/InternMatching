"use client"

import Image from "next/image"
import { Building2, Wallet, Users2 } from "lucide-react"
import { Job } from "@/lib/type"
import { cn } from "@/lib/utils"

const getTimeAgo = (dateStr: string) => {
    const diff = new Date().getTime() - new Date(dateStr).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return "Өнөөдөр"
    if (days === 1) return "Өчигдөр"
    return `${days} өдрийн өмнө`
}

type Props = {
    job: Job
    isSelected: boolean
    onClick: () => void
}

export function JobListCard({ job, isSelected, onClick }: Props) {
    return (
        <div
            className={cn(
                "flex items-start gap-3.5 p-4 cursor-pointer transition-all hover:bg-secondary/30",
                isSelected && "bg-primary/5 border-l-2 border-l-primary"
            )}
            onClick={onClick}
        >
            <div className="w-11 h-11 rounded-xl bg-secondary/40 flex items-center justify-center border border-border/30 overflow-hidden shrink-0 mt-0.5">
                {job.company?.logoUrl ? (
                    <Image src={job.company.logoUrl} alt="" width={44} height={44} className="object-cover w-full h-full" />
                ) : (
                    <Building2 className="w-5 h-5 text-muted-foreground/40" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold leading-tight mb-1 truncate">{job.title}</h3>
                <div className="flex items-center gap-1.5 text-xs mb-1.5">
                    <span className="text-primary font-bold truncate">{job.company?.companyName}</span>
                    <span className="text-muted-foreground/50 shrink-0">{getTimeAgo(job.postedAt)}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
                    <span className="flex items-center gap-1"><Wallet className="w-3 h-3" />{job.salaryRange || "Тохиролцоно"}</span>
                    <span className="flex items-center gap-1"><Users2 className="w-3 h-3" />{job.applicationCount}</span>
                    {job.matchScore != null && (
                        <span className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-bold",
                            job.matchScore >= 70 ? "text-emerald-600 bg-emerald-50" :
                            job.matchScore >= 40 ? "text-amber-600 bg-amber-50" :
                            "text-muted-foreground bg-secondary/40"
                        )}>
                            {Math.round(job.matchScore)}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
