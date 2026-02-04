"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Briefcase, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useMutation } from "@apollo/client/react"
import { REQUEST_PASSWORD_RESET } from "../graphql/mutations"
import { RequestPasswordResetData } from "@/lib/type"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    console.log(email, "email")
    const [requestReset, { loading, error }] = useMutation<RequestPasswordResetData, { email: string }>(REQUEST_PASSWORD_RESET)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await requestReset({ variables: { email } })
            setIsSubmitted(true)
        } catch (err) {
            console.error("Password reset request error:", err)
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-secondary/30 flex flex-col items-center justify-center px-4">
                <Card className="w-full max-w-md shadow-lg text-center">
                    <CardHeader>
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">И-майл илгээгдлээ</CardTitle>
                        <CardDescription>
                            Хэрэв таны и-майл бидний системд бүртгэлтэй бол нөхөн сэргээх заавар бүхий и-майл илгээсэн болно.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/login">Нэвтрэх хэсэг рүү буцах</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-secondary/30 flex flex-col">
            <header className="py-6 px-4">
                <div className="container mx-auto">
                    <Link href="/login" className="flex items-center gap-2 w-fit text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Буцах</span>
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 pb-16">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Briefcase className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Нууц үг сэргээх</CardTitle>
                        <CardDescription>
                            Бүртгэлтэй и-майл хаягаа оруулна уу. Бид танд нууц үг шинэчлэх холбоос илгээх болно.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
                                {error.message}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">И-майл</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Илгээж байна...
                                    </>
                                ) : (
                                    "Илгээх"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
