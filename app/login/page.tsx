"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Briefcase, Loader2 } from "lucide-react"
import { LOGIN } from "../graphql/mutations"
import { useMutation } from "@apollo/client/react";
import { AuthPayload, LoginInput } from "@/lib/type"

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const [login, { loading, error: mutationError }] = useMutation<{ login: AuthPayload }, { input: LoginInput }>(LOGIN)

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
        <div className="min-h-screen bg-secondary/30 flex flex-col">
            {/* Simple Header */}
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

            {/* Login Form */}
            <main className="flex-1 flex items-center justify-center px-4 pb-16">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Сайнуу , юу байнадаа.</CardTitle>
                        <CardDescription>
                            Бүртгэлээрээ нэвтрэн цааш үргэлжилнэ үү.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {mutationError && (
                            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
                                {mutationError.message}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Нууц үг</Label>
                                    <Link href="#" className="text-sm text-primary hover:underline">
                                        Нууц үгээ мартсан?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Нууц үгээ оруулна уу"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Нэвтэрч байна...
                                    </>
                                ) : (
                                    "Нэвтрэх"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Бүртгүүлж хараахан чадаагүй?
                            <Link href="/signup" className="text-primary hover:underline font-medium pl-3">
                                Бүртгүүлэх
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
