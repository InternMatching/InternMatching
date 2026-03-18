"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
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
    Building2,
    MapPin,
    Wallet,
    AlertCircle,
    Zap,
    Users2,
    Calendar,
    Quote,
    Globe,
    Info,
    Camera,
    Plus,
    XCircle
} from "lucide-react"
import { ME, GET_STUDENT_PROFILE, UPDATE_STUDENT_PROFILE, CREATE_STUDENT_PROFILE, GET_ALL_JOBS, CREATE_APPLICATION, GET_APPLICATIONS, UPLOAD_STUDENT_PROFILE_PICTURE } from "../graphql/mutations"
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
    const [applyJob] = useMutation<{ createApplication: Application }, { jobId: string }>(CREATE_APPLICATION)
    const [applyingJobId, setApplyingJobId] = useState<string | null>(null)
    const [uploadProfilePicture, { loading: uploadingPicture }] = useMutation(UPLOAD_STUDENT_PROFILE_PICTURE)

    const [formData, setFormData] = useState<StudentProfileInput>({
        firstName: "",
        lastName: "",
        bio: "",
        skills: [],
        experienceLevel: "intern",
        education: []
    })

    const [skillsInput, setSkillsInput] = useState("")
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)

    const getTimeRemaining = (deadline?: string) => {
        if (!deadline) return null
        const diff = new Date(deadline).getTime() - new Date().getTime()
        if (diff <= 0) return "Хугацаа дууссан"
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        if (days > 0) return `${days} хоног үлдсэн`
        const hours = Math.floor(diff / (1000 * 60 * 60))
        return `${hours} цаг үлдсэн`
    }

    useEffect(() => {
        if (profileData?.getStudentProfile) {
            const profile = profileData.getStudentProfile
            setFormData({
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                bio: profile.bio || "",
                skills: profile.skills || [],
                experienceLevel: profile.experienceLevel || "intern",
                education: profile.education || []
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
        setApplyingJobId(jobId)
        try {
            await applyJob({
                variables: { jobId }
            })
            toast.success("Амжилттай илгээлээ!")
            refetchApps()
        } catch (err) {
            console.error(err)
            toast.error("Та аль хэдийн илгээсэн байна эсвэл алдаа гарлаа.")
        } finally {
            setApplyingJobId(null)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Зөвхөн зураг оруулна уу")
            return
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Зургийн хэмжээ 10MB-аас бага байх ёстой")
            return
        }

        const reader = new FileReader()
        reader.onloadend = async () => {
            const base64String = reader.result as string
            try {
                await uploadProfilePicture({
                    variables: { base64Image: base64String }
                })
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

    if (userError) {
        router.push("/login")
        return null
    }

    const navItems = [
        { id: 'profile', name: 'Профайл', icon: User },
        { id: 'jobs', name: 'Дадлагууд', icon: Search },
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
                                    <div className="w-6.5 h-6.5 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10 overflow-hidden">
                                        {profileData?.getStudentProfile?.profilePictureUrl ? (
                                            <Image 
                                                src={profileData.getStudentProfile.profilePictureUrl} 
                                                alt="Profile" 
                                                width={26} 
                                                height={26} 
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <UserCircle className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                    <span className="text-xs font-bold text-foreground hidden sm:inline-block max-w-[100px] truncate">
                                        {profileData?.getStudentProfile?.firstName || "Оюутан"}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-2 rounded-2xl shadow-xl border-border/40 bg-background">
                                <div className="px-3 py-3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10 overflow-hidden shrink-0">
                                        {profileData?.getStudentProfile?.profilePictureUrl ? (
                                            <Image
                                                src={profileData.getStudentProfile.profilePictureUrl}
                                                alt="Profile"
                                                width={40}
                                                height={40}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <UserCircle className="h-5 w-5 text-primary" />
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-sm font-bold leading-tight truncate text-foreground">
                                            {profileData?.getStudentProfile?.firstName
                                                ? `${profileData.getStudentProfile.firstName} ${profileData.getStudentProfile.lastName || ""}`
                                                : "Оюутан"}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                                            {userData?.me?.email}
                                        </p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator className="bg-border/40 my-1" />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="rounded-xl px-3 py-2.5 transition-all cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-bold text-xs gap-2.5"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Системээс гарах
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
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-2">
                                            <div className="relative group">
                                                <div className="w-24 h-24 rounded-3xl bg-secondary/30 flex items-center justify-center border-2 border-border/50 overflow-hidden shadow-inner">
                                                    {profileData?.getStudentProfile?.profilePictureUrl ? (
                                                        <Image 
                                                            src={profileData.getStudentProfile.profilePictureUrl} 
                                                            alt="Profile" 
                                                            width={96} 
                                                            height={96} 
                                                            className="object-cover w-full h-full"
                                                        />
                                                    ) : (
                                                        <User className="w-10 h-10 text-muted-foreground/40" />
                                                    )}
                                                    {uploadingPicture && (
                                                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                                                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                                        </div>
                                                    )}
                                                </div>
                                                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-primary/20 hover:scale-110 transition-transform">
                                                    <Camera className="w-4 h-4 text-primary-foreground" />
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingPicture} />
                                                </label>
                                            </div>
                                            <div className="space-y-1">
                                                <CardTitle className="text-xl font-bold">Хувийн мэдээлэл</CardTitle>
                                                <CardDescription className="text-sm italic">Дадлага хийх хүсэлт гаргахад таны энэ мэдээлэл компаниудад очих болно.</CardDescription>
                                            </div>
                                        </div>
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

                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-muted-foreground ml-0.5">Түвшин</Label>
                                                <select
                                                    className="w-full h-10 rounded-xl bg-secondary/20 border border-border/50 focus:bg-background transition-all px-3 text-sm font-medium outline-none focus:ring-1 focus:ring-primary"
                                                    value={formData.experienceLevel}
                                                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                                                >
                                                    <option value="intern">Интерн</option>
                                                </select>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-xs font-bold text-muted-foreground ml-0.5">Боловсрол</Label>
                                                    {(formData.education || []).length === 0 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 px-2 text-[10px] font-black uppercase tracking-tighter"
                                                            onClick={() => {
                                                                setFormData({ ...formData, education: [{ school: "", degree: "", year: new Date().getFullYear(), status: "studying" }] })
                                                            }}
                                                        >
                                                            <Plus className="w-3 h-3 mr-1" /> Нэмэх
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    {(formData.education || []).map((edu, idx) => (
                                                        <div key={idx} className="p-4 rounded-xl border border-border/40 bg-secondary/5 space-y-3">
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase">Сургууль</Label>
                                                                    <Input
                                                                        value={edu.school}
                                                                        onChange={(e) => {
                                                                            const education = [...(formData.education || [])]
                                                                            education[idx] = { ...education[idx], school: e.target.value }
                                                                            setFormData({ ...formData, education })
                                                                        }}
                                                                        placeholder="МУИС, ШУТИС..."
                                                                        className="h-8 rounded-lg text-xs"
                                                                    />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase">Мэргэжил / Зэрэг</Label>
                                                                    <Input
                                                                        value={edu.degree}
                                                                        onChange={(e) => {
                                                                            const education = [...(formData.education || [])]
                                                                            education[idx] = { ...education[idx], degree: e.target.value }
                                                                            setFormData({ ...formData, education })
                                                                        }}
                                                                        placeholder="Програм хангамж, Бакалавр..."
                                                                        className="h-8 rounded-lg text-xs"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase">Төлөв</Label>
                                                                    <select
                                                                        className="w-full h-8 border rounded-lg px-2 bg-background text-xs font-medium outline-none focus:ring-1 focus:ring-primary"
                                                                        value={edu.status || "studying"}
                                                                        onChange={(e) => {
                                                                            const education = [...(formData.education || [])]
                                                                            education[idx] = { ...education[idx], status: e.target.value as "studying" | "graduated" }
                                                                            setFormData({ ...formData, education })
                                                                        }}
                                                                    >
                                                                        <option value="studying">Суралцаж байгаа</option>
                                                                        <option value="graduated">Төгссөн</option>
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                                                                        {edu.status === "graduated" ? "Төгссөн он" : "Элссэн он"}
                                                                    </Label>
                                                                    <Input
                                                                        type="number"
                                                                        value={edu.year}
                                                                        onChange={(e) => {
                                                                            const education = [...(formData.education || [])]
                                                                            education[idx] = { ...education[idx], year: parseInt(e.target.value) || 0 }
                                                                            setFormData({ ...formData, education })
                                                                        }}
                                                                        placeholder="2024"
                                                                        className="h-8 rounded-lg text-xs"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full h-8 rounded-lg text-xs font-bold text-destructive hover:bg-red-50 hover:text-red-600 border-destructive/20"
                                                                onClick={() => {
                                                                    const education = (formData.education || []).filter((_, i) => i !== idx)
                                                                    setFormData({ ...formData, education })
                                                                }}
                                                            >
                                                                <XCircle className="w-3.5 h-3.5 mr-1.5" /> Боловсрол устгах
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    {(formData.education || []).length === 0 && (
                                                        <p className="text-[11px] text-muted-foreground text-center py-4 bg-secondary/5 rounded-xl border border-dashed border-border/40">
                                                            Боловсролын мэдээлэл нэмээгүй байна.
                                                        </p>
                                                    )}
                                                </div>
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
                                        <h2 className="text-xl font-bold tracking-tight">Нээлттэй дадлагууд</h2>
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
                                                        <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 
                                                    text-sm">
                                                            <div className="space-y-3">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-10 h-10 bg-secondary/30 rounded-xl flex items-center justify-center border border-border/40 overflow-hidden shrink-0">
                                                                        {job.company?.logoUrl ? (
                                                                            <Image
                                                                                src={job.company.logoUrl}
                                                                                alt={job.company.companyName || ""}
                                                                                width={40}
                                                                                height={40}
                                                                                className="object-cover w-full h-full"
                                                                            />
                                                                        ) : (
                                                                            <span className="text-sm font-black text-primary/50 uppercase">
                                                                                {job.company?.companyName?.[0] || <Building2 className="w-4 h-4 text-muted-foreground" />}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex flex-col cursor-pointer" onClick={() => setSelectedJob(job)}>
                                                                        <h3 className="font-bold text-base leading-none mb-1 group-hover:text-primary transition-colors">{job.title}</h3>
                                                                        <p className="text-xs font-bold text-primary flex items-center gap-1 leading-none">
                                                                            {job.company?.companyName}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground/80 lowercase tracking-tight">
                                                                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                                                                    <span className="flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" />{job.salaryRange || "Цалин тодорхойгүй"}</span>
                                                                    <span className="flex items-center gap-1.5"><Users2 className="w-3.5 h-3.5" />{job.applicationCount}{job.maxParticipants ? `/${job.maxParticipants}` : ""} өргөдөл</span>
                                                                    <span className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] uppercase font-black">{job.type}</span>
                                                                    {job.deadline && (
                                                                        <span className={cn(
                                                                            "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] uppercase font-black",
                                                                            new Date(job.deadline).getTime() - new Date().getTime() < 86400000 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                                                                        )}>
                                                                            <AlertCircle className="w-3 h-3" />
                                                                            {getTimeRemaining(job.deadline)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleApply(job.id)}
                                                                disabled={applyingJobId !== null || isApplied}
                                                                variant={isApplied ? "outline" : "default"}
                                                                className={cn("h-9 rounded-xl px-6 font-bold text-xs",
                                                                    isApplied && "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 opacity-100"
                                                                )}
                                                            >
                                                                {isApplied ? (
                                                                    <><CheckCircle className="mr-2 h-3.5 w-3.5" />Илгээсэн</>
                                                                ) : applyingJobId === job.id ? (
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
                                                    <p className="text-sm font-bold text-muted-foreground">Одоогоор нээлттэй дадлагын байр алга байна.</p>
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
                                                            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setSelectedJob(app.job as any)}>
                                                                <div className="w-10 h-10 bg-secondary/30 rounded-xl flex items-center justify-center border border-border/40 overflow-hidden shrink-0">
                                                                    {app.job?.company?.logoUrl ? (
                                                                        <Image
                                                                            src={app.job.company.logoUrl}
                                                                            alt={app.job.company.companyName || ""}
                                                                            width={40}
                                                                            height={40}
                                                                            className="object-cover w-full h-full"
                                                                        />
                                                                    ) : (
                                                                        <span className="text-sm font-black text-primary/50 uppercase">
                                                                            {app.job?.company?.companyName?.[0] || <Building2 className="w-4 h-4 text-muted-foreground" />}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-bold text-base leading-none group-hover:text-primary transition-colors">{app.job?.title}</h3>
                                                                    <p className="text-xs font-bold text-primary mt-0.5">{app.job?.company?.companyName} • {app.job?.location}</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase font-bold tracking-widest pt-1">
                                                                <Clock className="w-3 h-3" />
                                                                Илгээсэн: {new Date(app.appliedAt).toLocaleDateString()}
                                                            </p>
                                                            {app.job?.deadline && (
                                                                <p className={cn(
                                                                    "text-[10px] flex items-center gap-1.5 uppercase font-bold tracking-widest pt-1",
                                                                    new Date(app.job.deadline).getTime() - new Date().getTime() < 86400000 ? "text-red-600" : "text-amber-600"
                                                                )}>
                                                                    <AlertCircle className="w-3 h-3" />
                                                                    Дуусах хугацаа: {new Date(app.job.deadline).toLocaleDateString()} ({getTimeRemaining(app.job.deadline)})
                                                                </p>
                                                            )}
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

            <Sheet open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
                <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                    {selectedJob && (
                        <div className="space-y-8 py-6">
                            <SheetHeader className="space-y-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border",
                                        selectedJob.type.toLowerCase() === 'intern'
                                            ? 'bg-orange-50/5 text-orange-600 border-orange-500/20'
                                            : 'bg-blue-50/5 text-blue-600 border-blue-500/20'
                                    )}>
                                        {selectedJob.type}
                                    </span>
                                    {selectedJob.deadline && (
                                        <span className={cn(
                                            "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border",
                                            new Date(selectedJob.deadline).getTime() - new Date().getTime() < 86400000 ? "bg-red-50 text-red-600 border-red-500/20" : "bg-amber-50 text-amber-600 border-amber-500/20"
                                        )}>
                                            <AlertCircle className="w-3 h-3" />
                                            {getTimeRemaining(selectedJob.deadline)}
                                        </span>
                                    )}
                                </div>
                                <SheetTitle className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                                    {selectedJob.title}
                                </SheetTitle>
                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground uppercase opacity-80">
                                    <div className="flex items-center gap-1.5">
                                        <Building2 className="w-3.5 h-3.5" />
                                        {selectedJob.company?.companyName}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {selectedJob.location}
                                    </div>
                                </div>
                            </SheetHeader>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                                        <Wallet className="w-3 h-3" />
                                        Цалин / Урамшуулал
                                    </div>
                                    <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">{selectedJob.salaryRange || "Тохиролцоно"}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 space-y-1">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        <Calendar className="w-3 h-3" />
                                        Нийтэлсэн огноо
                                    </div>
                                    <p className="text-lg font-black">{new Date(selectedJob.postedAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {selectedJob.responsibilities && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            Гүйцэтгэх үндсэн үүрэг
                                            <div className="h-px flex-1 bg-primary/10" />
                                        </h3>
                                        <div className="text-sm leading-relaxed text-foreground/80 font-medium whitespace-pre-wrap">
                                            {selectedJob.responsibilities}
                                        </div>
                                    </div>
                                )}

                                {selectedJob.requirements && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                            Тавигдах шаардлага
                                            <div className="h-px flex-1 bg-primary/10" />
                                        </h3>
                                        <div className="text-sm leading-relaxed text-foreground/80 font-medium whitespace-pre-wrap">
                                            {selectedJob.requirements}
                                        </div>
                                    </div>
                                )}

                                {selectedJob.additionalInfo && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            Нэмэлт мэдээлэл
                                            <div className="h-px flex-1 bg-border/40" />
                                        </h3>
                                        <div className="text-sm leading-relaxed text-muted-foreground font-medium whitespace-pre-wrap italic">
                                            {selectedJob.additionalInfo}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Card className="border-primary/10 bg-primary/5 rounded-2xl overflow-hidden shadow-none">
                                <CardHeader className="pb-3 border-b border-primary/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-primary/10 overflow-hidden shadow-inner">
                                            {selectedJob.company?.logoUrl ? (
                                                <Image
                                                    src={selectedJob.company.logoUrl}
                                                    alt={selectedJob.company.companyName || ""}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <span className="text-sm font-black text-primary/50 uppercase">
                                                    {selectedJob.company?.companyName?.[0] || <Building2 className="w-5 h-5 text-primary/40" />}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-1">Компаний тухай</div>
                                            <h4 className="text-sm font-black leading-none">{selectedJob.company?.companyName}</h4>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    {selectedJob.company?.slogan && (
                                        <div className="flex items-start gap-2 italic text-xs text-primary/70 mb-2">
                                            <Quote className="w-3 h-3 shrink-0 opacity-40" />
                                            <p>&quot;{selectedJob.company.slogan}&quot;</p>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 opacity-60"><Calendar className="w-3 h-3" /> Байгуулагдсан</div>
                                            <div className="text-foreground">{selectedJob.company?.foundedYear || "Тодорхойгүй"}</div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 opacity-60"><Users2 className="w-3 h-3" /> Ажилчид</div>
                                            <div className="text-foreground">{selectedJob.company?.employeeCount || "Тодорхойгүй"}</div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-foreground/70 font-medium line-clamp-3">
                                        {selectedJob.company?.description}
                                    </p>
                                    <div className="flex items-center gap-3 pt-2">
                                        {selectedJob.company?.website && (
                                            <a
                                                href={selectedJob.company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline"
                                            >
                                                <Globe className="w-3 h-3" />
                                                Вэбсайт
                                            </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="sticky bottom-0 pt-6 pb-2 bg-background/80 backdrop-blur-md">
                                <Button
                                    className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
                                    onClick={() => {
                                        handleApply(selectedJob.id);
                                        setSelectedJob(null);
                                    }}
                                    disabled={applyingJobId !== null || appsData?.getAllApplications?.some(app => app.jobId === selectedJob.id)}
                                >
                                    Хүсэлт илгээх
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}