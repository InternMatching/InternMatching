"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    FileText,
    User,
    Briefcase,
    GraduationCap,
    Wrench,
    Layout,
    Lightbulb,
    Trophy,
    RefreshCw,
    Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CVReviewResult } from "@/lib/type"

const SECTION_META = [
    {
        key: "contact" as const,
        label: "Холбоо барих мэдээлэл",
        icon: User,
        desc: "Имэйл, утас, LinkedIn, GitHub болон бусад холбоо барих мэдээлэл бүрэн, зөв форматтай эсэх",
    },
    {
        key: "summary" as const,
        label: "Товч танилцуулга",
        icon: FileText,
        desc: "Ажил горилогчийн хүч чадал, зорилгыг товч, тодорхой илэрхийлэх хэсэг",
    },
    {
        key: "experience" as const,
        label: "Ажлын туршлага",
        icon: Briefcase,
        desc: "Хийсэн ажил, хүрсэн үр дүн, ашигласан технологи болон хариуцлага",
    },
    {
        key: "education" as const,
        label: "Боловсрол",
        icon: GraduationCap,
        desc: "Суралцсан сургууль, чиглэл, дүн болон холбогдох хичээлүүд",
    },
    {
        key: "skills" as const,
        label: "Ур чадвар",
        icon: Wrench,
        desc: "Техникийн болон зөөлөн ур чадвар, мэргэшлийн түвшин",
    },
    {
        key: "format" as const,
        label: "Дизайн & Формат",
        icon: Layout,
        desc: "Уншихад хялбар байдал, визуал зохион байгуулалт, ATS-д тохирсон бүтэц",
    },
]

function scoreColor(score: number) {
    if (score >= 80) return "text-emerald-500"
    if (score >= 60) return "text-amber-500"
    return "text-red-500"
}

function scoreBgBar(score: number) {
    if (score >= 80) return "bg-emerald-500"
    if (score >= 60) return "bg-amber-500"
    return "bg-red-500"
}

function scoreLabel(score: number) {
    if (score >= 80) return "Маш сайн"
    if (score >= 60) return "Дунд зэрэг"
    return "Сайжруулах шаардлагатай"
}

function scoreBadgeClass(score: number) {
    if (score >= 80) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    if (score >= 60) return "bg-amber-500/10 text-amber-600 border-amber-500/20"
    return "bg-red-500/10 text-red-600 border-red-500/20"
}

function CircleScore({ score }: { score: number }) {
    const r = 52
    const stroke = 8
    const circumference = 2 * Math.PI * r
    const offset = circumference - (score / 100) * circumference
    const svgSize = (r + stroke) * 2
    const colorClass = score >= 80 ? "stroke-emerald-500" : score >= 60 ? "stroke-amber-500" : "stroke-red-500"

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={svgSize} height={svgSize} className="-rotate-90">
                <circle cx={svgSize / 2} cy={svgSize / 2} r={r} fill="none" className="stroke-muted" strokeWidth={stroke} />
                <circle
                    cx={svgSize / 2} cy={svgSize / 2} r={r} fill="none"
                    className={colorClass} strokeWidth={stroke}
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </svg>
            <span className={cn("absolute text-3xl font-extrabold tabular-nums", scoreColor(score))}>
                {score}
            </span>
        </div>
    )
}

