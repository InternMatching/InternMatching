"use client"

import React, { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Briefcase,
    Loader2,
    GraduationCap,
    Building2,
    CheckCircle2,
    ArrowRight,
    Eye,
    EyeOff,
    Info
} from "lucide-react"
import { useMutation } from "@apollo/client/react"
import { SIGNUP } from "../graphql/mutations"
import { SignupInput, UserRole as AppUserRole, AuthPayload } from "@/lib/type"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type LocalUserRole = "student" | "company"

function SignupContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showPassword, setShowPassword] = useState(false)
    const [selectedRole, setSelectedRole] = useState<LocalUserRole>("student")
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [signup, { loading, error: mutationError }] = useMutation<{ signup: AuthPayload }, { input: SignupInput }>(SIGNUP)

    useEffect(() => {
        const roleParam = searchParams.get("role")
        if (roleParam === "company" && selectedRole !== "company") {
            setSelectedRole("company")
        } else if (roleParam === "student" && selectedRole !== "student") {
            setSelectedRole("student")
        }
    }, [searchParams, selectedRole])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            toast.error("Нууц үгнүүд тохирохгүй байна.")
            return
        }

        if (formData.password.length < 8) {
            toast.error("Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой.")
            return
        }

        try {
            const { data } = await signup({
                variables: {
                    input: {
                        email: formData.email,
                        password: formData.password,
                        role: selectedRole as AppUserRole,
                    },
                },
            })

            if (data?.signup?.token) {
                localStorage.setItem("token", data.signup.token)
                toast.success("Бүртгэл амжилттай үүслээ!")

                // Redirect to respective dashboard with onboarding message
                if (selectedRole === "company") {
                    router.push("/company?onboarding=true")
                } else {
                    router.push("/student?onboarding=true")
                }
            }
        } catch (err) {
            console.error("Signup error:", err)
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
            {/* Left Side: Illustration & Value Proposition (Desktop Only) */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-linear-to-br from-primary/10 via-background to-secondary/20 p-12 border-r border-border relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary rounded-full blur-[100px]" />
                </div>

                <div className="max-w-md space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Шинэ боломжууд хүлээж байна</span>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold tracking-tight text-foreground">
                            InternMatch-д нэгдэж, <span className="text-primary italic">амжилтаа</span> эхлүүл.
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Бид таныг мянга мянган боломжууд болон шилдэг байгууллагуудтай шууд холбож өгөх болно.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 pt-4">
                        {[
                            { title: "Оюутнуудад", desc: "Дадлага хийх шилдэг газруудыг олж, туршлага хуримтлуулах." },
                            { title: "Байгууллагуудад", desc: "Чадварлаг, эрч хүчтэй залуу боловсон хүчнийг багтаа авах." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-background/50 border border-border/50 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20" />
                                </div>
                            ))}
                        </div>
                        <p>500+ оюутан аль хэдийн нэгдсэн</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <main className="flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-background">
                <Card className="w-full max-w-md border-none shadow-none bg-transparent">
                    <CardHeader className="space-y-2 p-0 mb-8 text-left">
                        <CardTitle className="text-3xl font-bold tracking-tight">Бүртгэл үүсгэх</CardTitle>
                        <CardDescription className="text-base">
                            Өөрийн карьерын аяллаа өнөөдөр эхлүүлээрэй.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {mutationError && (
                            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="w-2 h-2 rounded-full bg-destructive" />
                                {mutationError.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Role Selection */}
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold opacity-70">Таны оролцоо</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRole("student")}
                                        className={cn(
                                            "flex flex-col items-start gap-2 p-5 rounded-2xl border-2 transition-all text-left group",
                                            selectedRole === "student"
                                                ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                                                : "border-border hover:border-primary/30 hover:bg-muted/30"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                            selectedRole === "student" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                        )}>
                                            <GraduationCap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className={cn(
                                                "block font-bold",
                                                selectedRole === "student" ? "text-primary" : "text-foreground"
                                            )}>
                                                Оюутан
                                            </span>
                                            <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">Дадлага хайх</span>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRole("company")}
                                        className={cn(
                                            "flex flex-col items-start gap-2 p-5 rounded-2xl border-2 transition-all text-left group",
                                            selectedRole === "company"
                                                ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                                                : "border-border hover:border-primary/30 hover:bg-muted/30"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                            selectedRole === "company" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                        )}>
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className={cn(
                                                "block font-bold",
                                                selectedRole === "company" ? "text-primary" : "text-foreground"
                                            )}>
                                                Компани
                                            </span>
                                            <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">Зар байршуулах</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">И-мэйл хаяг</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@mail.com"
                                    className="h-11 rounded-xl focus-visible:ring-primary/20"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Нууц үг</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="h-11 rounded-xl pr-11 focus-visible:ring-primary/20"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1 h-9 w-9 p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2 mt-1 px-1">
                                    <Info className="w-3 h-3 text-muted-foreground" />
                                    <p className="text-[10px] text-muted-foreground">8+ тэмдэгт, том үсэг болон тоо орсон байвал илүү аюулгүй.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Нууц үг баталгаажуулах</Label>
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="h-11 rounded-xl focus-visible:ring-primary/20"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full h-11 rounded-xl font-semibold transition-all hover:-translate-y-px active:translate-y-0 shadow-lg shadow-primary/20" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Бүртгэлийг үүсгэж байна...
                                    </>
                                ) : (
                                    "Бүртгүүлэх"
                                )}
                            </Button>
                        </form>

                        <p className="mt-8 text-[11px] text-muted-foreground text-center leading-relaxed">
                            Бүртгүүлснээр та манай {" "}
                            <Link href="#" className="underline hover:text-primary transition-colors">Үйлчилгээний нөхцөл</Link>
                            {" "} болон {" "}
                            <Link href="#" className="underline hover:text-primary transition-colors">Нууцлалын бодлогыг</Link>
                            {" "} зөвшөөрсөнд тооцно.
                        </p>

                        <div className="mt-8 pt-6 border-t border-border/50 text-center text-sm">
                            <span className="text-muted-foreground">Та аль хэдийн бүртгэлтэй юу?</span>
                            <Link href="/login" className="text-primary hover:underline font-semibold ml-1.5 transition-colors">
                                Нэвтрэх
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-full max-w-md p-8 space-y-6">
                    <div className="h-10 w-2/3 bg-secondary/10 animate-pulse rounded-lg mx-auto" />
                    <div className="h-4 w-full bg-secondary/5 animate-pulse rounded-lg" />
                    <div className="space-y-4">
                        <div className="h-24 bg-secondary/10 animate-pulse rounded-2xl" />
                        <div className="h-12 bg-secondary/10 animate-pulse rounded-xl" />
                        <div className="h-12 bg-secondary/10 animate-pulse rounded-xl" />
                        <div className="h-12 bg-primary/20 animate-pulse rounded-xl" />
                    </div>
                </div>
            </div>
        }>
            <SignupContent />
        </Suspense>
    )
}

