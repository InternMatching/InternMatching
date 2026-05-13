"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, CheckCircle, CheckCircle2, Globe, Loader2 } from "lucide-react"
import { CompanyProfile, CompanyProfileInput } from "@/lib/type"
import { cn } from "@/lib/utils"
import { filterIndustries } from "@/features/company/utils/industries"

type Props = {
    profile?: CompanyProfile | null
    form: CompanyProfileInput
    setForm: React.Dispatch<React.SetStateAction<CompanyProfileInput>>
    autoSaveStatus: "idle" | "saving" | "saved"
    profileInitialized: React.MutableRefObject<boolean>
    logoUploading: boolean
    onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSubmit: (e: React.FormEvent) => void
    onManualSave: () => void
}

export function CompanyProfileTab({
    profile, form, setForm, autoSaveStatus, profileInitialized,
    logoUploading, onLogoUpload, onSubmit, onManualSave,
}: Props) {
    const [industryFocused, setIndustryFocused] = React.useState(false)
    const [industryActiveIndex, setIndustryActiveIndex] = React.useState(0)
    const industryBoxRef = React.useRef<HTMLDivElement | null>(null)

    const industrySuggestions = React.useMemo(
        () => filterIndustries(form.industry || ""),
        [form.industry],
    )

    React.useEffect(() => { setIndustryActiveIndex(0) }, [form.industry])

    React.useEffect(() => {
        if (!industryFocused) return
        const onClick = (e: MouseEvent) => {
            if (industryBoxRef.current && !industryBoxRef.current.contains(e.target as Node)) {
                setIndustryFocused(false)
            }
        }
        document.addEventListener("mousedown", onClick)
        return () => document.removeEventListener("mousedown", onClick)
    }, [industryFocused])

    const selectIndustry = (value: string) => {
        setForm({ ...form, industry: value })
        setIndustryFocused(false)
    }

    const handleIndustryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown" && industrySuggestions.length > 0) {
            e.preventDefault()
            setIndustryActiveIndex(i => (i + 1) % industrySuggestions.length)
        } else if (e.key === "ArrowUp" && industrySuggestions.length > 0) {
            e.preventDefault()
            setIndustryActiveIndex(i => (i - 1 + industrySuggestions.length) % industrySuggestions.length)
        } else if (e.key === "Enter" && industrySuggestions.length > 0 && industryFocused) {
            e.preventDefault()
            selectIndustry(industrySuggestions[industryActiveIndex])
        } else if (e.key === "Escape") {
            setIndustryFocused(false)
        }
    }

    return (
        <Card className="border-border/60 shadow-none rounded-2xl bg-background overflow-hidden font-medium">
            <CardHeader className="p-6 md:p-8 border-b border-border/40 bg-background/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold">Компаний профайл</CardTitle>
                        <CardDescription className="text-sm">Таны мэдээлэл оюутнуудад ажлын зарын хамт харагдах болно.</CardDescription>
                    </div>
                    {profile?.isVerified && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
                            <CheckCircle className="w-3 h-3" />
                            Баталгаажсан
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-5 mb-6 pb-6 border-b border-border/40">
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-2xl bg-secondary/30 border-2 border-border/40 overflow-hidden flex items-center justify-center">
                            {form.logoUrl ? (
                                <Image src={form.logoUrl} alt="Company logo" width={80} height={80} className="object-cover w-full h-full" />
                            ) : (
                                <span className="text-2xl font-black text-primary/40 uppercase">{form.companyName?.[0] || "C"}</span>
                            )}
                        </div>
                        <label htmlFor="logo-upload" className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            {logoUploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
                        </label>
                        <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={onLogoUpload} disabled={logoUploading} />
                    </div>
                    <div>
                        <p className="text-sm font-bold mb-0.5">Компаний лого</p>
                        <p className="text-xs text-muted-foreground font-medium">Лого дээр дарж зураг сонгоно уу</p>
                        <p className="text-[10px] text-muted-foreground/60 font-medium mt-1">PNG, JPG, WEBP · Cloudinary-д хадгалагдана</p>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground ml-0.5">Компаний нэр</Label>
                        <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} placeholder="Компаний нэр" className="h-10 rounded-xl bg-secondary/10 border-border/40 focus:bg-background transition-all" required />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground ml-0.5">Танилцуулга</Label>
                        <Input value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Зорилго, үйл ажиллагааны чиглэл..." className="h-10 rounded-xl bg-secondary/10 border-border/40 focus:bg-background transition-all" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2" ref={industryBoxRef}>
                            <Label className="text-xs font-bold text-muted-foreground ml-0.5">Салбар</Label>
                            <div className="relative">
                                <Input
                                    value={form.industry || ""}
                                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                                    onFocus={() => setIndustryFocused(true)}
                                    onKeyDown={handleIndustryKeyDown}
                                    placeholder="IT, Design, Marketing..."
                                    className="h-10 rounded-xl bg-secondary/10 border-border/40 focus:bg-background transition-all"
                                    autoComplete="off"
                                />
                                {industryFocused && industrySuggestions.length > 0 && (
                                    <div className="absolute z-20 mt-1 w-full rounded-xl border border-border/60 bg-popover shadow-lg overflow-hidden">
                                        {industrySuggestions.map((industry, i) => (
                                            <button
                                                key={industry}
                                                type="button"
                                                onMouseDown={(e) => { e.preventDefault(); selectIndustry(industry) }}
                                                onMouseEnter={() => setIndustryActiveIndex(i)}
                                                className={cn(
                                                    "w-full text-left px-3 py-2 text-sm font-medium transition-colors",
                                                    i === industryActiveIndex ? "bg-secondary/80 text-foreground" : "text-foreground/80 hover:bg-secondary/50",
                                                )}
                                            >
                                                {industry}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground ml-0.5">Байршил</Label>
                            <Input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Улаанбаатар" className="h-10 rounded-xl bg-secondary/10 border-border/40 focus:bg-background transition-all" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground ml-0.5">Вэбсайт</Label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input className="pl-10 h-10 rounded-xl bg-secondary/10 border-border/40 focus:bg-background transition-all" value={form.website || ""} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://example.mn" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground ml-0.5">Байгуулагдсан он</Label>
                            <Input type="number" value={form.foundedYear || ""} onChange={(e) => setForm({ ...form, foundedYear: parseInt(e.target.value) || undefined })} placeholder="Ж нь: 2010" className="h-10 rounded-xl bg-secondary/10 border-border/40 focus:bg-background transition-all" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground ml-0.5">Ажилчдын тоо</Label>
                            <Input type="number" value={form.employeeCount || ""} onChange={(e) => setForm({ ...form, employeeCount: parseInt(e.target.value) || undefined })} placeholder="Ж нь: 50" className="h-10 rounded-xl bg-secondary/10 border-border/40 focus:bg-background transition-all" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground ml-0.5">Уриа үг</Label>
                        <Input value={form.slogan || ""} onChange={(e) => setForm({ ...form, slogan: e.target.value })} placeholder="Компанийн уриа..." className="h-10 rounded-xl bg-secondary/10 border-border/40 focus:bg-background transition-all" />
                    </div>
                    <div className="flex items-center justify-between h-10">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {autoSaveStatus === "saving" && (<><Loader2 className="animate-spin h-4 w-4" /><span>Хадгалж байна...</span></>)}
                            {autoSaveStatus === "saved" && (<><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span className="text-emerald-500">Хадгалагдлаа</span></>)}
                            {autoSaveStatus === "idle" && profileInitialized.current && (
                                <span className="text-muted-foreground/60">Өөрчлөлт автоматаар хадгалагдана</span>
                            )}
                        </div>
                        <Button type="button" onClick={onManualSave} disabled={autoSaveStatus === "saving"} className="h-9 rounded-xl font-bold text-xs px-6">
                            {autoSaveStatus === "saving" ? (<><Loader2 className="animate-spin h-3.5 w-3.5 mr-2" />Хадгалж байна</>) : "Хадгалах"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
