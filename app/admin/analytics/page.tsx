"use client"

import React, { useState } from "react"
import { useQuery } from "@apollo/client/react"
import { ADMIN_STATS } from "@/features/admin/graphql/admin.queries"
import { AdminStats, StatsPeriod } from "@/lib/type"
import {
    Users,
    UserRound,
    Building2,
    Briefcase,
    ClipboardList,
    ShieldCheck,
    TrendingUp,
    ChevronDown,
    ArrowUpRight,
    Loader2,
    UserPlus
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts"

export default function AnalyticsPage() {
    const [period, setPeriod] = useState<StatsPeriod>("DAILY")
    const { data, loading, error } = useQuery<{ adminStats: AdminStats }>(ADMIN_STATS, {
        variables: { period },
        pollInterval: 15000,
    })

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-bold text-muted-foreground animate-pulse">Ачаалж байна...</p>
        </div>
    )

    if (error) return (
        <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-6 text-center text-destructive">
                <p className="font-bold">Системийн алдаа: {error.message}</p>
            </CardContent>
        </Card>
    )

    const stats = data?.adminStats

    const statCards = [
        { title: "Нийт хэрэглэгч", value: stats?.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
        { title: "Оюутнууд", value: stats?.totalStudents, icon: UserRound, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
        { title: "Компаниуд", value: stats?.totalCompanies, icon: Building2, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
        { title: "Идэвхтэй зар", value: stats?.activeJobs, icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
        { title: "Нийт өргөдөл", value: stats?.totalApplications, icon: ClipboardList, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/30" },
        { title: "Баталгаажуулах", value: stats?.pendingVerifications, icon: ShieldCheck, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/30" },
    ]

    // Pie chart data for user distribution
    const pieData = [
        { name: "Оюутнууд", value: stats?.totalStudents || 0, color: "#10b981" },
        { name: "Компаниуд", value: stats?.totalCompanies || 0, color: "#f59e0b" },
    ]

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight">Аналитик & Тайлан</h1>
                    <p className="text-sm font-bold text-muted-foreground">Системийн өсөлт болон хэрэглэгчийн идэвхийг шинжлэх.</p>
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

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {statCards.map((stat, i) => (
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
                                <h3 className="text-2xl font-black tracking-tight">{stat.value?.toLocaleString() ?? 0}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Today highlight */}
            {(stats?.newUsersToday ?? 0) > 0 && (
                <Card className="border-primary/20 bg-primary/5 rounded-2xl">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">Өнөөдөр <span className="text-primary">{stats?.newUsersToday}</span> шинэ хэрэглэгч бүртгүүлсэн</p>
                            <p className="text-xs text-muted-foreground">Платформын өсөлт үргэлжилж байна</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Growth Chart - Users */}
                <Card className="lg:col-span-2 border-border/60 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="p-6 pb-0">
                        <CardTitle className="text-base font-bold flex items-center gap-2.5">
                            <TrendingUp className="w-4.5 h-4.5 text-primary" />
                            Хэрэглэгчийн өсөлт
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.growthData || []}>
                                    <defs>
                                        <linearGradient id="colorUsersAnalytics" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeOpacity={0.5} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                                            fontSize: '12px',
                                            fontWeight: '700'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#3b82f6"
                                        strokeWidth={2.5}
                                        fillOpacity={1}
                                        fill="url(#colorUsersAnalytics)"
                                        name="Шинэ хэрэглэгч"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Pie Chart - User Distribution */}
                <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="p-6 pb-0">
                        <CardTitle className="text-base font-bold flex items-center gap-2.5">
                            <Users className="w-4.5 h-4.5 text-primary" />
                            Хэрэглэгчийн бүтэц
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                                            fontSize: '12px',
                                            fontWeight: '700'
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        iconType="circle"
                                        iconSize={8}
                                        formatter={(value: string) => (
                                            <span className="text-xs font-bold text-muted-foreground">{value}</span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Applications Bar Chart */}
            <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="p-6 pb-0">
                    <CardTitle className="text-base font-bold flex items-center gap-2.5">
                        <ClipboardList className="w-4.5 h-4.5 text-primary" />
                        Өргөдлийн идэвх
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.growthData || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeOpacity={0.5} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                                        fontSize: '12px',
                                        fontWeight: '700'
                                    }}
                                />
                                <Bar
                                    dataKey="apps"
                                    fill="#8b5cf6"
                                    radius={[8, 8, 0, 0]}
                                    name="Өргөдлүүд"
                                    maxBarSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
