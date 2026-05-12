"use client"

import React, { useState, useMemo, useEffect, useRef, Suspense } from "react"
import { useQuery, useLazyQuery } from "@apollo/client/react"
import { GET_JOBS_LIST, GET_JOB_DETAIL } from "@/features/jobs/graphql/jobs.queries"
import { Job, JobStatus } from "@/lib/type"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Search,
    Filter,
    X,
    Briefcase,
    SearchX,
} from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { JobListCard } from "@/features/jobs/components/JobListCard"
import { JobDetailPanel } from "@/features/jobs/components/JobDetailPanel"
import { JobShareDialog } from "@/features/jobs/components/JobShareDialog"
import { JobsPageSkeleton } from "@/features/jobs/components/JobsPageSkeleton"

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

    const autoSelectedRef = useRef(false)
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

    const { data, loading, error } = useQuery<{ getAllJobs: Job[] }>(GET_JOBS_LIST, {
        variables: { status: "open" as JobStatus },
        fetchPolicy: "cache-and-network"
    })

    const [fetchJobDetail, { data: detailData }] = useLazyQuery<{ getJob: Job }>(GET_JOB_DETAIL, {
        fetchPolicy: "cache-first",
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

    const selectedJobFull = useMemo(() => {
        if (!selectedJob) return null
        if (detailData?.getJob && detailData.getJob.id === selectedJob.id) {
            return { ...selectedJob, ...detailData.getJob }
        }
        return selectedJob
    }, [selectedJob, detailData])

    useEffect(() => {
        if (filteredJobs.length > 0 && !selectedJob && !autoSelectedRef.current) {
            const timeoutId = setTimeout(() => {
                autoSelectedRef.current = true
                setSelectedJob(filteredJobs[0])
                fetchJobDetail({ variables: { id: filteredJobs[0].id } })
            }, 0)
            return () => clearTimeout(timeoutId)
        }
    }, [filteredJobs, selectedJob, fetchJobDetail])

    const clearFilters = () => { setSearchQuery(""); setSelectedLevels([]) }

    const handleApplyClick = (jobId: string) => {
        const token = localStorage.getItem("token")
        if (!token) toast.error("Та бүртгэлээ үүсгэнэ үү")
        router.push(`/login?redirect=jobs&id=${jobId}`)
    }

    const handleJobClick = (job: Job) => {
        setSelectedJob(job)
        fetchJobDetail({ variables: { id: job.id } })
        if (window.innerWidth < 1024) router.push(`/jobs/${job.id}`)
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl text-foreground">
                <div className="flex items-center justify-between py-5 border-b border-border/40">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-base tracking-tight">InternMatch</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative hidden sm:block">
                            <Input
                                placeholder="Дадлага, компани хайх..."
                                className="w-64 rounded-xl pl-9 h-9 border-border/60 bg-secondary/10 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        </div>
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

                <div className="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-80px)]">
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
                                    <JobListCard
                                        key={job.id}
                                        job={job}
                                        isSelected={selectedJob?.id === job.id}
                                        onClick={() => handleJobClick(job)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="hidden lg:block flex-1">
                        {selectedJobFull ? (
                            <div className="p-8 max-w-3xl">
                                <JobDetailPanel
                                    job={selectedJobFull}
                                    onApply={handleApplyClick}
                                    onShare={setShareJob}
                                />
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
                </div>
            </div>

            {shareJob && (
                <JobShareDialog job={shareJob} onClose={() => setShareJob(null)} />
            )}
        </div>
    )
}

export default function JobsPage() {
    return (
        <Suspense fallback={<JobsPageSkeleton />}>
            <JobsContent />
        </Suspense>
    )
}
