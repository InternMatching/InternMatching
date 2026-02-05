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
    Search,
    AlertCircle,
    FileSearch,
    MailCheck,
    Verified
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

interface GetUnverifiedCompaniesData {
    getAllCompanyProfiles: CompanyProfile[];
}

interface VerifyCompanyData {
    verifyCompany: {
        id: string;
        isVerified: boolean;
    };
}

interface VerifyCompanyVars {
    companyProfileId: string;
}

export default function VerificationWorkflowPage() {
    const { data, loading, error, refetch } = useQuery<GetUnverifiedCompaniesData>(GET_UNVERIFIED_COMPANIES)
    const [verifyCompany] = useMutation<VerifyCompanyData, VerifyCompanyVars>(VERIFY_COMPANY)
    const [profiles, setProfiles] = useState<CompanyProfile[]>([])

    useEffect(() => {
        if (data) {
            // Filter for unverified in case the server logic is permissive
            setProfiles(data.getAllCompanyProfiles.filter((p: CompanyProfile) => !p.isVerified))
        }
    }, [data])

    const handleVerify = async (id: string, name: string) => {
        try {
            await verifyCompany({ variables: { companyProfileId: id } })
            toast.success(`${name} identity verified successfully`)
            refetch()
        } catch (err: any) {
            toast.error(err.message || "Verification sync failed")
        }
    }

    const handleReject = (id: string, name: string) => {
        toast.warning(`Rejection flow triggered for ${name}. Formal rejection requires manual justification (Feature Pending).`)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Баталгаажуулалт</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Платформын итгэлцлийг бий болгохын тулд компаниудын хүсэлтийг хянаж баталгаажуулна.</p>
                </div>
                <div className="bg-amber-100/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-5 py-3 rounded-2xl flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200 dark:shadow-none">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="block text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">Хяналт хүлээгдэж буй</span>
                        <span className="text-2xl font-black text-amber-700 dark:text-amber-400 tabular-nums leading-none">{profiles.length}</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <FileSearch className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
                    </div>
                    <p className="mt-6 text-sm font-bold text-slate-400 uppercase tracking-widest">Бүртгэлүүдийг хянаж байна...</p>
                </div>
            ) : profiles.length === 0 ? (
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 py-24 flex flex-col items-center justify-center text-center rounded-3xl">
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600 mb-6 group hover:scale-110 transition-transform cursor-pointer">
                        <Verified className="w-10 h-10" />
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 dark:text-white mt-2">Хүлээгдэж буй хүсэлт байхгүй</CardTitle>
                    <CardDescription className="max-w-md mt-3 text-slate-500 font-medium leading-relaxed">
                        Бүх компанийн бүртгэлийн хүсэлтүүдийг шийдвэрлэсэн байна. Шинэ хүсэлтүүд энд автоматаар гарч ирнэ.
                    </CardDescription>
                </Card>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {profiles.map((company) => (
                        <Card key={company.id} className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-3xl">
                            <CardHeader className="p-8 border-b border-slate-50 dark:border-slate-800/50">
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-xl group-hover:scale-110 transition-transform">
                                            {company.logoUrl ? (
                                                <img src={company.logoUrl} alt={company.companyName} className="w-full h-full object-cover" />
                                            ) : (
                                                <Building2 className="w-9 h-9 opacity-50" />
                                            )}
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors tracking-tight">{company.companyName}</CardTitle>
                                            <p className="text-sm text-slate-400 font-bold uppercase tracking-tight mt-1">{company.industry || "Ерөнхий салбар"}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-extrabold text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em] mb-1">Хүсэлт илгээсэн</p>
                                        <p className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg inline-block">
                                            {new Date(parseInt(company.updatedAt) || company.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 shadow-sm inline-block">Цахим хаяг</p>
                                        {company.website ? (
                                            <a
                                                href={company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-bold text-primary hover:text-indigo-600 transition-colors flex items-center gap-1.5 group/link bg-indigo-50/30 dark:bg-indigo-900/10 px-3 py-1.5 rounded-xl w-fit"
                                            >
                                                {company.website.replace(/^https?:\/\//, '')}
                                                <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                            </a>
                                        ) : (
                                            <span className="text-sm text-slate-400 italic font-medium">Бүртгэлгүй</span>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Төв оффис</p>
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-300">
                                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                            {company.location || "Тодорхойгүй"}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Зорилго, чиглэл</p>
                                    <p className="text-[13px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                                        {company.description || "Компани бүртгүүлэх үедээ тайлбар мэдээлэл оруулаагүй байна."}
                                    </p>
                                </div>

                                <div className="pt-6 flex items-center gap-4">
                                    <Button
                                        className="flex-1 rounded-2xl h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest shadow-xl shadow-emerald-200 dark:shadow-none border-none group transition-all"
                                        onClick={() => handleVerify(company.id, company.companyName)}
                                    >
                                        <MailCheck className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
                                        Баталгаажуулах
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 rounded-2xl h-12 border-slate-200 dark:border-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 font-bold transition-all"
                                        onClick={() => handleReject(company.id, company.companyName)}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Татгалзах
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Guidelines Footer */}
            <div className="p-6 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-3xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-black text-blue-900 dark:text-blue-300 uppercase tracking-tight">Хяналтын хуудас болон журамд нийцэх байдал</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-xs text-blue-800 dark:text-blue-400 font-medium list-disc list-inside">
                        <li>Албан ёсны домэйн хаяг болон SSL сертификатыг шалгах.</li>
                        <li>Салбарын үзүүлэлтүүдийг татварын бүртгэлтэй харьцуулах.</li>
                        <li>Лого болон брендинг материалуудыг зохиогчийн эрхэд нийцэж буй эсэхийг хянах.</li>
                        <li>Татгалзсан тохиолдолд тодорхой шалтгаан, засах зааварчилгаа өгөх.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
