"use client"

import React, { useState, useMemo } from "react"
import { useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"
import { useRouter } from "next/navigation"
import {

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

const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers { id email role }
  }
`

const GET_ALL_STUDENT_PROFILES = gql`
  query GetAllStudentProfiles {
    getAllStudentProfiles { id userId }
  }
`

const GET_ALL_COMPANIES = gql`
  query GetAllCompanies {
    getAllCompanyProfiles { id userId }
  }
`

interface Activity {
    id: string
    user: string
    action: string
    timestamp: string
    type: string
}

export default function LogsPage() {
    const { data, loading } = useQuery<{ adminStats: { recentActivities: Activity[] } }>(GET_LOGS, {
        pollInterval: 10000
    })
    const { data: usersData } = useQuery<{ getAllUsers: { id: string; email: string; role: string }[] }>(GET_ALL_USERS)
    const { data: studentData } = useQuery<{ getAllStudentProfiles: { id: string; userId: string }[] }>(GET_ALL_STUDENT_PROFILES)
    const { data: companyData } = useQuery<{ getAllCompanyProfiles: { id: string; userId: string }[] }>(GET_ALL_COMPANIES)
    const router = useRouter()

    const emailToUrl = useMemo(() => {
        const userMap: Record<string, { id: string; role: string }> = {}
        usersData?.getAllUsers?.forEach(u => { userMap[u.email] = { id: u.id, role: u.role } })

        const profileMap: Record<string, string> = {}
        studentData?.getAllStudentProfiles?.forEach(p => { profileMap[p.userId] = `/students/${p.id}` })
        companyData?.getAllCompanyProfiles?.forEach(p => { profileMap[p.userId] = `/admin/companies/${p.id}` })

        const result: Record<string, string> = {}
        Object.entries(userMap).forEach(([email, { id }]) => {
            if (profileMap[id]) result[email] = profileMap[id]
        })
        return result
    }, [usersData, studentData, companyData])

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

    const [searchQuery, setSearchQuery] = useState("")

    const filteredActivities = useMemo(() => {
        const activities = data?.adminStats?.recentActivities || []
        if (!searchQuery.trim()) return activities
        const q = searchQuery.toLowerCase()
        return activities.filter((log: Activity) =>
            log.user?.toLowerCase().includes(q) ||
            log.action?.toLowerCase().includes(q) ||
            log.type?.toLowerCase().includes(q)
        )
    }, [data, searchQuery])

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Үйлдлийн бүртгэл</h1>
                <p className="text-muted-foreground">Систем дээр хийгдсэн сүүлийн үйлдлүүд.</p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Хэрэглэгч эсвэл үйлдлээр хайх..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
                            {filteredActivities.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground">
                                        {searchQuery ? "Хайлтад тохирох үр дүн олдсонгүй." : "Бүртгэл байхгүй байна."}
                                    </td>
                                </tr>
                            ) : (
                                filteredActivities.map((log: Activity) => {
                                    const Icon = getActivityIcon(log.type)
                                    return (
                                        <tr key={log.id} className={`hover:bg-primary/5 transition-colors ${emailToUrl[log.user] ? 'cursor-pointer' : ''}`} onClick={() => { const url = emailToUrl[log.user]; if (url) router.push(url) }}>
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
                                                    {(() => {
                                                        const d = new Date(isNaN(Number(log.timestamp)) ? log.timestamp : Number(log.timestamp));
                                                        const valid = !isNaN(d.getTime());
                                                        return <>
                                                            <span className="font-bold">{valid ? d.toLocaleDateString() : "Тодорхойгүй"}</span>
                                                            {valid && <span className="text-muted-foreground">{d.toLocaleTimeString()}</span>}
                                                        </>
                                                    })()}
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
