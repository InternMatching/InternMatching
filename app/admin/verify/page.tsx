"use client"

import React, { useState, useEffect } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {
    Building2,
    CheckCircle2,
    XCircle,
    Globe,
    MapPin,
    Clock,
    ShieldCheck,
    ExternalLink,
    Loader2,
    ChevronRight,
    SearchX
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const GET_UNVERIFIED_COMPANIES = gql`
  query GetUnverifiedCompanies {
    getAllCompanyProfiles(verifiedOnly: false) {
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

export default function VerificationWorkflowPage() {
    const { data, loading, error, refetch } = useQuery<{ getAllCompanyProfiles: CompanyProfile[] }>(GET_UNVERIFIED_COMPANIES)
    const [verifyCompany, { loading: verifying }] = useMutation(VERIFY_COMPANY)

    const profiles = (data?.getAllCompanyProfiles || []).filter(p => !p.isVerified)

    const handleVerify = async (id: string, name: string) => {
        try {
            await verifyCompany({ variables: { companyProfileId: id } })
            toast.success(`${name} амжилттай баталгаажлаа`)
            refetch()
        } catch (err: any) {
            toast.error(err.message || "Алдаа гарлаа")
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-bold text-muted-foreground animate-pulse">Ачаалж байна...</p>
        </div>
    )

    if (error) return (
        <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-6 text-center text-destructive">
                <p className="font-bold">Алдаа гарлаа: {error.message}</p>
                <Button variant="outline" size="sm" className="mt-4 border-destructive/20 text-destructive hover:bg-destructive/10" onClick={() => refetch()}>Дахин оролдох</Button>
            </CardContent>
        </Card>
    )

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        Баталгаажуулалт
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest font-black ml-1">
                            {profiles.length} хүсэлт
                        </span>
                    </h1>
                    <p className="text-sm font-bold text-muted-foreground">Компаниудын бүртгэлийг хянаж системд нэвтрэхийг зөвшөөрнө.</p>
                </div>
            </div>

            {profiles.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 bg-secondary/10 rounded-3xl border-2 border-dashed border-border/40">
                    <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-lg shadow-secondary/20">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold">Хүлээгдэж буй хүсэлт байхгүй</h3>
                        <p className="text-sm text-muted-foreground font-medium">Бүх компаниуд баталгаажсан байна.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    {profiles.map((company) => (
                        <Card key={company.id} className="group hover:border-primary/40 transition-all border-border/60 shadow-sm rounded-2xl overflow-hidden bg-background">
                            <CardHeader className="p-6 pb-4 flex flex-row items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground overflow-hidden border border-border/40 shadow-sm group-hover:border-primary/20 transition-all shrink-0">
                                    {company.logoUrl ? (
                                        <img src={company.logoUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 className="w-7 h-7 text-muted-foreground/50" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <CardTitle className="text-base font-bold truncate group-hover:text-primary transition-colors">{company.companyName}</CardTitle>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{company.industry || "Салбар"}</span>
                                        <span className="w-1 h-1 rounded-full bg-border/60" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {company.location || "Улаанбаатар"}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-5">
                                <div className="space-y-3">
                                    <div className="p-3.5 rounded-xl bg-secondary/20 border border-border/20 text-xs font-medium leading-relaxed text-muted-foreground/80 line-clamp-2 italic">
                                        {company.description || "Компаний товч танилцуулга оруулаагүй байна."}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {company.website && (
                                                <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest gap-2 text-primary hover:bg-primary/5 px-2" asChild>
                                                    <a href={company.website} target="_blank" rel="noreferrer">
                                                        <Globe className="w-3.5 h-3.5" />
                                                        Вэбсайт руу
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground/50 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(parseInt(company.updatedAt) || Date.parse(company.updatedAt)).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2.5 pt-2">
                                    <Button
                                        className="flex-1 h-9 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/10"
                                        onClick={() => handleVerify(company.id, company.companyName)}
                                        disabled={verifying}
                                    >
                                        Баталгаажуулах
                                    </Button>
                                    <Button variant="outline" className="flex-1 h-9 rounded-xl font-bold text-xs text-destructive hover:bg-red-50 hover:text-red-600 border-border/60">
                                        Татгалзах
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
