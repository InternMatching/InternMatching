"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Clock, Building2, AlertCircle } from "lucide-react"
import { Application } from "@/lib/type"
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
    applications?: Application[]
    loading: boolean
}

export function StudentApplicationsTab({ applications, loading }: Props) {
    const router = useRouter()

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
                <h2 className="text-xl font-bold tracking-tight">Илгээсэн хүсэлтүүд</h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {applications?.length || 0} хүсэлт
                </p>
            </div>
            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-24 rounded-2xl bg-secondary/20 animate-pulse" />)}
                </div>
            ) : (
                <div className="grid gap-4">
                    {applications?.map((app) => (
                        <Card key={app.id} className="border-border/60 bg-background rounded-2xl shadow-sm">
                            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1.5 font-medium">
                                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push(`/jobs/${app.job?.id}`)}>
                                        <div className="w-10 h-10 bg-secondary/30 rounded-xl flex items-center justify-center border border-border/40 overflow-hidden shrink-0">
                                            {app.job?.company?.logoUrl ? (
                                                <Image src={app.job.company.logoUrl} alt={app.job.company.companyName || ""} width={40} height={40} className="object-cover w-full h-full" />
                                            ) : (
                                                <span className="text-sm font-black text-primary/50 uppercase">
                                                    {app.job?.company?.companyName?.[0] || <Building2 className="w-4 h-4 text-muted-foreground" />}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base leading-none group-hover:text-primary transition-colors">{app.job?.title}</h3>
                                            <p className="text-xs font-bold text-primary mt-0.5">{app.job?.company?.companyName} • {app.job?.location}</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase font-bold tracking-widest pt-1">
                                        <Clock className="w-3 h-3" />
                                        Илгээсэн: {new Date(app.appliedAt).toLocaleDateString()}
                                    </p>
                                    {app.job?.deadline && (
                                        <p className={cn(
                                            "text-[10px] flex items-center gap-1.5 uppercase font-bold tracking-widest pt-1",
                                            new Date(app.job.deadline).getTime() - new Date().getTime() < 86400000 ? "text-red-600" : "text-amber-600"
                                        )}>
                                            <AlertCircle className="w-3 h-3" />
                                            Дуусах хугацаа: {new Date(app.job.deadline).toLocaleDateString()} ({getTimeRemaining(app.job.deadline)})
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col sm:items-end gap-2.5">
                                    <span className={cn(
                                        "text-[9px] font-black px-2.5 py-1 rounded-md flex items-center gap-1.5 uppercase tracking-widest border",
                                        app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                            app.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200'
                                    )}>
                                        {app.status}
                                    </span>
                                    <div className="text-[10px] font-bold text-muted-foreground/60 bg-secondary/40 px-2 py-0.5 rounded-md self-start sm:self-auto">
                                        MATCH: {Math.round(app.matchScore)}%
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {applications?.length === 0 && (
                        <div className="py-20 text-center space-y-3 bg-secondary/10 rounded-2xl border-2 border-dashed border-border/40">
                            <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                            <p className="text-sm font-bold text-muted-foreground">Одоогоор хүсэлт байхгүй байна.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
