"use client"

import React, { useState, useMemo, useEffect, useRef, Suspense } from "react"
import { useQuery } from "@apollo/client/react"
import { GET_ALL_JOBS } from "../graphql/mutations"
import { Job, JobStatus } from "@/lib/type"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Briefcase,
    Search,
    Clock,
    MapPin,
    X,
    Building2,
    Wallet,
    ChevronRight,
    SearchX,
    Calendar,
    Users2,
    Quote,
    AlertCircle,
    Globe,
    Share2,
    Copy,
    Check
} from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

function JobsContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
    const [selectedLevels, setSelectedLevels] = useState<string[]>(
        searchParams.get("levels")?.split(",").filter(Boolean) || []
    )
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)
    const [shareJob, setShareJob] = useState<Job | null>(null)
    const [copied, setCopied] = useState(false)

    const debounceRef = useRef<number | null>(null)
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = window.setTimeout(() => {
            const params = new URLSearchParams()
            if (searchQuery) params.set("query", searchQuery)
            if (selectedLevels.length > 0) params.set("levels", selectedLevels.join(","))
            const newSearch = params.toString() ? `?${params.toString()}` : ""
            if (window.location.search !== newSearch) {
                router.replace(`${pathname}${newSearch}`, { scroll: false })
            }
        }, 500)
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    }, [searchQuery, selectedLevels, pathname, router])

    const { data, loading, error } = useQuery<{ getAllJobs: Job[] }>(GET_ALL_JOBS, {
        variables: { status: "open" as JobStatus },
        fetchPolicy: "network-only"
    })

    const filteredJobs = useMemo(() => {
        if (!data?.getAllJobs) return []
        return data.getAllJobs.filter(job => {
            const matchesSearch =
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location?.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesLevel =
                selectedLevels.length === 0 ||
                selectedLevels.includes(job.type.toLowerCase())
            return matchesSearch && matchesLevel
        })
    }, [data, searchQuery, selectedLevels])

    // Auto-select first job
    useEffect(() => {
        if (filteredJobs.length > 0 && !selectedJob) {
            setSelectedJob(filteredJobs[0])
        }
    }, [filteredJobs, selectedJob])

    const clearFilters = () => { setSearchQuery(""); setSelectedLevels([]) }

    const handleApplyClick = (jobId: string) => {
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Та бүртгэлээ үүсгэнэ үү")
            router.push(`/login?redirect=jobs&id=${jobId}`)
        } else {
            router.push(`/login?redirect=jobs&id=${jobId}`)
        }
    }

    const getJobShareUrl = (job: Job) => `${window.location.origin}/jobs?levels=${job.type.toLowerCase()}`

    const handleShareFB = (job: Job) => {
        const url = getJobShareUrl(job)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(`${job.title} - ${job.company?.companyName || ""} | InternMatch`)}`, "_blank", "width=600,height=400")
    }

    const handleCopyLink = (job: Job) => {
        navigator.clipboard.writeText(getJobShareUrl(job))
        setCopied(true)
        toast.success("Линк хуулагдлаа!")
        setTimeout(() => setCopied(false), 2000)
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

    /* ──────── Detail Panel (reused for desktop inline + mobile sheet) ──────── */
    const DetailPanel = ({ job }: { job: Job }) => (
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
                        onClick={() => setShareJob(job)}
                    >
                        <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                        className="h-10 rounded-xl font-bold text-xs px-5"
                        onClick={() => handleApplyClick(job.id)}
                    >
                        Илгээх
                    </Button>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
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
    )

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl text-foreground">
                {/* Top bar */}
                <div className="flex items-center justify-between py-5 border-b border-border/40">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-base tracking-tight">InternMatch</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative hidden sm:block">
                            <Input
                                placeholder="Дадлага, компани хайх..."
                                className="w-64 rounded-xl pl-9 h-9 border-border/60 bg-secondary/10 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        {/* Mobile filter */}
                        <div className="sm:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-9 rounded-xl gap-2">
                                        <Filter className="w-3.5 h-3.5" />
                                        Шүүлтүүр
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="rounded-t-3xl h-[50vh] p-6 bg-background">
                                    <SheetHeader className="mb-4">
                                        <SheetTitle className="text-lg font-bold">Шүүлтүүр</SheetTitle>
                                    </SheetHeader>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Input placeholder="Хайх..." className="rounded-xl pl-9 h-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                        </div>
                                        {(searchQuery || selectedLevels.length > 0) && (
                                            <Button variant="ghost" size="sm" className="w-full h-8 text-xs" onClick={clearFilters}><X className="w-3 h-3 mr-2" />Арилгах</Button>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                    {(searchQuery || selectedLevels.length > 0) && (
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl shrink-0" onClick={clearFilters}>
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Two-panel layout */}
                <div className="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-80px)]">
                    {/* LEFT: Job list */}
                    <div className="w-full lg:w-[420px] shrink-0 border-r border-border/40">
                        <div className="p-4 border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
                            <h2 className="text-sm font-bold">
                                Нээлттэй ажлын байрууд
                                <span className="text-muted-foreground font-medium ml-1.5">({filteredJobs.length})</span>
                            </h2>
                        </div>

                        {loading ? (
                            <div className="p-4 space-y-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="p-4 space-y-2">
                                        <Skeleton className="h-5 w-3/4 rounded" />
                                        <Skeleton className="h-3 w-1/2 rounded" />
                                        <Skeleton className="h-3 w-1/3 rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="p-8 text-center text-sm text-red-500">{error.message}</div>
                        ) : filteredJobs.length === 0 ? (
                            <div className="p-12 text-center space-y-2">
                                <SearchX className="w-8 h-8 text-muted-foreground/30 mx-auto" />
                                <p className="text-sm font-bold text-muted-foreground">Зар олдсонгүй</p>
                                <Button variant="link" className="text-xs" onClick={clearFilters}>Бүгдийг харах</Button>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/40">
                                {filteredJobs.map((job) => (
                                    <div
                                        key={job.id}
                                        className={cn(
                                            "flex items-start gap-3.5 p-4 cursor-pointer transition-all hover:bg-secondary/30",
                                            selectedJob?.id === job.id && "bg-primary/5 border-l-2 border-l-primary"
                                        )}
                                        onClick={() => setSelectedJob(job)}
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
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Job detail (desktop) */}
                    <div className="hidden lg:block flex-1">
                        {selectedJob ? (
                            <div className="p-8 max-w-3xl">
                                <DetailPanel job={selectedJob} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                <div className="text-center space-y-2">
                                    <Briefcase className="w-10 h-10 mx-auto opacity-20" />
                                    <p className="text-sm font-bold">Зар сонгоно уу</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Job detail (mobile — sheet) */}
                    <Sheet open={!!selectedJob && typeof window !== "undefined" && window.innerWidth < 1024} onOpenChange={(open) => { if (!open) setSelectedJob(null) }}>
                        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6">
                            {selectedJob && <DetailPanel job={selectedJob} />}
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Share Dialog */}
            {shareJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => { setShareJob(null); setCopied(false) }}>
                    <div className="fixed inset-0 bg-black/60 animate-in fade-in-0 duration-200" />
                    <div className="relative z-50 w-full max-w-sm mx-4 bg-background rounded-2xl border border-border/40 shadow-2xl p-6 space-y-5 animate-in fade-in-0 zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="space-y-1">
                            <h3 className="text-base font-bold">Хуваалцах</h3>
                            <p className="text-xs text-muted-foreground truncate">{shareJob.title} — {shareJob.company?.companyName}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <Button
                                variant="outline"
                                className="w-full h-11 rounded-xl font-bold text-sm gap-3 justify-start text-[#1877F2] border-[#1877F2]/20 hover:bg-[#1877F2]/5"
                                onClick={() => { handleShareFB(shareJob); setShareJob(null) }}
                            >
                                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                Facebook-д хуваалцах
                            </Button>
                            <div className="flex items-center gap-2 p-2 rounded-xl bg-secondary/30 border border-border/40">
                                <input readOnly value={getJobShareUrl(shareJob)} className="flex-1 bg-transparent text-xs font-medium text-muted-foreground outline-none truncate px-1" />
                                <Button
                                    variant="ghost" size="sm"
                                    className={cn("h-8 rounded-lg px-3 font-bold text-xs gap-1.5 shrink-0", copied ? "text-emerald-600" : "hover:bg-primary/10 hover:text-primary")}
                                    onClick={() => handleCopyLink(shareJob)}
                                >
                                    {copied ? <><Check className="w-3.5 h-3.5" />Хуулсан</> : <><Copy className="w-3.5 h-3.5" />Хуулах</>}
                                </Button>
                            </div>
                        </div>
                        <Button variant="ghost" className="w-full h-9 rounded-xl text-xs font-bold text-muted-foreground" onClick={() => { setShareJob(null); setCopied(false) }}>
                            Хаах
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function JobsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center gap-3 py-5 border-b border-border/40">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-5 w-28 rounded" />
                    </div>
                    <div className="flex">
                        <div className="w-[420px] shrink-0 border-r border-border/40 p-4 space-y-3">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex gap-3 p-3">
                                    <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-3/4 rounded" />
                                        <Skeleton className="h-3 w-1/2 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex-1 p-8 space-y-4">
                            <Skeleton className="h-16 w-16 rounded-2xl" />
                            <Skeleton className="h-7 w-2/3 rounded" />
                            <Skeleton className="h-4 w-1/3 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        }>
            <JobsContent />
        </Suspense>
    )
}
