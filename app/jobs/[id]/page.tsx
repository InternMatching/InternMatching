"use client"

import React, { useMemo, useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { GET_ALL_JOBS } from "@/features/jobs/graphql/jobs.queries"
import { ME } from "@/features/auth/graphql/auth.queries"
import { GET_APPLICATIONS } from "@/features/applications/graphql/applications.queries"
import { CREATE_APPLICATION } from "@/features/applications/graphql/applications.mutations"
import { Job, JobStatus, User, Application } from "@/lib/type"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Briefcase,
    MapPin,
    ArrowLeft,
    Building2,
    Calendar,
    Clock,
    Users2,
    Globe,
    Share2,
    Copy,
    Check,
    CheckCircle,
    Loader2,
    Quote,
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function JobDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [isExiting, setIsExiting] = useState(false)
    const handleBack = () => { setIsExiting(true); setTimeout(() => router.back(), 280) }
    const jobId = params.id as string
    const [shareOpen, setShareOpen] = React.useState(false)
    const [copied, setCopied] = React.useState(false)
    const [applyingJob, setApplyingJob] = React.useState(false)

    const { data: userData } = useQuery<{ me: User }>(ME)
    const isStudent = userData?.me?.role?.toLowerCase() === "student"
    const isLoggedIn = !!userData?.me

    const { data, loading, error } = useQuery<{ getAllJobs: Job[] }>(GET_ALL_JOBS, {
        variables: { status: "open" as JobStatus },
        fetchPolicy: "cache-first"
    })

    const { data: appsData, refetch: refetchApps } = useQuery<{ getAllApplications: Application[] }>(
        GET_APPLICATIONS,
        { skip: !isStudent }
    )

    const [createApplication] = useMutation<{ createApplication: Application }, { jobId: string }>(CREATE_APPLICATION)

    const job = useMemo(() => {
        if (!data?.getAllJobs) return null
        return data.getAllJobs.find(j => j.id === jobId) || null
    }, [data, jobId])

    const isApplied = useMemo(() => {
        if (!appsData?.getAllApplications || !jobId) return false
        return appsData.getAllApplications.some(app => app.jobId === jobId || app.job?.id === jobId)
    }, [appsData, jobId])

    const handleApplyClick = async () => {
        if (!isLoggedIn) {
            toast.error("Нэвтэрч орно уу")
            router.push(`/login?redirect=jobs&id=${jobId}`)
            return
        }
        if (!isStudent) {
            toast.error("Зөвхөн оюутан хүсэлт илгээх боломжтой")
            return
        }
        if (isApplied) return
        setApplyingJob(true)
        try {
            await createApplication({ variables: { jobId } })
            toast.success("Хүсэлт амжилттай илгээгдлээ!")
            refetchApps()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Хүсэлт илгээхэд алдаа гарлаа")
        } finally {
            setApplyingJob(false)
        }
    }

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

    const getJobShareUrl = () => `${window.location.origin}/jobs/${jobId}`

    const handleCopyLink = () => {
        navigator.clipboard.writeText(getJobShareUrl())
        setCopied(true)
        toast.success("Линк хуулагдлаа!")
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
                <div className="container mx-auto px-4 max-w-2xl py-6 space-y-5">
                    <Skeleton className="h-8 w-20 rounded-xl" />
                    <div className="flex items-start gap-4">
                        <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-6 w-3/4 rounded" />
                            <Skeleton className="h-4 w-1/2 rounded" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-full rounded-xl" />
                    <Skeleton className="h-20 rounded-2xl" />
                    <Skeleton className="h-32 rounded-2xl" />
                    <Skeleton className="h-32 rounded-2xl" />
                </div>
            </div>
        )
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/30" />
                    <p className="text-sm font-bold text-muted-foreground">Зар олдсонгүй</p>
                    <Button variant="outline" className="rounded-xl" onClick={() => router.push("/jobs")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Бүх зарууд
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]", isExiting && "animate-out fade-out slide-out-to-bottom-2 duration-[280ms]")}>
            <div className="container mx-auto px-4 max-w-2xl py-6 space-y-6 text-foreground">

                {/* Back */}
                <Button variant="ghost" size="sm" className="rounded-xl font-bold -ml-2" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Буцах
                </Button>

                {/* Header — same as JobDetailPanel */}
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center border border-border/40 overflow-hidden shrink-0">
                        {job.company?.logoUrl ? (
                            <Image src={job.company.logoUrl} alt="" width={64} height={64} className="object-cover w-full h-full" />
                        ) : (
                            <Building2 className="w-8 h-8 text-muted-foreground/40" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold tracking-tight leading-tight mb-1.5">{job.title}</h1>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                            <span className="text-primary">{job.company?.companyName}</span>
                            <span className="text-muted-foreground/50">{getTimeAgo(job.postedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-bold text-muted-foreground">
                            <Users2 className="w-3 h-3" />
                            <span>{job.applicationCount} өргөдөл илгээсэн</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10" onClick={() => setShareOpen(v => !v)}>
                            <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                            className={cn("h-10 rounded-xl font-bold text-xs px-5", isApplied && "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100")}
                            variant={isApplied ? "outline" : "default"}
                            onClick={handleApplyClick}
                            disabled={isApplied || applyingJob}
                        >
                            {isApplied ? (
                                <><CheckCircle className="w-3.5 h-3.5 mr-1.5" />Илгээсэн</>
                            ) : applyingJob ? (
                                <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Илгээж байна...</>
                            ) : "Илгээх"}
                        </Button>
                    </div>
                </div>

                {/* Share */}
                {shareOpen && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/10 border border-border/30">
                        <input readOnly value={getJobShareUrl()} className="flex-1 bg-transparent text-xs text-muted-foreground outline-none truncate px-1" />
                        <Button variant="ghost" size="sm" className={cn("h-8 rounded-lg px-3 font-bold text-xs gap-1.5 shrink-0", copied ? "text-emerald-600" : "hover:bg-primary/10 hover:text-primary")} onClick={handleCopyLink}>
                            {copied ? <><Check className="w-3.5 h-3.5" />Хуулсан</> : <><Copy className="w-3.5 h-3.5" />Хуулах</>}
                        </Button>
                    </div>
                )}

                {/* Stats — same grid as JobDetailPanel */}
                <div className={cn("grid gap-3", job.matchScore != null ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3")}>
                    {job.matchScore != null && (
                        <div className={cn("p-4 rounded-2xl border text-center",
                            job.matchScore >= 70 ? "bg-emerald-50 border-emerald-100" :
                                job.matchScore >= 40 ? "bg-amber-50 border-amber-100" :
                                    "bg-secondary/20 border-border/30")}>
                            <p className={cn("text-3xl font-bold",
                                job.matchScore >= 70 ? "text-emerald-600" :
                                    job.matchScore >= 40 ? "text-amber-600" :
                                        "text-muted-foreground")}>{Math.round(job.matchScore)}%</p>
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

                {/* Location / deadline */}
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

                {/* Skills */}
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Шаардагдах ур чадвар</h3>
                        <div className="flex flex-wrap gap-2">
                            {job.requiredSkills.map((skill, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/30 text-xs font-bold">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content sections */}
                {job.responsibilities && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                            Гүйцэтгэх үндсэн үүрэг
                            <div className="h-px flex-1 bg-primary/10" />
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground/80 font-bold p-2">{job.responsibilities}</p>
                    </div>
                )}

                {job.requirements && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                            Тавигдах шаардлага
                            <div className="h-px flex-1 bg-primary/10" />
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground/80 font-bold p-2">{job.requirements}</p>
                    </div>
                )}

                {job.description && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                            Тайлбар
                            <div className="h-px flex-1 bg-primary/10" />
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground/80 font-bold p-2">{job.description}</p>
                    </div>
                )}

                {job.additionalInfo && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            Нэмэлт мэдээлэл
                            <div className="h-px flex-1 bg-border/40" />
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground font-bold p-2">{job.additionalInfo}</p>
                    </div>
                )}

                {/* Company card — identical structure to JobDetailPanel */}
                {job.company && (
                    <Card className="border-border/60 rounded-2xl overflow-hidden shadow-none bg-background">
                        <CardHeader className="pb-3 border-b border-border/40">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-secondary/30 flex items-center justify-center border border-border/40 overflow-hidden shrink-0">
                                    {job.company.logoUrl ? (
                                        <Image src={job.company.logoUrl} alt="" width={40} height={40} className="object-cover w-full h-full" />
                                    ) : (
                                        <Building2 className="w-5 h-5 text-muted-foreground/40" />
                                    )}
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-1">Компаний тухай</div>
                                    <h4 className="text-sm font-bold leading-none">{job.company.companyName}</h4>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {job.company.slogan && (
                                <div className="flex items-start gap-2 italic text-xs text-muted-foreground">
                                    <Quote className="w-3 h-3 shrink-0 opacity-40 mt-0.5" />
                                    <p>&quot;{job.company.slogan}&quot;</p>
                                </div>
                            )}
                            {job.company.description && (
                                <p className="text-xs leading-relaxed text-foreground/70">{job.company.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                                {job.company.location && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-secondary/40">
                                        <MapPin className="w-3 h-3" />{job.company.location}
                                    </span>
                                )}
                                {job.company.foundedYear && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-secondary/40">
                                        <Calendar className="w-3 h-3" />{job.company.foundedYear}
                                    </span>
                                )}
                                {job.company.employeeCount && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-secondary/40">
                                        <Users2 className="w-3 h-3" />{job.company.employeeCount} ажилтан
                                    </span>
                                )}
                            </div>
                            {job.company.website && (
                                <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline pt-1">
                                    <Globe className="w-3 h-3" />Вэбсайт
                                </a>
                            )}
                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    )
}
