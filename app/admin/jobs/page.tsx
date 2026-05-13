"use client"

import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {
    Search, MapPin, Trash2, Eye, Plus, Loader2,
    Building2, X, Briefcase, Pencil,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const GET_ALL_JOBS = gql`
  query GetAllJobsAdmin {
    getAllJobs {
      id title description type status location salaryRange
      responsibilities requirements additionalInfo
      deadline maxParticipants requiredSkills postedAt
      company { id companyName industry logoUrl }
    }
  }
`

const GET_ALL_COMPANIES = gql`
  query GetAllCompaniesForJobForm {
    getAllCompanyProfiles {
      id companyName industry isVerified
    }
  }
`

const ADMIN_CREATE_JOB = gql`
  mutation AdminCreateJob($companyProfileId: ID!, $input: JobInput!) {
    adminCreateJob(companyProfileId: $companyProfileId, input: $input) {
      id title status
    }
  }
`

const UPDATE_JOB = gql`
  mutation UpdateJob($id: ID!, $input: JobInput!) {
    updateJob(id: $id, input: $input) {
      id title status
    }
  }
`

const DELETE_JOB = gql`
  mutation DeleteJob($id: ID!) {
    deleteJob(id: $id)
  }
`

const SALARY_OPTIONS = [
    "Тохиролцоно",
    "300,000₮ - 500,000₮",
    "500,000₮ - 800,000₮",
    "800,000₮ - 1,200,000₮",
    "1,200,000₮ - 1,500,000₮",
    "1,500,000₮ - 2,000,000₮",
    "2,000,000₮+",
]

interface Job {
    id: string; title: string; description?: string; type: string
    status: string; location?: string; salaryRange?: string
    responsibilities?: string; requirements?: string; additionalInfo?: string
    deadline?: string; maxParticipants?: number; requiredSkills?: string[]
    postedAt: string
    company: { id?: string; companyName: string; industry?: string; logoUrl?: string }
}

interface Company {
    id: string; companyName: string; industry?: string; isVerified: boolean
}

const EMPTY_FORM = {
    title: "", description: "", location: "", salaryRange: "",
    deadline: "", maxParticipants: "",
    responsibilities: "", requirements: "", additionalInfo: "",
    skillsInput: "", requiredSkills: [] as string[], status: "open",
}

export default function JobsManagementPage() {
    const { data, loading, error, refetch } = useQuery<{ getAllJobs: Job[] }>(GET_ALL_JOBS)
    const { data: companiesData } = useQuery<{ getAllCompanyProfiles: Company[] }>(GET_ALL_COMPANIES)
    const [deleteJob] = useMutation(DELETE_JOB)
    const [adminCreateJob, { loading: creating }] = useMutation(ADMIN_CREATE_JOB)
    const [updateJob, { loading: updating }] = useMutation(UPDATE_JOB)
    const router = useRouter()

    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [showForm, setShowForm] = useState(false)
    const [editingJob, setEditingJob] = useState<Job | null>(null)
    const [selectedCompanyId, setSelectedCompanyId] = useState("")
    const [form, setForm] = useState(EMPTY_FORM)

    const submitting = creating || updating
    const companies = companiesData?.getAllCompanyProfiles || []

    const filteredJobs = (data?.getAllJobs || []).filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || job.status.toLowerCase() === statusFilter
        return matchesSearch && matchesStatus
    })

    const openCreate = () => {
        setEditingJob(null)
        setSelectedCompanyId("")
        setForm(EMPTY_FORM)
        setShowForm(true)
    }

    const openEdit = (job: Job) => {
        setEditingJob(job)
        setSelectedCompanyId("")
        setForm({
            title: job.title,
            description: job.description || "",
            location: job.location || "",
            salaryRange: job.salaryRange || "",
            deadline: job.deadline ? job.deadline.split("T")[0] : "",
            maxParticipants: job.maxParticipants?.toString() || "",
            responsibilities: job.responsibilities || "",
            requirements: job.requirements || "",
            additionalInfo: job.additionalInfo || "",
            skillsInput: "",
            requiredSkills: job.requiredSkills || [],
            status: job.status,
        })
        setShowForm(true)
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditingJob(null)
        setSelectedCompanyId("")
        setForm(EMPTY_FORM)
    }

    const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === "Enter" || e.key === ",") && form.skillsInput.trim()) {
            e.preventDefault()
            const skill = form.skillsInput.trim()
            if (!form.requiredSkills.includes(skill))
                setForm(f => ({ ...f, requiredSkills: [...f.requiredSkills, skill], skillsInput: "" }))
            else
                setForm(f => ({ ...f, skillsInput: "" }))
        } else if (e.key === "Backspace" && !form.skillsInput && form.requiredSkills.length > 0) {
            setForm(f => ({ ...f, requiredSkills: f.requiredSkills.slice(0, -1) }))
        }
    }

    const removeSkill = (s: string) =>
        setForm(f => ({ ...f, requiredSkills: f.requiredSkills.filter(x => x !== s) }))

    const buildInput = () => ({
        title: form.title.trim(),
        description: form.description || undefined,
        location: form.location || undefined,
        salaryRange: form.salaryRange || undefined,
        requiredSkills: form.requiredSkills,
        deadline: form.deadline || undefined,
        maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : undefined,
        responsibilities: form.responsibilities || undefined,
        requirements: form.requirements || undefined,
        additionalInfo: form.additionalInfo || undefined,
        type: "intern",
        status: form.status,
    })

    const handleSubmit = async () => {
        if (!form.title.trim()) { toast.error("Гарчиг оруулна уу"); return }

        try {
            if (editingJob) {
                await updateJob({ variables: { id: editingJob.id, input: buildInput() } })
                toast.success("Зар амжилттай шинэчлэгдлээ")
            } else {
                if (!selectedCompanyId) { toast.error("Компани сонгоно уу"); return }
                await adminCreateJob({ variables: { companyProfileId: selectedCompanyId, input: buildInput() } })
                toast.success("Дадлагын зар амжилттай нэмэгдлээ")
            }
            handleCancel()
            refetch()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Алдаа гарлаа")
        }
    }

    const handleDelete = (id: string, title: string) => {
        toast(`"${title}" зарыг устгах уу?`, {
            action: {
                label: "Устгах",
                onClick: async () => {
                    try {
                        await deleteJob({ variables: { id } })
                        toast.success("Дадлагын байр амжилттай устлаа")
                        refetch()
                    } catch (err) {
                        toast.error(err instanceof Error ? err.message : "Устгахад алдаа гарлаа")
                    }
                },
            },
            cancel: { label: "Болих", onClick: () => {} },
            duration: 8000,
        })
    }

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
    if (error) return <div className="p-4 text-destructive">Алдаа: {error.message}</div>

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Дадлагын зарууд</h1>
                    <p className="text-muted-foreground">Системд нийтлэгдсэн бүх дадлагын байрны мэдээлэл.</p>
                </div>
                <Button onClick={showForm && !editingJob ? handleCancel : openCreate} variant={showForm && !editingJob ? "secondary" : "default"}>
                    <Plus className="w-4 h-4 mr-2" />
                    Шинэ зар нэмэх
                </Button>
            </div>

            {/* Inline form panel */}
            <div className={`grid transition-all duration-300 ease-in-out ${showForm ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                    <Card className="p-5">
                        {/* Panel header */}
                        <div className="flex items-start justify-between gap-4 mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Briefcase className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        {editingJob ? `Засах: "${editingJob.title}"` : "Шинэ зар нэмэх"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {editingJob ? `${editingJob.company.companyName}` : "Компанийн нэрийн өмнөөс дадлагын зар нийтлэх"}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCancel}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {/* Company selector (create only) */}
                            {!editingJob && (
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">Компани <span className="text-destructive">*</span></Label>
                                    <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                                        <SelectTrigger className="h-9 text-sm">
                                            <SelectValue placeholder="Компани сонгоно уу..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.map(c => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                                                            {c.companyName[0]}
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-xs font-medium truncate">{c.companyName}</span>
                                                            {c.industry && <span className="text-[10px] text-muted-foreground">{c.industry}</span>}
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Row: Title + Location */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">Гарчиг <span className="text-destructive">*</span></Label>
                                    <Input className="h-9 text-sm" placeholder="Frontend Developer Intern..." value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">Байршил</Label>
                                    <Input className="h-9 text-sm" placeholder="Улаанбаатар" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                                </div>
                            </div>

                            {/* Row: Salary + Deadline + Max + Status */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">Цалингийн хэмжээ</Label>
                                    <Select value={form.salaryRange} onValueChange={v => setForm(f => ({ ...f, salaryRange: v }))}>
                                        <SelectTrigger className="h-9 text-sm">
                                            <SelectValue placeholder="Сонгох..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SALARY_OPTIONS.map(o => (
                                                <SelectItem key={o} value={o}>{o}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">Дуусах хугацаа</Label>
                                    <Input type="date" className="h-9 text-sm" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">Хүлээн авах тоо</Label>
                                    <Input type="number" min={1} className="h-9 text-sm" placeholder="5" value={form.maxParticipants} onChange={e => setForm(f => ({ ...f, maxParticipants: e.target.value }))} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">Төлөв</Label>
                                    <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="open">Нээлттэй</SelectItem>
                                            <SelectItem value="closed">Хаагдсан</SelectItem>
                                            <SelectItem value="draft">Ноороглосон</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium">Шаардлагатай ур чадвар</Label>
                                <div className={cn("flex flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-2 min-h-9 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", form.requiredSkills.length === 0 && "items-center")}>
                                    {form.requiredSkills.map(skill => (
                                        <span key={skill} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium border border-primary/20 shrink-0">
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-destructive transition-colors ml-0.5">
                                                <X className="w-2.5 h-2.5" />
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        className="flex-1 min-w-[120px] text-sm outline-none bg-transparent placeholder:text-muted-foreground"
                                        placeholder={form.requiredSkills.length === 0 ? "React гэж бичээд Enter дар..." : "Нэмэх..."}
                                        value={form.skillsInput}
                                        onChange={e => setForm(f => ({ ...f, skillsInput: e.target.value }))}
                                        onKeyDown={handleSkillKeyDown}
                                    />
                                </div>
                            </div>

                            {/* Тайлбар */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium">Тайлбар</Label>
                                <textarea
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    rows={3} placeholder="Дадлагын байрны ерөнхий тайлбар..."
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                />
                            </div>

                            {/* Хариуцлага + Шаардлага side by side */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">Хариуцлага</Label>
                                    <textarea
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        rows={4} placeholder="Гүйцэтгэх үндсэн үүрэг, даалгавар..."
                                        value={form.responsibilities}
                                        onChange={e => setForm(f => ({ ...f, responsibilities: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">Шаардлага</Label>
                                    <textarea
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        rows={4} placeholder="Мэргэжил, туршлага, ур чадвар..."
                                        value={form.requirements}
                                        onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))}
                                    />
                                </div>
                            </div>

                            {/* Нэмэлт мэдээлэл */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium">Нэмэлт мэдээлэл</Label>
                                <textarea
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    rows={2} placeholder="Бусад зүйлс, тэмдэглэл..."
                                    value={form.additionalInfo}
                                    onChange={e => setForm(f => ({ ...f, additionalInfo: e.target.value }))}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2 pt-1 border-t">
                                <Button variant="outline" size="sm" onClick={handleCancel} disabled={submitting}>Болих</Button>
                                <Button
                                    size="sm"
                                    onClick={handleSubmit}
                                    disabled={submitting || (!editingJob && !selectedCompanyId) || !form.title.trim()}
                                >
                                    {submitting
                                        ? <><Loader2 className="animate-spin mr-1.5 h-3.5 w-3.5" />{editingJob ? "Шинэчилж байна..." : "Нэмж байна..."}</>
                                        : editingJob ? "Шинэчлэх" : "Нэмэх"
                                    }
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Зарын нэрээр хайх..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-md">
                    {["all", "open", "closed"].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${statusFilter === s ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                            {s === "all" ? "Бүгд" : s === "open" ? "Нээлттэй" : "Хаагдсан"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-secondary/20">
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Дадлагын байр</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Компани</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Төлөв</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Үйлдэл</th>
                            </tr>
                        </thead>
                        <tbody key={statusFilter + searchTerm} className="divide-y animate-in fade-in duration-200">
                            {filteredJobs.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-20 text-center text-muted-foreground">Дадлагын зар олдсонгүй.</td></tr>
                            ) : (
                                filteredJobs.map(job => (
                                    <tr key={job.id} className="hover:bg-secondary/40 transition-colors cursor-pointer" onClick={() => router.push(`/admin/jobs/${job.id}`)}>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{job.title}</span>
                                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                    <MapPin className="w-3 h-3 text-rose-500" />{job.location || "—"}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">{job.company.companyName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${job.status === "open" ? "bg-green-100 text-green-700" : job.status === "draft" ? "bg-amber-100 text-amber-700" : "bg-secondary text-muted-foreground"}`}>
                                                {job.status === "open" ? "Нээлттэй" : job.status === "draft" ? "Ноороглосон" : "Хаагдсан"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <Link href={`/admin/jobs/${job.id}`}><Eye className="w-4 h-4" /></Link>
                                                </Button>
                                                <Button
                                                    variant="ghost" size="icon"
                                                    className={cn("h-8 w-8", editingJob?.id === job.id && "bg-primary/10 text-primary")}
                                                    onClick={() => editingJob?.id === job.id ? handleCancel() : openEdit(job)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(job.id, job.title)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
