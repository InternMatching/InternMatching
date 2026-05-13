"use client"

import React, { useMemo, useState } from "react"
import Image from "next/image"
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
    Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
    const [isExiting, setIsExiting] = useState(false)
    const handleBack = () => { setIsExiting(true); setTimeout(() => router.back(), 280) }
    const companyId = params.id as string

    const { data, loading, error, refetch } = useQuery<{ getAllCompanyProfiles: CompanyProfile[] }>(GET_ALL_COMPANIES)
    const [verifyCompany, { loading: verifying }] = useMutation(VERIFY_COMPANY)

    const company = useMemo(() => {
        if (!data?.getAllCompanyProfiles) return null
        return data.getAllCompanyProfiles.find(c => c.id === companyId) || null
    }, [data, companyId])

    const handleVerify = async () => {
        try {
            await verifyCompany({ variables: { companyProfileId: companyId } })
            toast.success("Компани амжилттай баталгаажлаа")
            refetch()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Алдаа гарлаа")
        }
    }

    if (loading) return (
        <div className="space-y-4">
            <div className="h-8 w-16 bg-secondary/20 animate-pulse rounded-lg" />
            <div className="h-28 bg-secondary/10 animate-pulse rounded-2xl" />
            <div className="h-48 bg-secondary/10 animate-pulse rounded-2xl" />
        </div>
    )

    if (error) return (
        <div className="p-4 text-sm text-destructive">Алдаа: {error.message}</div>
    )

    if (!company) return (
        <div className="space-y-4">
            <Button variant="ghost" size="sm" className="rounded-lg" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />Буцах
            </Button>
            <p className="py-20 text-center text-sm text-muted-foreground">Компани олдсонгүй.</p>
        </div>
    )

    return (
        <div className={cn("space-y-4", isExiting && "animate-out fade-out slide-out-to-bottom-2 duration-[280ms]")}>

            {/* Back */}
            <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                <Button variant="ghost" size="sm" className="h-8 px-2 rounded-lg text-muted-foreground hover:text-foreground -ml-2" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-1.5" />Буцах
                </Button>
            </div>

            {/* Profile card */}
            <div className="rounded-2xl border border-border/40 bg-background overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300" style={{ animationDelay: "60ms", animationFillMode: "both" }}>
                <div className="h-0.5 bg-gradient-to-r from-primary/70 via-primary/30 to-transparent" />
                <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-secondary/40 border border-border/40 overflow-hidden flex items-center justify-center shrink-0">
                                {company.logoUrl ? (
                                    <Image src={company.logoUrl} alt={company.companyName} width={56} height={56} className="object-cover w-full h-full" />
                                ) : (
                                    <Building2 className="w-6 h-6 text-muted-foreground/40" />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-lg font-bold leading-tight">{company.companyName}</h1>
                                    {company.isVerified && (
                                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                                    )}
                                </div>
                                {company.industry && (
                                    <p className="text-xs text-muted-foreground mt-0.5">{company.industry}</p>
                                )}
                            </div>
                        </div>

                        {!company.isVerified && (
                            <Button
                                size="sm"
                                className="h-8 rounded-lg text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-700 shrink-0"
                                onClick={handleVerify}
                                disabled={verifying}
                            >
                                {verifying
                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    : <ShieldCheck className="w-3.5 h-3.5" />
                                }
                                Баталгаажуулах
                            </Button>
                        )}
                    </div>

                    {company.slogan && (
                        <p className="mt-4 pt-4 border-t border-border/40 text-sm text-muted-foreground italic">
                            &ldquo;{company.slogan}&rdquo;
                        </p>
                    )}
                </div>
            </div>

            {/* Content card */}
            <div className="rounded-2xl border border-border/40 bg-background divide-y divide-border/40 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: "140ms", animationFillMode: "both" }}>

                {/* Stats */}
                <div className="p-6 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />Байгуулагдсан
                        </p>
                        <p className="text-sm font-semibold">{company.foundedYear ?? "—"}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <Users2 className="w-3 h-3" />Ажилчид
                        </p>
                        <p className="text-sm font-semibold">{company.employeeCount ?? "—"}</p>
                    </div>
                </div>

                {/* Description */}
                <div className="p-6">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Танилцуулга</p>
                    <p className="text-sm leading-relaxed text-foreground/80">
                        {company.description || <span className="italic text-muted-foreground/50">Танилцуулга байхгүй.</span>}
                    </p>
                </div>

                {/* Location + Website */}
                <div className="p-6 space-y-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Холбоо барих</p>
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        </div>
                        <span className="text-sm font-medium">{company.location || "—"}</span>
                    </div>
                    {company.website && (
                        <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 group"
                        >
                            <div className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                                <Globe className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-primary group-hover:underline truncate">{company.website}</span>
                        </a>
                    )}
                </div>
            </div>

        </div>
    )
}
