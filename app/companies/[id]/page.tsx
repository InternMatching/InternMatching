"use client"

import React, { useMemo, useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {
    ArrowLeft, Building2, MapPin, Globe,
    ShieldCheck, Calendar, Users2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const GET_ALL_COMPANIES = gql`
  query GetAllCompaniesPublic {
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
    }
  }
`

interface CompanyProfile {
    id: string
    companyName: string
    description?: string
    industry?: string
    location?: string
    logoUrl?: string
    website?: string
    foundedYear?: number
    employeeCount?: number
    slogan?: string
    isVerified: boolean
}

export default function CompanyDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [isExiting, setIsExiting] = useState(false)
    const handleBack = () => { setIsExiting(true); setTimeout(() => router.back(), 280) }
    const companyId = params.id as string

    const { data, loading } = useQuery<{ getAllCompanyProfiles: CompanyProfile[] }>(GET_ALL_COMPANIES)

    const company = useMemo(() => {
        if (!data?.getAllCompanyProfiles) return null
        return data.getAllCompanyProfiles.find(c => c.id === companyId) || null
    }, [data, companyId])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
                <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
                    <div className="h-8 w-16 bg-secondary/20 animate-pulse rounded-lg" />
                    <div className="h-28 bg-secondary/10 animate-pulse rounded-2xl" />
                    <div className="h-48 bg-secondary/10 animate-pulse rounded-2xl" />
                </div>
            </div>
        )
    }

    if (!company) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] flex items-center justify-center">
                <div className="text-center space-y-3">
                    <Building2 className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                    <p className="text-sm font-medium text-muted-foreground">Компани олдсонгүй</p>
                    <Button variant="outline" size="sm" className="rounded-xl" onClick={handleBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" />Буцах
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]", isExiting && "animate-out fade-out slide-out-to-bottom-2 duration-[280ms]")}>
            <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">

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
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    {company.industry && (
                                        <span className="text-xs text-muted-foreground">{company.industry}</span>
                                    )}
                                    {company.location && (
                                        <>
                                            {company.industry && <span className="text-muted-foreground/40 text-xs">·</span>}
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <MapPin className="w-3 h-3" />{company.location}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
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
                    {(company.foundedYear || company.employeeCount) && (
                        <div className="p-6 grid grid-cols-2 gap-4">
                            {company.foundedYear && (
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" />Байгуулагдсан
                                    </p>
                                    <p className="text-sm font-semibold">{company.foundedYear}</p>
                                </div>
                            )}
                            {company.employeeCount && (
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                        <Users2 className="w-3 h-3" />Ажилчид
                                    </p>
                                    <p className="text-sm font-semibold">{company.employeeCount}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    {company.description && (
                        <div className="p-6">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Танилцуулга</p>
                            <p className="text-sm leading-relaxed text-foreground/80">{company.description}</p>
                        </div>
                    )}

                    {/* Contact */}
                    {(company.location || company.website) && (
                        <div className="p-6 space-y-3">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Холбоо барих</p>
                            {company.location && (
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                    </div>
                                    <span className="text-sm font-medium">{company.location}</span>
                                </div>
                            )}
                            {company.website && (
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 group">
                                    <div className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                                        <Globe className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium text-primary group-hover:underline truncate">{company.website}</span>
                                </a>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
