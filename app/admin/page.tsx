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
    Activity,
    ChevronDown,
    ArrowUpRight
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
import { cn } from "@/lib/utils"

export default function AdminDashboardPage() {
    const [period, setPeriod] = useState<StatsPeriod>("DAILY")
    const { data, loading, error } = useQuery<{ adminStats: AdminStats }>(ADMIN_STATS, {
        variables: { period },
        pollInterval: 10000,
    })

    const formatRelativeTime = (isoString: string) => {
        const now = new Date();
        const timestamp = isNaN(Number(isoString)) ? isoString : Number(isoString);
        const past = new Date(timestamp);

        if (isNaN(past.getTime())) return "Тодорхойгүй";

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
                return { icon: UserRound, color: "text-emerald-500", bg: "bg-emerald-50" };
            case 'COMPANY_SIGNUP':
                return { icon: ShieldCheck, color: "text-amber-500", bg: "bg-amber-50" };
            case 'COMPANY_PROFILE_CREATED':
                return { icon: Building2, color: "text-blue-500", bg: "bg-blue-50" };
            case 'JOB_POSTED':
                return { icon: Briefcase, color: "text-indigo-500", bg: "bg-indigo-50" };
            case 'APPLICATION_SUBMITTED':
                return { icon: ClipboardList, color: "text-purple-500", bg: "bg-purple-50" };
            default:
                return { icon: Activity, color: "text-slate-500", bg: "bg-slate-50" };
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-bold text-muted-foreground animate-pulse">Ачаалж байна...</p>
        </div>
    )

    if (error) return (
        <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-6 text-center text-destructive">
                <p className="font-bold font-monrope">Системийн алдаа: {error.message}</p>
            </CardContent>
        </Card>
    )

    const stats = data?.adminStats

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight">Хянах самбар</h1>
                    <p className="text-sm font-bold text-muted-foreground">Системийн ерөнхий үзүүлэлтүүд болон идэвхжлийг хянах.</p>
                </div>
                <div className="relative">
                    <select
                        className="appearance-none bg-background border border-border/60 rounded-xl px-4 py-1.5 pr-10 text-xs font-bold focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer shadow-sm"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as StatsPeriod)}
                    >
                        <option value="DAILY">Өнөөдрийн байдлаар</option>
                        <option value="WEEKLY">Долоо хоногоор</option>
                        <option value="MONTHLY">Сараар</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { title: "Нийт хэрэглэгч", value: stats?.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { title: "Оюутнууд", value: stats?.totalStudents, icon: UserRound, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { title: "Компаниуд", value: stats?.totalCompanies, icon: Building2, color: "text-amber-600", bg: "bg-amber-50" },
                    { title: "Идэвхтэй зар", value: stats?.activeJobs, icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50" }
                ].map((stat, i) => (
                    <Card key={i} className="border-border/60 shadow-sm rounded-2xl overflow-hidden hover:border-primary/20 transition-all group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("p-2.5 rounded-xl transition-all group-hover:scale-110", stat.bg, stat.color)}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">{stat.title}</p>
                                <h3 className="text-2xl font-black tracking-tight">{stat.value?.toLocaleString()}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Growth Chart */}
                <Card className="lg:col-span-2 border-border/60 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="p-6 pb-0">
                        <CardTitle className="text-base font-bold flex items-center gap-2.5">
                            <TrendingUp className="w-4.5 h-4.5 text-primary" />
                            Өсөлтийн хурд
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.growthData || []}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.08} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 10, fill: '#888', fontWeight: 600 }}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10, fill: '#888', fontWeight: 600 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                            fontSize: '12px',
                                            fontWeight: '700'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorUsers)"
                                        name="Шинэ хэрэглэгч"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="p-6 border-b border-border/40 bg-secondary/10">
                        <CardTitle className="text-base font-bold flex items-center gap-2.5">
                            <Clock className="w-4.5 h-4.5 text-primary" />
                            Сүүлийн үйлдлүүд
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {(stats?.recentActivities || []).map((activity) => {
                                const config = getActivityConfig(activity.type);
                                return (
                                    <div key={activity.id} className="flex gap-4 group cursor-default">
                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", config.bg, config.color)}>
                                            <config.icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0 border-b border-border/40 pb-4 group-last:border-0">
                                            <div className="flex items-center justify-between gap-2 mb-0.5">
                                                <p className="text-xs font-bold truncate text-foreground group-hover:text-primary transition-colors">{activity.user}</p>
                                                <span className="text-[9px] font-bold text-muted-foreground/50 whitespace-nowrap uppercase tracking-widest">
                                                    {formatRelativeTime(activity.timestamp)}
                                                </span>
                                            </div>
                                            <p className="text-[11px] font-medium text-muted-foreground leading-relaxed italic opacity-80">{activity.action}</p>
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