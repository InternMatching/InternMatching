"use client"

import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { toast } from "sonner"
import { CREATE_JOB, UPDATE_JOB, DELETE_JOB } from "@/features/jobs/graphql/jobs.mutations"
import { Job, JobInput, CompanyProfile } from "@/lib/type"

const EMPTY_JOB: JobInput = {
    title: "", description: "", type: "intern", location: "", salaryRange: "",
    responsibilities: "", requirements: "", additionalInfo: "", deadline: "", requiredSkills: [],
}

export function useCompanyJobs(profile: CompanyProfile | null | undefined, refetchJobs: () => void) {
    const [jobForm, setJobForm] = useState<JobInput>(EMPTY_JOB)
    const [showJobForm, setShowJobForm] = useState(false)
    const [editingJob, setEditingJob] = useState<Job | null>(null)
    const [viewingJob, setViewingJob] = useState<Job | null>(null)
    const [skillsInput, setSkillsInput] = useState("")

    const [createJob, { loading: creatingJob }] = useMutation<{ createJob: Job }, { input: JobInput }>(CREATE_JOB)
    const [updateJob, { loading: updatingJob }] = useMutation(UPDATE_JOB)
    const [deleteJob, { loading: deletingJob }] = useMutation(DELETE_JOB)

    const resetForm = () => { setJobForm(EMPTY_JOB); setSkillsInput(""); setEditingJob(null) }

    const toggleForm = () => { setShowJobForm((v) => !v); resetForm() }

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!jobForm.title.trim()) { toast.error("Ажлын нэр оруулна уу"); return }
        try {
            if (editingJob) {
                const input = editingJob.status === "draft"
                    ? { ...jobForm, status: "draft" as const }
                    : jobForm
                await updateJob({ variables: { id: editingJob.id, input } })
                toast.success("Зар амжилттай шинэчлэгдлээ!")
            } else {
                if (!profile?.isVerified) { toast.error("Таны бүртгэл баталгаажаагүй байна"); return }
                await createJob({ variables: { input: jobForm } })
                toast.success("Ажлын байр амжилттай бүртгэгдлээ!")
            }
            setShowJobForm(false)
            resetForm()
            refetchJobs()
        } catch (err) {
            console.error(err)
            toast.error(editingJob ? "Зар шинэчлэхэд алдаа гарлаа" : "Ажлын байр бүртгэхэд алдаа гарлаа")
        }
    }

    const saveDraft = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!jobForm.title.trim()) { toast.error("Ажлын нэр оруулна уу"); return }
        try {
            if (editingJob) {
                await updateJob({ variables: { id: editingJob.id, input: { ...jobForm, status: "draft" as const } } })
                toast.success("Ноороглогдлоо!")
            } else {
                await createJob({ variables: { input: { ...jobForm, status: "draft" as const } } })
                toast.success("Зар ноороглогдлоо!")
            }
            setShowJobForm(false)
            resetForm()
            refetchJobs()
        } catch (err) {
            console.error(err)
            toast.error("Ноороглоход алдаа гарлаа")
        }
    }

    const publishDraft = async (jobId: string) => {
        if (!profile?.isVerified) { toast.error("Нийтлэхийн тулд бүртгэлээ баталгаажуулна уу"); return }
        try {
            await updateJob({ variables: { id: jobId, input: { status: "open" as const } } })
            toast.success("Зар амжилттай нийтлэгдлээ!")
            refetchJobs()
        } catch (err) {
            console.error(err)
            toast.error("Нийтлэхэд алдаа гарлаа")
        }
    }

    const editJob = (job: Job) => {
        setEditingJob(job)
        setJobForm({
            title: job.title, description: job.description || "", type: job.type,
            requiredSkills: job.requiredSkills || [], location: job.location || "",
            salaryRange: job.salaryRange || "", responsibilities: job.responsibilities || "",
            requirements: job.requirements || "", additionalInfo: job.additionalInfo || "",
            deadline: job.deadline ? job.deadline.split("T")[0] : "", maxParticipants: job.maxParticipants,
        })
        setSkillsInput("")
        setShowJobForm(true)
    }

    const removeJob = async (jobId: string, jobTitle: string) => {
        if (!confirm(`"${jobTitle}" зарыг устгахдаа итгэлтэй байна уу?`)) return
        try {
            await deleteJob({ variables: { id: jobId } })
            toast.success("Зар амжилттай устгагдлаа!")
            refetchJobs()
        } catch (err) {
            console.error(err)
            toast.error("Зар устгахад алдаа гарлаа")
        }
    }

    return {
        jobForm, setJobForm, showJobForm, editingJob, viewingJob, setViewingJob,
        skillsInput, setSkillsInput,
        submitting: creatingJob || updatingJob, deletingJob,
        toggleForm, submitForm, saveDraft, publishDraft, editJob, removeJob,
    }
}
