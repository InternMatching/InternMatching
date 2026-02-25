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
    User,
    FileText,
    Search,
    Loader2,
    LogOut,
    CheckCircle,
    Clock,
    Menu,
    UserCircle,
    ChevronRight,
    MapPin,
    Building2,
    Wallet
} from "lucide-react"
import { ME, GET_STUDENT_PROFILE, UPDATE_STUDENT_PROFILE, CREATE_STUDENT_PROFILE, GET_ALL_JOBS, CREATE_APPLICATION, GET_APPLICATIONS } from "../graphql/mutations"
import { User as UserType, StudentProfile, Job, Application, StudentProfileInput, JobStatus } from "@/lib/type"
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

export default function StudentPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<"profile" | "jobs" | "applications">("profile")
    const [isMenuOpen, setIsMenuOpen] = useState(false)

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

    const client = useApolloClient()

    const handleLogout = async () => {
        localStorage.removeItem("token")
        await client.clearStore()
        toast.success("Амжилттай гарлаа")
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
        { id: 'profile', name: 'Профайл', icon: User },
        { id: 'jobs', name: 'Ажлын байр', icon: Search },
        { id: 'applications', name: 'Миний хүсэлтүүд', icon: FileText },
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
                                <Briefcase className="w-4.5 h-4.5 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-base hidden sm:block tracking-tight text-foreground">
                                InternMatch <span className="text-primary/70 font-medium">Student</span>
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
                                    <span className="text-xs font-bold text-foreground hidden sm:inline-block max-w-[100px] truncate">
                                        {profileData?.getStudentProfile?.firstName || "Оюутан"}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" sideOffset={8} className="w-52 p-1.5 rounded-2xl shadow-xl border-border/40 bg-background">
                                <DropdownMenuLabel className="font-normal px-3 py-2">
                                    <div className="flex flex-col space-y-0.5">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-0.5">Нэвтэрсэн</p>
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

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                            {activeTab === "profile" && (
                                <Card className="border-border/60 shadow-none rounded-2xl bg-background">
                                    <CardHeader className="p-6 md:p-8 border-b border-border/40 mb-2">
                                        <CardTitle className="text-xl font-bold">Хувийн мэдээлэл</CardTitle>
                                        <CardDescription className="text-sm">Дадлага хийх хүсэлт гаргахад таны энэ мэдээлэл компаниудад очих болно.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6 md:p-8">
                                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-muted-foreground ml-0.5">Овог</Label>
                                                    <Input
                                                        value={formData.lastName || ""}
                                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                        placeholder="Овог"
                                                        className="h-10 rounded-xl bg-secondary/20 border-border/50 focus:bg-background transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-muted-foreground ml-0.5">Нэр</Label>
                                                    <Input
                                                        value={formData.firstName || ""}
                                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                        placeholder="Нэр"
                                                        className="h-10 rounded-xl bg-secondary/20 border-border/50 focus:bg-background transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-muted-foreground ml-0.5">Товч танилцуулга (Bio)</Label>
                                                <Input
                                                    value={formData.bio}
                                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                    placeholder="Өөрийнхөө тухай товчхон..."
                                                    className="h-10 rounded-xl bg-secondary/20 border-border/50 focus:bg-background transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-muted-foreground ml-0.5">Ур чадварууд (Таслалаар тусгаарлах)</Label>
                                                <Input
                                                    value={skillsInput}
                                                    onChange={(e) => {
                                                        setSkillsInput(e.target.value);
                                                        setFormData({
                                                            ...formData,
                                                            skills: e.target.value.split(",").map(s => s.trim()).filter(s => s !== "")
                                                        });
                                                    }}
                                                    placeholder="React, TypeScript, UI/UX..."
                                                    className="h-10 rounded-xl bg-secondary/20 border-border/50 focus:bg-background transition-all"
                                                />
                                            </div>
                                            <Button type="submit" disabled={updatingProfile || creatingProfile} className="h-10 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">
                                                {(updatingProfile || creatingProfile) ? (
                                                    <><Loader2 className="animate-spin mr-2 h-4 w-4" />Хадгалж байна...</>
                                                ) : (
                                                    profileData?.getStudentProfile ? "Өөрчлөлтийг хадгалах" : "Профайл үүсгэх"
                                                )}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            {activeTab === "jobs" && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
                                        <h2 className="text-xl font-bold tracking-tight">Боломжит ажлын байрууд</h2>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            {jobsData?.getAllJobs?.length || 0} нээлттэй зар
                                        </p>
                                    </div>
                                    {jobsLoading ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-2xl bg-secondary/20 animate-pulse" />)}
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {jobsData?.getAllJobs?.map((job) => {
                                                const isApplied = appsData?.getAllApplications?.some(app => app.jobId === job.id) ||
                                                    appsData?.getAllApplications?.some(app => app.job?.id === job.id);

                                                return (
                                                    <Card key={job.id} className="group hover:border-primary/40 transition-all border-border/60 shadow-sm rounded-2xl overflow-hidden bg-background">
                                                        <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 text-sm">
                                                            <div className="space-y-3">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-9 h-9 bg-secondary/50 rounded-lg flex items-center justify-center">
                                                                        <Building2 className="w-4.5 h-4.5 text-muted-foreground" />
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <h3 className="font-bold text-base leading-none mb-1 group-hover:text-primary transition-colors">{job.title}</h3>
                                                                        <p className="text-xs font-bold text-primary flex items-center gap-1 leading-none">
                                                                            {job.company?.companyName}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground/80 lowercase tracking-tight">
                                                                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                                                                    <span className="flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" />{job.salaryRange || "Цалин тодорхойгүй"}</span>
                                                                    <span className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] uppercase font-black">{job.type}</span>
                                                                </div>
                                                            </div>

                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleApply(job.id)}
                                                                disabled={applying || isApplied}
                                                                variant={isApplied ? "outline" : "default"}
                                                                className={cn("h-9 rounded-xl px-6 font-bold text-xs",
                                                                    isApplied && "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 opacity-100"
                                                                )}
                                                            >
                                                                {isApplied ? (
                                                                    <><CheckCircle className="mr-2 h-3.5 w-3.5" />Илгээсэн</>
                                                                ) : applying ? (
                                                                    <><Loader2 className="animate-spin mr-2 h-3.5 w-3.5" />Илгээж байна...</>
                                                                ) : (
                                                                    "Илгээх"
                                                                )}
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                )
                                            })}
                                            {jobsData?.getAllJobs?.length === 0 && (
                                                <div className="py-20 text-center space-y-3 bg-secondary/10 rounded-2xl border-2 border-dashed border-border/40">
                                                    <Search className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                                                    <p className="text-sm font-bold text-muted-foreground">Одоогоор нээлттэй ажлын байр алга байна.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "applications" && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
                                        <h2 className="text-xl font-bold tracking-tight">Илгээсэн хүсэлтүүд</h2>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            {appsData?.getAllApplications?.length || 0} хүсэлт
                                        </p>
                                    </div>
                                    {appsLoading ? (
                                        <div className="space-y-4">
                                            {[1, 2].map(i => <div key={i} className="h-24 rounded-2xl bg-secondary/20 animate-pulse" />)}
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {appsData?.getAllApplications?.map((app) => (
                                                <Card key={app.id} className="border-border/60 bg-background rounded-2xl shadow-sm">
                                                    <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                        <div className="space-y-1.5 font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-bold text-base leading-none">{app.job?.title}</h3>
                                                            </div>
                                                            <p className="text-xs font-bold text-primary">{app.job?.company?.companyName}</p>
                                                            <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase font-bold tracking-widest pt-1">
                                                                <Clock className="w-3 h-3" />
                                                                Илгээсэн: {new Date(parseInt(app.appliedAt) || Date.parse(app.appliedAt) || Date.now()).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col sm:items-end gap-2.5">
                                                            <span className={cn(
                                                                "text-[9px] font-black px-2.5 py-1 rounded-md flex items-center gap-1.5 uppercase tracking-widest border",
                                                                app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                                    app.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200'
                                                            )}>
                                                                {app.status}
                                                            </span>
                                                            <div className="text-[10px] font-bold text-muted-foreground/60 bg-secondary/40 px-2 py-0.5 rounded-md self-start sm:self-auto">
                                                                MATCH: {Math.round(app.matchScore * 100)}%
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                            {appsData?.getAllApplications?.length === 0 && (
                                                <div className="py-20 text-center space-y-3 bg-secondary/10 rounded-2xl border-2 border-dashed border-border/40">
                                                    <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                                                    <p className="text-sm font-bold text-muted-foreground">Одоогоор хүсэлт байхгүй байна.</p>
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