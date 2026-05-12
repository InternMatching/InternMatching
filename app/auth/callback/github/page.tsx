"use client"

import { useEffect, Suspense, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation, useApolloClient } from "@apollo/client/react"
import { GITHUB_LOGIN } from "@/features/auth/graphql/auth.mutations"
import { AuthPayload } from "@/lib/type"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

function GitHubCallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const client = useApolloClient()
    const [githubLogin] = useMutation<{ githubLogin: AuthPayload }>(GITHUB_LOGIN)

    const handleLogin = useCallback(async (code: string, role: string) => {
        try {
            const { data } = await githubLogin({
                variables: {
                    code,
                    role: role as "student" | "company"
                }
            })

            if (data?.githubLogin?.token) {
                localStorage.setItem("token", data.githubLogin.token)
                localStorage.removeItem("pending_role")
                await client.resetStore()

                const userRole = data.githubLogin.user.role
                toast.success("GitHub-ээр амжилттай нэвтэрлээ!")

                if (userRole === "COMPANY" || userRole.toLowerCase() === "company") {
                    router.push("/company")
                } else if (userRole === "ADMIN" || userRole.toLowerCase() === "admin") {
                    router.push("/admin")
                } else {
                    router.push("/student")
                }
            }
        } catch (err) {
            console.error("GitHub login error:", err)
            toast.error(err instanceof Error ? `GitHub нэвтрэлт амжилтгүй: ${err.message}` : "GitHub нэвтрэлт амжилтгүй")
            router.push("/login")
        }
    }, [githubLogin, client, router])

    useEffect(() => {
        const code = searchParams.get("code")
        const role = localStorage.getItem("pending_role") || "student"

        if (code) {
            handleLogin(code, role)
        } else {
            toast.error("GitHub-ээс код хүлээн авч чадсангүй.")
            router.push("/login")
        }
    }, [searchParams, handleLogin, router])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
            <div className="space-y-6 max-w-sm w-full animate-in fade-in duration-700">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                    <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10 mx-auto" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">GitHub холболт</h2>
                    <p className="text-muted-foreground">Түр хүлээнэ үү, бид таныг системд нэвтрүүлж байна...</p>
                </div>
            </div>
        </div>
    )
}

export default function GitHubCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <GitHubCallbackContent />
        </Suspense>
    )
}
