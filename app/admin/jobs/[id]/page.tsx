"use client"

import React, { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {
    ArrowLeft,
    Briefcase,
    Building2,
    MapPin,
    Clock,
    Calendar,
    Users2,
    Globe,
    Loader2,
    Trash2,
    DollarSign,
    FileText
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"

const GET_ALL_JOBS = gql`
  query GetAllJobs {
    getAllJobs {
      id
      title
      description
      type
      location
      salaryRange
      responsibilities
      requirements
      additionalInfo
      deadline
      maxParticipants
      applicationCount
      requiredSkills
      status
      postedAt
      company {
        companyName
        logoUrl
        location
        foundedYear
        employeeCount
        slogan
        website
      }
    }
  }
`

const DELETE_JOB = gql`
  mutation DeleteJob($id: ID!) {
    deleteJob(id: $id)
  }
`

interface Job {
    id: string
    title: string
    description: string
    type: string
    location: string
    salaryRange?: string
    responsibilities?: string[]
    requirements?: string[]
    additionalInfo?: string
    deadline?: string
    maxParticipants?: number
    applicationCount?: number
    requiredSkills?: string[]
    status: string
    postedAt: string
    company: {
        companyName: string
        logoUrl?: string
        location?: string
        foundedYear?: number
        employeeCount?: number
        slogan?: string
        website?: string
    }
}

export default function AdminJobDetailPage() {
    const params = useParams()
    const router = useRouter()
    const jobId = params.id as string

    const { data, loading, error } = useQuery<{ getAllJobs: Job[] }>(GET_ALL_JOBS)
    const [deleteJob] = useMutation(DELETE_JOB)

    const job = useMemo(() => {
        if (!data?.getAllJobs) return null
        return data.getAllJobs.find(j => j.id === jobId) || null
    }, [data, jobId])

    const handleDelete = async () => {
        if (!confirm("Энэ дадлагын зарыг устгахдаа итгэлтэй байна уу?")) return
        try {
            await deleteJob({ variables: { id: jobId } })
            toast.success("Дадлагын байр амжилттай устлаа")
            router.push("/admin/jobs")
        } catch (err: any) {
            toast.error(err.message || "Устгахад алдаа гарлаа")
        }
    }

    if (loading) return (
        <div className="flex justify-center p-12">
            <Loader2 className="animate-spin" />
        </div>
    )

    if (error) return (
        <div className="p-4 text-destructive">Алдаа: {error.message}</div>
    )

    if (!job) return (
        <div className="space-y-4">
            <Button variant="ghost" size="sm" className="rounded-xl font-medium" onClick={() => router.push("/admin/jobs")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Буцах
            </Button>
            <div className="py-20 text-center text-muted-foreground">
                Дадлагын зар олдсонгүй.
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => router.push("/admin/jobs")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Буцах
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30"
                    onClick={handleDelete}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Устгах
                </Button>
            </div>

            {/* Job Info Card */}
            <Card>
                <CardContent className="p-6 space-y-6">
                    {/* Title & Company */}
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center border overflow-hidden shrink-0">
                            {job.company.logoUrl ? (
                                <img src={job.company.logoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <Briefcase className="w-6 h-6 text-primary/40" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-bold">{job.title}</h1>
                            <p className="text-sm text-primary font-medium">{job.company.companyName}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-rose-500" />
                                    {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {job.type}
                                </span>
                                <span className={`font-medium px-2 py-0.5 rounded-full ${job.status === 'open' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-secondary text-muted-foreground'}`}>
                                    {job.status === 'open' ? 'Нээлттэй' : 'Хаагдсан'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {job.salaryRange && (
                            <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    <DollarSign className="w-3 h-3" />
                                    Цалин
                                </div>
                                <p className="text-sm font-bold">{job.salaryRange}</p>
                            </div>
                        )}
                        <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                <Calendar className="w-3 h-3" />
                                Нийтэлсэн
                            </div>
                            <p className="text-sm font-bold">{(() => { const d = new Date(isNaN(Number(job.postedAt)) ? job.postedAt : Number(job.postedAt)); return isNaN(d.getTime()) ? job.postedAt : d.toLocaleDateString('mn-MN') })()}</p>
                        </div>
                        {job.deadline && (
                            <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    <Clock className="w-3 h-3" />
                                    Дуусах хугацаа
                                </div>
                                <p className="text-sm font-bold">{(() => { const d = new Date(isNaN(Number(job.deadline)) ? job.deadline : Number(job.deadline!)); return isNaN(d.getTime()) ? job.deadline : d.toLocaleDateString('mn-MN') })()}</p>
                            </div>
                        )}
                        {job.applicationCount !== undefined && (
                            <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 space-y-1">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    <Users2 className="w-3 h-3" />
                                    Өргөдлүүд
                                </div>
                                <p className="text-sm font-bold">{job.applicationCount}</p>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {job.description && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <div className="h-px flex-1 bg-border/40" />
                                Тайлбар
                                <div className="h-px flex-1 bg-border/40" />
                            </h3>
                            <p className="text-sm leading-relaxed text-foreground/80">{job.description}</p>
                        </div>
                    )}

                    {/* Requirements */}
                    {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <div className="h-px flex-1 bg-border/40" />
                                Шаардлага
                                <div className="h-px flex-1 bg-border/40" />
                            </h3>
                            <ul className="space-y-1.5">
                                {job.requirements.map((req, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Responsibilities */}
                    {job.responsibilities && Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <div className="h-px flex-1 bg-border/40" />
                                Үүрэг даалгавар
                                <div className="h-px flex-1 bg-border/40" />
                            </h3>
                            <ul className="space-y-1.5">
                                {job.responsibilities.map((resp, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                        {resp}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Required Skills */}
                    {job.requiredSkills && Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <div className="h-px flex-1 bg-border/40" />
                                Шаардлагатай ур чадвар
                                <div className="h-px flex-1 bg-border/40" />
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {job.requiredSkills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional Info */}
                    {job.additionalInfo && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <div className="h-px flex-1 bg-border/40" />
                                Нэмэлт мэдээлэл
                                <div className="h-px flex-1 bg-border/40" />
                            </h3>
                            <p className="text-sm leading-relaxed text-foreground/80">{job.additionalInfo}</p>
                        </div>
                    )}

                    {/* Company Info */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <div className="h-px flex-1 bg-border/40" />
                            Компанийн мэдээлэл
                            <div className="h-px flex-1 bg-border/40" />
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {job.company.foundedYear && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-background border border-border/40 text-sm">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">Байгуулагдсан: {job.company.foundedYear}</span>
                                </div>
                            )}
                            {job.company.employeeCount && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-background border border-border/40 text-sm">
                                    <Users2 className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">Ажилчид: {job.company.employeeCount}</span>
                                </div>
                            )}
                            {job.company.website && (
                                <a
                                    href={job.company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-3 rounded-xl bg-background border border-border/40 text-sm font-medium text-primary hover:bg-primary/5 transition-colors col-span-2"
                                >
                                    <Globe className="w-4 h-4" />
                                    {job.company.website}
                                </a>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
