"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "@apollo/client/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Briefcase, Building, PlusCircle, Users, Loader2, LogOut, CheckCircle, XCircle, Clock } from "lucide-react"
import { ME, GET_COMPANY_PROFILE, UPDATE_COMPANY_PROFILE, CREATE_COMPANY_PROFILE, GET_ALL_JOBS, CREATE_JOB, GET_APPLICATIONS, UPDATE_APPLICATION_STATUS } from "../graphql/mutations"
import { User, CompanyProfile, Job, Application, CompanyProfileInput, JobInput, JobStatus, ApplicationStatus } from "@/lib/type"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "sonner"

export default function CompanyPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<"profile" | "jobs" | "applicants">("profile")

    // Auth & Profile Data
    const { data: userData, loading: userLoading, error: userError } = useQuery<{ me: User }>(ME)
    const { data: profileData, loading: profileLoading, refetch: refetchProfile } = useQuery<{ getCompanyProfile: CompanyProfile }>(GET_COMPANY_PROFILE)
    const { data: myJobsData, loading: jobsLoading, refetch: refetchJobs } = useQuery<{ getAllJobs: Job[] }>(GET_ALL_JOBS, {
        variables: { companyProfileId: profileData?.getCompanyProfile?.id }
    })
    const { data: appsData, loading: appsLoading, refetch: refetchApps } = useQuery<{ getAllApplications: Application[] }>(GET_APPLICATIONS)
    console.log(profileData)
    const [updateProfile, { loading: updatingProfile }] = useMutation<{ updateCompanyProfile: CompanyProfile }, { input: CompanyProfileInput }>(UPDATE_COMPANY_PROFILE)
    const [createProfile, { loading: creatingProfile }] = useMutation<{ createCompanyProfile: CompanyProfile }, { input: CompanyProfileInput }>(CREATE_COMPANY_PROFILE)
    const [createJob, { loading: creatingJob }] = useMutation<{ createJob: Job }, { input: JobInput }>(CREATE_JOB)
    const [updateAppStatus, { loading: updatingStatus }] = useMutation<{ updateApplicationStatus: Application }, { id: string, status: ApplicationStatus }>(UPDATE_APPLICATION_STATUS)

    const [profileForm, setProfileForm] = useState<CompanyProfileInput>({
        companyName: "",
        description: "",
        industry: "",
        location: "",
        website: ""
    })

    const [jobForm, setJobForm] = useState<JobInput>({
        title: "",
        description: "",
        type: "intern",
        location: "",
        salaryRange: "",
        requiredSkills: []
    })

    const [showJobForm, setShowJobForm] = useState(false)
    const [skillsInput, setSkillsInput] = useState("")

    useEffect(() => {
        if (profileData?.getCompanyProfile) {
            const profile = profileData.getCompanyProfile
            setProfileForm({
                companyName: profile.companyName || "",
                description: profile.description || "",
                industry: profile.industry || "",
                location: profile.location || "",
                website: profile.website || ""
            })
        }
    }, [profileData])

    const handleLogout = () => {
        localStorage.removeItem("token")
        router.push("/login")
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!profileForm.companyName.trim()) {
            toast.error("Компаний нэр оруулна уу")
            return
        }

        try {
            if (profileData?.getCompanyProfile) {
                await updateProfile({
                    variables: {
                        input: profileForm
                    }
                })
                toast.success("Профайл амжилттай шинэчлэгдлээ!")
            } else {
                await createProfile({
                    variables: {
                        input: profileForm
                    }
                })
                toast.success("Компанийн бүртгэл амжилттай хийгдлээ!")
            }
            refetchProfile()
        } catch (err) {
            console.error(err)
            toast.error("Алдаа гарлаа. Дахин оролдоно уу.")
        }
    }

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!profileData?.getCompanyProfile?.isVerified) {
            toast.error("Таны бүртгэл баталгаажаагүй байна")
            return
        }

        if (!jobForm.title.trim()) {
            toast.error("Ажлын нэр оруулна уу")
            return
        }

        if (!jobForm.location?.trim()) {
            toast.error("Байршил оруулна уу")
            return
        }

        try {
            await createJob({
                variables: {
                    input: jobForm
                }
            })
            toast.success("Ажлын байр амжилттай бүртгэгдлээ!")
            setShowJobForm(false)
            setJobForm({ title: "", description: "", type: "intern", location: "", salaryRange: "", requiredSkills: [] })
            setSkillsInput("")
            refetchJobs()
        } catch (err) {
            console.error(err)
            toast.error("Ажлын байр бүртгэхэд алдаа гарлаа")
        }
    }

    const handleStatusUpdate = async (appId: string, status: ApplicationStatus) => {
        try {
            await updateAppStatus({
                variables: { id: appId, status }
            })
            toast.success("Төлөв амжилттай солигдлоо")
            refetchApps()
        } catch (err) {
            console.error(err)
            toast.error("Төлөв өөрчлөхөд алдаа гарлаа")
        }
    }

    if (userLoading || profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (userError) {
        router.push("/login")
        return null
    }

    return (
        <div className="min-h-screen bg-secondary/10">
            {/* Header */}
            <header className="bg-background border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-semibold text-xl">InternMatch Business</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden md:block">{userData?.me?.email}</span>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <LogOut className="w-4 h-4 mr-2" />
                            Гарах
                        </Button>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Nav */}
                    <div className="space-y-2">
                        <Button
                            variant={activeTab === "profile" ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveTab("profile")}
                        >
                            <Building className="w-4 h-4 mr-2" />
                            Компаний мэдээлэл
                        </Button>
                        <Button
                            variant={activeTab === "jobs" ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveTab("jobs")}
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Ажлын байрууд
                        </Button>
                        <Button
                            variant={activeTab === "applicants" ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveTab("applicants")}
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Хүсэлтүүд
                        </Button>
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-3">
                        {activeTab === "profile" && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Компаний мэдээлэл</CardTitle>
                                            <CardDescription>Компанийхаа танилцуулгыг оруулж оюутнуудыг татаарай.</CardDescription>
                                        </div>
                                        {profileData?.getCompanyProfile?.isVerified && (
                                            <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                Баталгаажсан
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Компаний нэр</Label>
                                            <Input
                                                value={profileForm.companyName}
                                                onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Товч танилцуулга</Label>
                                            <Input
                                                value={profileForm.description || ""}
                                                onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                                                placeholder="Компанийхаа тухай..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Салбар</Label>
                                                <Input
                                                    value={profileForm.industry || ""}
                                                    onChange={(e) => setProfileForm({ ...profileForm, industry: e.target.value })}
                                                    placeholder="IT, Finance, Marketing..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Байршил</Label>
                                                <Input
                                                    value={profileForm.location || ""}
                                                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                                                    placeholder="Улаанбаатар"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Вэбсайт</Label>
                                            <Input
                                                value={profileForm.website || ""}
                                                onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                        <Button type="submit" disabled={updatingProfile || creatingProfile} className="w-full sm:w-auto">
                                            {(updatingProfile || creatingProfile) ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                            {profileData?.getCompanyProfile ? "Мэдээлэл шинэчлэх" : "Бүртгэл үүсгэх"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === "jobs" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">Нийтэлсэн ажлын байрууд</h2>
                                    <Button onClick={() => setShowJobForm(!showJobForm)}>
                                        {showJobForm ? "Болих" : "Шинэ зар"}
                                    </Button>
                                </div>

                                {showJobForm && (
                                    <Card className="border-primary/20">
                                        <CardHeader>
                                            <CardTitle>Шинэ ажлын байр бүртгэх</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleCreateJob} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Ажлын нэр</Label>
                                                    <Input
                                                        value={jobForm.title}
                                                        onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Байршил</Label>
                                                    <Input
                                                        value={jobForm.location || ""}
                                                        onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Шаардлагатай ур чадварууд (Таслалаар тусгаарлах)</Label>
                                                    <Input
                                                        value={skillsInput}
                                                        onChange={(e) => {
                                                            setSkillsInput(e.target.value);
                                                            setJobForm({
                                                                ...jobForm,
                                                                requiredSkills: e.target.value.split(",").map(s => s.trim()).filter(s => s !== "")
                                                            });
                                                        }}
                                                        placeholder="React, TypeScript, UI/UX..."
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Тайлбар</Label>
                                                    <Input
                                                        value={jobForm.description || ""}
                                                        onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Төрөл</Label>
                                                        <select
                                                            className="w-full border rounded-md p-2 bg-background"
                                                            value={jobForm.type}
                                                            onChange={(e) => setJobForm({ ...jobForm, type: e.target.value as any })}
                                                        >
                                                            <option value="intern">Интерн</option>
                                                            <option value="junior">Жуниор</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Цалингийн хязгаар</Label>
                                                        <Input
                                                            value={jobForm.salaryRange || ""}
                                                            onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                                                            placeholder="Ж нь: 800k - 1.2M"
                                                        />
                                                    </div>
                                                </div>
                                                <Button type="submit" disabled={creatingJob} className="w-full">
                                                    {creatingJob ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                                    Нийтлэх
                                                </Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                )}

                                {jobsLoading ? <Loader2 className="animate-spin text-primary" /> : (
                                    <div className="grid gap-4">
                                        {myJobsData?.getAllJobs?.map((job) => (
                                            <Card key={job.id}>
                                                <CardContent className="pt-6 flex items-center justify-between">
                                                    <div>
                                                        <CardTitle className="text-lg">{job.title}</CardTitle>
                                                        <CardDescription>{job.location} • {job.salaryRange}</CardDescription>
                                                    </div>
                                                    <div className={`px-2 py-1 rounded text-xs ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                        {job.status === 'open' ? 'Идэвхтэй' : 'Хаагдсан'}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                        {myJobsData?.getAllJobs?.length === 0 && !showJobForm && (
                                            <div className="text-center py-12 text-muted-foreground bg-background rounded-lg border border-dashed">
                                                Одоогоор зар байхгүй байна.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "applicants" && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Ирсэн хүсэлтүүд</h2>
                                {appsLoading ? <Loader2 className="animate-spin text-primary" /> : (
                                    <div className="grid gap-4">
                                        {appsData?.getAllApplications?.map((app) => (
                                            <Card key={app.id}>
                                                <CardContent className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg">{app.student?.firstName} {app.student?.lastName}</h3>
                                                        <p className="text-sm text-primary font-medium">{app.job?.title}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">Match Score: {Math.round(app.matchScore * 100)}%</p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                            app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {app.status.toUpperCase()}
                                                        </span>

                                                        <div className="flex gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 w-8 p-0 text-green-600"
                                                                onClick={() => handleStatusUpdate(app.id, "accepted")}
                                                                disabled={updatingStatus}
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 w-8 p-0 text-red-600"
                                                                onClick={() => handleStatusUpdate(app.id, "rejected")}
                                                                disabled={updatingStatus}
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                        {appsData?.getAllApplications?.length === 0 && (
                                            <div className="text-center py-12 text-muted-foreground bg-background rounded-lg border border-dashed">
                                                Одоогоор хүсэлт ирээгүй байна.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}