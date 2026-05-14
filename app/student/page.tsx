"use client"

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery, useMutation } from "@apollo/client/react"
import { useAuth } from "@/lib/auth-context"
import { Clock } from "lucide-react"
import { GET_STUDENT_PROFILE } from "@/features/student/graphql/student.queries"
import { UPDATE_STUDENT_PROFILE, UPLOAD_STUDENT_PROFILE_PICTURE } from "@/features/student/graphql/student.mutations"
import { GET_ALL_JOBS } from "@/features/jobs/graphql/jobs.queries"
import { GET_APPLICATIONS } from "@/features/applications/graphql/applications.queries"
import { CREATE_APPLICATION } from "@/features/applications/graphql/applications.mutations"
import { GET_INVITATIONS } from "@/features/invitations/graphql/invitations.queries"
import { RESPOND_TO_INVITATION } from "@/features/invitations/graphql/invitations.mutations"
import { StudentProfile, Job, Application, StudentProfileInput, JobStatus, Invitation } from "@/lib/type"
import { toast } from "sonner"
import { Footer } from "@/components/layout/Footer"
import { StudentHeader } from "@/features/student/components/StudentHeader"
import { StudentSidebar, StudentTabId } from "@/features/student/components/StudentSidebar"
import { StudentProfileTab } from "@/features/student/components/tabs/ProfileTab"
import { StudentJobsTab } from "@/features/student/components/tabs/JobsTab"
import { StudentApplicationsTab } from "@/features/student/components/tabs/ApplicationsTab"
import { StudentInvitationsTab } from "@/features/student/components/tabs/InvitationsTab"

const VALID_STUDENT_TABS: StudentTabId[] = ["profile", "jobs", "applications", "invitations"]

const PageSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
)

