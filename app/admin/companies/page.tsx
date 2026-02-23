"use client"

<<<<<<< HEAD
import React, { useState, useEffect } from "react"
=======
import React, { useState } from "react"
>>>>>>> 89aa8c56af75944ac236664e77278c3f0a92c99b
import { useQuery, useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {
    Building2,
    Search,
<<<<<<< HEAD
    Filter,
    MoreVertical,
    ExternalLink,
    MapPin,
    Globe,
    ShieldCheck,
    ShieldAlert,
    Trash2,
    Eye,
    Plus
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
=======
    MapPin,
    Globe,
    ShieldCheck,
    Plus,
    Loader2
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
>>>>>>> 89aa8c56af75944ac236664e77278c3f0a92c99b
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const GET_ALL_COMPANIES = gql`
  query GetAllCompanies {
    getAllCompanyProfiles {
      id
      companyName
      description
      industry
      location
      logoUrl
      website
      isVerified
      updatedAt
    }
  }
`

const VERIFY_COMPANY = gql`
  mutation VerifyCompany($companyProfileId: ID!) {
    verifyCompany(companyProfileId: $companyProfileId) {
      id
      isVerified
    }
  }
`

interface CompanyProfile {
<<<<<<< HEAD
    id: string;
    companyName: string;
    description: string;
    industry: string;
    location: string;
    logoUrl: string;
    website: string;
    isVerified: boolean;
    updatedAt: string;
}

interface GetAllCompaniesData {
    getAllCompanyProfiles: CompanyProfile[];
}

export default function CompaniesManagementPage() {
    const { data, loading, error, refetch } = useQuery<GetAllCompaniesData>(GET_ALL_COMPANIES)
    console.log(data, "Companies")
    const [verifyCompany] = useMutation(VERIFY_COMPANY)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all") // all, verified, unverified

    const filteredCompanies = (data?.getAllCompanyProfiles || []).filter(company => {
        const matchesSearch = company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesStatus = statusFilter === "all" ||
=======
    id: string
    companyName: string
    description: string
    industry: string
    location: string
    logoUrl: string
    website: string
    isVerified: boolean
    updatedAt: string
}

export default function CompaniesManagementPage() {
    const { data, loading, error, refetch } = useQuery<{
        getAllCompanyProfiles: CompanyProfile[]
    }>(GET_ALL_COMPANIES)

    const [verifyCompany] = useMutation(VERIFY_COMPANY)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const filteredCompanies = (data?.getAllCompanyProfiles || []).filter(company => {
        const name = company.companyName || ""
        const industry = company.industry || ""

        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            industry.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus =
            statusFilter === "all" ||
>>>>>>> 89aa8c56af75944ac236664e77278c3f0a92c99b
            (statusFilter === "verified" && company.isVerified) ||
            (statusFilter === "unverified" && !company.isVerified)

        return matchesSearch && matchesStatus
    })

    const handleVerify = async (id: string) => {
        try {
            await verifyCompany({ variables: { companyProfileId: id } })
            toast.success("Компани амжилттай баталгаажлаа")
            refetch()
        } catch (err: any) {
<<<<<<< HEAD
            toast.error(err.message || "Баталгаажуулахад алдаа гарлаа")
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Компанийн сан</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Платформд бүртгэлтэй бүх компаниудыг удирдах хэсэг.</p>
                </div>
                <Button className="rounded-xl font-bold shadow-lg shadow-primary/20">
=======
            toast.error(err.message || "Алдаа гарлаа")
        }
    }

    if (loading)
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="animate-spin" />
            </div>
        )

    if (error)
        return (
            <div className="p-4 text-destructive">
                Алдаа: {error.message}
            </div>
        )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Компанийн сан</h1>
                    <p className="text-muted-foreground">
                        Платформд бүртгэлтэй компаниудыг удирдах хэсэг.
                    </p>
                </div>
                <Button>
>>>>>>> 89aa8c56af75944ac236664e77278c3f0a92c99b
                    <Plus className="w-4 h-4 mr-2" />
                    Компани нэмэх
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
<<<<<<< HEAD
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Компанийн нэр эсвэл салбараар хайх..."
                        className="pl-10 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-primary font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setStatusFilter("all")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors duration-200 ${statusFilter === 'all' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'}`}
                    >
                        Бүгд
                    </button>
                    <button
                        onClick={() => setStatusFilter("verified")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors duration-200 ${statusFilter === 'verified' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                    >
                        Баталгаажсан
                    </button>
                    <button
                        onClick={() => setStatusFilter("unverified")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors duration-200 ${statusFilter === 'unverified' ? 'bg-white dark:bg-slate-700 text-amber-600 shadow-sm' : 'text-slate-500'}`}
                    >
                        Хүлээгдэж буй
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="animate-pulse border-none shadow-sm h-48 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
                    ))}
                </div>
            ) : filteredCompanies.length === 0 ? (
                <Card className="border-none shadow-sm py-20 flex flex-col items-center justify-center text-center rounded-2xl bg-white dark:bg-slate-900">
                    <Building2 className="w-12 h-12 text-slate-200 mb-4" />
                    <p className="text-slate-500 font-medium">Компани олдсонгүй.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCompanies.map((company) => (
                        <Card key={company.id} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900 rounded-2xl overflow-hidden group">
                            <CardHeader className="p-6 pb-4 border-b border-slate-50 dark:border-slate-800">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                                            {company.logoUrl ? (
                                                <img src={company.logoUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <Building2 className="w-6 h-6 text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-bold truncate max-w-[150px]">{company.companyName}</CardTitle>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{company.industry || "Салбар тодорхойгүй"}</p>
                                        </div>
                                    </div>
                                    {company.isVerified ? (
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-1.5 rounded-lg text-emerald-600">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                    ) : (
                                        <div className="bg-amber-50 dark:bg-amber-900/20 p-1.5 rounded-lg text-amber-600">
                                            <ShieldAlert className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {company.location || "Байршил байхгүй"}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                                        <Globe className="w-3.5 h-3.5" />
                                        {company.website ? (
                                            <a href={company.website} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate">
                                                {company.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        ) : "Вэбсайт байхгүй"}
                                    </div>
                                </div>
                                <div className="pt-2 flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="flex-1 rounded-lg text-[10px] font-bold uppercase h-9">
                                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                                        Үзэх
                                    </Button>
                                    {!company.isVerified && (
                                        <Button
                                            size="sm"
                                            className="flex-1 rounded-lg text-[10px] font-bold uppercase h-9 bg-emerald-600 hover:bg-emerald-700"
                                            onClick={() => handleVerify(company.id)}
                                        >
                                            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
=======
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Компанийн нэрээр хайх..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-md">
                    {["all", "verified", "unverified"].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${statusFilter === status
                                ? "bg-background text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {status === "all"
                                ? "Бүгд"
                                : status === "verified"
                                    ? "Баталгаажсан"
                                    : "Хүлээгдэж буй"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCompanies.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-muted-foreground bg-background rounded-lg border border-dashed text-sm">
                        Компани олдсонгүй.
                    </div>
                ) : (
                    filteredCompanies.map(company => (
                        <Card key={company.id}>
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden border">
                                            {company.logoUrl ? (
                                                <img
                                                    src={company.logoUrl}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Building2 className="w-5 h-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm font-bold">
                                                {company.companyName}
                                            </CardTitle>
                                            <p className="text-[10px] text-muted-foreground uppercase font-medium">
                                                {company.industry || "Салбар тодорхойгүй"}
                                            </p>
                                        </div>
                                    </div>
                                    {company.isVerified && (
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-1 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-rose-500" />
                                        {company.location || "Байршил байхгүй"}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-3 h-3 text-primary" />
                                        <span className="truncate">
                                            {company.website || "Вэбсайт байхгүй"}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2 flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 h-8 text-[10px] font-bold uppercase"
                                    >
                                        Үзэх
                                    </Button>

                                    {!company.isVerified && (
                                        <Button
                                            size="sm"
                                            className="flex-1 h-8 text-[10px] font-bold uppercase bg-emerald-600 hover:bg-emerald-700"
                                            onClick={() => handleVerify(company.id)}
                                        >
>>>>>>> 89aa8c56af75944ac236664e77278c3f0a92c99b
                                            Баталгаажуулах
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
<<<<<<< HEAD
                    ))}
                </div>
            )}
        </div>
    )
}
=======
                    ))
                )}
            </div>
        </div>
    )
}
>>>>>>> 89aa8c56af75944ac236664e77278c3f0a92c99b
