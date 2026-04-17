"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Job } from "@/lib/type"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const getJobShareUrl = (job: Job) =>
    `${window.location.origin}/jobs?levels=${job.type.toLowerCase()}`

type Props = {
    job: Job
    onClose: () => void
}

export function JobShareDialog({ job, onClose }: Props) {
    const [copied, setCopied] = useState(false)

    const handleShareFB = () => {
        const url = getJobShareUrl(job)
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(`${job.title} - ${job.company?.companyName || ""} | InternMatch`)}`,
            "_blank",
            "width=600,height=400"
        )
        onClose()
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(getJobShareUrl(job))
        setCopied(true)
        toast.success("Линк хуулагдлаа!")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="fixed inset-0 bg-black/60 animate-in fade-in-0 duration-200" />
            <div
                className="relative z-50 w-full max-w-sm mx-4 bg-background rounded-2xl border border-border/40 shadow-2xl p-6 space-y-5 animate-in fade-in-0 zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-1">
                    <h3 className="text-base font-bold">Хуваалцах</h3>
                    <p className="text-xs text-muted-foreground truncate">
                        {job.title} — {job.company?.companyName}
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <Button
                        variant="outline"
                        className="w-full h-11 rounded-xl font-bold text-sm gap-3 justify-start text-[#1877F2] border-[#1877F2]/20 hover:bg-[#1877F2]/5"
                        onClick={handleShareFB}
                    >
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook-д хуваалцах
                    </Button>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-secondary/30 border border-border/40">
                        <input
                            readOnly
                            value={getJobShareUrl(job)}
                            className="flex-1 bg-transparent text-xs font-medium text-muted-foreground outline-none truncate px-1"
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-8 rounded-lg px-3 font-bold text-xs gap-1.5 shrink-0",
                                copied ? "text-emerald-600" : "hover:bg-primary/10 hover:text-primary"
                            )}
                            onClick={handleCopyLink}
                        >
                            {copied ? (
                                <><Check className="w-3.5 h-3.5" />Хуулсан</>
                            ) : (
                                <><Copy className="w-3.5 h-3.5" />Хуулах</>
                            )}
                        </Button>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full h-9 rounded-xl text-xs font-bold text-muted-foreground"
                    onClick={onClose}
                >
                    Хаах
                </Button>
            </div>
        </div>
    )
}