function StudentPageInner() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialTab = searchParams.get("tab") as StudentTabId | null
    const [activeTab, setActiveTab] = useState<StudentTabId>(
        initialTab && VALID_STUDENT_TABS.includes(initialTab) ? initialTab : "profile"
    )
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const { user: userMe, loading: userLoading, error: userError, logout } = useAuth()
    const { data: profileData, loading: profileLoading, refetch: refetchProfile } = useQuery<{ getStudentProfile: StudentProfile }>(GET_STUDENT_PROFILE)
    const { data: jobsData, loading: jobsLoading } = useQuery<{ getAllJobs: Job[] }>(GET_ALL_JOBS, {
        variables: { status: "open" as JobStatus }
    })
    const { data: appsData, loading: appsLoading, refetch: refetchApps } = useQuery<{ getAllApplications: Application[] }>(GET_APPLICATIONS)
    const { data: invitationsData, loading: invitationsLoading } = useQuery<{ getInvitations: Invitation[] }>(GET_INVITATIONS)

    const [updateProfile] = useMutation<{ updateStudentProfile: StudentProfile }, { input: StudentProfileInput }>(UPDATE_STUDENT_PROFILE)
    const [applyJob] = useMutation<{ createApplication: Application }, { jobId: string }>(CREATE_APPLICATION)
    const [applyingJobId, setApplyingJobId] = useState<string | null>(null)
    const [uploadProfilePicture, { loading: uploadingPicture }] = useMutation(UPLOAD_STUDENT_PROFILE_PICTURE)
    const [respondToInvitation, { loading: respondingInvitation }] = useMutation(RESPOND_TO_INVITATION, {
        refetchQueries: [{ query: GET_INVITATIONS }],
    })

    const [formData, setFormData] = useState<StudentProfileInput>({
        firstName: "", lastName: "", bio: "", skills: [],
        experienceLevel: "intern", isActivelyLooking: true, education: [],
    })
    const [skillsInput, setSkillsInput] = useState("")
    const profileInitialized = useRef(false)
    const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
    const latestFormData = useRef(formData)
    latestFormData.current = formData

    const doAutoSave = useCallback(async (data: StudentProfileInput, manual = false) => {
        if (!profileInitialized.current) return
        if (!data.firstName?.trim() || !data.lastName?.trim()) return

        const allEducation = data.education || []
        const validEducation = allEducation
            .filter(e => e.school?.trim() && e.degree?.trim())
            .map(({ school, degree, year, status }) => ({
                school: school.trim(),
                degree: degree.trim(),
                year: year || new Date().getFullYear(),
                ...(status ? { status } : {}),
            }))

        if (manual && allEducation.length > validEducation.length) {
            toast.error("Сургууль болон мэргэжлийг бөглөнө үү")
            return
        }

        setAutoSaveStatus("saving")
        try {
            const cleanInput = {
                firstName: data.firstName, lastName: data.lastName, bio: data.bio,
                skills: data.skills, experienceLevel: data.experienceLevel,
                isActivelyLooking: data.isActivelyLooking,
                education: validEducation,
            }
            await updateProfile({ variables: { input: cleanInput } })
            refetchProfile()
            setAutoSaveStatus("saved")
            setTimeout(() => setAutoSaveStatus("idle"), 2000)
        } catch (err) {
            console.error("Auto-save error:", err)
            setAutoSaveStatus("idle")
            if (manual) {
                toast.error(err instanceof Error ? err.message : "Хадгалахад алдаа гарлаа")
            }
        }
    }, [updateProfile, refetchProfile])

    const handleTabChange = (tab: StudentTabId) => {
        if (activeTab === "profile" && profileInitialized.current) {
            doAutoSave(latestFormData.current)
        }
        setActiveTab(tab)
        setIsMenuOpen(false)
    }

    useEffect(() => {
        if (userError) router.push("/login")
    }, [userError, router])

    useEffect(() => {
        if (profileInitialized.current) return
        if (profileData?.getStudentProfile) {
            const profile = profileData.getStudentProfile
            setFormData({
                firstName: profile.firstName || "", lastName: profile.lastName || "",
                bio: profile.bio || "", skills: profile.skills || [],
                experienceLevel: profile.experienceLevel || "intern",
                isActivelyLooking: profile.isActivelyLooking ?? true,
                education: profile.education || [],
            })
            setSkillsInput("")
            setTimeout(() => { profileInitialized.current = true }, 100)
        } else if (!profileLoading && userMe) {
            setTimeout(() => { profileInitialized.current = true }, 100)
        }
    }, [profileData, profileLoading, userMe])

    const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    useEffect(() => {
        if (!profileInitialized.current) return
        if (!formData.firstName?.trim() || !formData.lastName?.trim()) return
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
        autoSaveTimer.current = setTimeout(() => { doAutoSave(formData) }, 3000)
        return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
    }, [formData, doAutoSave])

    const handleManualSave = () => {
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
        doAutoSave(formData, true)
    }

    const handleApply = async (jobId: string) => {
        setApplyingJobId(jobId)
        try {
            await applyJob({ variables: { jobId } })
            toast.success("Амжилттай илгээлээ!")
            refetchApps()
        } catch (err) {
            console.error(err)
            toast.error("Та аль хэдийн илгээсэн байна эсвэл алдаа гарлаа.")
        } finally {
            setApplyingJobId(null)
        }
    }

    const handleInvitationResponse = async (invitationId: string, status: "accepted" | "rejected") => {
        try {
            await respondToInvitation({ variables: { id: invitationId, status } })
            toast.success(status === "accepted" ? "Урилгыг зөвшөөрлөө!" : "Урилгыг татгалзлаа")
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Алдаа гарлаа")
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith("image/")) { toast.error("Зөвхөн зураг оруулна уу"); return }
        if (file.size > 10 * 1024 * 1024) { toast.error("Зургийн хэмжээ 10MB-аас бага байх ёстой"); return }

        const reader = new FileReader()
        reader.onloadend = async () => {
            try {
                await uploadProfilePicture({ variables: { base64Image: reader.result as string } })
                toast.success("Профайл зураг шинэчлэгдлээ")
                refetchProfile()
            } catch (err) {
                console.error(err)
                toast.error("Зураг хуулахад алдаа гарлаа")
            }
        }
        reader.readAsDataURL(file)
    }

    if (userLoading || profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }
    if (userError) return null

    const profile = profileData?.getStudentProfile
    const sidebar = <StudentSidebar activeTab={activeTab} onSelect={handleTabChange} />

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
            <StudentHeader
                profile={profile}
                email={userMe?.email}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                sidebar={sidebar}
                onLogout={() => logout()}
            />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="hidden md:block w-60 shrink-0">
                        <div className="sticky top-24">
                            {sidebar}
                            <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" />
                                    Санамж
                                </h4>
                                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                                    Профайлаа тогтмол шинэчилж байх нь ажилд орох боломжийг нэмэгдүүлнэ.
                                </p>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1 min-w-0">
                        <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {activeTab === "profile" && (
                                <StudentProfileTab
                                    profile={profile} formData={formData} setFormData={setFormData}
                                    skillsInput={skillsInput} setSkillsInput={setSkillsInput}
                                    autoSaveStatus={autoSaveStatus} profileInitialized={profileInitialized}
                                    uploadingPicture={uploadingPicture} onImageUpload={handleImageUpload}
                                    onSubmit={(e) => { e.preventDefault(); doAutoSave(formData) }}
                                    onManualSave={handleManualSave}
                                />
                            )}
                            {activeTab === "jobs" && (
                                <StudentJobsTab
                                    jobs={jobsData?.getAllJobs} applications={appsData?.getAllApplications}
                                    loading={jobsLoading} applyingJobId={applyingJobId} onApply={handleApply}
                                />
                            )}
                            {activeTab === "applications" && (
                                <StudentApplicationsTab applications={appsData?.getAllApplications} loading={appsLoading} />
                            )}
                            {activeTab === "invitations" && (
                                <StudentInvitationsTab
                                    invitations={invitationsData?.getInvitations} loading={invitationsLoading}
                                    responding={respondingInvitation} onRespond={handleInvitationResponse}
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

export default function StudentPage() {
    return (
        <Suspense fallback={<PageSpinner />}>
            <StudentPageInner />
        </Suspense>
    )
}
