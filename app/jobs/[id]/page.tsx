"use client"

import React, { useMemo } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { GET_ALL_JOBS, ME, GET_APPLICATIONS, CREATE_APPLICATION } from "../../graphql/mutations"
import { Job, JobStatus, User, Application } from "@/lib/type"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Briefcase,
    Clock,
    MapPin,
    ArrowLeft,
    Building2,
    Calendar,
    Users2,
    Quote,
    Globe,
    Share2,
    Copy,
    Check,
    CheckCircle,
    Loader2
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Footer } from "@/components/layout/Footer"

export default function JobDetailPage() {
    const params = useParams()
    const router = useRouter()
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
        } catch (err: any) {
            toast.error(err.message || "Хүсэлт илгээхэд алдаа гарлаа")
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

    const handleShareFB = () => {
        const url = getJobShareUrl()
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(`${job?.title} - ${job?.company?.companyName || ""} | InternMatch`)}`, "_blank", "width=600,height=400")
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(getJobShareUrl())
        setCopied(true)
        toast.success("Линк хуулагдлаа!")
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
                <div className="container mx-auto px-4 max-w-2xl py-6 space-y-6">
                    <Skeleton className="h-8 w-24 rounded-xl" />
                    <div className="flex items-start gap-4">
                        <Skeleton className="w-16 h-16 rounded-2xl" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-6 w-3/4 rounded" />
                            <Skeleton className="h-4 w-1/2 rounded" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
                    </div>
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
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
            <div className="container mx-auto px-4 max-w-2xl py-6 text-foreground">
                {/* Back button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-4 rounded-xl font-medium"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Буцах
                </Button>

                <div className="space-y-6">
                    {/* Header */}
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
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            className={cn(
                                "flex-1 h-11 rounded-xl font-bold text-sm",
                                isApplied && "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                            )}
                            variant={isApplied ? "outline" : "default"}
                            onClick={handleApplyClick}
                            disabled={isApplied || applyingJob}
                        >
                            {isApplied ? (
                                <><CheckCircle className="w-4 h-4 mr-2" />Илгээсэн</>
                            ) : applyingJob ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Илгээж байна...</>
                            ) : (
                                "Өргөдөл илгээх"
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-11 w-11 rounded-xl"
                            onClick={() => setShareOpen(!shareOpen)}
                        >
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Share section */}
                    {shareOpen && (
                        <div className="p-4 rounded-2xl bg-secondary/10 border border-border/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                            <Button
                                variant="outline"
                                className="w-full h-11 rounded-xl font-bold text-sm gap-3 justify-start text-[#1877F2] border-[#1877F2]/20 hover:bg-[#1877F2]/5"
                                onClick={() => { handleShareFB(); setShareOpen(false) }}
                            >
                                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                Facebook-д хуваалцах
                            </Button>
                            <div className="flex items-center gap-2 p-2 rounded-xl bg-background border border-border/40">
                                <input readOnly value={getJobShareUrl()} className="flex-1 bg-transparent text-xs font-medium text-muted-foreground outline-none truncate px-1" />
                                <Button
                                    variant="ghost" size="sm"
                                    className={cn("h-8 rounded-lg px-3 font-bold text-xs gap-1.5 shrink-0", copied ? "text-emerald-600" : "hover:bg-primary/10 hover:text-primary")}
                                    onClick={handleCopyLink}
                                >
                                    {copied ? <><Check className="w-3.5 h-3.5" />Хуулсан</> : <><Copy className="w-3.5 h-3.5" />Хуулах</>}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Stats row */}
                    <div className={cn("grid gap-3", job.matchScore != null ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3")}>
                        {job.matchScore != null && (
                            <div className={cn(
                                "p-4 rounded-2xl border text-center",
                                job.matchScore >= 70 ? "bg-emerald-50 border-emerald-100" :
                                job.matchScore >= 40 ? "bg-amber-50 border-amber-100" :
                                "bg-secondary/20 border-border/30"
                            )}>
                                <p className={cn(
                                    "text-3xl font-black",
                                    job.matchScore >= 70 ? "text-emerald-600" :
                                    job.matchScore >= 40 ? "text-amber-600" :
                                    "text-muted-foreground"
                                )}>{Math.round(job.matchScore)}%</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Тохирол</p>
                            </div>
                        )}
                        <div className="p-4 rounded-2xl bg-secondary/20 border border-border/30 text-center">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Цалин</p>
                            <p className="text-sm font-black">{job.salaryRange || "Тохиролцоно"}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-secondary/20 border border-border/30 text-center">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Хүсч буй</p>
                            <p className="text-sm font-black">{job.maxParticipants || "—"}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center">
                            <p className="text-3xl font-black text-primary">{job.applicationCount}</p>
                            <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">Өргөдөл</p>
                        </div>
                    </div>

                    {/* Info rows */}
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

                    {/* Required skills */}
                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Шаардагдах ур чадвар</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.requiredSkills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/30 text-xs font-bold">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sections */}
                    {job.responsibilities && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                Гүйцэтгэх үндсэн үүрэг
                                <div className="h-px flex-1 bg-primary/10" />
                            </h3>
                            <div className="text-sm leading-relaxed text-foreground/80 font-medium whitespace-pre-wrap">{job.responsibilities}</div>
                        </div>
                    )}

                    {job.requirements && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                Тавигдах шаардлага
                                <div className="h-px flex-1 bg-primary/10" />
                            </h3>
                            <div className="text-sm leading-relaxed text-foreground/80 font-medium whitespace-pre-wrap">{job.requirements}</div>
                        </div>
                    )}

                    {job.additionalInfo && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                Нэмэлт мэдээлэл
                                <div className="h-px flex-1 bg-border/40" />
                            </h3>
                            <div className="text-sm leading-relaxed text-muted-foreground font-medium whitespace-pre-wrap italic">{job.additionalInfo}</div>
                        </div>
                    )}

                    {/* Company card */}
                    <Card className="border-primary/10 bg-primary/5 rounded-2xl overflow-hidden shadow-none">
                        <CardHeader className="pb-3 border-b border-primary/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-primary/10 overflow-hidden shadow-inner">
                                    {job.company?.logoUrl ? (
                                        <Image src={job.company.logoUrl} alt="" width={40} height={40} className="object-cover w-full h-full" />
                                    ) : (
                                        <Building2 className="w-5 h-5 text-primary/40" />
                                    )}
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-1">Компаний тухай</div>
                                    <h4 className="text-sm font-black leading-none">{job.company?.companyName}</h4>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {job.company?.slogan && (
                                <div className="flex items-start gap-2 italic text-xs text-primary/70">
                                    <Quote className="w-3 h-3 shrink-0 opacity-40 mt-0.5" />
                                    <p>&quot;{job.company.slogan}&quot;</p>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 opacity-60"><Calendar className="w-3 h-3" /> Байгуулагдсан</div>
                                    <div className="text-foreground">{job.company?.foundedYear || "—"}</div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 opacity-60"><Users2 className="w-3 h-3" /> Ажилчид</div>
                                    <div className="text-foreground">{job.company?.employeeCount || "—"}</div>
                                </div>
                            </div>
                            {job.company?.website && (
                                <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline pt-1">
                                    <Globe className="w-3 h-3" />Вэбсайт
                                </a>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>
            <Footer />
        </div>
    )
}
