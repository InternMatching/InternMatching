"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Briefcase,
    Building,
    PlusCircle,
    Users,
    Loader2,
    LogOut,
    CheckCircle,
    XCircle,
    Clock,
    Menu,
    UserCircle,
    ChevronRight,
    Search,
    Globe,
    Building2,
    CheckCircle2
} from "lucide-react"
import { ME, GET_COMPANY_PROFILE, UPDATE_COMPANY_PROFILE, CREATE_COMPANY_PROFILE, GET_ALL_JOBS, CREATE_JOB, GET_APPLICATIONS, UPDATE_APPLICATION_STATUS } from "../graphql/mutations"
import { User, CompanyProfile, Job, Application, CompanyProfileInput, JobInput, JobStatus, ApplicationStatus } from "@/lib/type"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function CompanyPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<"profile" | "jobs" | "applicants">("profile")
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Auth & Profile Data
    const { data: userData, loading: userLoading, error: userError } = useQuery<{ me: User }>(ME)
    const { data: profileData, loading: profileLoading, refetch: refetchProfile } = useQuery<{ getCompanyProfile: CompanyProfile }>(GET_COMPANY_PROFILE)
    const { data: myJobsData, loading: jobsLoading, refetch: refetchJobs } = useQuery<{ getAllJobs: Job[] }>(GET_ALL_JOBS, {
        variables: { companyProfileId: profileData?.getCompanyProfile?.id }
    })
    const { data: appsData, loading: appsLoading, refetch: refetchApps } = useQuery<{ getAllApplications: Application[] }>(GET_APPLICATIONS)

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

    const client = useApolloClient()

    const handleLogout = async () => {
        localStorage.removeItem("token")
        await client.clearStore()
        toast.success("Амжилттай гарлаа")
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
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (userError) {
        router.push("/login")
        return null
    }

    const navItems = [
        { id: 'profile', name: 'Компаний мэдээлэл', icon: Building },
        { id: 'jobs', name: 'Ажлын байрууд', icon: Briefcase },
        { id: 'applicants', name: 'Хүсэлтүүд', icon: Users },
    ]

    const SidebarContent = () => (
        <div className="flex flex-col gap-1.5 py-4">
            {navItems.map((item) => {
                const isActive = activeTab === item.id
                return (
                    <Button
                        key={item.id}
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                            "w-full justify-start h-10 px-3 rounded-xl transition-all duration-200 text-sm",
                            isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => {
                            setActiveTab(item.id as any)
                            setIsMenuOpen(false)
                        }}
                    >
                        <item.icon className={cn("w-4 h-4 mr-3", isActive ? "text-primary" : "text-muted-foreground")} />
                        <span className="font-bold">{item.name}</span>
                        {isActive && <div className="ml-auto w-1 h-3 bg-primary rounded-full" />}
                    </Button>
                )
            })}
        </div>
    )

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
            {/* Header */}
            <header className="bg-background/60 backdrop-blur-xl border-b border-border/40 sticky top-0 z-40">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[260px] p-0 bg-background border-r border-border/40">
                                <SheetHeader className="p-5 border-b border-border/40 text-left">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                                            <Briefcase className="w-4 h-4 text-primary-foreground" />
                                        </div>
                                        <SheetTitle className="text-lg font-bold">InternMatch</SheetTitle>
                                    </div>
                                </SheetHeader>
                                <div className="p-3">
                                    <SidebarContent />
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Logo */}
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push("/")}>
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/10 transition-all duration-300 ease-in-out">
                                <Building2 className="w-4.5 h-4.5 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-base hidden sm:block tracking-tight text-foreground">
                                InternMatch <span className="text-primary/70 font-medium tracking-normal">Business</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-3">
                        <ThemeToggle />
                        <span className="h-6 w-px bg-border/40 hidden sm:block" />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-9 px-2.5 rounded-xl gap-2 hover:bg-secondary">
                                    <div className="w-6.5 h-6.5 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
                                        <UserCircle className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-xs font-bold text-foreground hidden sm:inline-block max-w-[120px] truncate">
                                        {profileForm.companyName || "Миний бизнес"}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" sideOffset={8} className="w-52 p-1.5 rounded-2xl shadow-xl border-border/40 bg-background">
                                <DropdownMenuLabel className="font-normal px-3 py-2">
                                    <div className="flex flex-col space-y-0.5">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Нэвтэрсэн</p>
                                        <p className="text-sm font-bold leading-none truncate text-foreground">
                                            {userData?.me?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border/40" />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="rounded-xl px-3 py-2 transition-all cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-bold text-xs"
                                >
                                    <LogOut className="mr-2.5 h-3.5 w-3.5" />
                                    <span>Системээс гарах</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Nav */}
                    <aside className="hidden md:block w-60 shrink-0">
                        <div className="sticky top-24">
                            <SidebarContent />
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

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                            {activeTab === "profile" && (
                                <Card className="border-border/60 shadow-none rounded-2xl bg-background overflow-hidden font-medium">
                                    <CardHeader className="p-6 md:p-8 border-b border-border/40 bg-background/50">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="space-y-1">
                                                <CardTitle className="text-xl font-bold">Компаний профайл</CardTitle>
                                                <CardDescription className="text-sm">Таны мэдээлэл оюутнуудад ажлын зарын хамт харагдах болно.</CardDescription>
                                            </div>
                                            {profileData?.getCompanyProfile?.isVerified && (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Баталгаажсан
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 md:p-8">
                                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-muted-foreground ml-0.5">Компаний нэр</Label>
                                                <Input
                                                    value={profileForm.companyName}
                                                    onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                                                    placeholder="Компаний нэр"
                                                    className="h-10 rounded-xl bg-secondary/10 border-border/40 focus:bg-background transition-all"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-muted-foreground ml-0.5">Танилцуулга</Label>
                                                <Input
                                                    value={profileForm.description || ""}
                                                    onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                                                    placeholder="Зорилго, үйл ажиллагааны чиглэл..."
                                                    className="h-10 rounded-xl bg-secondary/10 border-border/40 focus:bg-background transition-all"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-muted-foreground ml-0.5">Салбар</Label>
                                                    <Input
                                                        value={profileForm.industry || ""}
                                                        onChange={(e) => setProfileForm({ ...profileForm, industry: e.target.value })}
                                                        placeholder="IT, Design, Marketing..."
                                                        className="h-10 rounded-xl bg-secondary/10 border-border/40 focus:bg-background transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-muted-foreground ml-0.5">Байршил</Label>
                                                    <Input
                                                        value={profileForm.location || ""}
                                                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                                                        placeholder="Улаанбаатар"
                                                        className="h-10 rounded-xl bg-secondary/10 border-border/40 focus:bg-background transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-muted-foreground ml-0.5">Вэбсайт</Label>
                                                <div className="relative">
                                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        className="pl-10 h-10 rounded-xl bg-secondary/10 border-border/40 focus:bg-background transition-all"
                                                        value={profileForm.website || ""}
                                                        onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                                                        placeholder="https://example.mn"
                                                    />
                                                </div>
                                            </div>
                                            <Button type="submit" disabled={updatingProfile || creatingProfile} className="h-10 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">
                                                {(updatingProfile || creatingProfile) ? (
                                                    <><Loader2 className="animate-spin mr-2 h-4 w-4" />Шинэчилж байна...</>
                                                ) : (
                                                    profileData?.getCompanyProfile ? "Мэдээлэл хадгалах" : "Бүртгэл үүсгэх"
                                                )}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === "jobs" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-border/40 pb-5 mb-2">
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-bold tracking-tight">Нийтэлсэн зарууд</h2>
                                            <p className="text-xs text-muted-foreground font-medium">Нийт {myJobsData?.getAllJobs?.length || 0} ажлын байр</p>
                                        </div>
                                        <Button size="sm" onClick={() => setShowJobForm(!showJobForm)} className="rounded-xl h-9 px-4 font-bold">
                                            {showJobForm ? "Болих" : <><PlusCircle className="w-3.5 h-3.5 mr-2" />Шинэ зар</>}
                                        </Button>
                                    </div>

                                    {showJobForm && (
                                        <Card className="border-primary/20 bg-primary/5 shadow-none rounded-2xl animate-in fade-in zoom-in-95 duration-200">
                                            <CardHeader className="pb-4">
                                                <CardTitle className="text-lg">Шинэ ажлын байр нэмэх</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <form onSubmit={handleCreateJob} className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <Label className="text-xs font-bold text-muted-foreground ml-0.5">Ажлын нэр</Label>
                                                            <Input
                                                                value={jobForm.title}
                                                                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                                                                placeholder="Ж нь: Web Developer"
                                                                className="h-9 rounded-lg bg-background"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <Label className="text-xs font-bold text-muted-foreground ml-0.5">Байршил</Label>
                                                            <Input
                                                                value={jobForm.location || ""}
                                                                onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                                                                placeholder="Улаанбаатар эсвэл Гэрээс"
                                                                className="h-9 rounded-lg bg-background"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs font-bold text-muted-foreground ml-0.5">Ур чадварууд (Таслалаар)</Label>
                                                        <Input
                                                            value={skillsInput}
                                                            onChange={(e) => {
                                                                setSkillsInput(e.target.value);
                                                                setJobForm({
                                                                    ...jobForm,
                                                                    requiredSkills: e.target.value.split(",").map(s => s.trim()).filter(s => s !== "")
                                                                });
                                                            }}
                                                            placeholder="React, CSS, SQL..."
                                                            className="h-9 rounded-lg bg-background"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                        <div className="space-y-1.5">
                                                            <Label className="text-xs font-bold text-muted-foreground ml-0.5">Төрөл</Label>
                                                            <select
                                                                className="w-full h-9 border rounded-lg px-2 bg-background text-sm font-medium outline-none focus:ring-1 focus:ring-primary"
                                                                value={jobForm.type}
                                                                onChange={(e) => setJobForm({ ...jobForm, type: e.target.value as any })}
                                                            >
                                                                <option value="intern">Интерн</option>
                                                                <option value="junior">Жуниор</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1.5 flex-1 col-span-2">
                                                            <Label className="text-xs font-bold text-muted-foreground ml-0.5">Цалин / Мэдээлэл</Label>
                                                            <Input
                                                                value={jobForm.salaryRange || ""}
                                                                onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                                                                placeholder="800k - 1.5M эсвэл Тохиролцоно"
                                                                className="h-9 rounded-lg bg-background"
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button type="submit" disabled={creatingJob} className="w-full h-10 rounded-xl font-bold">
                                                        {creatingJob ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Оруулж байна...</> : "Нийтлэх"}
                                                    </Button>
                                                </form>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {jobsLoading ? (
                                        <div className="space-y-2">
                                            {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-secondary/20 animate-pulse" />)}
                                        </div>
                                    ) : (
                                        <div className="grid gap-3">
                                            {myJobsData?.getAllJobs?.map((job) => (
                                                <Card key={job.id} className="hover:border-primary/40 transition-all border-border/60 bg-background rounded-xl shadow-none">
                                                    <CardContent className="p-4 flex items-center justify-between font-medium">
                                                        <div className="flex flex-col">
                                                            <h3 className="font-bold text-sm mb-0.5">{job.title}</h3>
                                                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                                                <span className="flex items-center gap-1"><Search className="w-3 h-3" />{job.location}</span>
                                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.salaryRange || "Уян хатан"}</span>
                                                            </div>
                                                        </div>
                                                        <div className={cn(
                                                            "px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
                                                            job.status === 'open' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-secondary text-muted-foreground'
                                                        )}>
                                                            {job.status === 'open' ? 'Нээлттэй' : 'Хаагдсан'}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "applicants" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-border/40 pb-5 mb-2">
                                        <div className="space-y-1">
                                            <h2 className="text-xl font-bold tracking-tight">Оюутнуудын хүсэлт</h2>
                                            <p className="text-xs text-muted-foreground font-medium">Нийт {appsData?.getAllApplications?.length || 0} өргөдөл</p>
                                        </div>
                                    </div>

                                    {appsLoading ? (
                                        <div className="space-y-4">
                                            {[1, 2].map(i => <div key={i} className="h-28 rounded-2xl bg-secondary/20 animate-pulse" />)}
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {appsData?.getAllApplications?.map((app) => (
                                                <Card key={app.id} className="border-border/60 bg-background rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                                                    <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 font-medium">
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-secondary/50 rounded-xl flex items-center justify-center font-bold text-primary border border-border/20 uppercase text-sm">
                                                                    {app.student?.firstName?.[0]}{app.student?.lastName?.[0]}
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-bold text-base leading-none mb-1">{app.student?.firstName} {app.student?.lastName}</h3>
                                                                    <p className="text-xs font-bold text-primary flex items-center gap-1 leading-none uppercase tracking-tighter opacity-80">
                                                                        {app.job?.title}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest pt-1">
                                                                <span className="bg-secondary/40 px-2 py-0.5 rounded text-primary">MATCH: {Math.round(app.matchScore * 100)}%</span>
                                                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{new Date(parseInt(app.appliedAt) || Date.now()).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3 justify-between md:justify-end border-t md:border-0 pt-4 md:pt-0">
                                                            <span className={cn(
                                                                "text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest border",
                                                                app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                                    app.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                                            )}>
                                                                {app.status}
                                                            </span>

                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    className="h-9 w-9 text-emerald-600 border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50 shadow-sm"
                                                                    onClick={() => handleStatusUpdate(app.id, "accepted")}
                                                                    disabled={updatingStatus}
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    className="h-9 w-9 text-red-600 border-red-100 bg-red-50/20 hover:bg-red-50 shadow-sm"
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
                                                <div className="py-20 text-center space-y-3 bg-secondary/10 rounded-2xl border-2 border-dashed border-border/40">
                                                    <Users className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                                                    <p className="text-sm font-bold text-muted-foreground">Одоогоор хүсэлт ирээгүй байна.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}