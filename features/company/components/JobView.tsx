"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Pencil, Trash2, MapPin, DollarSign, Users2, Calendar, Building2, Send } from "lucide-react"
import { Job, CompanyProfile } from "@/lib/type"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Props = {
    job: Job
    company?: CompanyProfile | null
    isVerified?: boolean
    deletingJob: boolean
    onBack: () => void
    onEdit: (job: Job) => void
    onDelete: (id: string, title: string) => void
    onPublishDraft?: (id: string) => void
}

export function JobView({ job, company, isVerified, deletingJob, onBack, onEdit, onDelete, onPublishDraft }: Props) {
    const [isExiting, setIsExiting] = useState(false)

    const handleBack = () => {
        setIsExiting(true)
        setTimeout(() => onBack(), 280)
    }

    const handlePublish = () => {
        if (!isVerified) {
            toast.error("Нийтлэх боломжгүй", {
                description: "Нийтлэхийн тулд эхлээд админаар баталгаажуулагдах шаардлагатай.",
            })
            return
        }
        onPublishDraft?.(job.id)
    }
    return (
        <Card className={cn(
            "border-border/60 bg-background rounded-xl shadow-none",
            isExiting
                ? "animate-out fade-out slide-out-to-bottom-3 duration-[280ms]"
                : "animate-in fade-in slide-in-from-bottom-3 duration-300"
        )}>
            <CardContent className="p-5 sm:p-6">
                <div className="animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: "50ms", animationFillMode: "both" }}>
                    <Button variant="ghost" size="sm" className="mb-4 gap-2 text-muted-foreground" onClick={handleBack}>
                        <ArrowLeft className="w-4 h-4" />
                        Буцах
                    </Button>
                </div>

                <div className="flex items-start gap-3 mb-5 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
                    <div className="w-12 h-12 bg-secondary/30 rounded-xl flex items-center justify-center border border-border/40 overflow-hidden shrink-0">
                        {company?.logoUrl ? (
                            <Image src={company.logoUrl} alt={company.companyName} width={48} height={48} className="object-cover w-full h-full" />
                        ) : (
                            <span className="text-lg font-medium text-primary/50 uppercase">
                                {company?.companyName?.[0] || <Building2 className="w-5 h-5 text-muted-foreground" />}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="font-bold text-lg">{job.title}</h2>
                            {job.status === "draft" && (
                                <span className="text-[9px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 border border-amber-200">
                                    Ноороглосон
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">{company?.companyName}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        {job.status === "draft" && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-3 rounded-lg text-xs font-bold gap-1.5 hover:bg-emerald-50 hover:text-emerald-600"
                                onClick={handlePublish}
                            >
                                <Send className="w-3.5 h-3.5" />
                                Нийтлэх
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary" onClick={() => onEdit(job)}>
                            <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-red-50 hover:text-red-600" onClick={() => onDelete(job.id, job.title)} disabled={deletingJob}>
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap mb-5 text-xs text-muted-foreground font-medium animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: "170ms", animationFillMode: "both" }}>
                    {job.location && (
                        <span className="flex items-center gap-1.5 bg-secondary/30 px-2.5 py-1 rounded-lg">
                            <MapPin className="w-3.5 h-3.5" />{job.location}
                        </span>
                    )}
                    <span className="flex items-center gap-1.5 bg-secondary/30 px-2.5 py-1 rounded-lg">
                        <DollarSign className="w-3.5 h-3.5" />{job.salaryRange || "Уян хатан"}
                    </span>
                    <span className="flex items-center gap-1.5 bg-secondary/30 px-2.5 py-1 rounded-lg">
                        <Users2 className="w-3.5 h-3.5" />
                        {job.applicationCount}{job.maxParticipants ? `/${job.maxParticipants}` : ""} өргөдөл
                    </span>
                    {job.deadline && (
                        <span className="flex items-center gap-1.5 bg-secondary/30 px-2.5 py-1 rounded-lg">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(job.deadline).toLocaleDateString("mn-MN")}
                        </span>
                    )}
                </div>

                {job.requiredSkills?.length > 0 && (
                    <div className="mb-5 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: "240ms", animationFillMode: "both" }}>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Шаардлагатай ур чадвар</h4>
                        <div className="flex flex-wrap gap-3.5 my-4">
                            {job.requiredSkills.map((skill, i) => (
                                <span key={i} className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-lg ">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: "310ms", animationFillMode: "both" }}>
                    {job.description && (
                        <Section title="Тайлбар" body={job.description} />
                    )}
                    {job.responsibilities && (
                        <Section title="Хариуцлага" body={job.responsibilities} />
                    )}
                    {job.requirements && (
                        <Section title="Шаардлага" body={job.requirements} />
                    )}
                    {job.additionalInfo && (
                        <Section title="Нэмэлт мэдээлэл" body={job.additionalInfo} />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function Section({ title, body }: { title: string; body: string }) {
    return (
        <div className="mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{title}</h4>
            <p className="text-sm leading-relaxed p-4">{body}</p>
        </div>
    )
}
