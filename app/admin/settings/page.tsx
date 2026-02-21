"use client"

import { useQuery, useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {
    Settings,
    Bell,
    Lock,
    User as UserIcon,
    Shield,
    Globe,
    Moon,
    Sun,
    Save,
    Key,
    Mail,
    Smartphone
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { useState, useEffect } from "react"
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

const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`

interface GetMeData {
    me: {
        id: string;
        email: string;
        phoneNumber?: string;
        themeColor?: string;
        emailNotifications?: boolean;
    }
}

export default function SettingsPage() {
    const { data, loading } = useQuery<GetMeData>(GET_ME)
    const [updateSettings] = useMutation(UPDATE_SETTINGS)
    const [requestPasswordReset] = useMutation(REQUEST_PASSWORD_RESET)
    const { setTheme } = useTheme()
    const [hasSyncedTheme, setHasSyncedTheme] = useState(false)

    const [adminData, setAdminData] = useState({
        email: "",
        phoneNumber: "",
        themeColor: "light",
        emailNotifications: true
    })

    useEffect(() => {
        if (data?.me) {
            const savedTheme = data.me.themeColor === 'dark' ? 'dark' : 'light'
            setAdminData({
                email: data.me.email || "",
                phoneNumber: data.me.phoneNumber || "",
                themeColor: savedTheme,
                emailNotifications: data.me.emailNotifications !== false
            })
            // Sync next-themes on initial load ONLY
            if (!hasSyncedTheme) {
                setTheme(savedTheme)
                setHasSyncedTheme(true)
            }
        }
    }, [data, setTheme, hasSyncedTheme])

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
            setTheme(adminData.themeColor) // Use local state to apply
            toast.success("Тохиргоо амжилттай хадгалагдлаа")
        } catch (err: any) {
            toast.error(err.message || "Хадгалахад алдаа гарлаа")
        }
    }

    const changeTheme = (newTheme: 'light' | 'dark') => {
        setAdminData({ ...adminData, themeColor: newTheme })
        setTheme(newTheme)
    }

    const handlePasswordRecovery = async () => {
        try {
            await requestPasswordReset({ variables: { email: adminData.email } })
            toast.success("Нууц үг сэргээх линк имейл рүү илгээгдлээ")
        } catch (err: any) {
            toast.error(err.message || "Алдаа гарлаа")
        }
    }

    if (loading) return <div className="p-8">Уншиж байна...</div>

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Системийн тохиргоо</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Админ самбарын болон системийн ерөнхий тохиргоо.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <nav className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary font-bold rounded-xl text-sm transition-all">
                        <UserIcon className="w-4 h-4" />
                        Профайл
                    </button>
                    {/* ... other nav items ... */}
                </nav>

                <div className="md:col-span-3 space-y-6">
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                        <CardHeader className="border-b border-slate-50 dark:border-slate-800 p-6">
                            <CardTitle className="text-lg font-bold">Админ мэдээлэл</CardTitle>
                            <CardDescription>Таны хувийн мэдээлэл болон холбоо барих хаяг.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Имейл хаяг</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            value={adminData.email}
                                            onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                                            className="pl-10 rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Утасны дугаар</label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            value={adminData.phoneNumber}
                                            onChange={(e) => setAdminData({ ...adminData, phoneNumber: e.target.value })}
                                            className="pl-10 rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                        <CardHeader className="border-b border-slate-50 dark:border-slate-800 p-6">
                            <CardTitle className="text-lg font-bold">Харагдац болон мэдэгдэл</CardTitle>
                            <CardDescription>Админ самбарын өнгө болон загвар.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Системийн өнгө</p>
                                    <p className="text-xs text-slate-500">Цагаан эсвэл Харанхуй горим сонгох.</p>
                                </div>
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                    <button
                                        onClick={() => changeTheme('light')}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${adminData.themeColor === 'light' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'}`}
                                    >
                                        Цагаан
                                    </button>
                                    <button
                                        onClick={() => changeTheme('dark')}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${adminData.themeColor === 'dark' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'}`}
                                    >
                                        Харанхуй
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Имейл мэдэгдэл</p>
                                    <p className="text-xs text-slate-500">Шинэ хүсэлт ирэх үед имейл хүлээн авах.</p>
                                </div>
                                <button
                                    onClick={() => setAdminData({ ...adminData, emailNotifications: !adminData.emailNotifications })}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${adminData.emailNotifications ? 'bg-primary' : 'bg-slate-200'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${adminData.emailNotifications ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                        <CardHeader className="border-b border-slate-50 dark:border-slate-800 p-6">
                            <CardTitle className="text-lg font-bold">Аюулгүй байдал</CardTitle>
                            <CardDescription>Нууц үг сэргээх хүсэлт илгээх.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <Button variant="outline" onClick={handlePasswordRecovery} className="w-full rounded-xl font-bold h-11 border-slate-200">
                                <Key className="w-4 h-4 mr-2" />
                                Нууц үг сэргээх имейл илгээх
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSave} className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                            <Save className="w-4 h-4 mr-2" />
                            Тохиргоог хадгалах
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
