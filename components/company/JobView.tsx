"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Pencil, Trash2, MapPin, DollarSign, Users2, Calendar, Building2 } from "lucide-react"
import { Job, CompanyProfile } from "@/lib/type"

type Props = {
    job: Job
    company?: CompanyProfile | null
    deletingJob: boolean
    onBack: () => void
    onEdit: (job: Job) => void
    onDelete: (id: string, title: string) => void
}

export function JobView({ job, company, deletingJob, onBack, onEdit, onDelete }: Props) {
    return (
        <Card className="border-border/60 bg-background rounded-xl shadow-none">
            <CardContent className="p-5 sm:p-6">
                <Button variant="ghost" size="sm" className="mb-4 gap-2 text-muted-foreground" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4" />
                    Буцах
                </Button>

                <div className="flex items-start gap-3 mb-5">
                    <div className="w-12 h-12 bg-secondary/30 rounded-xl flex items-center justify-center border border-border/40 overflow-hidden shrink-0">
                        {company?.logoUrl ? (
                            <Image src={company.logoUrl} alt={company.companyName} width={48} height={48} className="object-cover w-full h-full" />
                        ) : (
                            <span className="text-lg font-black text-primary/50 uppercase">
                                {company?.companyName?.[0] || <Building2 className="w-5 h-5 text-muted-foreground" />}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-lg">{job.title}</h2>
                        <p className="text-sm text-muted-foreground">{company?.companyName}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary" onClick={() => onEdit(job)}>
                            <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-red-50 hover:text-red-600" onClick={() => onDelete(job.id, job.title)} disabled={deletingJob}>
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap mb-5 text-xs text-muted-foreground font-medium">
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
                    <div className="mb-5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Шаардлагатай ур чадвар</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {job.requiredSkills.map((skill, i) => (
                                <span key={i} className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-lg">{skill}</span>
                            ))}
                        </div>
                    </div>
                )}

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
            </CardContent>
        </Card>
    )
}

function Section({ title, body }: { title: string; body: string }) {
    return (
        <div className="mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{title}</h4>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{body}</p>
        </div>
    )
}
