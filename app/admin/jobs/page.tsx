"use client"

import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {
    Briefcase,
    Search,
    Filter,
    MapPin,
    Clock,
    Building2,
    Trash2,
    Eye,
    Plus,
    CheckCircle2,
    XCircle,
    BadgeAlert
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const GET_ALL_JOBS = gql`
  query GetAllJobs {
    getAllJobs {
      id
      title
      description
      type
      status
      location
      postedAt
      company {
        companyName
        logoUrl
      }
    }
  }
`

const DELETE_JOB = gql`
  mutation DeleteJob($id: ID!) {
    deleteJob(id: $id)
  }
`

interface Job {
    id: string;
    title: string;
    description: string;
    type: string;
    status: string;
    location: string;
    postedAt: string;
    company: {
        companyName: string;
        logoUrl?: string;
    }
}

interface GetAllJobsData {
    getAllJobs: Job[];
}

export default function JobsManagementPage() {
    const { data, loading, error, refetch } = useQuery<GetAllJobsData>(GET_ALL_JOBS)
    const [deleteJob] = useMutation(DELETE_JOB)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all") // all, open, closed

    const filteredJobs = (data?.getAllJobs || []).filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.companyName.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || job.status.toLowerCase() === statusFilter.toLowerCase()

        return matchesSearch && matchesStatus
    })

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`"${title}" ажлын байрыг устгахдаа итгэлтэй байна уу?`)) return

        try {
            await deleteJob({ variables: { id } })
            toast.success("Ажлын байр амжилттай устлаа")
            refetch()
        } catch (err: any) {
            toast.error(err.message || "Устгахад алдаа гарлаа")
        }
    }

    const getStatusBadge = (status: string) => {
        if (status.toLowerCase() === 'open') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-tighter">
                    <CheckCircle2 className="w-3 h-3" />
                    Нээлттэй
                </span>
            )
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-tighter">
                <XCircle className="w-3 h-3" />
                Хаагдсан
            </span>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ажлын зарууд</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Системд нийтлэгдсэн бүх ажлын байрны мэдээллийг хянах хэсэг.</p>
                </div>
                <Button className="rounded-xl font-bold shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4 mr-2" />
                    Шинэ зар нэмэх
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Ажлын нэр эсвэл компаниар хайх..."
                        className="pl-10 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-primary font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setStatusFilter("all")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === 'all' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'}`}
                    >
                        Бүгд
                    </button>
                    <button
                        onClick={() => setStatusFilter("open")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === 'open' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                    >
                        Нээлттэй
                    </button>
                    <button
                        onClick={() => setStatusFilter("closed")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${statusFilter === 'closed' ? 'bg-white dark:bg-slate-700 text-amber-600 shadow-sm' : 'text-slate-500'}`}
                    >
                        Хаагдсан
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : filteredJobs.length === 0 ? (
                <Card className="border-none shadow-sm py-20 flex flex-col items-center justify-center text-center rounded-2xl bg-white dark:bg-slate-900">
                    <Briefcase className="w-12 h-12 text-slate-200 mb-4" />
                    <p className="text-slate-500 font-medium">Ажлын зар олдсонгүй.</p>
                </Card>
            ) : (
                <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900 rounded-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Ажлын байр</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Компани</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Төлөв</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Огноо</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Үйлдэл</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {filteredJobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{job.title}</span>
                                                <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mt-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {job.location}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                                                    {job.company.logoUrl ? (
                                                        <img src={job.company.logoUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Building2 className="w-4 h-4 text-slate-400" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{job.company.companyName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {getStatusBadge(job.status)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(parseInt(job.postedAt) || job.postedAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-xl border border-transparent hover:border-slate-200 shadow-sm">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl border border-transparent hover:border-rose-100 shadow-sm"
                                                    onClick={() => handleDelete(job.id, job.title)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    )
}
