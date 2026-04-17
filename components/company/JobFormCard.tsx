"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { JobInput, Job } from "@/lib/type"

type Props = {
    form: JobInput
    setForm: React.Dispatch<React.SetStateAction<JobInput>>
    skillsInput: string
    setSkillsInput: (v: string) => void
    editingJob: Job | null
    submitting: boolean
    onSubmit: (e: React.FormEvent) => void
}

export function JobFormCard({ form, setForm, skillsInput, setSkillsInput, editingJob, submitting, onSubmit }: Props) {
    return (
        <Card className="border-primary/20 bg-primary/5 shadow-none rounded-2xl animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg">{editingJob ? `"${editingJob.title}" зарыг засах` : "Шинэ дадлагын зар нэмэх"}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-muted-foreground ml-0.5">Зарны нэр</Label>
                            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ж нь: Web Developer" className="h-9 rounded-lg bg-background" required />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-muted-foreground ml-0.5">Байршил</Label>
                            <Input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Улаанбаатар эсвэл Гэрээс" className="h-9 rounded-lg bg-background" required />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-muted-foreground ml-0.5">Ур чадварууд (Таслалаар)</Label>
                        <Input
                            value={skillsInput}
                            onChange={(e) => {
                                setSkillsInput(e.target.value)
                                setForm({ ...form, requiredSkills: e.target.value.split(",").map(s => s.trim()).filter(s => s !== "") })
                            }}
                            placeholder="React, CSS, SQL..."
                            className="h-9 rounded-lg bg-background"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-muted-foreground ml-0.5">Төрөл</Label>
                            <select
                                className="w-full h-9 border rounded-lg px-2 bg-background text-sm font-medium outline-none focus:ring-1 focus:ring-primary"
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value as JobInput["type"] })}
                            >
                                <option value="intern">Интерн</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-muted-foreground ml-0.5">Цалин / Мэдээлэл</Label>
                            <Input value={form.salaryRange || ""} onChange={(e) => setForm({ ...form, salaryRange: e.target.value })} placeholder="800k - 1.5M эсвэл Тохиролцоно" className="h-9 rounded-lg bg-background" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-muted-foreground ml-0.5">Дуусах хугацаа</Label>
                            <Input type="date" value={form.deadline || ""} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="h-9 rounded-lg bg-background" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-muted-foreground ml-0.5">Хүлээн авах тоо</Label>
                            <Input type="number" min={1} value={form.maxParticipants ?? ""} onChange={(e) => setForm({ ...form, maxParticipants: e.target.value ? parseInt(e.target.value) : undefined })} placeholder="Ж нь: 5" className="h-9 rounded-lg bg-background" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-muted-foreground ml-0.5">Гүйцэтгэх үндсэн үүрэг</Label>
                        <textarea value={form.responsibilities || ""} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} placeholder="Ажлын байрны үүрэг хариуцлага..." className="w-full min-h-[100px] border rounded-lg p-3 bg-background text-sm outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-muted-foreground ml-0.5">Дадлагат тавигдах шаардлага</Label>
                        <textarea value={form.requirements || ""} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="Мэргэжил, туршлага, ур чадвар..." className="w-full min-h-[100px] border rounded-lg p-3 bg-background text-sm outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-muted-foreground ml-0.5">Нэмэлт мэдээлэл</Label>
                        <textarea value={form.additionalInfo || ""} onChange={(e) => setForm({ ...form, additionalInfo: e.target.value })} placeholder="Бусад зүйлс..." className="w-full min-h-[80px] border rounded-lg p-3 bg-background text-sm outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full h-10 rounded-xl font-bold">
                        {submitting ? (<><Loader2 className="animate-spin mr-2 h-4 w-4" />{editingJob ? "Шинэчилж байна..." : "Оруулж байна..."}</>) : editingJob ? "Шинэчлэх" : "Нийтлэх"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
