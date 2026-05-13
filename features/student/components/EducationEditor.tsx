"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, XCircle } from "lucide-react"
import { StudentProfileInput } from "@/lib/type"

type Education = NonNullable<StudentProfileInput["education"]>[number]

type Props = {
    education: Education[]
    onChange: (education: Education[]) => void
}

export function EducationEditor({ education, onChange }: Props) {
    const update = (idx: number, patch: Partial<Education>) => {
        const next = [...education]
        next[idx] = { ...next[idx], ...patch }
        onChange(next)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-muted-foreground ml-0.5">Боловсрол</Label>
                {education.length === 0 && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[10px]  uppercase "
                        onClick={() => onChange([{ school: "", degree: "", year: new Date().getFullYear(), status: "studying" }])}
                    >
                        <Plus className="w-3 h-3 mr-1" /> Нэмэх
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                {education.map((edu, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-border/40 bg-secondary/5 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase">Сургууль</Label>
                                <Input value={edu.school} onChange={(e) => update(idx, { school: e.target.value })} placeholder="МУИС, ШУТИС..." className="h-8 rounded-lg text-xs" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase">Мэргэжил / Зэрэг</Label>
                                <Input value={edu.degree} onChange={(e) => update(idx, { degree: e.target.value })} placeholder="Програм хангамж, Бакалавр..." className="h-8 rounded-lg text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase">Төлөв</Label>
                                <select
                                    className="w-full h-8 border rounded-lg px-2 bg-background text-xs font-medium outline-none focus:ring-1 focus:ring-primary"
                                    value={edu.status || "studying"}
                                    onChange={(e) => update(idx, { status: e.target.value as "studying" | "graduated" })}
                                >
                                    <option value="studying">Суралцаж байгаа</option>
                                    <option value="graduated">Төгссөн</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase">
                                    {edu.status === "graduated" ? "Төгссөн он" : "Элссэн он"}
                                </Label>
                                <Input
                                    type="number"
                                    value={edu.year}
                                    onChange={(e) => update(idx, { year: parseInt(e.target.value) || 0 })}
                                    placeholder="2024"
                                    className="h-8 rounded-lg text-xs"
                                />
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full h-8 rounded-lg text-xs font-bold text-destructive hover:bg-red-50 hover:text-red-600 border-destructive/20"
                            onClick={() => onChange(education.filter((_, i) => i !== idx))}
                        >
                            <XCircle className="w-3.5 h-3.5 mr-1.5" /> Боловсрол устгах
                        </Button>
                    </div>
                ))}
                {education.length === 0 && (
                    <p className="text-[11px] text-muted-foreground text-center py-4 bg-secondary/5 rounded-xl border border-dashed border-border/40">
                        Боловсролын мэдээлэл нэмээгүй байна.
                    </p>
                )}
            </div>
        </div>
    )
}
