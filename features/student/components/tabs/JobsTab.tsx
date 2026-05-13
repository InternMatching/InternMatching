"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useLazyQuery } from "@apollo/client/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Search, Loader2, CheckCircle, Building2, MapPin, Wallet, AlertCircle, Users2,
    Sparkles, TrendingUp, TrendingDown, Minus, ChevronDown,
} from "lucide-react"
import { Job, Application, AIMatchResult } from "@/lib/type"
import { cn } from "@/lib/utils"
import { GET_AI_MATCH_SCORE } from "@/features/jobs/graphql/jobs.queries"

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

function AIMatchPanel({ jobId }: { jobId: string }) {
    const [aiResult, setAiResult] = React.useState<AIMatchResult | null>(null)
    const [open, setOpen] = React.useState(false)
    const [getScore, { loading }] = useLazyQuery<{ getAIMatchScore: AIMatchResult }>(GET_AI_MATCH_SCORE, {
        fetchPolicy: "network-only",
    })

    const rec = aiResult?.recommendation
    const recColor = rec === "hire" ? "text-emerald-600" : rec === "maybe" ? "text-amber-600" : "text-red-500"
    const recBg = rec === "hire" ? "bg-emerald-50 border-emerald-200" : rec === "maybe" ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"
    const recLabel = rec === "hire" ? "Маш тохиромжтой" : rec === "maybe" ? "Хэсэгчлэн тохиромжтой" : "Тохиромжгүй"
    const RecIcon = rec === "hire" ? TrendingUp : rec === "maybe" ? Minus : TrendingDown

    return (
        <div>
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 rounded-lg text-[11px] font-bold gap-1.5 border-primary/20 text-primary hover:bg-primary/5"
                onClick={async () => {
                    if (aiResult) { setOpen(v => !v); return }
                    const { data } = await getScore({ variables: { jobId } })
                    if (data?.getAIMatchScore) { setAiResult(data.getAIMatchScore); setOpen(true) }
                }}
                disabled={loading}
            >
                {loading
                    ? <><Loader2 className="w-3 h-3 animate-spin" />Шинжилж байна...</>
                    : <><Sparkles className="w-3 h-3" />AI шинжилгээ{aiResult && <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />}</>
                }
            </Button>

            <div className={`grid transition-all duration-300 ease-in-out mt-2 ${open && aiResult ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                    {aiResult && (
                        <div className="rounded-xl border border-border/50 bg-secondary/10 p-4 space-y-3">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12 shrink-0">
                                        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-border/40" />
                                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray={`${aiResult.score} 100`} strokeLinecap="round"
                                                className={aiResult.score >= 70 ? "text-emerald-500" : aiResult.score >= 40 ? "text-amber-500" : "text-red-400"} />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-xs font-black">{aiResult.score}%</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground mb-0.5">AI Таарамжийн дүн</p>
                                        <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border", recBg, recColor)}>
                                            <RecIcon className="w-3 h-3" />{recLabel}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-foreground/80 leading-relaxed">{aiResult.summary}</p>
                            {aiResult.strengths.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Давуу тал</p>
                                    <ul className="space-y-0.5">
                                        {aiResult.strengths.map((s, i) => <li key={i} className="text-xs text-foreground/70 flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">+</span>{s}</li>)}
                                    </ul>
                                </div>
                            )}
                            {aiResult.gaps.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Дутагдал</p>
                                    <ul className="space-y-0.5">
                                        {aiResult.gaps.map((g, i) => <li key={i} className="text-xs text-foreground/70 flex items-start gap-1.5"><span className="text-amber-500 mt-0.5">−</span>{g}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
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

                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        {/* Keyword match score badge */}
                                        {job.matchScore != null && (
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
                                                    <div
                                                        className={cn("h-full rounded-full transition-all", job.matchScore >= 70 ? "bg-emerald-500" : job.matchScore >= 40 ? "bg-amber-500" : "bg-red-400")}
                                                        style={{ width: `${job.matchScore}%` }}
                                                    />
                                                </div>
                                                <span className={cn("text-[11px] font-black", job.matchScore >= 70 ? "text-emerald-600" : job.matchScore >= 40 ? "text-amber-600" : "text-red-500")}>
                                                    {Math.round(job.matchScore)}%
                                                </span>
                                            </div>
                                        )}
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
                                        <AIMatchPanel jobId={job.id} />
                                    </div>
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
