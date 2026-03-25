"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Briefcase,
    Loader2,
    Eye,
    EyeOff,
    CheckCircle2,
    ArrowRight,
    Github,
    Building2
} from "lucide-react"
import { toast } from "sonner"
import { LOGIN, SOCIAL_LOGIN } from "../graphql/mutations"
import { useMutation, useApolloClient } from "@apollo/client/react"
import { AuthPayload, LoginInput, SocialLoginInput } from "@/lib/type"
import { cn } from "@/lib/utils"
import { useGoogleLogin } from '@react-oauth/google'

export default function LoginPage() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [selectedRole, setSelectedRole] = useState<'student' | 'company'>("student")
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const [login, { loading, error: mutationError }] = useMutation<{ login: AuthPayload }, { input: LoginInput }>(LOGIN)
    const [socialLogin, { loading: socialLoading }] = useMutation<{ socialLogin: AuthPayload }, { input: SocialLoginInput }>(SOCIAL_LOGIN)
    const client = useApolloClient()

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            toast.promise(
                async () => {
                    // 1. Fetch user profile from Google using the access token
                    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                    });
                    const userInfo = await res.json();

                    // 2. Send to backend
                    const { data } = await socialLogin({
                        variables: {
                            input: {
                                email: userInfo.email,
                                socialId: userInfo.sub,
                                provider: 'google',
                                firstName: userInfo.given_name,
                                lastName: userInfo.family_name,
                                profilePictureUrl: userInfo.picture,
                                role: selectedRole
                            }
                        }
                    });

                    if (data?.socialLogin?.token) {
                        localStorage.setItem("token", data.socialLogin.token);
                        await client.resetStore();
                        
                        const userRole = data.socialLogin.user.role;
                        if (userRole === "COMPANY" || userRole.toLowerCase() === "company") {
                            router.push("/company");
                        } else if (userRole === "ADMIN" || userRole.toLowerCase() === "admin") {
                            router.push("/admin");
                        } else {
                            router.push("/student");
                        }
                        return "Success";
                    }
                    throw new Error("Token not received");
                },
                {
                    loading: "Google-оор нэвтэрч байна...",
                    success: "Амжилттай нэвтэрлээ!",
                    error: (err) => `Алдаа гарлаа: ${err.message}`
                }
            );
        },
        onError: () => toast.error("Google-ээр нэвтрэхэд алдаа гарлаа")
    });

    const handleSocialLogin = async (provider: 'google' | 'github') => {
        if (provider === 'google') {
            googleLogin();
            return;
        }

        if (provider === 'github') {
            // 1. Store the selected role so we can use it after the redirect
            localStorage.setItem("pending_role", selectedRole);

            // 2. Redirect to GitHub
            const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
            const redirectUri = `${window.location.origin}/auth/callback/github`;
            const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
            
            window.location.href = githubUrl;
            return;
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const { data } = await login({
                variables: {
                    input: {
                        email: formData.email,
                        password: formData.password,
                    },
                },
            })

            if (data?.login?.token) {
                localStorage.setItem("token", data.login.token)

                // Clear any previous store/cache to avoid stale data
                await client.resetStore()

                const userRole = data.login.user.role
                if (userRole === "COMPANY" || userRole.toLowerCase() === "company") {
                    router.push("/company")
                } else if (userRole === "ADMIN" || userRole.toLowerCase() === "admin") {
                    router.push("/admin")
                } else {
                    router.push("/student")
                }
            }
        } catch (err) {
            console.error("Login error:", err)
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
            {/* Left Side: Illustration & Benefits (Desktop Only) */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-linear-to-br from-primary/10 via-background to-secondary/20 p-12 border-r border-border relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary rounded-full blur-[100px]" />
                </div>

                <div className="max-w-md space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                        <Briefcase className="w-4 h-4" />
                        <span>InternMatch Platform</span>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold tracking-tight text-foreground">
                            Ирээдүйн карьераа <span className="text-primary italic">яг одоо</span> төлөвлө.
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            InternMatch бол оюутнууд болон шилдэг байгууллагуудыг холбох хамгийн богино зам юм.
                        </p>
                    </div>

                    <ul className="space-y-4 pt-4">
                        {[
                            "Чадварлаг боловсон хүчин олох",
                            "Мэргэжлийн дадлага хийх боломж",
                            "Олон улсын жишигт нийцсэн систем",
                            "Хурдан бөгөөд хялбар бүртгэл"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-foreground/80">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="pt-8">
                        <Button variant="outline" className="rounded-full group" asChild>
                            <Link href="/">
                                Дэлгэрэнгүй үзэх
                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <main className="flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-background">
                <Card className="w-full max-w-md border-none shadow-none bg-transparent">
                    <CardHeader className="space-y-2 p-0 mb-8">
                        <CardTitle className="text-3xl font-bold tracking-tight">Тавтай морилно уу!</CardTitle>
                        <CardDescription className="text-base">
                            Өөрийн карьераа эхлүүлэх эсвэл шилдэг залуу боловсон хүчинтэй холбогдоорой.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {mutationError && (
                            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="w-2 h-2 rounded-full bg-destructive" />
                                {mutationError.message}
                            </div>
                        )}

                        {/* Role Selection for Social Signup */}
                        <div className="mb-8 space-y-3">
                            <Label className="text-sm font-semibold opacity-70">Таны оролцоо (Шинэ хэрэглэгч бол)</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setSelectedRole("student")}
                                    className={cn(
                                        "flex flex-col items-start gap-2 p-4 rounded-2xl border-2 transition-all text-left group",
                                        selectedRole === "student"
                                            ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                                            : "border-border hover:border-primary/30 hover:bg-muted/30"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                        selectedRole === "student" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                    )}>
                                        <Briefcase className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className={cn(
                                            "block font-bold text-xs",
                                            selectedRole === "student" ? "text-primary" : "text-foreground"
                                        )}>
                                            Оюутан
                                        </span>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedRole("company")}
                                    className={cn(
                                        "flex flex-col items-start gap-2 p-4 rounded-2xl border-2 transition-all text-left group",
                                        selectedRole === "company"
                                            ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                                            : "border-border hover:border-primary/30 hover:bg-muted/30"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                        selectedRole === "company" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                    )}>
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className={cn(
                                            "block font-bold text-xs",
                                            selectedRole === "company" ? "text-primary" : "text-foreground"
                                        )}>
                                            Компани
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Нууц үг</Label>
                                    <Link href="/forgot-password" title="Нууц үгээ мартсан?" className="text-sm text-primary hover:underline font-medium focus-visible:outline-none">
                                        Нууц үгээ мартсан?
                                    </Link>
                                </div>
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
                            </div>

                            <div className="flex items-center space-x-2 pt-1 pb-2">
                                <Checkbox id="remember" className="rounded-[4px]" />
                                <label
                                    htmlFor="remember"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    Намайг санах
                                </label>
                            </div>

                            <Button type="submit" className="w-full h-11 rounded-xl font-semibold transition-all hover:-translate-y-px active:translate-y-0 shadow-lg shadow-primary/20" disabled={loading || socialLoading}>
                                {loading || socialLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Нэвтэрч байна...
                                    </>
                                ) : (
                                    "Нэвтрэх"
                                )}
                            </Button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-4 text-muted-foreground font-medium">Эсвэл нэвтрэх</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 rounded-xl font-medium border-border hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-colors"
                                onClick={() => handleSocialLogin('google')}
                                disabled={socialLoading}
                            >
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                    <path d="M1 1h22v22H1z" fill="none" />
                                </svg>
                                Google
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 rounded-xl font-medium border-border hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-colors"
                                onClick={() => handleSocialLogin('github')}
                                disabled={socialLoading}
                            >
                                <Github className="mr-2 h-4 w-4" />
                                GitHub
                            </Button>
                        </div>

                        <div className="mt-10 text-center text-sm">
                            <span className="text-muted-foreground">Бүртгүүлж хараахан чадаагүй?</span>
                            <Link href="/signup" className="text-primary hover:underline font-semibold ml-1.5 transition-colors">
                                Бүртгүүлэх
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
