"use client"

import React, { useEffect, useState } from "react"
import { useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {
    Users,
    UserRound,
    Building2,
    Briefcase,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Clock,
    ExternalLink,
    ShieldCheck,
    ClipboardList,
    ChevronLeft,
    TrendingDown,
    Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from "recharts"

const ADMIN_STATS = gql`
  query AdminStats {
    adminStats {
      totalUsers
      totalStudents
      totalCompanies
      activeJobs
      totalApplications
      pendingVerifications
      newUsersToday
    }
  }
`

interface AdminStats {
    totalUsers: number;
    totalStudents: number;
    totalCompanies: number;
    activeJobs: number;
    totalApplications: number;
    pendingVerifications: number;
    newUsersToday: number;
}

interface AdminStatsData {
    adminStats: AdminStats;
}

const mockGrowthData = [
    { name: 'Дав', users: 120, apps: 80 },
    { name: 'Мяг', users: 180, apps: 110 },
    { name: 'Лха', users: 150, apps: 140 },
    { name: 'Пүр', users: 220, apps: 190 },
    { name: 'Баа', users: 300, apps: 250 },
    { name: 'Бям', users: 250, apps: 200 },
    { name: 'Ням', users: 320, apps: 280 },
]

export default function AdminDashboardPage() {
    const { data, loading, error } = useQuery<AdminStatsData>(ADMIN_STATS)
    const [stats, setStats] = useState<AdminStats | null>(null)

    useEffect(() => {
        if (data) {
            setStats(data.adminStats)
        }
    }, [data])

    interface MetricCardProps {
        title: string;
        value: number | undefined;
        icon: React.ElementType;
        trend?: "up" | "down";
        trendValue?: string;
        color: string;
    }

    const MetricCard = ({ title, value, icon: Icon, trend, trendValue, color }: MetricCardProps) => (
        <Card className="overflow-hidden border-none shadow-sm transition-all duration-300 hover:shadow-lg group bg-white dark:bg-slate-900">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 transition-transform group-hover:scale-110`}>
                        <Icon className={`w-7 h-7 ${color.replace('bg-', 'text-')}`} />
                    </div>
                    {trend && (
                        <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-rose-600 bg-rose-50 dark:bg-rose-900/20'
                            }`}>
                            {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                            {trendValue}
                        </div>
                    )}
                </div>
                <div className="mt-5">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
                        {loading ? "..." : value?.toLocaleString() || 0}
                    </h3>
                </div>
            </CardContent>
            <div className={`h-1.5 w-full ${color}`}></div>
        </Card>
    )

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Системийн тойм</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Платформын ерөнхий мэдээлэл болон бодит цагийн үзүүлэлтүүд.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white font-bold h-11 px-6 shadow-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        Шууд дамжуулалт
                    </Button>
                    <Button className="rounded-xl shadow-xl shadow-primary/20 h-11 px-6 font-bold">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Гүйцэтгэлийн тайлан
                    </Button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Нийт хэрэглэгчид"
                    value={stats?.totalUsers}
                    icon={Users}
                    trend="up"
                    trendValue="+14%"
                    color="bg-blue-600"
                />
                <MetricCard
                    title="Оюутны нөөц"
                    value={stats?.totalStudents}
                    icon={UserRound}
                    trend="up"
                    trendValue="+9%"
                    color="bg-emerald-600"
                />
                <MetricCard
                    title="Баталгаажсан компаниуд"
                    value={stats?.totalCompanies}
                    icon={Building2}
                    trend="up"
                    trendValue="+5%"
                    color="bg-amber-500"
                />
                <MetricCard
                    title="Идэвхтэй ажлын байр"
                    value={stats?.activeJobs}
                    icon={Briefcase}
                    trend="up"
                    trendValue="+21%"
                    color="bg-indigo-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Chart */}
                <Card className="lg:col-span-2 border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-8 border-b border-slate-50 dark:border-slate-800/50">
                        <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary" />
                                Өсөлтийн хурд
                            </CardTitle>
                            <CardDescription className="text-sm font-medium">Бүртгэл болон өргөдлийн тооны өөрчлөлтийг харьцуулах</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
                            <button className="px-3 py-1 text-xs font-bold rounded-lg bg-white dark:bg-slate-700 shadow-sm text-primary">Өдрөөр</button>
                            <button className="px-3 py-1 text-xs font-medium rounded-lg text-slate-500 hover:text-slate-700">Долоо хоногоор</button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-10">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={mockGrowthData}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '16px',
                                            border: 'none',
                                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                            padding: '12px 16px',
                                            fontWeight: 'bold'
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
                                    <Area
                                        type="monotone"
                                        dataKey="apps"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorApps)"
                                        name="Ажлын өргөдөл"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Feed */}
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
                    <CardHeader className="border-b border-slate-50 dark:border-slate-800/50">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-indigo-500" />
                            Шууд үйлдлүүд
                        </CardTitle>
                        <CardDescription className="text-xs font-medium uppercase tracking-wider text-slate-400">Түүхчилсэн бүртгэл</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                        <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                            {[
                                { user: "Дорж Баяр", action: "Оюутнаар бүртгүүллээ", time: "2 мин өмнө", icon: UserRound, color: "text-emerald-500 bg-emerald-50" },
                                { user: "Tech LLC", action: "Баталгаажуулах хүсэлт илгээлээ", time: "5 мин өмнө", icon: ShieldCheck, color: "text-amber-500 bg-amber-50" },
                                { user: "React Dev", action: "Шинэ ажлын байр зарлагдлаа", time: "10 мин өмнө", icon: Briefcase, color: "text-indigo-500 bg-indigo-50" },
                                { user: "Startup MN", action: "Компани баталгаажлаа", time: "1 цаг өмнө", icon: Building2, color: "text-blue-500 bg-blue-50" },
                                { user: "Сарнай Очир", action: "Tech LLC-д өргөдөл илгээлээ", time: "3 цаг өмнө", icon: ClipboardList, color: "text-purple-500 bg-purple-50" },
                                { user: "Систем", action: "Системийн нөөцлөлт амжилттай", time: "5 цаг өмнө", icon: Activity, color: "text-slate-500 bg-slate-100" },
                            ].map((activity, idx) => (
                                <div key={idx} className="flex gap-4 group cursor-pointer relative z-10">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 border-white dark:border-slate-900 transition-transform group-hover:scale-110 shadow-sm ${activity.color}`}>
                                        <activity.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 space-y-0.5">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">
                                                {activity.user}
                                            </p>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{activity.time}</span>
                                        </div>
                                        <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">{activity.action}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <div className="p-4 border-t border-slate-50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-800/30">
                        <Button variant="ghost" className="w-full text-xs font-extrabold uppercase tracking-widest text-slate-500 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all">
                            Үйлдлийн бүртгэлийг бүхлээр нь харах
                            <ArrowUpRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Verification Alert Footer */}
            {(stats?.pendingVerifications ?? 0) > 0 && (
                <div className="p-6 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-200 dark:border-amber-900/30 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200 dark:shadow-none animate-pulse">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white">Анхаарал хандуулах үйлдлүүд</h4>
                            <p className="text-slate-600 dark:text-slate-400 font-medium">Хяналт хүлээгдэж буй <span className="text-amber-600 font-bold">{stats?.pendingVerifications} компани</span> байна.</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => (window as any).location.href = "/admin/verify"}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-12 px-8 rounded-2xl shadow-xl shadow-amber-200 dark:shadow-none border-none group transition-all hover:translate-x-1"
                    >
                        Баталгаажуулах хэсэг рүү очих
                        <ChevronLeft className="w-5 h-5 ml-2 rotate-180" />
                    </Button>
                </div>
            )}
        </div>
    )
}