"use client"

import React from "react"
import Image from "next/image"
import { useMutation } from "@apollo/client/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, User, Camera, X, FileText, Sparkles, Check } from "lucide-react"
import { StudentProfile, StudentProfileInput, CVParseResult } from "@/lib/type"
import { cn } from "@/lib/utils"
import { EducationEditor } from "@/features/student/components/EducationEditor"
import { filterTechSkills } from "@/features/student/utils/techSkills"
import { PARSE_CV } from "@/features/student/graphql/student.mutations"
import { toast } from "sonner"

type Props = {
    profile?: StudentProfile | null
    formData: StudentProfileInput
    setFormData: React.Dispatch<React.SetStateAction<StudentProfileInput>>
    skillsInput: string
    setSkillsInput: (v: string) => void
    autoSaveStatus: "idle" | "saving" | "saved"
    profileInitialized: React.MutableRefObject<boolean>
    uploadingPicture: boolean
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSubmit: (e: React.FormEvent) => void
    onManualSave: () => void
}

export function StudentProfileTab({
    profile,
    formData,
    setFormData,
    skillsInput,
    setSkillsInput,
    autoSaveStatus,
    profileInitialized,
    uploadingPicture,
    onImageUpload,
    onSubmit,
    onManualSave,
}: Props) {
    const [skillFocused, setSkillFocused] = React.useState(false)
    const [activeIndex, setActiveIndex] = React.useState(0)
    const skillBoxRef = React.useRef<HTMLDivElement | null>(null)
    const cvInputRef = React.useRef<HTMLInputElement>(null)

    // CV parsing state
    const [parsedCV, setParsedCV] = React.useState<CVParseResult | null>(null)
    const [showCVPreview, setShowCVPreview] = React.useState(false)
    const [parseCV, { loading: parsingCV }] = useMutation<{ parseCV: CVParseResult }>(PARSE_CV)

    const handleCVFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.type !== "application/pdf") { toast.error("Зөвхөн PDF файл оруулна уу"); return }
        if (file.size > 5 * 1024 * 1024) { toast.error("Файлын хэмжээ 5MB-аас бага байх ёстой"); return }

        const reader = new FileReader()
        reader.onloadend = async () => {
            try {
                const { data } = await parseCV({ variables: { base64PDF: reader.result as string } })
                if (data?.parseCV) {
                    setParsedCV(data.parseCV)
                    setShowCVPreview(true)
                }
            } catch (err: unknown) {
                const code = (err as { graphQLErrors?: { extensions?: { code?: string } }[] })
                    ?.graphQLErrors?.[0]?.extensions?.code
                if (code === "CV_PARSE_LIMIT_EXCEEDED") {
                    toast.error("Өдөрт CV задлах хязгаарт хүрлээ. Маргааш дахин оролдоно уу.", {
                        description: "Өдөрт хамгийн ихдээ 3 удаа CV задлах боломжтой.",
                    })
                } else {
                    toast.error("CV задлахад алдаа гарлаа. PDF файл зөв форматтай эсэхийг шалгана уу.")
                }
            }
        }
        reader.readAsDataURL(file)
        // Reset input so same file can be re-selected
        e.target.value = ""
    }

    const applyParsedCV = () => {
        if (!parsedCV) return
        setFormData(prev => ({
            ...prev,
            ...(parsedCV.firstName && { firstName: parsedCV.firstName }),
            ...(parsedCV.lastName && { lastName: parsedCV.lastName }),
            ...(parsedCV.bio && { bio: parsedCV.bio }),
            ...(parsedCV.skills.length > 0 && {
                skills: Array.from(new Set([...prev.skills || [], ...parsedCV.skills]))
            }),
            ...(parsedCV.education.length > 0 && { education: parsedCV.education }),
            ...(parsedCV.experienceLevel && { experienceLevel: parsedCV.experienceLevel }),
        }))
        toast.success("CV-ийн мэдээлэл профайлд нэмэгдлээ!")
        setShowCVPreview(false)
        setParsedCV(null)
    }

    const currentSkills = React.useMemo(() => formData.skills || [], [formData.skills])
    const suggestions = React.useMemo(
        () => filterTechSkills(skillsInput, currentSkills),
        [skillsInput, currentSkills],
    )

    React.useEffect(() => { setActiveIndex(0) }, [skillsInput])

    React.useEffect(() => {
        if (!skillFocused) return
        const onClick = (e: MouseEvent) => {
            if (skillBoxRef.current && !skillBoxRef.current.contains(e.target as Node)) {
                setSkillFocused(false)
            }
        }
        document.addEventListener("mousedown", onClick)
        return () => document.removeEventListener("mousedown", onClick)
    }, [skillFocused])

    const addSkill = (skill: string) => {
        const value = skill.trim()
        if (!value) return
        const exists = currentSkills.some(s => s.toLowerCase() === value.toLowerCase())
        if (exists) {
            setSkillsInput("")
            return
        }
        setFormData({ ...formData, skills: [...currentSkills, value] })
        setSkillsInput("")
    }

    const removeSkill = (skill: string) => {
        setFormData({
            ...formData,
            skills: currentSkills.filter(s => s !== skill),
        })
    }

    const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown" && suggestions.length > 0) {
            e.preventDefault()
            setActiveIndex(i => (i + 1) % suggestions.length)
        } else if (e.key === "ArrowUp" && suggestions.length > 0) {
            e.preventDefault()
            setActiveIndex(i => (i - 1 + suggestions.length) % suggestions.length)
        } else if (e.key === "Enter") {
            e.preventDefault()
            if (suggestions.length > 0) {
                addSkill(suggestions[activeIndex])
            } else if (skillsInput.trim()) {
                addSkill(skillsInput)
            }
        } else if (e.key === "Backspace" && skillsInput === "" && currentSkills.length > 0) {
            removeSkill(currentSkills[currentSkills.length - 1])
        } else if (e.key === "Escape") {
            setSkillFocused(false)
        }
    }

    return (
        <Card className="border-border/60 shadow-none rounded-2xl bg-background">
            <CardHeader className="p-6 md:p-8 border-b border-border/40 mb-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-2">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-3xl bg-secondary/30 flex items-center justify-center border-2 border-border/50 overflow-hidden shadow-inner">
                            {profile?.profilePictureUrl ? (
                                <Image src={profile.profilePictureUrl} alt="Profile" width={96} height={96} className="object-cover w-full h-full" />
                            ) : (
                                <User className="w-10 h-10 text-muted-foreground/40" />
                            )}
                            {uploadingPicture && (
                                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                </div>
                            )}
                        </div>
                        <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-primary/20 hover:scale-110 transition-transform">
                            <Camera className="w-4 h-4 text-primary-foreground" />
                            <input type="file" className="hidden" accept="image/*" onChange={onImageUpload} disabled={uploadingPicture} />
                        </label>
                    </div>
                    <div className="space-y-1 flex-1">
                        <CardTitle className="text-xl font-bold">Хувийн мэдээлэл</CardTitle>
                        <CardDescription className="text-sm italic">Дадлага хийх хүсэлт гаргахад таны энэ мэдээлэл компаниудад очих болно.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">{formData.isActivelyLooking !== false ? "Идэвхтэй" : "Идэвхгүй"}</span>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, isActivelyLooking: !prev.isActivelyLooking }))}
                            className={cn(
                                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                                formData.isActivelyLooking !== false ? "bg-primary" : "bg-secondary"
                            )}
                        >
                            <span className={cn(
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                                formData.isActivelyLooking !== false ? "translate-x-5" : "translate-x-0"
                            )} />
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
                {/* CV Parse Button */}
                <div className="mb-6">
                    <input ref={cvInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleCVFileChange} />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 font-bold"
                        onClick={() => cvInputRef.current?.click()}
                        disabled={parsingCV}
                    >
                        {parsingCV
                            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />CV задлаж байна...</>
                            : <><Sparkles className="w-3.5 h-3.5" />CV-ээс автоматаар бөглөх</>
                        }
                    </Button>
                    <p className="text-[11px] text-muted-foreground mt-1.5 ml-0.5">
                        PDF форматтай CV оруулснаар профайлын талбарууд автоматаар бөглөгдөнө.{" "}
                        <span className="text-primary/70 font-medium">Өдөрт хамгийн ихдээ 3 удаа.</span>
                    </p>
                </div>

                {/* CV Preview Panel */}
                <div className={`grid transition-all duration-300 ease-in-out mb-6 ${showCVPreview ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                        <div className="rounded-2xl border border-primary/20 bg-primary/3 p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <FileText className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <p className="text-sm font-semibold">CV-ийн задлалт</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setShowCVPreview(false); setParsedCV(null) }}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            {parsedCV && (
                                <div className="space-y-3 text-sm">
                                    {(parsedCV.firstName || parsedCV.lastName) && (
                                        <div className="flex items-start gap-2">
                                            <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                            <span className="text-muted-foreground">Нэр: <span className="text-foreground font-medium">{[parsedCV.firstName, parsedCV.lastName].filter(Boolean).join(" ")}</span></span>
                                        </div>
                                    )}
                                    {parsedCV.bio && (
                                        <div className="flex items-start gap-2">
                                            <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                            <span className="text-muted-foreground">Танилцуулга: <span className="text-foreground font-medium line-clamp-2">{parsedCV.bio}</span></span>
                                        </div>
                                    )}
                                    {parsedCV.skills.length > 0 && (
                                        <div className="flex items-start gap-2">
                                            <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                            <span className="text-muted-foreground">Ур чадвар: <span className="text-foreground font-medium">{parsedCV.skills.slice(0, 6).join(", ")}{parsedCV.skills.length > 6 ? ` +${parsedCV.skills.length - 6}` : ""}</span></span>
                                        </div>
                                    )}
                                    {parsedCV.education.length > 0 && (
                                        <div className="flex items-start gap-2">
                                            <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                            <span className="text-muted-foreground">Боловсрол: <span className="text-foreground font-medium">{parsedCV.education.map(e => `${e.degree} — ${e.school}`).join("; ")}</span></span>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="flex gap-2 pt-1 border-t border-primary/10">
                                <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs" onClick={() => { setShowCVPreview(false); setParsedCV(null) }}>Цуцлах</Button>
                                <Button size="sm" className="h-8 rounded-lg text-xs font-bold gap-1.5" onClick={applyParsedCV}>
                                    <Sparkles className="w-3 h-3" />Профайлд нэмэх
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground ml-0.5">Овог</Label>
                            <Input
                                value={formData.lastName || ""}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                placeholder="Овог"
                                className="h-10 rounded-xl bg-secondary/20 border-border/50 focus:bg-background transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-muted-foreground ml-0.5">Нэр</Label>
                            <Input
                                value={formData.firstName || ""}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                placeholder="Нэр"
                                className="h-10 rounded-xl bg-secondary/20 border-border/50 focus:bg-background transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Label className="text-xs font-bold text-muted-foreground ml-0.5">Товч танилцуулга (Bio)</Label>
                        <Input
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Өөрийнхөө тухай товчхон..."
                            className="h-10 rounded-xl bg-secondary/20 border-border/50 focus:bg-background transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-4" ref={skillBoxRef}>
                        <Label className="text-xs font-bold text-muted-foreground ml-0.5 ">Ур чадваруд</Label>
                        {currentSkills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {currentSkills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="inline-flex items-center gap-1.5 h-7 pl-3 pr-1.5 rounded-full bg-secondary/60 text-foreground text-xs font-semibold"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            aria-label={`${skill} устгах`}
                                            className="inline-flex items-center justify-center w-4 h-4 rounded-full text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="relative  mb-2 ">
                            <Input
                                value={skillsInput}
                                onChange={(e) => setSkillsInput(e.target.value)}
                                onFocus={() => setSkillFocused(true)}
                                onKeyDown={handleSkillKeyDown}
                                placeholder="Ур чадвар нэмэх (жишээ нь: React)"
                                className="h-10 rounded-xl bg-secondary/20 border-border/50 focus:bg-background transition-all"
                                autoComplete="off"
                            />
                            {skillFocused && suggestions.length > 0 && (
                                <div className="absolute z-20 mt-1 w-full rounded-xl border border-border/60 bg-popover shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                                    {suggestions.map((skill, i) => (
                                        <button
                                            key={skill}
                                            type="button"
                                            onMouseDown={(e) => { e.preventDefault(); addSkill(skill) }}
                                            onMouseEnter={() => setActiveIndex(i)}
                                            className={cn(
                                                "w-full text-left px-3 py-2 text-sm font-medium transition-colors",
                                                i === activeIndex ? "bg-secondary/80 text-foreground" : "text-foreground/80 hover:bg-secondary/50",
                                            )}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground ml-0.5">Түвшин</Label>
                        <select
                            className="w-full h-10 rounded-xl bg-secondary/20 border border-border/50 focus:bg-background transition-all px-3 text-sm font-medium outline-none focus:ring-1 focus:ring-primary"
                            value={formData.experienceLevel}
                            onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as StudentProfileInput["experienceLevel"] })}
                        >
                            <option value="intern">Интерн</option>
                        </select>
                    </div>

                    <EducationEditor
                        education={formData.education || []}
                        onChange={(education) => setFormData({ ...formData, education })}
                    />

                    <div className="flex items-center justify-between h-10">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span key={autoSaveStatus} className="flex items-center gap-2 animate-in fade-in duration-200">
                                {autoSaveStatus === "saving" && (
                                    <><Loader2 className="animate-spin h-4 w-4" /><span>Хадгалж байна...</span></>
                                )}
                                {autoSaveStatus === "saved" && (
                                    <><CheckCircle className="h-4 w-4 text-emerald-500" /><span className="text-emerald-500">Хадгалагдлаа</span></>
                                )}
                                {autoSaveStatus === "idle" && profileInitialized.current && (
                                    <span className="text-muted-foreground/60">Өөрчлөлт автоматаар хадгалагдана</span>
                                )}
                            </span>
                        </div>
                        <Button
                            type="button"
                            onClick={onManualSave}
                            disabled={autoSaveStatus === "saving"}
                            className="h-9 rounded-xl font-bold text-xs px-6"
                        >
                            {autoSaveStatus === "saving" ? (
                                <><Loader2 className="animate-spin h-3.5 w-3.5 mr-2" />Хадгалж байна</>
                            ) : "Хадгалах"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
