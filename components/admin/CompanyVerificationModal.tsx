"use client"

import { useState } from "react"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Globe, Calendar, Users, MapPin, Briefcase, Quote, Building2 } from "lucide-react"

interface CompanyProfile {
    id: string
    companyName: string
    description: string
    industry: string
    location: string
    logoUrl: string
    website: string
    isVerified: boolean
    foundedYear: number | null
    employeeCount: number | null
    slogan: string | null
    updatedAt: string
}

interface Props {
    company: CompanyProfile | null
    isOpen: boolean
    onClose: () => void
    onApprove: (companyId: string, companyName: string) => Promise<void>
}

export function CompanyVerificationModal({ company, isOpen, onClose, onApprove }: Props) {
    const [loading, setLoading] = useState(false)

    if (!company) return null

    const handleApprove = async () => {
        setLoading(true)
        try {
            await onApprove(company.id, company.companyName)
            onClose()
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center overflow-hidden border border-border/40 shrink-0">
                            {company.logoUrl ? (
                                <Image src={company.logoUrl} alt={company.companyName} width={40} height={40} className="object-cover w-full h-full" />
                            ) : (
                                <Building2 className="w-5 h-5 text-muted-foreground/50" />
                            )}
                        </div>
                        {company.companyName}
                    </DialogTitle>
                    <DialogDescription>Компанийн баталгаажуулалтын мэдээлэл</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {company.description && (
                        <div className="p-3.5 rounded-xl bg-secondary/20 border border-border/20 text-sm leading-relaxed text-muted-foreground italic">
                            {company.description}
                        </div>
                    )}

                    {company.slogan && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Quote className="w-3.5 h-3.5 text-primary/50 shrink-0" />
                            <span className="italic">&ldquo;{company.slogan}&rdquo;</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-secondary/10 border border-border/20 space-y-1">
                            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />Салбар
                            </p>
                            <p className="text-sm font-bold">{company.industry || "—"}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-secondary/10 border border-border/20 space-y-1">
                            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />Байршил
                            </p>
                            <p className="text-sm font-bold">{company.location || "—"}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-secondary/10 border border-border/20 space-y-1">
                            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />Үүсгэсэн он
                            </p>
                            <p className="text-sm font-bold">{company.foundedYear || "—"}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-secondary/10 border border-border/20 space-y-1">
                            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1">
                                <Users className="w-3 h-3" />Ажилтнууд
                            </p>
                            <p className="text-sm font-bold">{company.employeeCount || "—"}</p>
                        </div>
                    </div>

                    {company.website && (
                        <a
                            href={company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                            <Globe className="w-4 h-4" />
                            {company.website}
                        </a>
                    )}
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Хаах
                    </Button>
                    <Button
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={handleApprove}
                        disabled={loading}
                    >
                        {loading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Хүлээж байна...</> : "Баталгаажуулах"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
