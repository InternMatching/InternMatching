"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "@apollo/client/react"
import { useAuth } from "@/lib/auth-context"
import { CheckCircle2 } from "lucide-react"
import { GET_COMPANY_PROFILE } from "@/features/company/graphql/company.queries"
import { UPDATE_COMPANY_PROFILE, UPLOAD_COMPANY_LOGO } from "@/features/company/graphql/company.mutations"
import { GET_ALL_JOBS } from "@/features/jobs/graphql/jobs.queries"
import { GET_APPLICATIONS } from "@/features/applications/graphql/applications.queries"
import { UPDATE_APPLICATION_STATUS } from "@/features/applications/graphql/applications.mutations"
import { GET_ALL_STUDENT_PROFILES } from "@/features/student/graphql/student.queries"
import { GET_INVITATIONS } from "@/features/invitations/graphql/invitations.queries"
import { SEND_INVITATION } from "@/features/invitations/graphql/invitations.mutations"
import {
    CompanyProfile, Job, Application, CompanyProfileInput,
    ApplicationStatus, StudentProfile, Invitation,
} from "@/lib/type"
import { toast } from "sonner"
import { Footer } from "@/components/layout/Footer"
import { CompanyHeader } from "@/features/company/components/CompanyHeader"
import { CompanySidebar, CompanyTabId } from "@/features/company/components/CompanySidebar"
import { CompanyProfileTab } from "@/features/company/components/tabs/ProfileTab"
import { CompanyJobsTab } from "@/features/company/components/tabs/JobsTab"
import { CompanyApplicantsTab } from "@/features/company/components/tabs/ApplicantsTab"
import { CompanyStudentsTab } from "@/features/company/components/tabs/StudentsTab"
import { useCompanyJobs } from "@/features/company/hooks/useCompanyJobs"

