"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "@apollo/client/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Briefcase, User, FileText, Search, Loader2, LogOut, CheckCircle, Clock } from "lucide-react"
import { ME, GET_STUDENT_PROFILE, UPDATE_STUDENT_PROFILE, CREATE_STUDENT_PROFILE, GET_ALL_JOBS, CREATE_APPLICATION, GET_APPLICATIONS } from "../graphql/mutations"
import { User as UserType, StudentProfile, Job, Application, StudentProfileInput, JobStatus } from "@/lib/type"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "sonner"

export default function StudentPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<"profile" | "jobs" | "applications">("profile")

    // Auth & Profile Data
    const { data: userData, loading: userLoading, error: userError } = useQuery<{ me: UserType }>(ME)
    const { data: profileData, loading: profileLoading, refetch: refetchProfile } = useQuery<{ getStudentProfile: StudentProfile }>(GET_STUDENT_PROFILE)
    const { data: jobsData, loading: jobsLoading } = useQuery<{ getAllJobs: Job[] }>(GET_ALL_JOBS, {
        variables: { status: "open" as JobStatus }
    })
    const { data: appsData, loading: appsLoading, refetch: refetchApps } = useQuery<{ getAllApplications: Application[] }>(GET_APPLICATIONS)

    const [updateProfile, { loading: updatingProfile }] = useMutation<{ updateStudentProfile: StudentProfile }, { input: StudentProfileInput }>(UPDATE_STUDENT_PROFILE)
    const [createProfile, { loading: creatingProfile }] = useMutation<{ createStudentProfile: StudentProfile }, { input: StudentProfileInput }>(CREATE_STUDENT_PROFILE)
    const [applyJob, { loading: applying }] = useMutation<{ createApplication: Application }, { jobId: string }>(CREATE_APPLICATION)

    const [formData, setFormData] = useState<StudentProfileInput>({
        firstName: "",
        lastName: "",
        bio: "",
        skills: []
    })

    const [skillsInput, setSkillsInput] = useState("")

    useEffect(() => {
        if (profileData?.getStudentProfile) {
            const profile = profileData.getStudentProfile
            setFormData({
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                bio: profile.bio || "",
                skills: profile.skills || []
            })
            setSkillsInput(profile.skills?.join(", ") || "")
        }
    }, [profileData])

    const handleLogout = () => {
        localStorage.removeItem("token")
        router.push("/login")
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.firstName?.trim()) {
            toast.error("Нэр оруулна уу")
            return
        }
        if (!formData.lastName?.trim()) {
            toast.error("Овог оруулна уу")
            return
        }

        try {
            if (profileData?.getStudentProfile) {
                await updateProfile({
                    variables: {
                        input: formData
                    }
                })
                toast.success("Профайл амжилттай шинэчлэгдлээ!")
            } else {
                await createProfile({
                    variables: {
                        input: formData
                    }
                })
                toast.success("Оюутны бүртгэл амжилттай хийгдлээ!")
            }
            refetchProfile()
        } catch (err) {
            console.error(err)
            toast.error("Алдаа гарлаа. Дахин оролдоно уу.")
        }
    }

    const handleApply = async (jobId: string) => {
        try {
            await applyJob({
                variables: { jobId }
            })
            toast.success("Амжилттай илгээлээ!")
            refetchApps()
        } catch (err) {
            console.error(err)
            toast.error("Та аль хэдийн илгээсэн байна эсвэл алдаа гарлаа.")
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
                        <span className="font-semibold text-xl hidden sm:block">InternMatch</span>
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
                            <User className="w-4 h-4 mr-2" />
                            Профайл
                        </Button>
                        <Button
                            variant={activeTab === "jobs" ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveTab("jobs")}
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Ажлын байр
                        </Button>
                        <Button
                            variant={activeTab === "applications" ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveTab("applications")}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Миний хүсэлтүүд
                        </Button>
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-3">
                        {activeTab === "profile" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Миний мэдээлэл</CardTitle>
                                    <CardDescription>Өөрийн мэдээллийг шинэчилж компаниудад харагдуулна уу.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Овог</Label>
                                                <Input
                                                    value={formData.lastName || ""}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Нэр</Label>
                                                <Input
                                                    value={formData.firstName || ""}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Товч намтар (Bio)</Label>
                                            <Input
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                placeholder="Өөрийнхөө тухай товчхон..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Ур чадварууд (Таслалаар тусгаарлах)</Label>
                                            <Input
                                                value={skillsInput}
                                                onChange={(e) => {
                                                    setSkillsInput(e.target.value);
                                                    setFormData({
                                                        ...formData,
                                                        skills: e.target.value.split(",").map(s => s.trim()).filter(s => s !== "")
                                                    });
                                                }}
                                                placeholder="React, TypeScript, Node.js..."
                                            />
                                        </div>
                                        <Button type="submit" disabled={updatingProfile || creatingProfile}>
                                            {(updatingProfile || creatingProfile) ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                                            {profileData?.getStudentProfile ? "Хадгалах" : "Бүртгэл үүсгэх"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === "jobs" && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold mb-4">Нээлттэй ажлын байрууд</h2>
                                {jobsLoading ? <Loader2 className="animate-spin text-primary" /> : (
                                    <div className="grid gap-4">
                                        {jobsData?.getAllJobs?.map((job) => (
                                            <Card key={job.id} className="hover:shadow-md transition-shadow">
                                                <CardHeader className="flex flex-row items-start justify-between">
                                                    <div>
                                                        <CardTitle className="text-xl">{job.title}</CardTitle>
                                                        <CardDescription className="font-medium text-primary">{job.company?.companyName}</CardDescription>
                                                    </div>
                                                    <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                                                        {job.type}
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-sm font-medium">{job.location} • {job.salaryRange}</div>
                                                        <Button size="sm" onClick={() => handleApply(job.id)} disabled={applying}>
                                                            Илгээх
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                        {jobsData?.getAllJobs?.length === 0 && (
                                            <div className="text-center py-12 text-muted-foreground bg-background rounded-lg border border-dashed">
                                                Одоогоор нээлттэй ажлын байр алга байна.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "applications" && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold mb-4">Явуулсан хүсэлтүүд</h2>
                                {appsLoading ? <Loader2 className="animate-spin text-primary" /> : (
                                    <div className="grid gap-4">
                                        {appsData?.getAllApplications?.map((app) => (
                                            <Card key={app.id}>
                                                <CardContent className="pt-6 flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-bold">{app.job?.title}</h3>
                                                        <p className="text-sm text-muted-foreground">{app.job?.company?.companyName}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">Илгээсэн: {new Date(parseInt(app.appliedAt) || Date.parse(app.appliedAt) || Date.now()).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                            app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {app.status === 'accepted' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                            {app.status.toUpperCase()}
                                                        </span>
                                                        <span className="text-xs font-semibold">Match: {Math.round(app.matchScore * 100)}%</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                        {appsData?.getAllApplications?.length === 0 && (
                                            <div className="text-center py-12 text-muted-foreground bg-background rounded-lg border border-dashed">
                                                Одоогоор хүсэлт байхгүй байна.
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