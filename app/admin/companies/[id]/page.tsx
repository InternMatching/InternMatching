"use client"

import React, { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {
    ArrowLeft,
    Building2,
    MapPin,
    Globe,
    ShieldCheck,
    Calendar,
    Users2,
    Quote,
    Loader2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
      foundedYear
      employeeCount
      slogan
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
    foundedYear?: number
    employeeCount?: number
    slogan?: string
    isVerified: boolean
    updatedAt: string
}

export default function AdminCompanyDetailPage() {
    const params = useParams()
    const router = useRouter()
    const companyId = params.id as string

    const { data, loading, error, refetch } = useQuery<{
        getAllCompanyProfiles: CompanyProfile[]
    }>(GET_ALL_COMPANIES)

    const [verifyCompany] = useMutation(VERIFY_COMPANY)

    const company = useMemo(() => {
        if (!data?.getAllCompanyProfiles) return null
        return data.getAllCompanyProfiles.find(c => c.id === companyId) || null
    }, [data, companyId])

    const handleVerify = async () => {
        try {
            await verifyCompany({ variables: { companyProfileId: companyId } })
            toast.success("Компани амжилттай баталгаажлаа")
            refetch()
        } catch (err: any) {
            toast.error(err.message || "Алдаа гарлаа")
        }
    }

    if (loading) return (
        <div className="flex justify-center p-12">
            <Loader2 className="animate-spin" />
        </div>
    )

    if (error) return (
        <div className="p-4 text-destructive">Алдаа: {error.message}</div>
    )

    if (!company) return (
        <div className="space-y-4">
            <Button variant="ghost" size="sm" className="rounded-xl font-medium" onClick={() => router.push("/admin/companies")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Буцах
            </Button>
            <div className="py-20 text-center text-muted-foreground">
                Компани олдсонгүй.
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => router.push("/admin/companies")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Буцах
                </Button>
                {!company.isVerified && (
                    <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={handleVerify}
                    >
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Баталгаажуулах
                    </Button>
                )}
            </div>

            <Card>
                <CardContent className="p-6 space-y-6">
                    {/* Company Header */}
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center border-2 border-primary/10 overflow-hidden shadow-inner shrink-0">
                            {company.logoUrl ? (
                                <img src={company.logoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <Building2 className="w-8 h-8 text-primary/40" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold">{company.companyName}</h1>
                                {company.isVerified && (
                                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                )}
                            </div>
                            <p className="text-primary font-bold uppercase tracking-widest text-[10px]">
                                {company.industry}
                            </p>
                        </div>
                    </div>

                    {/* Slogan */}
                    {company.slogan && (
                        <div className="flex items-start gap-2 p-4 rounded-xl bg-primary/5 border border-primary/10 italic text-sm text-primary/80">
                            <Quote className="w-4 h-4 shrink-0 fill-primary/10" />
                            <p>&quot;{company.slogan}&quot;</p>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                <Calendar className="w-3 h-3" />
                                Байгуулагдсан
                            </div>
                            <p className="text-lg font-black">{company.foundedYear || "Тодорхойгүй"}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                <Users2 className="w-3 h-3" />
                                Ажилчид
                            </div>
                            <p className="text-lg font-black">{company.employeeCount || "Тодорхойгүй"}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <div className="h-px flex-1 bg-border/40" />
                            Танилцуулга
                            <div className="h-px flex-1 bg-border/40" />
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground/80 font-medium">
                            {company.description || "Танилцуулга байхгүй."}
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <div className="h-px flex-1 bg-border/40" />
                            Холбоо барих
                            <div className="h-px flex-1 bg-border/40" />
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border/40 text-sm font-bold">
                                <MapPin className="w-4 h-4 text-rose-500" />
                                {company.location || "Байршил байхгүй"}
                            </div>
                            {company.website && (
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border/40 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                                >
                                    <Globe className="w-4 h-4" />
                                    {company.website}
                                </a>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