export default function CompanyPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<CompanyTabId>("profile")
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const { user: userMe, loading: userLoading, error: userError, logout } = useAuth()
    const { data: profileData, loading: profileLoading, refetch: refetchProfile } = useQuery<{ getCompanyProfile: CompanyProfile }>(GET_COMPANY_PROFILE)
    const { data: myJobsData, loading: jobsLoading, refetch: refetchJobs } = useQuery<{ getAllJobs: Job[] }>(GET_ALL_JOBS, {
        variables: { companyProfileId: profileData?.getCompanyProfile?.id }
    })
    const { data: appsData, loading: appsLoading, refetch: refetchApps } = useQuery<{ getAllApplications: Application[] }>(GET_APPLICATIONS)
    const { data: studentsData, loading: studentsLoading } = useQuery<{ getAllStudentProfiles: StudentProfile[] }>(GET_ALL_STUDENT_PROFILES)
    const { data: invitationsData } = useQuery<{ getInvitations: Invitation[] }>(GET_INVITATIONS)

    const [updateProfile] = useMutation<{ updateCompanyProfile: CompanyProfile }, { input: CompanyProfileInput }>(UPDATE_COMPANY_PROFILE)
    const [updateAppStatus, { loading: updatingStatus }] = useMutation<{ updateApplicationStatus: Application }, { id: string, status: ApplicationStatus }>(UPDATE_APPLICATION_STATUS)
    const [uploadLogo] = useMutation<{ uploadCompanyLogo: CompanyProfile }, { base64Image: string }>(UPLOAD_COMPANY_LOGO)
    const [sendInvitation, { loading: sendingInvitation }] = useMutation(SEND_INVITATION, {
        refetchQueries: [{ query: GET_INVITATIONS }],
    })

    const [profileForm, setProfileForm] = useState<CompanyProfileInput>({
        companyName: "", description: "", industry: "", location: "", logoUrl: "",
        website: "", foundedYear: undefined, employeeCount: undefined, slogan: "",
    })
    const [logoUploading, setLogoUploading] = useState(false)
    const [studentSearch, setStudentSearch] = useState("")
    const profileInitialized = useRef(false)
    const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
    const latestProfileForm = useRef(profileForm); latestProfileForm.current = profileForm
    const profile = profileData?.getCompanyProfile
    const jobs = useCompanyJobs(profile, refetchJobs)

    const doAutoSave = useCallback(async (data: CompanyProfileInput) => {
        if (!profileInitialized.current) return
        if (!data.companyName?.trim()) return
        setAutoSaveStatus("saving")
        try {
            await updateProfile({
                variables: {
                    input: {
                        companyName: data.companyName, description: data.description || "",
                        industry: data.industry || "", location: data.location || "",
                        logoUrl: data.logoUrl || "", website: data.website || "",
                        foundedYear: data.foundedYear || undefined,
                        employeeCount: data.employeeCount || undefined,
                        slogan: data.slogan || "",
                    }
                }
            })
            refetchProfile()
            setAutoSaveStatus("saved")
            setTimeout(() => setAutoSaveStatus("idle"), 2000)
        } catch (err) {
            console.error("Auto-save error:", err)
            setAutoSaveStatus("idle")
        }
    }, [updateProfile, refetchProfile])

    const handleTabChange = (tab: CompanyTabId) => {
        if (activeTab === "profile" && profileInitialized.current) {
            doAutoSave(latestProfileForm.current)
        }
        setActiveTab(tab)
        setIsMenuOpen(false)
    }

    useEffect(() => { if (userError) router.push("/login") }, [userError, router])

    useEffect(() => {
        if (profileInitialized.current) return
        if (profileData?.getCompanyProfile) {
            const p = profileData.getCompanyProfile
            setProfileForm({
                companyName: p.companyName || "", description: p.description || "",
                industry: p.industry || "", location: p.location || "",
                logoUrl: p.logoUrl || "", website: p.website || "",
                foundedYear: p.foundedYear, employeeCount: p.employeeCount, slogan: p.slogan || "",
            })
            setTimeout(() => { profileInitialized.current = true }, 100)
        } else if (!profileLoading && userMe) {
            setTimeout(() => { profileInitialized.current = true }, 100)
        }
    }, [profileData, profileLoading, userMe])

    const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    useEffect(() => {
        if (!profileInitialized.current) return
        if (!profileForm.companyName?.trim()) return
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
        autoSaveTimer.current = setTimeout(() => { doAutoSave(profileForm) }, 3000)
        return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
    }, [profileForm, doAutoSave])

    const handleManualSave = () => {
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
        doAutoSave(profileForm)
    }

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 10 * 1024 * 1024) { toast.error("Логоны хэмжээ 10MB-аас бага байх ёстой"); return }
        const reader = new FileReader()
        reader.onload = async () => {
            setLogoUploading(true)
            try {
                const { data } = await uploadLogo({ variables: { base64Image: reader.result as string } })
                if (data?.uploadCompanyLogo?.logoUrl) {
                    setProfileForm(prev => ({ ...prev, logoUrl: data.uploadCompanyLogo.logoUrl }))
                    toast.success("Лого амжилттай байршуулагдлаа!")
                    refetchProfile()
                }
            } catch (err) {
                console.error(err)
                toast.error("Лого байршуулахад алдаа гарлаа")
            } finally {
                setLogoUploading(false)
            }
        }
        reader.readAsDataURL(file)
    }

    const handleSendInvitation = async (studentProfileId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            await sendInvitation({ variables: { studentProfileId } })
            toast.success("Урилга илгээгдлээ. Тухайн оюутны хүсэлт автоматаар зөвшөөрөгдлөө.")
            refetchApps()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Урилга илгээхэд алдаа гарлаа")
        }
    }

    const handleStatusUpdate = async (appId: string, status: ApplicationStatus) => {
        try {
            await updateAppStatus({ variables: { id: appId, status } })
            toast.success("Төлөв амжилттай солигдлоо")
            refetchApps()
        } catch (err) {
            console.error(err)
            toast.error("Төлөв өөрчлөхөд алдаа гарлаа")
        }
    }

    if (userLoading || profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }
    if (userError) return null

    const sidebar = <CompanySidebar activeTab={activeTab} onSelect={handleTabChange} />

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
            <CompanyHeader
                profile={profile} companyName={profileForm.companyName} email={userMe?.email}
                isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}
                sidebar={sidebar} onLogout={() => logout()}
            />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="hidden md:block w-60 shrink-0">
                        <div className="sticky top-24">
                            {sidebar}
                            <div className="mt-8 p-4 rounded-2xl bg-secondary/30 border border-border/40">
                                <div className="flex items-center gap-2 mb-2 text-foreground">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider">Баталгаажуулалт</h4>
                                </div>
                                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                                    Зар нийтлэхийн тулд таны профайл админаар баталгаажсан байх ёстой.
                                </p>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1 min-w-0">
                        <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {activeTab === "profile" && (
                                <CompanyProfileTab
                                    profile={profile} form={profileForm} setForm={setProfileForm}
                                    autoSaveStatus={autoSaveStatus} profileInitialized={profileInitialized}
                                    logoUploading={logoUploading} onLogoUpload={handleLogoUpload}
                                    onSubmit={(e) => { e.preventDefault(); doAutoSave(profileForm) }}
                                    onManualSave={handleManualSave}
                                />
                            )}
                            {activeTab === "jobs" && (
                                <CompanyJobsTab
                                    jobs={myJobsData?.getAllJobs} loading={jobsLoading} company={profile}
                                    isVerified={!!profile?.isVerified}
                                    showForm={jobs.showJobForm} onToggleForm={jobs.toggleForm}
                                    form={jobs.jobForm} setForm={jobs.setJobForm}
                                    skillsInput={jobs.skillsInput} setSkillsInput={jobs.setSkillsInput}
                                    editingJob={jobs.editingJob}
                                    viewingJob={jobs.viewingJob} setViewingJob={jobs.setViewingJob}
                                    submittingForm={jobs.submitting} deletingJob={jobs.deletingJob}
                                    onSubmitForm={jobs.submitForm}
                                    onSaveDraft={jobs.saveDraft}
                                    onPublishDraft={jobs.publishDraft}
                                    onEditJob={jobs.editJob} onDeleteJob={jobs.removeJob}
                                />
                            )}
                            {activeTab === "applicants" && (
                                <CompanyApplicantsTab
                                    applications={appsData?.getAllApplications}
                                    invitations={invitationsData?.getInvitations}
                                    loading={appsLoading} updatingStatus={updatingStatus}
                                    onStatusUpdate={handleStatusUpdate}
                                />
                            )}
                            {activeTab === "students" && (
                                <CompanyStudentsTab
                                    students={studentsData?.getAllStudentProfiles}
                                    invitations={invitationsData?.getInvitations}
                                    loading={studentsLoading}
                                    search={studentSearch} setSearch={setStudentSearch}
                                    sending={sendingInvitation} onInvite={handleSendInvitation}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer compact />
        </div>
    )
}
