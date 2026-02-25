"use client"

import React, { useState, useMemo, useEffect, Suspense } from "react"
import { useQuery } from "@apollo/client/react"
import { GET_ALL_STUDENT_PROFILES, ME } from "../graphql/mutations"
import { StudentProfile, User } from "@/lib/type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Users,
    Lock,
    Search,
    ArrowRight,
    ShieldCheck,
    Filter,
    X,
    UserCircle,
    CheckCircle2,
    Briefcase,
    ChevronRight
} from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

function StudentsContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const { data: userData } = useQuery<{ me: User }>(ME)
    const isCompany = userData?.me?.role.toLowerCase() === 'company' || userData?.me?.role.toLowerCase() === 'admin'

    const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
    const [skillQuery, setSkillQuery] = useState(searchParams.get("skills") || "")

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (searchQuery) params.set("query", searchQuery)
        else params.delete("query")

        if (skillQuery) params.set("skills", skillQuery)
        else params.delete("skills")

        const newUrl = `${pathname}?${params.toString()}`
        if (window.location.search !== `?${params.toString()}`) {
            router.replace(newUrl, { scroll: false })
        }
    }, [searchQuery, skillQuery, pathname, router, searchParams])

    const { data: studentsData, loading, error } = useQuery<{ getAllStudentProfiles: StudentProfile[] }>(
        GET_ALL_STUDENT_PROFILES,
        { skip: !isCompany }
    )

    const filteredStudents = useMemo(() => {
        if (!studentsData?.getAllStudentProfiles) return []

        return studentsData.getAllStudentProfiles.filter(student => {
            const matchesSearch =
                `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.bio?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesSkills =
                !skillQuery ||
                student.skills.some(skill => skill.toLowerCase().includes(skillQuery.toLowerCase()))

            return matchesSearch && matchesSkills
        })
    }, [studentsData, searchQuery, skillQuery])

    const clearFilters = () => {
        setSearchQuery("")
        setSkillQuery("")
    }

    const StudentSkeleton = () => (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="rounded-2xl border-border/40 overflow-hidden bg-background shadow-sm">
                    <CardContent className="p-5 space-y-4">
                        <div className="flex items-start justify-between">
                            <Skeleton className="w-12 h-12 rounded-xl" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-3/4 rounded-md" />
                            <Skeleton className="h-3 w-full rounded-md" />
                            <Skeleton className="h-3 w-4/5 rounded-md" />
                        </div>
                        <div className="flex gap-1.5">
                            <Skeleton className="h-6 w-16 rounded-md" />
                            <Skeleton className="h-6 w-16 rounded-md" />
                        </div>
                        <Skeleton className="h-9 w-full rounded-lg" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )

    const FilterSidebar = () => (
        <div className="space-y-4 text-sm font-medium">
            <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Нэрээр хайх</label>
                <div className="relative">
                    <Input
                        placeholder="Оюутны нэр..."
                        className="rounded-xl pl-9 h-10 border-border/60 bg-secondary/10 focus:bg-background transition-all text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Ур чадвараар шүүх</label>
                <div className="relative">
                    <Input
                        placeholder="React, Design..."
                        className="rounded-xl pl-9 h-10 border-border/60 bg-secondary/10 focus:bg-background transition-all text-sm"
                        value={skillQuery}
                        onChange={(e) => setSkillQuery(e.target.value)}
                    />
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                </div>
            </div>

            {(searchQuery || skillQuery) && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-8 rounded-lg text-xs text-muted-foreground hover:text-primary transition-colors"
                    onClick={clearFilters}
                >
                    <X className="w-3 h-3 mr-2" />
                    Шүүлтүүр арилгах
                </Button>
            )}
        </div>
    )

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] py-6 md:py-10">
            <div className="container mx-auto px-4 md:px-6 lg:px-12 max-w-7xl text-foreground">
                {/* Minimal Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-tight">
                            <Users className="w-3 h-3 " />
                            <span>Системд бүртгэлтэй</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Оюутнуудын сан
                        </h1>
                        <p className="text-muted-foreground text-sm font-medium">
                            Компанид хамгийн шилдэг залуу боловсон хүчнийг санал болгож байна.
                        </p>
                    </div>

                    {isCompany && (
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-9 rounded-xl border-border/60 gap-2 font-medium">
                                        <Filter className="w-3.5 h-3.5" />
                                        Шүүлтүүр
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="rounded-t-3xl h-[45vh] p-6 bg-background border-t-0">
                                    <SheetHeader className="mb-4">
                                        <SheetTitle className="text-lg font-bold">Хайлт & Шүүлтүүр</SheetTitle>
                                    </SheetHeader>
                                    <FilterSidebar />
                                </SheetContent>
                            </Sheet>
                        </div>
                    )}
                </div>

                {!isCompany ? (
                    <div className="max-w-xl mx-auto py-8">
                        <Card className="border-border/60 shadow-none rounded-3xl overflow-hidden bg-background">
                            <CardContent className="p-8 md:p-12 flex flex-col items-center text-center space-y-6">
                                <div className="p-4 bg-primary/5 rounded-2xl">
                                    <Lock className="w-10 h-10 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold">Хязгаарлагдмал хэсэг</h2>
                                    <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                                        Оюутнуудын профайл болон холбоо барих мэдээллийг үзэхийн тулд заавал <span className="text-foreground font-bold">Компани</span> эрхээр нэвтэрнэ үү.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2.2 w-full pt-2">
                                    <Button className="flex-1 h-10 rounded-xl font-bold" asChild>
                                        <Link href="/login?redirect=students">Нэвтрэх</Link>
                                    </Button>
                                    <Button variant="outline" className="flex-1 h-10 rounded-xl font-bold border-border/60" asChild>
                                        <Link href="/signup">Бүртгүүлэх</Link>
                                    </Button>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Аюулгүй байдал
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Minimal Sidebar */}
                        <aside className="hidden lg:block w-64 shrink-0">
                            <div className="sticky top-24 space-y-6">
                                <FilterSidebar />
                                <div className="p-4 rounded-2xl bg-secondary/20 border border-border/40 text-[11px] font-medium leading-relaxed text-muted-foreground">
                                    <div className="flex items-center gap-1.5 mb-1 text-foreground font-bold uppercase tracking-wider">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                        Мэдэгдэл
                                    </div>
                                    Зөвхөн баталгаажсан профайлтай оюутнууд харагдах болно.
                                </div>
                            </div>
                        </aside>

                        {/* Students List */}
                        <main className="flex-1 space-y-4">
                            <div className="flex items-center justify-between border-b pb-3 border-border/40 mb-2">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    Нийт <span className="text-foreground">{filteredStudents.length}</span> үр дүн
                                </p>
                            </div>

                            {loading ? (
                                <StudentSkeleton />
                            ) : error ? (
                                <Card className="p-10 text-center rounded-2xl border-dashed border-border/60 bg-red-50/5">
                                    <p className="text-sm font-medium text-red-500">{error.message}</p>
                                    <Button variant="ghost" className="mt-2 text-xs h-8" onClick={() => window.location.reload()}>Дахин ачаалах</Button>
                                </Card>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
                                    {filteredStudents.map((student) => (
                                        <Card key={student.id} className="group hover:border-primary/40 hover:shadow-md transition-all duration-300 border-border/60 bg-background rounded-2xl overflow-hidden flex flex-col">
                                            <CardContent className="p-5 flex flex-col h-full space-y-4 text-sm font-medium">
                                                <div className="flex items-start justify-between">
                                                    <div className="w-11 h-11 rounded-xl bg-secondary/50 flex items-center justify-center font-bold text-primary group-hover:bg-primary/5 transition-colors uppercase text-sm">
                                                        {student.firstName?.[0]}{student.lastName?.[0]}
                                                    </div>
                                                    <div className={cn(
                                                        "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border",
                                                        student.experienceLevel === 'intern' ? 'bg-orange-50/5 text-orange-600 border-orange-500/20' : 'bg-blue-50/5 text-blue-600 border-blue-500/20'
                                                    )}>
                                                        {student.experienceLevel}
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <h3 className="text-base font-bold group-hover:text-primary transition-colors">
                                                        {student.firstName} {student.lastName}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                        {student.bio || "Мэдээлэл байхгүй."}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap gap-1.2 mt-auto">
                                                    {student.skills.slice(0, 3).map((skill, i) => (
                                                        <span key={i} className="px-2 py-0.5 bg-secondary/40 rounded-md text-[9px] font-bold text-muted-foreground/80 uppercase tracking-tighter">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {student.skills.length > 3 && (
                                                        <span className="px-2 py-0.5 text-[9px] font-bold text-primary/60 uppercase">
                                                            +{student.skills.length - 3}
                                                        </span>
                                                    )}
                                                </div>

                                                <Button size="sm" className="w-full h-9 rounded-xl gap-1.5 font-bold text-xs" asChild>
                                                    <Link href={`/students/${student.id}`}>
                                                        Профайл үзэх
                                                        <ChevronRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {filteredStudents.length === 0 && (
                                        <div className="col-span-full py-16 text-center bg-secondary/5 rounded-2xl border-border/40 border-2 border-dashed px-4">
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold">Оюутан олдсонгүй</p>
                                                <p className="text-xs text-muted-foreground">Түлхүүр үгээ өөрчилж үзнэ үү.</p>
                                            </div>
                                            <Button variant="link" className="mt-2 text-xs" onClick={clearFilters}>Бүгдийг харах</Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </main>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function StudentsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] py-6 md:py-10">
                <div className="container mx-auto px-4 md:px-6 lg:px-12 max-w-7xl text-foreground">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div className="space-y-4">
                            <div className="h-8 w-48 bg-secondary/20 animate-pulse rounded-lg" />
                            <div className="h-4 w-64 bg-secondary/10 animate-pulse rounded-lg" />
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <aside className="hidden lg:block w-64 shrink-0 space-y-4">
                            <div className="h-40 bg-secondary/10 animate-pulse rounded-2xl" />
                        </aside>
                        <main className="flex-1 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-48 bg-secondary/10 animate-pulse rounded-2xl" />
                                ))}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        }>
            <StudentsContent />
        </Suspense>
    )
}

