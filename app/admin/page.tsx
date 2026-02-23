"use client"

import React, { useEffect, useState } from "react"
import { useQuery } from "@apollo/client/react"
import { ADMIN_STATS } from "../graphql/mutations"
import {
    Users,
    UserRound,
    Building2,
    Briefcase,
    TrendingUp,
    Clock,
    ShieldCheck,
    ClipboardList,
    Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"
import { AdminStats, StatsPeriod } from "@/lib/type"
import { Loader2 } from "lucide-react"

export default function AdminDashboardPage() {
    const [period, setPeriod] = useState<StatsPeriod>("DAILY")
    const { data, loading, error } = useQuery<{ adminStats: AdminStats }>(ADMIN_STATS, {
        variables: { period },
        pollInterval: 10000,
    })

    const formatRelativeTime = (isoString: string) => {
        const now = new Date();
        const past = new Date(isNaN(Date.parse(isoString)) ? parseInt(isoString) : isoString);

        const diffInMs = now.getTime() - past.getTime();
        const diffInMins = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMins < 1) return "Дөнгөж сая";
        if (diffInMins < 60) return `${diffInMins} мин өмнө`;
        if (diffInHours < 24) return `${diffInHours} цаг өмнө`;
        if (diffInDays === 1) return "Өчигдөр";
        return `${diffInDays} өдрийн өмнө`;
    };

    const getActivityConfig = (type: string) => {
        switch (type) {
            case 'STUDENT_SIGNUP':
            case 'STUDENT_PROFILE_CREATED':
                return { icon: UserRound, color: "text-green-500" };
            case 'COMPANY_SIGNUP':
                return { icon: ShieldCheck, color: "text-amber-500" };
            case 'COMPANY_PROFILE_CREATED':
                return { icon: Building2, color: "text-blue-500" };
            case 'JOB_POSTED':
                return { icon: Briefcase, color: "text-indigo-500" };
            case 'APPLICATION_SUBMITTED':
                return { icon: ClipboardList, color: "text-purple-500" };
            default:
                return { icon: Activity, color: "text-slate-500" };
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
    if (error) return <div className="p-4 text-destructive">Алдаа: {error.message}</div>

    const stats = data?.adminStats

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Хянах самбар</h1>
                    <p className="text-muted-foreground">Системийн ерөнхий үзүүлэлтүүд</p>
                </div>
                <div className="flex gap-2">
                    <select
                        className="bg-background border rounded-md px-3 py-1 text-sm"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as StatsPeriod)}
                    >
                        <option value="DAILY">Өдрөөр</option>
                        <option value="WEEKLY">Долоо хоногоор</option>
                    </select>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Нийт хэрэглэгчид", value: stats?.totalUsers, icon: Users, color: "text-blue-500" },
                    { title: "Оюутнууд", value: stats?.totalStudents, icon: UserRound, color: "text-green-500" },
                    { title: "Компаниуд", value: stats?.totalCompanies, icon: Building2, color: "text-amber-500" },
                    { title: "Идэвхтэй зарууд", value: stats?.activeJobs, icon: Briefcase, color: "text-indigo-500" }
                ].map((stat, i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                    <h3 className="text-2xl font-bold mt-1">{stat.value?.toLocaleString()}</h3>
                                </div>
                                <div className={`p-2 rounded-full bg-secondary ${stat.color}`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Өсөлтийн хурд
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.growthData || []}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#3b82f6"
                                        fillOpacity={1}
                                        fill="url(#colorUsers)"
                                        name="Шинэ хэрэглэгч"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="apps"
                                        stroke="#10b981"
                                        fillOpacity={0}
                                        name="Ажлын өргөдөл"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Сүүлийн үйлдлүүд
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {(stats?.recentActivities || []).map((activity) => {
                                const config = getActivityConfig(activity.type);
                                return (
                                    <div key={activity.id} className="flex gap-3">
                                        <div className={`mt-1 ${config.color}`}>
                                            <config.icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{activity.user}</p>
                                            <p className="text-xs text-muted-foreground">{activity.action}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1">
                                                {formatRelativeTime(activity.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}