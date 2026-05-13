"use client"

import Image from "next/image"
import {
    Building2,
    MapPin,
    Clock,
    Users2,
    Quote,
    Calendar,
    Globe,
    Share2,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Job } from "@/lib/type"
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

const getTimeAgo = (dateStr: string) => {
    const diff = new Date().getTime() - new Date(dateStr).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return "Өнөөдөр"
    if (days === 1) return "Өчигдөр"
    return `${days} өдрийн өмнө`
}

type Props = {
    job: Job
    onApply: (jobId: string) => void
    onShare: (job: Job) => void
}

export function JobDetailPanel({ job, onApply, onShare }: Props) {
    return (
        <div className="space-y-6">
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center border border-border/40 overflow-hidden shrink-0">
                    {job.company?.logoUrl ? (
                        <Image src={job.company.logoUrl} alt="" width={64} height={64} className="object-cover w-full h-full" />
                    ) : (
                        <Building2 className="w-8 h-8 text-muted-foreground/40" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold tracking-tight leading-tight mb-1.5">{job.title}</h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                        <span className="text-primary">{job.company?.companyName}</span>
                        <span className="text-muted-foreground/50">{getTimeAgo(job.postedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-bold text-muted-foreground">
                        <Users2 className="w-3 h-3" />
                        <span>Өнөөдөр {job.applicationCount} өргөдөл илгээсэн</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-primary/10"
                        onClick={() => onShare(job)}
                    >
                        <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                        className="h-10 rounded-xl font-bold text-xs px-5"
                        onClick={() => onApply(job.id)}
                    >
                        Илгээх
                    </Button>
                </div>
            </div>

            <div className={cn("grid gap-3", job.matchScore != null ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3")}>
                {job.matchScore != null && (
                    <div className={cn(
                        "p-4 rounded-2xl border text-center",
                        job.matchScore >= 70 ? "bg-emerald-50 border-emerald-100" :
                            job.matchScore >= 40 ? "bg-amber-50 border-amber-100" :
                                "bg-secondary/20 border-border/30"
                    )}>
                        <p className={cn(
                            "text-3xl font-bold",
                            job.matchScore >= 70 ? "text-emerald-600" :
                                job.matchScore >= 40 ? "text-amber-600" :
                                    "text-muted-foreground"
                        )}>{Math.round(job.matchScore)}%</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Тохирол</p>
                    </div>
                )}
                <div className="p-4 rounded-2xl bg-secondary/20 border border-border/30 text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Цалин</p>
                    <p className="text-sm font-bold">{job.salaryRange || "Тохиролцоно"}</p>
                </div>
                <div className="p-4 rounded-2xl bg-secondary/20 border border-border/30 text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Хүсч буй</p>
                    <p className="text-sm font-bold">{job.maxParticipants || "—"}</p>
                </div>
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center">
                    <p className="text-3xl font-bold text-primary">{job.applicationCount}</p>
                    <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">Өргөдөл</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/10 border border-border/20">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Байршил</p>
                        <p className="text-xs font-bold">{job.location || "—"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/10 border border-border/20">
                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Хугацаа</p>
                        <p className="text-xs font-bold">{job.deadline ? getTimeRemaining(job.deadline) : "Тодорхойгүй"}</p>
                    </div>
                </div>
            </div>

            {job.requiredSkills && job.requiredSkills.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Шаардагдах ур чадвар</h3>
                    <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.map((skill, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/30 text-xs font-bold">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {job.responsibilities && (
                <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        Гүйцэтгэх үндсэн үүрэг
                        <div className="h-px flex-1 bg-primary/10" />
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground/80 font-medium p-2">{job.responsibilities}</p>
                </div>
            )}

            {job.requirements && (
                <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                        Тавигдах шаардлага
                        <div className="h-px flex-1 bg-primary/10" />
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground/80 font-medium my-4">{job.requirements}</p>
                </div>
            )}


            {job.additionalInfo && (
                <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        Нэмэлт мэдээлэл
                        <div className="h-px flex-1 bg-border/40" />
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground  font-medium my-4">{job.additionalInfo}</p>
                </div>
            )}

            <Card className="border-border/60 rounded-2xl overflow-hidden shadow-none bg-background">
                <CardHeader className="pb-3 border-b border-border/40">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary/30 flex items-center justify-center border border-border/40 overflow-hidden shrink-0">
                            {job.company?.logoUrl ? (
                                <Image src={job.company.logoUrl} alt="" width={40} height={40} className="object-cover w-full h-full" />
                            ) : (
                                <Building2 className="w-5 h-5 text-muted-foreground/40" />
                            )}
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-1">Компаний тухай</div>
                            <h4 className="text-sm font-bold leading-none">{job.company?.companyName}</h4>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                    {job.company?.slogan && (
                        <div className="flex items-start gap-2 italic text-xs text-muted-foreground">
                            <Quote className="w-3 h-3 shrink-0 opacity-40 mt-0.5" />
                            <p>&quot;{job.company.slogan}&quot;</p>
                        </div>
                    )}
                    {job.company?.description && (
                        <p className="text-xs leading-relaxed text-foreground/70">{job.company.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                        {job.company?.location && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-secondary/40">
                                <MapPin className="w-3 h-3" />{job.company.location}
                            </span>
                        )}
                        {job.company?.foundedYear && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-secondary/40">
                                <Calendar className="w-3 h-3" />{job.company.foundedYear}
                            </span>
                        )}
                        {job.company?.employeeCount && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-secondary/40">
                                <Users2 className="w-3 h-3" />{job.company.employeeCount} ажилтан
                            </span>
                        )}
                    </div>
                    {job.company?.website && (
                        <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline pt-1">
                            <Globe className="w-3 h-3" />Вэбсайт
                        </a>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
