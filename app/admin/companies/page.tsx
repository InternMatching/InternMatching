"use client"

import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {
    Building2,
    Search,
    MapPin,
    Globe,
    ShieldCheck,
    Plus,
    Loader2
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
                    <Plus className="w-4 h-4 mr-2" />
                    Компани нэмэх
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
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
                                            Баталгаажуулах
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}