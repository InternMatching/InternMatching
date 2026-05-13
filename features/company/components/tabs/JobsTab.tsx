"use client"

import React, { useMemo, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    PlusCircle, Pencil, Trash2, Search, Clock, Users2, AlertCircle, Building2, Send,
} from "lucide-react"
import { Job, JobInput, CompanyProfile } from "@/lib/type"
import { cn } from "@/lib/utils"
import { JobFormCard } from "@/features/company/components/JobFormCard"
import { JobView } from "@/features/company/components/JobView"

const getTimeRemaining = (deadline?: string, now = Date.now()) => {
    if (!deadline) return null
    const diff = new Date(deadline).getTime() - now
    if (diff <= 0) return "Хугацаа дууссан"
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days > 0) return `${days} хоног үлдсэн`
    const hours = Math.floor(diff / (1000 * 60 * 60))
    return `${hours} цаг үлдсэн`
}

type JobsGridProps = {
    jobs?: Job[]
    company?: CompanyProfile | null
    isVerified: boolean
    deletingJob: boolean
    onViewJob: (job: Job) => void
    onEditJob: (job: Job) => void
    onDeleteJob: (id: string, title: string) => void
    onPublishDraft: (id: string) => void
}

function JobsGrid({ jobs, company, isVerified, deletingJob, onViewJob, onEditJob, onDeleteJob, onPublishDraft }: JobsGridProps) {
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now()
    const jobsList = useMemo(() => {
        return jobs?.map((job) => {
            const isExpired = job.deadline ? new Date(job.deadline).getTime() < now : false
            return (
            <Card
                key={job.id}
                className={cn("transition-all border-border/60 bg-background rounded-xl shadow-none cursor-pointer", isExpired ? "opacity-50" : "hover:border-primary/40")}
                onClick={() => onViewJob(job)}
            >
                <CardContent className="p-4 font-medium">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-secondary/30 rounded-xl flex items-center justify-center border border-border/40 overflow-hidden shrink-0">
                            {company?.logoUrl ? (
                                <Image src={company.logoUrl} alt={company.companyName} width={40} height={40} className="object-cover w-full h-full" />
                            ) : (
                                <span className="text-sm font-medium text-primary/50 uppercase">
                                    {company?.companyName?.[0] || <Building2 className="w-4 h-4 text-muted-foreground" />}
                                </span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 pt-2 flex items-center gap-2">
                            <h3 className="font-bold text-sm truncate">{job.title}</h3>
                            {job.status === "draft" && (
                                <span className="shrink-0 text-[9px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 border border-amber-200">
                                    Ноороглосон
                                </span>
                            )}
                        </div>
                        <div className="hidden md:flex items-center gap-1 shrink-0 ml-auto">
                            {job.status === "draft" && isVerified && (
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-emerald-50 hover:text-emerald-600" title="Нийтлэх" onClick={(e) => { e.stopPropagation(); onPublishDraft(job.id) }}>
                                    <Send className="w-3.5 h-3.5" />
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary" onClick={(e) => { e.stopPropagation(); onEditJob(job) }}>
                                <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-red-50 hover:text-red-600" onClick={(e) => { e.stopPropagation(); onDeleteJob(job.id, job.title) }} disabled={deletingJob}>
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap mt-2 sm:ml-[52px] text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        <span className="flex items-center gap-1"><Search className="w-3 h-3" />{job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.salaryRange || "Уян хатан"}</span>
                        <span className="flex items-center gap-1">
                            <Users2 className="w-3 h-3" />
                            {job.applicationCount}{job.maxParticipants ? `/${job.maxParticipants}` : ""}
                        </span>
                        {job.deadline && (
                            <span className={cn(
                                "flex items-center gap-1",
                                new Date(job.deadline).getTime() - now < 86400000 ? "text-red-500" : "text-amber-500"
                            )}>
                                <AlertCircle className="w-3 h-3" />
                                {getTimeRemaining(job.deadline, now)}
                            </span>
                        )}
                        <div className="flex md:hidden items-center gap-1 shrink-0 ml-auto">
                            {job.status === "draft" && isVerified && (
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg hover:bg-emerald-50 hover:text-emerald-600" onClick={(e) => { e.stopPropagation(); onPublishDraft(job.id) }}>
                                    <Send className="w-3 h-3" />
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg hover:bg-primary/10 hover:text-primary" onClick={(e) => { e.stopPropagation(); onEditJob(job) }}>
                                <Pencil className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg hover:bg-red-50 hover:text-red-600" onClick={(e) => { e.stopPropagation(); onDeleteJob(job.id, job.title) }} disabled={deletingJob}>
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
        }) || []
    }, [jobs, now, company, deletingJob, isVerified, onViewJob, onEditJob, onDeleteJob, onPublishDraft])
    return <div className="grid gap-3">{jobsList}</div>
}

type Props = {
    jobs?: Job[]
    loading: boolean
    company?: CompanyProfile | null
    isVerified: boolean
    showForm: boolean
    onToggleForm: () => void
    form: JobInput
    setForm: React.Dispatch<React.SetStateAction<JobInput>>
    skillsInput: string
    setSkillsInput: (v: string) => void
    editingJob: Job | null
    viewingJob: Job | null
    setViewingJob: (job: Job | null) => void
    submittingForm: boolean
    deletingJob: boolean
    onSubmitForm: (e: React.FormEvent) => void
    onSaveDraft: (e: React.FormEvent) => void
    onPublishDraft: (id: string) => void
    onEditJob: (job: Job) => void
    onDeleteJob: (id: string, title: string) => void
}

export function CompanyJobsTab({
    jobs, loading, company, isVerified, showForm, onToggleForm, form, setForm,
    skillsInput, setSkillsInput, editingJob, viewingJob, setViewingJob,
    submittingForm, deletingJob, onSubmitForm, onSaveDraft, onPublishDraft, onEditJob, onDeleteJob,
}: Props) {
    const [returnCount, setReturnCount] = useState(0)

    const handleJobBack = () => {
        setViewingJob(null)
        setReturnCount(c => c + 1)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-5 mb-2">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight">Нийтэлсэн зарууд</h2>
                    <p className="text-xs text-muted-foreground font-medium">Нийт {jobs?.length || 0} дадлагын зар</p>
                </div>
                <Button size="sm" onClick={onToggleForm} className="rounded-xl h-9 px-4 font-bold">
                    {showForm ? "Болих" : <><PlusCircle className="w-3.5 h-3.5 mr-2" />Шинэ зар</>}
                </Button>
            </div>

            <div className={`grid transition-all duration-300 ease-in-out ${showForm ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="pb-2">
                        <JobFormCard
                            form={form} setForm={setForm} skillsInput={skillsInput} setSkillsInput={setSkillsInput}
                            editingJob={editingJob} submitting={submittingForm} isVerified={isVerified}
                            onSubmit={onSubmitForm} onSaveDraft={onSaveDraft}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="space-y-2">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-secondary/20 animate-pulse" />)}
                </div>
            ) : viewingJob ? (
                <JobView
                    job={viewingJob} company={company} isVerified={isVerified} deletingJob={deletingJob}
                    onBack={handleJobBack}
                    onEdit={(j) => { onEditJob(j); setViewingJob(null) }}
                    onDelete={(id, title) => { onDeleteJob(id, title); setViewingJob(null) }}
                    onPublishDraft={(id) => { onPublishDraft(id); setViewingJob(null) }}
                />
            ) : (
                <div key={returnCount} className={returnCount > 0 ? "animate-in fade-in slide-in-from-left-3 duration-300" : ""}>
                    <JobsGrid jobs={jobs} company={company} isVerified={isVerified} deletingJob={deletingJob} onViewJob={setViewingJob} onEditJob={onEditJob} onDeleteJob={onDeleteJob} onPublishDraft={onPublishDraft} />
                </div>
            )}
        </div>
    )
}
