"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Search, Loader2, CheckCircle, Building2, MapPin, Wallet, AlertCircle, Users2,
} from "lucide-react"
import { Job, Application } from "@/lib/type"
import { cn } from "@/lib/utils"

const getTimeRemaining = (deadline?: string) => {
    if (!deadline) return null
    const diff = new Date(deadline).getTime() - new Date().getTime()
    if (diff <= 0) return "Хугацаа дууссан"
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days > 0) return `${days} хоног үлдсэн`
    const hours = Math.floor(diff / (1000 * 60 * 60))
    return `${hours} цаг үлдсэн`
}

type Props = {
    jobs?: Job[]
    applications?: Application[]
    loading: boolean
    applyingJobId: string | null
    onApply: (jobId: string) => void
}

export function StudentJobsTab({ jobs, applications, loading, applyingJobId, onApply }: Props) {
    const router = useRouter()

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
                <h2 className="text-xl font-bold tracking-tight">Нээлттэй дадлагууд</h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {jobs?.length || 0} нээлттэй зар
                </p>
            </div>
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-2xl bg-secondary/20 animate-pulse" />)}
                </div>
            ) : (
                <div className="grid gap-4">
                    {(() => {
                        // eslint-disable-next-line react-hooks/purity
                        const now = Date.now()
                        return jobs?.map((job) => {
                            const isApplied = applications?.some(app => app.jobId === job.id) ||
                                applications?.some(app => app.job?.id === job.id)
                            const isExpired = job.deadline ? new Date(job.deadline).getTime() < now : false

                        return (
                            <Card key={job.id} className={cn("group transition-all border-border/60 shadow-sm rounded-2xl overflow-hidden bg-background", isExpired ? "opacity-50 pointer-events-none" : "hover:border-primary/40")}>
                                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 text-sm">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-secondary/30 rounded-xl flex items-center justify-center border border-border/40 overflow-hidden shrink-0">
                                                {job.company?.logoUrl ? (
                                                    <Image src={job.company.logoUrl} alt={job.company.companyName || ""} width={40} height={40} className="object-cover w-full h-full" />
                                                ) : (
                                                    <span className="text-sm font-medium text-primary/50 uppercase">
                                                        {job.company?.companyName?.[0] || <Building2 className="w-4 h-4 text-muted-foreground" />}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col cursor-pointer" onClick={() => router.push(`/jobs/${job.id}`)}>
                                                <h3 className="font-bold text-base leading-none mb-1 group-hover:text-primary transition-colors">{job.title}</h3>
                                                <p className="text-xs font-bold text-primary flex items-center gap-1 leading-none">
                                                    {job.company?.companyName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground/80 lowercase tracking-tight">
                                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                                            <span className="flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" />{job.salaryRange || "Цалин тодорхойгүй"}</span>
                                            <span className="flex items-center gap-1.5"><Users2 className="w-3.5 h-3.5" />{job.applicationCount}{job.maxParticipants ? `/${job.maxParticipants}` : ""} өргөдөл</span>
                                            <span className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] uppercase font-medium">{job.type}</span>
                                            {job.deadline && (
                                                <span className={cn(
                                                    "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] uppercase font-medium",
                                                    new Date(job.deadline).getTime() - now < 86400000 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                                                )}>
                                                    <AlertCircle className="w-3 h-3" />
                                                    {getTimeRemaining(job.deadline)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        size="sm"
                                        onClick={() => onApply(job.id)}
                                        disabled={applyingJobId !== null || isApplied}
                                        variant={isApplied ? "outline" : "default"}
                                        className={cn("h-9 rounded-xl px-6 font-bold text-xs",
                                            isApplied && "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 opacity-100"
                                        )}
                                    >
                                        {isApplied ? (
                                            <><CheckCircle className="mr-2 h-3.5 w-3.5" />Илгээсэн</>
                                        ) : applyingJobId === job.id ? (
                                            <><Loader2 className="animate-spin mr-2 h-3.5 w-3.5" />Илгээж байна...</>
                                        ) : (
                                            "Илгээх"
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                        }) || []
                    })()}
                    {jobs?.length === 0 && (
                        <div className="py-20 text-center space-y-3 bg-secondary/10 rounded-2xl border-2 border-dashed border-border/40">
                            <Search className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                            <p className="text-sm font-bold text-muted-foreground">Одоогоор нээлттэй дадлагын байр алга байна.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
