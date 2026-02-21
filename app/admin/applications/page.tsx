"use client"

import React, { useState } from "react"
import { useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {
    ClipboardList,
    Search,
    Filter,
    Clock,
    User,
    Briefcase,
    Building2,
    Eye,
    CheckCircle2,
    XCircle,
    Timer,
    Zap
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const GET_ALL_APPLICATIONS = gql`
  query GetAllApplications {
    getAllApplications {
      id
      status
      appliedAt
      matchScore
      job {
        title
        company {
          companyName
        }
      }
      student {
        firstName
        lastName
      }
    }
  }
`

interface Application {
    id: string;
    status: string;
    appliedAt: string;
    matchScore: number;
    job: {
        title: string;
        company: {
            companyName: string;
        }
    };
    student: {
        firstName?: string;
        lastName?: string;
    };
}

interface GetAllApplicationsData {
    getAllApplications: Application[];
}

export default function ApplicationsManagementPage() {
    const { data, loading, error } = useQuery<GetAllApplicationsData>(GET_ALL_APPLICATIONS)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const filteredApps = (data?.getAllApplications || []).filter(app => {
        const studentName = `${app.student?.firstName || ""} ${app.student?.lastName || ""}`.toLowerCase()
        const matchesSearch = studentName.includes(searchTerm.toLowerCase()) ||
            app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.job.company.companyName.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || app.status.toLowerCase() === statusFilter.toLowerCase()

        return matchesSearch && matchesStatus
    })

    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case 'applied':
                return { label: 'Илгээсэн', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: ClipboardList }
            case 'reviewing':
                return { label: 'Хянаж буй', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Timer }
            case 'interview_scheduled':
                return { label: 'Ярилцлага товлосон', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: User }
            case 'accepted':
                return { label: 'Зөвшөөрсөн', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 }
            case 'rejected':
                return { label: 'Татгалзсан', color: 'bg-rose-100 text-rose-700 border-rose-200', icon: XCircle }
            default:
                return { label: status, color: 'bg-slate-100 text-slate-700 border-slate-200', icon: ClipboardList }
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Өргөдлийн жагсаалт</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Системээр дамжсан бүх ажлын өргөдлүүдийг хянах хэсэг.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Оюутан, ажил эсвэл компаниар хайх..."
                        className="pl-10 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-primary font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto">
                    {['all', 'applied', 'reviewing', 'accepted', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all whitespace-nowrap ${statusFilter === status
                                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            {status === 'all' ? 'Бүгд' : getStatusConfig(status).label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : filteredApps.length === 0 ? (
                <Card className="border-none shadow-sm py-20 flex flex-col items-center justify-center text-center rounded-2xl bg-white dark:bg-slate-900">
                    <ClipboardList className="w-12 h-12 text-slate-200 mb-4" />
                    <p className="text-slate-500 font-medium">Өргөдөл олдсонгүй.</p>
                </Card>
            ) : (
                <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900 rounded-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Оюутан</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Ажлын байр</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Таарамж</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Төлөв</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Үйлдэл</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {filteredApps.map((app) => {
                                    const statusConfig = getStatusConfig(app.status)
                                    return (
                                        <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase shadow-sm">
                                                        {(app.student?.firstName?.[0] || "U")}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                                                        {app.student?.firstName} {app.student?.lastName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-1">{app.job.title}</span>
                                                    <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                                        <Building2 className="w-3 h-3" />
                                                        {app.job.company.companyName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${app.matchScore > 80 ? 'bg-emerald-500' : app.matchScore > 50 ? 'bg-amber-500' : 'bg-slate-400'}`}
                                                            style={{ width: `${app.matchScore}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[11px] font-black text-slate-500">{app.matchScore}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight border shadow-sm ${statusConfig.color}`}>
                                                    <statusConfig.icon className="w-3 h-3" />
                                                    {statusConfig.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-xl border border-transparent hover:border-slate-200 shadow-sm transition-all">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    )
}
