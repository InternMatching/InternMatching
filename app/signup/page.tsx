"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Briefcase, Loader2, GraduationCap, Building2 } from "lucide-react"
import { useMutation } from "@apollo/client/react";
import { SIGNUP } from "../graphql/mutations"
import { AuthPayload, SignupInput } from "@/lib/type"
import { ThemeToggle } from "@/components/theme-toggle"

import { cn } from "@/lib/utils"

type UserRole = "STUDENT" | "COMPANY"

export default function SignupPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [signup, { loading, error: mutationError }] = useMutation<{ signup: AuthPayload }, { input: SignupInput }>(SIGNUP)

    const [selectedRole, setSelectedRole] = useState<UserRole>("STUDENT")
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })

    useEffect(() => {
        const roleParam = searchParams.get("role")
        if (roleParam === "company") {
            setSelectedRole("COMPANY")
        } else if (roleParam === "student") {
            setSelectedRole("STUDENT")
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match")
            return
        }

        try {
            const { data } = await signup({
                variables: {
                    input: {
                        email: formData.email,
                        password: formData.password,
                        role: selectedRole.toLowerCase() as any,
                    },
                },
            })

            if (data?.signup?.token) {
                localStorage.setItem("token", data.signup.token)

                if (selectedRole === "COMPANY") {
                    router.push("/company")
                } else {
                    router.push("/student")
                }
            }
        } catch (err) {
            console.error("Signup error:", err)
        }
    }

    return (
        <div className="min-h-screen bg-secondary/30 flex flex-col">
            <header className="py-6 px-4">
                <div className="container mx-auto">
                    <Link href="/" className="flex items-center gap-2 w-fit">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-semibold text-xl text-foreground">InternMatch</span>
                    </Link>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Signup Form */}
            <main className="flex-1 flex items-center justify-center px-4 pb-16">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Бүртгэлээ үүсгэх</CardTitle>
                        <CardDescription>
                            Өнөөдрийг бидэнтэй хамт эхлээрэй.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {mutationError && (
                            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
                                {mutationError.message}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Role Selection */}
                            <div className="space-y-2">
                                <Label>Би бол</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRole("STUDENT")}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                                            selectedRole === "STUDENT"
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-muted-foreground/30"
                                        )}
                                    >
                                        <GraduationCap className={cn(
                                            "w-6 h-6",
                                            selectedRole === "STUDENT" ? "text-primary" : "text-muted-foreground"
                                        )} />
                                        <span className={cn(
                                            "text-sm font-medium",
                                            selectedRole === "STUDENT" ? "text-primary" : "text-muted-foreground"
                                        )}>
                                            Оюутан
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRole("COMPANY")}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                                            selectedRole === "COMPANY"
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-muted-foreground/30"
                                        )}
                                    >
                                        <Building2 className={cn(
                                            "w-6 h-6",
                                            selectedRole === "COMPANY" ? "text-primary" : "text-muted-foreground"
                                        )} />
                                        <span className={cn(
                                            "text-sm font-medium",
                                            selectedRole === "COMPANY" ? "text-primary" : "text-muted-foreground"
                                        )}>
                                            Компань
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">И-майл</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Нууц үг</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Нууц үгээ оруулна уу"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Нууц үг баталгаажуулах</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Нууц үг баталгаажуулах"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
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

                        <p className="mt-4 text-xs text-muted-foreground text-center">
                            By signing up, you agree to our{" "}
                            <Link href="#" className="text-primary hover:underline">Terms of Service</Link>
                            {" "}and{" "}
                            <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
                        </p>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Та аль хэдийн бүртгэлтэй юу?
                            <Link href="/login" className="text-primary hover:underline font-medium pl-2">
                                Нэвтрэх
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
