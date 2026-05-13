"use client"

import React, { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { gql } from "@apollo/client"
import { useMutation } from "@apollo/client/react"
import { toast } from "sonner"
import Link from "next/link"
import {
    Upload,
    FileText,
    Sparkles,
    Loader2,
    CheckCircle2,
    ArrowRight,
    Shield,
    Zap,
    Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { CVReviewResult } from "@/lib/type"

const REVIEW_CV = gql`
  mutation ReviewCV($base64PDF: String!) {
    reviewCV(base64PDF: $base64PDF) {
      overallScore
      overallSummary
      sections {
        contact { score strengths improvements }
        summary { score strengths improvements }
        experience { score strengths improvements }
        education { score strengths improvements }
        skills { score strengths improvements }
        format { score strengths improvements }
      }
      topRecommendations
      atsScore
      verdict
    }
  }
`

const features = [
    {
        icon: Sparkles,
        title: "AI шинжилгээ",
        desc: "Claude AI таны CV-г мэргэжлийн шүүмжлэгчийн нүдээр үнэлнэ",
    },
    {
        icon: Target,
        title: "Хэсгүүдийн үнэлгээ",
        desc: "Туршлага, боловсрол, ур чадвар, формат — бүр тус бүрээр",
    },
    {
        icon: Shield,
        title: "ATS нийцэл",
        desc: "Автомат шүүлтүүрт нийцэж байгаа эсэхийг шалгана",
    },
    {
        icon: Zap,
        title: "Хурдан үр дүн",
        desc: "15 секундын дотор бүрэн шинжилгээ хүлээн авна",
    },
]


export default function CVReviewPage() {
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [dragging, setDragging] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [reviewCV, { loading }] = useMutation<{ reviewCV: CVReviewResult }>(REVIEW_CV)

    const processFile = (file: File) => {
        if (file.type !== "application/pdf") {
            toast.error("Зөвхөн PDF файл оруулна уу")
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Файлын хэмжээ 5MB-аас бага байх ёстой")
            return
        }
        setSelectedFile(file)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) processFile(file)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) processFile(file)
        e.target.value = ""
    }

    const handleSubmit = async () => {
        if (!selectedFile) return
        const reader = new FileReader()
        reader.onloadend = async () => {
            try {
                const { data } = await reviewCV({
                    variables: { base64PDF: reader.result as string },
                })
                if (data?.reviewCV) {
                    sessionStorage.setItem("cvReviewResult", JSON.stringify(data.reviewCV))
                    sessionStorage.setItem("cvReviewFileName", selectedFile.name)
                    router.push("/cv-review/result")
                }
            } catch (err: unknown) {
                console.error("[reviewCV]", err)
                const gqlMsg = (err as { graphQLErrors?: { message?: string }[] })
                    ?.graphQLErrors?.[0]?.message
                const netMsg = (err as { networkError?: { message?: string } })
                    ?.networkError?.message
                toast.error(
                    gqlMsg ?? netMsg ?? "CV шүүмжлэхэд алдаа гарлаа. PDF файл зөв форматтай эсэхийг шалгана уу."
                )
            }
        }
        reader.readAsDataURL(selectedFile)
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/5 to-background pt-16 pb-20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_70%)]" />
                <div className="container mx-auto px-4 relative">
                    <div className="max-w-2xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
                            <Sparkles className="w-3.5 h-3.5" />
                            AI-аар ажилладаг
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                            Таны CV-г{" "}
                            <span className="text-primary">мэргэжлийн</span>{" "}
                            түвшинд үнэлнэ
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            CV-гээ оруулаад хэдхэн секундын дотор мэргэжлийн шүүмж, оноо,
                            сайжруулах зөвлөмжийг монгол хэлээр авна уу.
                        </p>
                    </div>
                </div>
            </section>

            {/* Upload section — always shown */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-xl mx-auto space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-foreground mb-1">CV-гээ оруулна уу</h2>
                        <p className="text-sm text-muted-foreground">PDF формат • Хамгийн ихдээ 5MB</p>
                    </div>

                    {/* Drop zone */}
                    <div
                        onClick={() => !loading && fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        className={cn(
                            "relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all duration-200",
                            dragging
                                ? "border-primary bg-primary/5 scale-[1.01]"
                                : selectedFile
                                    ? "border-emerald-500/50 bg-emerald-500/5"
                                    : "border-border hover:border-primary/50 hover:bg-muted/40",
                            loading && "pointer-events-none opacity-60"
                        )}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {selectedFile ? (
                            <>
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-foreground">{selectedFile.name}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Файл бэлэн
                                    </p>
                                </div>
                                <p className="text-xs text-muted-foreground">Өөр файл сонгохын тулд дарна уу</p>
                            </>
                        ) : (
                            <>
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                                    dragging ? "bg-primary/15" : "bg-muted"
                                )}>
                                    <Upload className={cn("w-7 h-7 transition-colors", dragging ? "text-primary" : "text-muted-foreground")} />
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-foreground">CV файлаа энд чирэх эсвэл дарж сонгох</p>
                                    <p className="text-sm text-muted-foreground mt-1">PDF • Хамгийн ихдээ 5MB</p>
                                </div>
                            </>
                        )}
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedFile || loading || authLoading || !user}
                        size="lg"
                        className="w-full h-12 rounded-xl font-bold text-base gap-2 shadow-md shadow-primary/20"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                CV шүүмжилж байна...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                CV шүүмжлэх
                            </>
                        )}
                    </Button>

                    {loading && (
                        <p className="text-center text-sm text-muted-foreground animate-pulse">
                            AI таны CV-г уншиж, шинжилж байна. Хэдэн секунд хүлээнэ үү...
                        </p>
                    )}

                    {/* Inline auth nudge — only when not logged in */}
                    {!authLoading && !user && (
                        <p className="text-center text-sm text-muted-foreground">
                            Бүртгэлтэй юу?{" "}
                            <Link href="/login" className="font-semibold text-foreground hover:text-primary transition-colors">
                                Нэвтрэх
                            </Link>
                            {" · "}
                            <Link href="/signup" className="font-semibold text-foreground hover:text-primary transition-colors">
                                Бүртгүүлэх
                            </Link>
                        </p>
                    )}

                    {/* Profile link — only when logged in */}
                    {user && (
                        <div className="flex items-center justify-center gap-2">
                            <p className="text-xs text-muted-foreground">CV-г профайлдаа нэмэхийг хүсвэл</p>
                            <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs gap-1">
                                <Link href="/student?tab=profile">
                                    <FileText className="w-3 h-3" />
                                    Профайл руу очих
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Features */}
            <section className="border-t border-border/40 bg-muted/20 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-xl font-bold text-center text-foreground mb-10">
                            Юу үнэлэгддэг вэ?
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {features.map(({ icon: Icon, title, desc }) => (
                                <div key={title} className="flex items-start gap-4 p-4 rounded-2xl bg-background border border-border/40">
                                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-foreground">{title}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
