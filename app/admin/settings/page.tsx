"use client"

import React, { useState, useEffect } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {
    Settings,
    User as UserIcon,
    Mail,
    Smartphone,
    Save,
    Key,
    Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useTheme } from "next-themes"

const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      phoneNumber
      themeColor
      emailNotifications
    }
  }
`

const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($input: UpdateSettingsInput!) {
    updateSettings(input: $input) {
      id
      email
      phoneNumber
      themeColor
      emailNotifications
    }
  }
`

export default function SettingsPage() {
    const { data, loading } = useQuery<{ me: any }>(GET_ME)
    const [updateSettings] = useMutation(UPDATE_SETTINGS)
    const { setTheme } = useTheme()
    const [adminData, setAdminData] = useState({
        email: "",
        phoneNumber: "",
        themeColor: "light",
        emailNotifications: true
    })

    useEffect(() => {
        if (data?.me) {
            setAdminData({
                email: data.me.email || "",
                phoneNumber: data.me.phoneNumber || "",
                themeColor: data.me.themeColor || "light",
                emailNotifications: data.me.emailNotifications !== false
            })
        }
    }, [data])

    const handleSave = async () => {
        try {
            await updateSettings({
                variables: {
                    input: {
                        email: adminData.email,
                        phoneNumber: adminData.phoneNumber,
                        themeColor: adminData.themeColor,
                        emailNotifications: adminData.emailNotifications
                    }
                }
            })
            setTheme(adminData.themeColor)
            toast.success("Тохиргоо амжилттай хадгалагдлаа")
        } catch (err: any) {
            toast.error(err.message || "Алдаа гарлаа")
        }
    }

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold">Системийн тохиргоо</h1>
                <p className="text-muted-foreground">Админ самбарын болон системийн ерөнхий тохиргоо.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <aside className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start bg-primary/10 text-primary">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Профайл
                    </Button>
                </aside>

                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Админ мэдээлэл</CardTitle>
                            <CardDescription>Таны хувийн мэдээлэл болон холбоо барих.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Имейл</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        value={adminData.email}
                                        onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Утас</label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        value={adminData.phoneNumber}
                                        onChange={(e) => setAdminData({ ...adminData, phoneNumber: e.target.value })}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Харагдац</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Системийн өнгө</span>
                                <div className="flex bg-secondary p-1 rounded-md">
                                    <button
                                        onClick={() => setAdminData({ ...adminData, themeColor: 'light' })}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${adminData.themeColor === 'light' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                                    >
                                        Цагаан
                                    </button>
                                    <button
                                        onClick={() => setAdminData({ ...adminData, themeColor: 'dark' })}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${adminData.themeColor === 'dark' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                                    >
                                        Харанхуй
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button onClick={handleSave} className="h-10 px-8">
                            <Save className="w-4 h-4 mr-2" />
                            Хадгалах
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
