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
import { cn } from "@/lib/utils"

type UserRole = "STUDENT" | "COMPANY"

export default function SignupPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
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

        setIsLoading(true)

        // Simulate API call - replace with actual GraphQL mutation
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Redirect based on selected role
        if (selectedRole === "COMPANY") {
            router.push("/company/dashboard")
        } else {
            router.push("/student/dashboard")
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
                </div>
            </header>

            {/* Signup Form */}
            <main className="flex-1 flex items-center justify-center px-4 pb-16">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Create an account</CardTitle>
                        <CardDescription>
                            Get started with InternMatch today
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Role Selection */}
                            <div className="space-y-2">
                                <Label>I am a</Label>
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
                                            Student
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
                                            Company
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
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
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create account"
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
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
