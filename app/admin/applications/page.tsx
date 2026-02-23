"use client"

import React, { useState } from "react"
import { useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {
    ClipboardList,
    Search,
    Building2,
    Eye,
    CheckCircle2,
    XCircle,
    Timer,
    Loader2,
    UserCircle
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

export default function ApplicationsManagementPage() {
    const { data, loading, error } = useQuery<{ getAllApplications: Application[] }>(GET_ALL_APPLICATIONS)
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

    const getStatusLabel = (status: string) => {
        switch (status.toLowerCase()) {
            case 'applied': return 'Илгээсэн'
            case 'reviewing': return 'Хянаж буй'
            case 'accepted': return 'Зөвшөөрсөн'
            case 'rejected': return 'Татгалзсан'
            default: return status
        }
    }

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
    if (error) return <div className="p-4 text-destructive">Алдаа: {error.message}</div>

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Өргөдлийн жагсаалт</h1>
                <p className="text-muted-foreground">Системээр дамжсан бүх ажлын өргөдлүүдийг хянах хэсэг.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Оюутан, ажил эсвэл компаниар хайх..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-md overflow-x-auto">
                    {['all', 'applied', 'reviewing', 'accepted', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${statusFilter === status
                                ? 'bg-background text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {status === 'all' ? 'Бүгд' : getStatusLabel(status)}
                        </button>
                    ))}
                </div>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-secondary/20">
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Оюутан</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Ажил / Компани</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Таарамж</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Төлөв</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Үйлдэл</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredApps.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground">
                                        Өргөдөл олдсонгүй.
                                    </td>
                                </tr>
                            ) : (
                                filteredApps.map((app) => (
                                    <tr key={app.id} className="hover:bg-secondary/10 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <UserCircle className="w-5 h-5 text-muted-foreground" />
                                                <span className="text-sm font-medium">{app.student?.firstName} {app.student?.lastName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{app.job.title}</span>
                                                <span className="text-[11px] text-muted-foreground">{app.job.company.companyName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${app.matchScore > 80 ? 'bg-green-500' : 'bg-primary'}`}
                                                        style={{ width: `${app.matchScore}%` }}
                                                    />
                                                </div>
                                                <span className="text-[11px] font-bold">{app.matchScore}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-secondary">
                                                {getStatusLabel(app.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
