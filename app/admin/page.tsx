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

<<<<<<< HEAD
    interface MetricCardProps {
        title: string;
        value: number | undefined;
        icon: React.ElementType;
        trend?: "up" | "down";
        trendValue?: string;
        color: string;
    }

    const MetricCard = ({ title, value, icon: Icon, trend, trendValue, color }: MetricCardProps) => (
        <Card className="overflow-hidden border-none shadow-sm transition-shadow duration-300 hover:shadow-lg group bg-white dark:bg-slate-900">
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
=======
    const stats = data?.adminStats
>>>>>>> 89aa8c56af75944ac236664e77278c3f0a92c99b

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
<<<<<<< HEAD
                <Card className="lg:col-span-2 border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
                    <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-50 dark:border-slate-800/50">
                        <div className="text-center sm:text-left">
                            <CardTitle className="text-lg sm:text-xl font-bold flex items-center justify-center sm:justify-start gap-2">
                                <Activity className="w-5 h-5 text-primary" />
                                Өсөлтийн хурд
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm font-medium">Регистр болон өргөдлийн тоон өөрчлөлт</CardDescription>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                            <button
                                onClick={() => setPeriod("DAILY")}
                                className={`flex-1 sm:flex-none px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors duration-200 whitespace-nowrap ${period === 'DAILY' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Өдрөөр
                            </button>
                            <button
                                onClick={() => setPeriod("WEEKLY")}
                                className={`flex-1 sm:flex-none px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-lg transition-colors duration-200 whitespace-nowrap ${period === 'WEEKLY' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Долоо хоногоор
                            </button>
                        </div>
=======
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Өсөлтийн хурд
                        </CardTitle>
>>>>>>> 89aa8c56af75944ac236664e77278c3f0a92c99b
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
<<<<<<< HEAD
                                    <div key={activity.id} className="flex gap-4 group cursor-pointer relative z-10">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 border-white dark:border-slate-900 transition-transform duration-200 group-hover:scale-110 shadow-sm ${config.color}`}>
                                            <config.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 space-y-0.5 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors duration-200 truncate">
                                                    {activity.user}
                                                </p>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter shrink-0">
                                                    {formatRelativeTime(activity.timestamp)}
                                                </span>
                                            </div>
                                            <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2">{activity.action}</p>
=======
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
>>>>>>> 89aa8c56af75944ac236664e77278c3f0a92c99b
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
<<<<<<< HEAD
                    <div className="p-4 border-t border-slate-50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-800/30">
                        <Button variant="ghost" className="w-full text-[10px] font-extrabold uppercase tracking-widest text-slate-500 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors duration-200 h-10">
                            Бүгдийг харах
                            <ArrowUpRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Verification Alert Footer */}
            {(stats?.pendingVerifications ?? 0) > 0 && (
                <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-200 dark:border-amber-900/30 rounded-2xl sm:rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-sm">
                    <div className="flex items-center gap-4 sm:gap-5 w-full md:w-auto">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200 dark:shadow-none animate-pulse shrink-0">
                            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">Анхаарал хандуулах</h4>
                            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 font-medium line-clamp-1">
                                <span className="text-amber-600 font-bold">{stats?.pendingVerifications} компани</span> хүлээгдэж байна.
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => (window as any).location.href = "/admin/verify"}
                        className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold h-11 sm:h-12 px-6 sm:px-8 rounded-xl sm:rounded-2xl shadow-xl shadow-amber-200 dark:shadow-none border-none group transition-opacity duration-200"
                    >
                        Одоо очих
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 ml-2 rotate-180" />
                    </Button>
                </div>
            )}
=======
                </Card>
            </div>
>>>>>>> 89aa8c56af75944ac236664e77278c3f0a92c99b
        </div>
    )
}