"use client"

import React from "react"
import { useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {
    History,
    Search,
    Loader2,
    Activity,
    UserRound,
    Building2,
    Briefcase,
    ClipboardList,
    ShieldCheck
} from "lucide-react"
import { Card } from "@/components/ui/card"
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

export default function LogsPage() {
    const { data, loading } = useQuery<{ adminStats: { recentActivities: any[] } }>(GET_LOGS, {
        pollInterval: 10000
    })

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'STUDENT_SIGNUP':
            case 'STUDENT_PROFILE_CREATED':
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
        }
    };

    const activities = data?.adminStats?.recentActivities || []

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
            </Card>
        </div>
    )
}
