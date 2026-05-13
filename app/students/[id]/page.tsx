"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation } from "@apollo/client/react"
import { GET_ALL_STUDENT_PROFILES } from "@/features/student/graphql/student.queries"
import { ME } from "@/features/auth/graphql/auth.queries"
import { GET_INVITATIONS } from "@/features/invitations/graphql/invitations.queries"
import { SEND_INVITATION } from "@/features/invitations/graphql/invitations.mutations"
import { StudentProfile, User, Invitation } from "@/lib/type"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
    ArrowLeft,
    UserCircle,
    Zap,
    GraduationCap,
    Send,
    CheckCircle2,
    Loader2,
    Mail,
    Clock,
} from "lucide-react"

const LEVEL_LABEL: Record<string, string> = {
    intern: "Интерн",
    junior: "Жуниор",
    mid: "Дунд түвшин",
    senior: "Сениор",
}

export default function StudentDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [isExiting, setIsExiting] = useState(false)
    const handleBack = () => { setIsExiting(true); setTimeout(() => router.back(), 280) }
    const studentId = params.id as string
    const [inviteMessage, setInviteMessage] = useState("")
    const [showMessage, setShowMessage] = useState(false)

    const { data: userData } = useQuery<{ me: User }>(ME)
    const isCompany = userData?.me?.role?.toLowerCase() === "company"

    const { data, loading } = useQuery<{ getAllStudentProfiles: StudentProfile[] }>(GET_ALL_STUDENT_PROFILES)
    const { data: invitationsData } = useQuery<{ getInvitations: Invitation[] }>(GET_INVITATIONS, { skip: !isCompany })

    const [sendInvitation, { loading: sending }] = useMutation(SEND_INVITATION, {
        refetchQueries: [{ query: GET_INVITATIONS }],
    })

    const student = data?.getAllStudentProfiles?.find((s) => s.id === studentId)
    const existing = invitationsData?.getInvitations?.find((inv) => inv.studentProfileId === studentId)
    const alreadyInvited = existing?.status === "pending"
    const inviteAccepted = existing?.status === "accepted"

    const handleSend = async () => {
        try {
            await sendInvitation({ variables: { studentProfileId: studentId, message: inviteMessage || null } })
            toast.success("Урилга амжилттай илгээгдлээ!")
            setShowMessage(false)
            setInviteMessage("")
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Урилга илгээхэд алдаа гарлаа")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
                <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
                    <div className="h-8 w-16 bg-secondary/20 animate-pulse rounded-lg" />
                    <div className="h-32 bg-secondary/10 animate-pulse rounded-2xl" />
                    <div className="h-24 bg-secondary/10 animate-pulse rounded-2xl" />
                    <div className="h-20 bg-secondary/10 animate-pulse rounded-2xl" />
                </div>
            </div>
        )
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] flex items-center justify-center">
                <div className="text-center space-y-3">
                    <UserCircle className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                    <p className="text-sm font-medium text-muted-foreground">Оюутан олдсонгүй</p>
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
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        Буцах
                    </Button>
                </div>

                {/* Profile card */}
                <div className="rounded-2xl border border-border/40 bg-background overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300" style={{ animationDelay: "60ms", animationFillMode: "both" }}>
                    {/* Accent bar */}
                    <div className="h-0.5 bg-gradient-to-r from-primary/70 via-primary/30 to-transparent" />

                    <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            {/* Avatar + identity */}
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/10 overflow-hidden flex items-center justify-center shrink-0">
                                    {student.profilePictureUrl ? (
                                        <Image src={student.profilePictureUrl} alt={student.firstName || ""} width={56} height={56} className="object-cover w-full h-full" />
                                    ) : (
                                        <UserCircle className="w-7 h-7 text-primary/40" />
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold leading-tight">
                                        {student.firstName} {student.lastName}
                                    </h1>
                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                        <span className="text-xs text-muted-foreground font-medium">
                                            {(student.experienceLevel ? LEVEL_LABEL[student.experienceLevel] : null) || student.experienceLevel}
                                        </span>
                                        {student.isActivelyLooking && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-200/60">
                                                <Zap className="w-2.5 h-2.5" />
                                                Идэвхтэй хайж байна
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Invite button */}
                            {isCompany && (
                                <div className="shrink-0">
                                    {alreadyInvited ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/80">
                                            <Clock className="w-3.5 h-3.5" />
                                            Урилга илгээсэн
                                        </span>
                                    ) : inviteAccepted ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/80">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Зөвшөөрсөн
                                        </span>
                                    ) : (
                                        <Button size="sm" className="h-8 rounded-lg text-xs font-bold gap-1.5" onClick={() => setShowMessage(v => !v)}>
                                            <Send className="w-3.5 h-3.5" />
                                            Урих
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Invite message panel */}
                        <div className={`grid transition-all duration-300 ease-in-out ${showMessage ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden">
                                <div className="pt-4 mt-4 border-t border-border/40 space-y-3">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Урилгын мессеж <span className="font-normal normal-case tracking-normal opacity-60">(заавал биш)</span></p>
                                    <textarea
                                        placeholder="Танд манай компанид дадлага хийх урилга илгээж байна..."
                                        className="w-full rounded-xl border border-border/50 bg-secondary/20 resize-none p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all"
                                        rows={3}
                                        value={inviteMessage}
                                        onChange={(e) => setInviteMessage(e.target.value)}
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs" onClick={() => { setShowMessage(false); setInviteMessage("") }}>
                                            Болих
                                        </Button>
                                        <Button size="sm" className="h-8 rounded-lg text-xs font-bold gap-1.5" onClick={handleSend} disabled={sending}>
                                            {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                            Илгээх
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content sections */}
                <div className="rounded-2xl border border-border/40 bg-background divide-y divide-border/40 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: "140ms", animationFillMode: "both" }}>

                    {/* Bio */}
                    <div className="p-6">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Миний тухай</p>
                        <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                            {student.bio || <span className="text-muted-foreground/50 italic">Танилцуулга оруулаагүй байна.</span>}
                        </p>
                    </div>

                    {/* Skills */}
                    <div className="p-6">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Ур чадварууд</p>
                        {student.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                                {student.skills.map((skill, i) => (
                                    <span key={i} className="px-2.5 py-1 rounded-lg bg-primary/8 text-primary text-xs font-medium border border-primary/12">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground/50 italic">Ур чадвар оруулаагүй байна.</p>
                        )}
                    </div>

                    {/* Education */}
                    {student.education && student.education.length > 0 && (
                        <div className="p-6">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
                                <GraduationCap className="w-3.5 h-3.5" />
                                Боловсрол
                            </p>
                            <div className="space-y-4">
                                {student.education.map((edu, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                        <div>
                                            <p className="text-sm font-bold leading-tight">{edu.school}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{edu.degree}</p>
                                            <p className="text-[10px] text-primary/60 font-medium mt-0.5">{edu.year} он</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contact */}
                    {student.user?.email && (
                        <div className="p-6">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Холбоо барих</p>
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Mail className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="text-sm font-medium">{student.user.email}</span>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
