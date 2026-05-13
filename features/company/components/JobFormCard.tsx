"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, X } from "lucide-react"
import { JobInput, Job } from "@/lib/type"
import { cn } from "@/lib/utils"
import { filterTechSkills } from "@/features/student/utils/techSkills"

type Props = {
    form: JobInput
    setForm: React.Dispatch<React.SetStateAction<JobInput>>
    skillsInput: string
    setSkillsInput: (v: string) => void
    editingJob: Job | null
    submitting: boolean
    isVerified: boolean
    onSubmit: (e: React.FormEvent) => void
    onSaveDraft: (e: React.FormEvent) => void
}

export function JobFormCard({ form, setForm, skillsInput, setSkillsInput, editingJob, submitting, onSubmit, onSaveDraft }: Props) {
    const [skillFocused, setSkillFocused] = React.useState(false)
    const [activeIndex, setActiveIndex] = React.useState(0)
    const skillBoxRef = React.useRef<HTMLDivElement | null>(null)

    const currentSkills = React.useMemo(() => form.requiredSkills || [], [form.requiredSkills])
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
        setForm({ ...form, requiredSkills: [...currentSkills, value] })
        setSkillsInput("")
    }

    const removeSkill = (skill: string) => {
        setForm({ ...form, requiredSkills: currentSkills.filter(s => s !== skill) })
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
                            <Input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Улаанбаатар" className="h-9 rounded-lg bg-background" required />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2" ref={skillBoxRef}>
                        <Label className="text-xs font-bold text-muted-foreground ml-0.5">Ур чадварууд</Label>
                        {currentSkills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {currentSkills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="inline-flex items-center gap-1.5 h-7 pl-3 pr-1.5 rounded-full bg-background text-foreground text-xs font-semibold"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            aria-label={`${skill} устгах`}
                                            className="inline-flex items-center justify-center w-4 h-4 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        <div className="relative">
                            <Input
                                value={skillsInput}
                                onChange={(e) => setSkillsInput(e.target.value)}
                                onFocus={() => setSkillFocused(true)}
                                onKeyDown={handleSkillKeyDown}
                                placeholder="Ур чадвар нэмэх (жишээ нь: React)"
                                className="h-9 rounded-lg bg-background"
                                autoComplete="off"
                            />
                            {skillFocused && suggestions.length > 0 && (
                                <div className="absolute z-20 mt-1 w-full rounded-xl border border-border/60 bg-popover shadow-lg overflow-hidden">
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
                            <select
                                value={form.salaryRange || ""}
                                onChange={(e) => setForm({ ...form, salaryRange: e.target.value })}
                                className="w-full h-9 border rounded-lg px-2 bg-background text-sm font-medium outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Сонгох...</option>
                                <option value="Тохиролцоно">Тохиролцоно</option>
                                <option value="300,000₮ - 500,000₮">300,000₮ - 500,000₮</option>
                                <option value="500,000₮ - 800,000₮">500,000₮ - 800,000₮</option>
                                <option value="800,000₮ - 1,200,000₮">800,000₮ - 1,200,000₮</option>
                                <option value="1,200,000₮ - 1,500,000₮">1,200,000₮ - 1,500,000₮</option>
                                <option value="1,500,000₮ - 2,000,000₮">1,500,000₮ - 2,000,000₮</option>
                                <option value="2,000,000₮+">2,000,000₮+</option>
                            </select>
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
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={submitting}
                            onClick={onSaveDraft}
                            className="flex-1 h-10 rounded-xl font-bold"
                        >
                            {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Ноороглох"}
                        </Button>
                        <Button type="submit" disabled={submitting} className="flex-1 h-10 rounded-xl font-bold">
                            {submitting ? (<><Loader2 className="animate-spin mr-2 h-4 w-4" />{editingJob ? "Шинэчилж байна..." : "Нийтлэж байна..."}</>) : editingJob ? "Шинэчлэх" : "Нийтлэх"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
