"use client"

import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, User, Camera } from "lucide-react"
import { StudentProfile, StudentProfileInput } from "@/lib/type"
import { cn } from "@/lib/utils"
import { EducationEditor } from "@/features/student/components/EducationEditor"

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
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground ml-0.5">Товч танилцуулга (Bio)</Label>
                        <Input
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Өөрийнхөө тухай товчхон..."
                            className="h-10 rounded-xl bg-secondary/20 border-border/50 focus:bg-background transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground ml-0.5">Ур чадварууд (Таслалаар тусгаарлах)</Label>
                        <Input
                            value={skillsInput}
                            onChange={(e) => {
                                setSkillsInput(e.target.value)
                                setFormData({
                                    ...formData,
                                    skills: e.target.value.split(",").map(s => s.trim()).filter(s => s !== "")
                                })
                            }}
                            placeholder="React, TypeScript, UI/UX..."
                            className="h-10 rounded-xl bg-secondary/20 border-border/50 focus:bg-background transition-all"
                        />
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
                            {autoSaveStatus === "saving" && (
                                <><Loader2 className="animate-spin h-4 w-4" /><span>Хадгалж байна...</span></>
                            )}
                            {autoSaveStatus === "saved" && (
                                <><CheckCircle className="h-4 w-4 text-emerald-500" /><span className="text-emerald-500">Хадгалагдлаа</span></>
                            )}
                            {autoSaveStatus === "idle" && profileInitialized.current && (
                                <span className="text-muted-foreground/60">Өөрчлөлт автоматаар хадгалагдана</span>
                            )}
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
