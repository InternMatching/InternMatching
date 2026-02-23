"use client"

import React from "react"
import { useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {
    History,
    Search,
<<<<<<< HEAD
    Filter,
    Clock,
=======
    Loader2,
    Activity,
>>>>>>> 89aa8c56af75944ac236664e77278c3f0a92c99b
    UserRound,
    Building2,
    Briefcase,
    ClipboardList,
<<<<<<< HEAD
    ShieldCheck,
    Activity,
    Download
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
=======
    ShieldCheck
} from "lucide-react"
import { Card } from "@/components/ui/card"
>>>>>>> 89aa8c56af75944ac236664e77278c3f0a92c99b
import { Input } from "@/components/ui/input"

const GET_LOGS = gql`
  query GetLogs {
    adminStats {
      recentActivities {
        id
        user
        action
        timestamp
        type
      }
    }
  }
`

<<<<<<< HEAD
interface GetLogsData {
    adminStats: {
        recentActivities: Array<{
            id: string;
            user: string;
            action: string;
            timestamp: string;
            type: string;
        }>;
    };
}

export default function LogsPage() {
    const { data, loading } = useQuery<GetLogsData>(GET_LOGS, {
=======
export default function LogsPage() {
    const { data, loading } = useQuery<{ adminStats: { recentActivities: any[] } }>(GET_LOGS, {
>>>>>>> 89aa8c56af75944ac236664e77278c3f0a92c99b
        pollInterval: 10000
    })

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'STUDENT_SIGNUP':
            case 'STUDENT_PROFILE_CREATED':
<<<<<<< HEAD
                return { icon: UserRound, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" };
            case 'COMPANY_SIGNUP':
                return { icon: ShieldCheck, color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20" };
            case 'COMPANY_PROFILE_CREATED':
                return { icon: Building2, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20" };
            case 'JOB_POSTED':
                return { icon: Briefcase, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" };
            case 'APPLICATION_SUBMITTED':
                return { icon: ClipboardList, color: "text-purple-500 bg-purple-50 dark:bg-purple-900/20" };
            default:
                return { icon: Activity, color: "text-slate-500 bg-slate-50 dark:bg-slate-800/50" };
=======
                return UserRound;
            case 'COMPANY_SIGNUP':
                return ShieldCheck;
            case 'COMPANY_PROFILE_CREATED':
                return Building2;
            case 'JOB_POSTED':
                return Briefcase;
            case 'APPLICATION_SUBMITTED':
                return ClipboardList;
            default:
                return Activity;
>>>>>>> 89aa8c56af75944ac236664e77278c3f0a92c99b
        }
    };

    const activities = data?.adminStats?.recentActivities || []

<<<<<<< HEAD
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Үйлдлийн бүртгэл</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Систем дээр хийгдсэн бүх үйлдлүүдийн түүх.</p>
                </div>
                <Button variant="outline" className="rounded-xl font-bold border-slate-200">
                    <Download className="w-4 h-4 mr-2" />
                    Бүртгэл татах
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Хэрэглэгч эсвэл үйлдлээр хайх..."
                        className="pl-10 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-primary font-medium"
                    />
                </div>
                <Button variant="outline" className="rounded-xl font-bold border-slate-200">
                    <Filter className="w-4 h-4 mr-2" />
                    Шүүлтүүр
                </Button>
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900 rounded-3xl">
                <CardHeader className="border-b border-slate-50 dark:border-slate-800 p-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <History className="w-5 h-5 text-primary" />
                        Сүүлийн 100 үйлдэл
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Төрөл</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Хэрэглэгч</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Үйлдэл</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Огноо</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                            Ачааллаж байна...
                                        </td>
                                    </tr>
                                ) : activities.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-slate-400 font-medium">
                                            Үйлдэл бүртгэгдээгүй байна.
                                        </td>
                                    </tr>
                                ) : (
                                    activities.map((log: any) => {
                                        const config = getActivityIcon(log.type)
                                        return (
                                            <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${config.color}`}>
                                                        <config.icon className="w-5 h-5" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{log.user}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{log.action}</span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                            {new Date(log.timestamp).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-medium">
                                                            {new Date(log.timestamp).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
=======
    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Үйлдлийн бүртгэл</h1>
                <p className="text-muted-foreground">Систем дээр хийгдсэн сүүлийн үйлдлүүд.</p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Хэрэглэгч эсвэл үйлдлээр хайх..." className="pl-10" />
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-secondary/20">
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Төрөл</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Хэрэглэгч</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Үйлдэл</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Огноо</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {activities.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground">
                                        Бүртгэл байхгүй байна.
                                    </td>
                                </tr>
                            ) : (
                                activities.map((log) => {
                                    const Icon = getActivityIcon(log.type)
                                    return (
                                        <tr key={log.id} className="hover:bg-secondary/10 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary">
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium">{log.user}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-muted-foreground">{log.action}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex flex-col items-end text-xs">
                                                    <span className="font-bold">{new Date(log.timestamp).toLocaleDateString()}</span>
                                                    <span className="text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
>>>>>>> 89aa8c56af75944ac236664e77278c3f0a92c99b
            </Card>
        </div>
    )
}
