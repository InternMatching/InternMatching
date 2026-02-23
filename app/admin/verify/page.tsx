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
    Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

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
    const [verifyCompany] = useMutation(VERIFY_COMPANY)

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

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
    if (error) return <div className="p-4 text-destructive">Алдаа: {error.message}</div>

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Баталгаажуулалт</h1>
                <p className="text-muted-foreground">Компаниудын хүсэлтийг хянаж баталгаажуулна.</p>
            </div>

            {profiles.length === 0 ? (
                <Card className="py-20 flex flex-col items-center justify-center text-center">
                    <ShieldCheck className="w-12 h-12 text-muted-foreground mb-4" />
                    <CardTitle>Хүлээгдэж буй хүсэлт байхгүй</CardTitle>
                    <CardDescription>Бүх компанийн хүсэлтүүд шийдвэрлэгдсэн байна.</CardDescription>
                </Card>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {profiles.map((company) => (
                        <Card key={company.id}>
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground overflow-hidden border">
                                        {company.logoUrl ? (
                                            <img src={company.logoUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 className="w-6 h-6" />
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{company.companyName}</CardTitle>
                                        <p className="text-xs text-muted-foreground">{company.industry || "Салбар тодорхойгүй"}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Globe className="w-4 h-4 text-primary" />
                                        {company.website ? (
                                            <a href={company.website} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate">
                                                {company.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        ) : "Бүртгэлгүй"}
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="w-4 h-4 text-rose-500" />
                                        {company.location || "Тодорхойгүй"}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {company.description || "Тайлбар оруулаагүй байна."}
                                </p>
                                <div className="pt-2 flex gap-3">
                                    <Button
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                        onClick={() => handleVerify(company.id, company.companyName)}
                                    >
                                        Баталгаажуулах
                                    </Button>
                                    <Button variant="outline" className="flex-1 text-destructive hover:bg-destructive/10">
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
