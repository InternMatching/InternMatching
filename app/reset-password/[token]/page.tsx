"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Briefcase, Loader2, CheckCircle2 } from "lucide-react"
import { useMutation } from "@apollo/client/react"
import { RESET_PASSWORD } from "../../graphql/mutations"
import { ResetPasswordData, ResetPasswordInput } from "@/lib/type"

export default function ResetPasswordPage() {
    const router = useRouter()
    const params = useParams()
    const token = params.token as string

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    })
    const [isSuccess, setIsSuccess] = useState(false)
    const [localError, setLocalError] = useState("")

    const [resetPassword, { loading, error: mutationError }] = useMutation<ResetPasswordData, ResetPasswordInput>(RESET_PASSWORD)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalError("")

        if (formData.password.length < 6) {
            setLocalError("Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setLocalError("Нууц үгүүд таарахгүй байна.")
            return
        }

        try {
            const { data } = await resetPassword({
                variables: {
                    token,
                    newPassword: formData.password,
                },
            })

            if (data?.resetPassword) {
                setIsSuccess(true)
                // Redirect after 3 seconds
                setTimeout(() => {
                    router.push("/login")
                }, 3000)
            }
        } catch (err) {
            console.error("Password reset error:", err)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-secondary/30 flex flex-col items-center justify-center px-4">
                <Card className="w-full max-w-md shadow-lg text-center">
                    <CardHeader>
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">Нууц үг амжилттай шинэчлэгдлээ</CardTitle>
                        <CardDescription>
                            Таны нууц үг амжилттай солигдлоо. Та 3 секундын дараа нэвтрэх хэсэг рүү шилжих болно.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/login">Одоо нэвтрэх</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-secondary/30 flex flex-col items-center justify-center px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Шинэ нууц үг тохируулах</CardTitle>
                    <CardDescription>
                        Доорх хэсэгт шинэ нууц үгээ оруулна уу.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {(localError || mutationError) && (
                        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
                            {localError || mutationError?.message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Шинэ нууц үг</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="******"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Нууц үг давтах</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="******"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Шинэчилж байна...
                                </>
                            ) : (
                                "Нууц үг шинэчлэх"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
