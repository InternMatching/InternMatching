"use client"

import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {
    Briefcase,
    Search,
    MapPin,
    Clock,
    Trash2,
    Eye,
    Plus,
    Loader2,
    Building2
} from "lucide-react"
import { Card } from "@/components/ui/card"
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

export default function JobsManagementPage() {
    const { data, loading, error, refetch } = useQuery<{ getAllJobs: Job[] }>(GET_ALL_JOBS)
    const [deleteJob] = useMutation(DELETE_JOB)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const filteredJobs = (data?.getAllJobs || []).filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || job.status.toLowerCase() === statusFilter.toLowerCase()
        return matchesSearch && matchesStatus
    })

    const handleDelete = async (id: string) => {
        if (!confirm(`Энэ ажлын зарыг устгахдаа итгэлтэй байна уу?`)) return

        try {
            await deleteJob({ variables: { id } })
            toast.success("Ажлын байр амжилттай устлаа")
            refetch()
        } catch (err: any) {
            toast.error(err.message || "Устгахад алдаа гарлаа")
        }
    }

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
    if (error) return <div className="p-4 text-destructive">Алдаа: {error.message}</div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Ажлын зарууд</h1>
                    <p className="text-muted-foreground">Системд нийтлэгдсэн бүх ажлын байрны мэдээлэл.</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Шинэ зар нэмэх
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Ажлын нэрээр хайх..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-md">
                    {['all', 'open', 'closed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${statusFilter === status
                                ? 'bg-background text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {status === 'all' ? 'Бүгд' : status === 'open' ? 'Нээлттэй' : 'Хаагдсан'}
                        </button>
                    ))}
                </div>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-secondary/20">
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Ажлын байр</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Компани</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Төлөв</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Үйлдэл</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredJobs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground">
                                        Ажлын зар олдсонгүй.
                                    </td>
                                </tr>
                            ) : (
                                filteredJobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-secondary/10 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{job.title}</span>
                                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                    <MapPin className="w-3 h-3 text-rose-500" />
                                                    {job.location}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">{job.company.companyName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-secondary'}`}>
                                                {job.status === 'open' ? 'Нээлттэй' : 'Хаагдсан'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                    onClick={() => handleDelete(job.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
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
