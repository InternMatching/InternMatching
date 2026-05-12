"use client"

import React, { createContext, useCallback, useContext, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useApolloClient } from "@apollo/client/react"
import { toast } from "sonner"
import { ME } from "@/features/auth/graphql/auth.queries"
import { User } from "@/lib/type"

type AuthContextValue = {
    user: User | null
    loading: boolean
    error: unknown
    refetch: () => void
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const client = useApolloClient()

    const { data, loading, error, refetch } = useQuery<{ me: User }>(ME, {
        fetchPolicy: "cache-first",
    })

    const logout = useCallback(async () => {
        localStorage.removeItem("token")
        await client.clearStore()
        toast.success("Амжилттай гарлаа")
        router.push("/login")
    }, [client, router])

    const value = useMemo<AuthContextValue>(
        () => ({
            user: data?.me ?? null,
            loading,
            error,
            refetch: () => { refetch() },
            logout,
        }),
        [data?.me, loading, error, refetch, logout]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
    return ctx
}