function SectionCard({ meta, section }: {
    meta: typeof SECTION_META[number]
    section: { score: number; strengths: string[]; improvements: string[] }
}) {
    const Icon = meta.icon
    return (
        <div className="rounded-2xl border border-border/40 bg-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-5 border-b border-border/30">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                        <p className="font-bold text-foreground">{meta.label}</p>
                        <span className={cn("text-xs font-bold px-2.5 py-0.5 rounded-full border shrink-0", scoreBadgeClass(section.score))}>
                            {scoreLabel(section.score)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                                className={cn("h-full rounded-full", scoreBgBar(section.score))}
                                style={{ width: `${section.score}%` }}
                            />
                        </div>
                        <span className={cn("text-sm font-extrabold tabular-nums shrink-0", scoreColor(section.score))}>
                            {section.score}<span className="text-muted-foreground font-normal">/100</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="px-5 py-3 bg-muted/20 border-b border-border/20 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">{meta.desc}</p>
            </div>

            {/* Body — always visible */}
            <div className="p-5 space-y-5">
                {section.strengths.length > 0 && (
                    <div className="space-y-2.5">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Давуу тал
                        </p>
                        <ul className="space-y-2">
                            {section.strengths.map((s, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground leading-relaxed">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {section.improvements.length > 0 && (
                    <div className="space-y-2.5">
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Сайжруулах зүйлс
                        </p>
                        <ul className="space-y-2">
                            {section.improvements.map((s, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground leading-relaxed">
                                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {section.strengths.length === 0 && section.improvements.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">Энэ хэсгийн мэдээлэл CV-д байхгүй байна.</p>
                )}
            </div>
        </div>
    )
}

export default function CVReviewResultPage() {
    const router = useRouter()

    const [result] = useState<CVReviewResult | null>(() => {
        if (typeof window === "undefined") return null
        const raw = sessionStorage.getItem("cvReviewResult")
        if (!raw) return null
        try { return JSON.parse(raw) as CVReviewResult } catch { return null }
    })

    const [fileName] = useState<string>(() => {
        if (typeof window === "undefined") return ""
        return sessionStorage.getItem("cvReviewFileName") ?? ""
    })

    useEffect(() => {
        if (!result) router.replace("/cv-review")
    }, [result, router])

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm">Үр дүн ачааллаж байна...</p>
                </div>
            </div>
        )
    }

    const avgSectionScore = Math.round(
        Object.values(result.sections).reduce((sum, s) => sum + s.score, 0) / 6
    )

    return (
        <main className="min-h-screen bg-background pb-24">
            {/* Sticky top bar */}
            <div className="sticky top-16 z-40 border-b border-border/40 bg-background/90 backdrop-blur-md">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
                    <Button variant="ghost" size="sm" className="gap-2 rounded-xl" asChild>
                        <Link href="/cv-review">
                            <ArrowLeft className="w-4 h-4" />
                            Буцах
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium text-muted-foreground truncate">{fileName}</span>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 rounded-xl shrink-0" asChild>
                        <Link href="/cv-review">
                            <RefreshCw className="w-4 h-4" />
                            Дахин шүүмжлэх
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-10 space-y-8 max-w-2xl">

                {/* Overall hero card */}
                <div className="rounded-3xl border border-border/40 bg-gradient-to-br from-primary/5 to-background p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        <div className="flex flex-col items-center gap-2 shrink-0">
                            <CircleScore score={result.overallScore} />
                            <span className={cn("text-sm font-bold", scoreColor(result.overallScore))}>
                                {scoreLabel(result.overallScore)}
                            </span>
                            <span className="text-xs text-muted-foreground">Нийт оноо</span>
                        </div>
                        <div className="space-y-4 text-center sm:text-left flex-1">
                            <div>
                                <h1 className="text-xl font-extrabold text-foreground leading-snug mb-2">
                                    CV шүүмжлэлийн үр дүн
                                </h1>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {result.overallSummary}
                                </p>
                            </div>
                            {/* Stats row */}
                            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/40 bg-background text-sm">
                                    <TrendingUp className="w-4 h-4 text-primary shrink-0" />
                                    <span className="text-muted-foreground text-xs">ATS нийцэл:</span>
                                    <span className={cn("font-bold text-sm", scoreColor(result.atsScore))}>
                                        {result.atsScore}/100
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/40 bg-background text-sm">
                                    <Layout className="w-4 h-4 text-primary shrink-0" />
                                    <span className="text-muted-foreground text-xs">Хэсгийн дундаж:</span>
                                    <span className={cn("font-bold text-sm", scoreColor(avgSectionScore))}>
                                        {avgSectionScore}/100
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Score bar summary */}
                    <div className="mt-7 pt-6 border-t border-border/30 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {SECTION_META.map(meta => {
                            const sec = result.sections[meta.key]
                            const Icon = meta.icon
                            return (
                                <div key={meta.key} className="flex items-center gap-2">
                                    <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-muted-foreground truncate mb-1">{meta.label}</p>
                                        <div className="flex items-center gap-1.5">
                                            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full", scoreBgBar(sec.score))}
                                                    style={{ width: `${sec.score}%` }}
                                                />
                                            </div>
                                            <span className={cn("text-[10px] font-bold tabular-nums shrink-0", scoreColor(sec.score))}>
                                                {sec.score}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Top recommendations */}
                {result.topRecommendations.length > 0 && (
                    <div className="rounded-2xl border border-primary/20 bg-primary/3 p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Lightbulb className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-bold text-foreground">Шилдэг зөвлөмжүүд</h2>
                                <p className="text-xs text-muted-foreground">CV-г хамгийн их сайжруулах {result.topRecommendations.length} алхам</p>
                            </div>
                        </div>
                        <ol className="space-y-3">
                            {result.topRecommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-foreground leading-relaxed">
                                    <span className="w-6 h-6 rounded-full bg-primary/15 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    {rec}
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {/* Section breakdown — all visible */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Хэсгүүдийн дэлгэрэнгүй үнэлгээ</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Таны CV-ийн 6 үндсэн хэсгийн давуу тал болон сайжруулах шаардлагатай зүйлс
                        </p>
                    </div>
                    {SECTION_META.map(meta => (
                        <SectionCard
                            key={meta.key}
                            meta={meta}
                            section={result.sections[meta.key]}
                        />
                    ))}
                </div>

                {/* Verdict */}
                <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                            <Trophy className="w-4.5 h-4.5 text-amber-500" />
                        </div>
                        <div>
                            <h2 className="font-bold text-foreground">Эцсийн дүгнэлт</h2>
                            <p className="text-xs text-muted-foreground">Нийт үнэлгээний хураангуй</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-12">{result.verdict}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button asChild size="lg" className="flex-1 h-11 rounded-xl font-bold gap-2">
                        <Link href="/cv-review">
                            <RefreshCw className="w-4 h-4" />
                            Өөр CV шүүмжлэх
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="flex-1 h-11 rounded-xl font-bold gap-2">
                        <Link href="/jobs">
                            <Briefcase className="w-4 h-4" />
                            Дадлага хайх
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    )
}
