"use client"

import React, { useState, useMemo, useEffect, useRef, Suspense, useCallback } from "react"
import { useQuery } from "@apollo/client/react"
import { GET_ALL_JOBS } from "../graphql/mutations"
import { Job, JobStatus } from "@/lib/type"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Briefcase,
    Search,
    Clock,
    MapPin,
    Zap,
    Filter,
    X,
    Building2,
    Wallet,
    ChevronRight,
    SearchX,
    Calendar,
    Users2,
    Quote,
    CheckCircle2,
    AlertCircle,
    Info,
    Globe
} from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

function JobsContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Input state - шууд харагдана (debounce хийгдэхгүй)
    const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
    const [selectedLevels, setSelectedLevels] = useState<string[]>(
        searchParams.get("levels")?.split(",").filter(Boolean) || []
    )
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)

    // URL-г debounce хийж шинэчлэх (300ms хүлээнэ)
    // searchParams-г ref-д хадгалж, dependency array-д оруулахгүй
    // (оруулбал router.replace → searchParams өөрчлөгдөх → effect дахин ажиллах → loop)
    // Debounce only the URL update (background side-effect).
    // Filtering uses `searchQuery` directly so it's instant.
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

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [searchQuery, selectedLevels, pathname, router])

    const { data, loading, error } = useQuery<{ getAllJobs: Job[] }>(GET_ALL_JOBS, {
        variables: {
            status: "open" as JobStatus
        },
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

    const toggleLevel = (level: string) => {
        setSelectedLevels(prev =>
            prev.includes(level)
                ? prev.filter(l => l !== level)
                : [...prev, level]
        )
    }

    const clearFilters = () => {
        setSearchQuery("")
        setSelectedLevels([])
    }

    const handleApplyClick = (jobId: string) => {
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Та бүртгэлээ үүсгэнэ үү")
            router.push(`/login?redirect=jobs&id=${jobId}`)
        } else {
            // Even if logged in, let's follow the user's flow
            // Usually, this would check the role and redirect to the student dashboard
            // But for now, we'll just redirect to login which handles redirection if already logged in
            // Or better, redirect them to the student dashboard if token exists
            router.push(`/login?redirect=jobs&id=${jobId}`)
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

    const JobSkeleton = () => (
        <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="rounded-2xl border-border/40 overflow-hidden bg-background shadow-sm">
                    <CardContent className="p-0 flex flex-col md:flex-row h-full">
                        <div className="flex-1 p-5 md:p-8 space-y-4">
                            <div className="flex gap-2">
                                <Skeleton className="h-5 w-16 rounded-md" />
                                <Skeleton className="h-5 w-24 rounded-md" />
                            </div>
                            <Skeleton className="h-7 w-2/3 rounded-md" />
                            <div className="flex gap-4">
                                <Skeleton className="h-10 w-28 rounded-md" />
                                <Skeleton className="h-10 w-28 rounded-md" />
                            </div>
                        </div>
                        <div className="md:w-48 bg-secondary/10 p-6 flex flex-col gap-3 justify-center">
                            <Skeleton className="h-9 w-full rounded-xl" />
                            <Skeleton className="h-3 w-20 mx-auto rounded-full" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )

    // Rendered as inline JSX (not as a component) so the <Input> DOM node
    // is never unmounted between renders — prevents focus loss on each keystroke.
    const filterPanel = (
        <div className="space-y-4 text-sm font-medium">
            <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Хайх</label>
                <div className="relative">
                    <Input
                        placeholder="Ажил, байршил..."
                        className="rounded-xl pl-9 h-10 border-border/60 bg-secondary/10 focus:bg-background transition-all text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Түвшин</label>
                <Card className="border-border/40 shadow-none rounded-xl bg-secondary/5 overflow-hidden">
                    <CardContent className="p-1 space-y-0.5">
                        {['intern', 'junior'].map((level) => (
                            <label key={level} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/40 transition-all cursor-pointer group">
                                <Checkbox
                                    id={level}
                                    checked={selectedLevels.includes(level)}
                                    onCheckedChange={() => toggleLevel(level)}
                                    className="rounded-md border-border/60"
                                />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold group-hover:text-primary transition-colors capitalize">
                                        {level === 'intern' ? 'Дадлага' : 'Junior'} ({level})
                                    </span>
                                </div>
                            </label>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {(searchQuery || selectedLevels.length > 0) && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-8 rounded-lg text-xs text-muted-foreground hover:text-primary transition-colors"
                    onClick={clearFilters}
                >
                    <X className="w-3 h-3 mr-2" />
                    Арилгах
                </Button>
            )}
        </div>
    )

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] py-6 md:py-10">
            <div className="container mx-auto px-4 md:px-6 lg:px-12 max-w-7xl text-foreground">
                {/* Minimal Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-tight">
                            <Zap className="w-3 h-3" />
                            <span>Нээлттэй боломжууд</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Ажил <span className="text-primary">&</span> Дадлага
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium">
                            Таны хүссэн ажлын байр энд байж магадгүй.
                        </p>
                    </div>

                    {/* Mobile Filter */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 rounded-xl border-border/60 gap-2 font-medium">
                                    <Filter className="w-3.5 h-3.5" />
                                    Шүүлтүүр
                                    {selectedLevels.length > 0 && (
                                        <span className="ml-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold">
                                            {selectedLevels.length}
                                        </span>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="rounded-t-3xl h-[40vh] p-6 bg-background border-t-0">
                                <SheetHeader className="mb-4">
                                    <SheetTitle className="text-lg font-bold">Шүүлтүүр</SheetTitle>
                                </SheetHeader>
                                {filterPanel}
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Minimal Sidebar */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-24 space-y-6">
                            {filterPanel}
                            <div className="p-4 rounded-2xl bg-secondary/20 border border-border/40 text-[11px] font-medium leading-relaxed text-muted-foreground">
                                <div className="flex items-center gap-1.5 mb-1 text-foreground font-bold uppercase tracking-wider">
                                    <Briefcase className="w-3.5 h-3.5 text-primary" />
                                    Зөвлөгөө
                                </div>
                                Шүүлтүүрийг ашиглан өөрт тохирох ажлыг хурдан олоорой.
                            </div>
                        </div>
                    </aside>

                    {/* Main Feed */}
                    <main className="flex-1 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3 border-border/40 mb-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                Нийт <span className="text-foreground">{filteredJobs.length}</span> зар олдлоо
                            </p>
                        </div>

                        {loading ? (
                            <JobSkeleton />
                        ) : error ? (
                            <Card className="p-10 text-center rounded-2xl border-dashed border-border/60 bg-red-50/5">
                                <p className="text-sm font-medium text-red-500">{error.message}</p>
                                <Button variant="ghost" className="mt-2 text-xs h-8" onClick={() => window.location.reload()}>Дахин ачаалах</Button>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {filteredJobs.map((job) => (
                                    <Card key={job.id} className="group hover:border-primary/40 hover:shadow-md transition-all duration-300 border-border/60 bg-background rounded-2xl overflow-hidden">
                                        <CardContent className="p-0 flex flex-col md:flex-row h-full text-sm font-medium">
                                            <div className="flex-1 p-5 md:p-8">
                                                <div className="flex flex-wrap items-center gap-2.5 mb-5">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border",
                                                        job.type.toLowerCase() === 'intern'
                                                            ? 'bg-orange-50/5 text-orange-600 border-orange-500/20'
                                                            : 'bg-blue-50/5 text-blue-600 border-blue-500/20'
                                                    )}>
                                                        {job.type}
                                                    </span>
                                                    <div className="h-3 w-px bg-border/40" />
                                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                                                        <Clock className="w-3 h-3 opacity-60" />
                                                        {new Date(job.postedAt).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                <h2
                                                    className="text-lg md:text-xl font-bold mb-5 group-hover:text-primary transition-colors cursor-pointer leading-tight"
                                                    onClick={() => setSelectedJob(job)}
                                                >
                                                    {job.title}
                                                </h2>

                                                <div className="flex flex-wrap items-center gap-6">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center overflow-hidden">
                                                            {job.company?.logoUrl ? (
                                                                <Image
                                                                    src={job.company.logoUrl}
                                                                    alt={job.company.companyName || "logo"}
                                                                    width={32}
                                                                    height={32}
                                                                    className="object-cover w-full h-full"
                                                                />
                                                            ) : (
                                                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 leading-none mb-0.5">Компани</span>
                                                            <span className="font-bold text-xs">{job.company?.companyName}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center">
                                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-60 leading-none mb-0.5">Байршил</span>
                                                            <span className="font-bold text-xs">{job.location}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="px-2.5 py-1 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                                            <div className="flex items-center gap-1.5">
                                                                <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                                                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{job.salaryRange || "Тохиролцоно"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:w-48 bg-secondary/5 p-6 flex flex-col items-center justify-center md:border-l border-border/40 gap-3">
                                                <Button 
                                                    size="sm" 
                                                    className="w-full h-10 rounded-xl gap-1.5 font-bold text-xs"
                                                    onClick={() => handleApplyClick(job.id)}
                                                >
                                                    Илгээх
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </Button>
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center opacity-70">Илгээх боломжтой</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {filteredJobs.length === 0 && (
                                    <div className="py-16 text-center bg-secondary/5 rounded-2xl border-border/40 border-2 border-dashed px-4">
                                        <div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <SearchX className="w-6 h-6 text-muted-foreground/30" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-bold">Зар олдсонгүй</p>
                                            <p className="text-xs text-muted-foreground">Түлхүүр үгээ өөрчилж үзнэ үү.</p>
                                        </div>
                                        <Button variant="link" className="mt-2 text-xs" onClick={clearFilters}>Бүгдийг харах</Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <Sheet open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
                <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                    {selectedJob && (
                        <div className="space-y-8 py-6">
                            <SheetHeader className="space-y-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border",
                                        selectedJob.type.toLowerCase() === 'intern'
                                            ? 'bg-orange-50/5 text-orange-600 border-orange-500/20'
                                            : 'bg-blue-50/5 text-blue-600 border-blue-500/20'
                                    )}>
                                        {selectedJob.type}
                                    </span>
                                    {selectedJob.deadline && (
                                        <span className={cn(
                                            "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border",
                                            new Date(selectedJob.deadline).getTime() - new Date().getTime() < 86400000 ? "bg-red-50 text-red-600 border-red-500/20" : "bg-amber-50 text-amber-600 border-amber-500/20"
                                        )}>
                                            <AlertCircle className="w-3 h-3" />
                                            {getTimeRemaining(selectedJob.deadline)}
                                        </span>
                                    )}
                                </div>
                                <SheetTitle className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                                    {selectedJob.title}
                                </SheetTitle>
                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground uppercase opacity-80">
                                    <div className="flex items-center gap-1.5">
                                        <Building2 className="w-3.5 h-3.5" />
                                        {selectedJob.company?.companyName}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {selectedJob.location}
                                    </div>
                                </div>
                            </SheetHeader>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                                        <Wallet className="w-3 h-3" />
                                        Цалин / Урамшуулал
                                    </div>
                                    <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">{selectedJob.salaryRange || "Тохиролцоно"}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 space-y-1">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        <Calendar className="w-3 h-3" />
                                        Нийтэлсэн огноо
                                    </div>
                                    <p className="text-lg font-black">{new Date(selectedJob.postedAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {selectedJob.responsibilities && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            Гүйцэтгэх үндсэн үүрэг
                                            <div className="h-px flex-1 bg-primary/10" />
                                        </h3>
                                        <div className="text-sm leading-relaxed text-foreground/80 font-medium whitespace-pre-wrap">
                                            {selectedJob.responsibilities}
                                        </div>
                                    </div>
                                )}

                                {selectedJob.requirements && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            Тавигдах шаардлага
                                            <div className="h-px flex-1 bg-primary/10" />
                                        </h3>
                                        <div className="text-sm leading-relaxed text-foreground/80 font-medium whitespace-pre-wrap">
                                            {selectedJob.requirements}
                                        </div>
                                    </div>
                                )}

                                {selectedJob.additionalInfo && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            Нэмэлт мэдээлэл
                                            <div className="h-px flex-1 bg-border/40" />
                                        </h3>
                                        <div className="text-sm leading-relaxed text-muted-foreground font-medium whitespace-pre-wrap italic">
                                            {selectedJob.additionalInfo}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Card className="border-primary/10 bg-primary/5 rounded-2xl overflow-hidden shadow-none">
                                <CardHeader className="pb-3 border-b border-primary/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-primary/10 overflow-hidden shadow-inner">
                                            {selectedJob.company?.logoUrl ? (
                                                <Image
                                                    src={selectedJob.company.logoUrl}
                                                    alt={selectedJob.company.companyName || "logo"}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <Building2 className="w-5 h-5 text-primary/40" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-1">Компаний тухай</div>
                                            <h4 className="text-sm font-black leading-none">{selectedJob.company?.companyName}</h4>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    {selectedJob.company?.slogan && (
                                        <div className="flex items-start gap-2 italic text-xs text-primary/70 mb-2">
                                            <Quote className="w-3 h-3 shrink-0 opacity-40" />
                                            <p>&quot;{selectedJob.company.slogan}&quot;</p>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 opacity-60"><Calendar className="w-3 h-3" /> Байгуулагдсан</div>
                                            <div className="text-foreground">{selectedJob.company?.foundedYear || "Тодорхойгүй"}</div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 opacity-60"><Users2 className="w-3 h-3" /> Ажилчид</div>
                                            <div className="text-foreground">{selectedJob.company?.employeeCount || "Тодорхойгүй"}</div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-foreground/70 font-medium line-clamp-3">
                                        {selectedJob.company?.description}
                                    </p>
                                    <div className="flex items-center gap-3 pt-2">
                                        {selectedJob.company?.website && (
                                            <a
                                                href={selectedJob.company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline"
                                            >
                                                <Globe className="w-3 h-3" />
                                                Вэбсайт
                                            </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="sticky bottom-0 pt-6 pb-2 bg-background/80 backdrop-blur-md">
                                <Button 
                                    className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
                                    onClick={() => handleApplyClick(selectedJob.id)}
                                >
                                    Одоо бүртгүүлэх
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default function JobsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] py-6 md:py-10">
                <div className="container mx-auto px-4 md:px-6 lg:px-12 max-w-7xl text-foreground">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div className="space-y-4">
                            <div className="h-8 w-48 bg-secondary/20 animate-pulse rounded-lg" />
                            <div className="h-4 w-64 bg-secondary/10 animate-pulse rounded-lg" />
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <aside className="hidden lg:block w-64 shrink-0 space-y-4">
                            <div className="h-40 bg-secondary/10 animate-pulse rounded-2xl" />
                        </aside>
                        <main className="flex-1 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-48 bg-secondary/10 animate-pulse rounded-2xl" />
                            ))}
                        </main>
                    </div>
                </div>
            </div>
        }>
            <JobsContent />
        </Suspense>
    )
}

