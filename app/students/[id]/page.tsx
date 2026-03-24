"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation } from "@apollo/client/react"
import { GET_ALL_STUDENT_PROFILES, ME, SEND_INVITATION, GET_INVITATIONS } from "../../graphql/mutations"
import { StudentProfile, User, Invitation } from "@/lib/type"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { toast } from "sonner"
import {
    ArrowLeft,
    UserCircle,
    Zap,
    Briefcase,
    Clock,
    GraduationCap,
    Send,
    CheckCircle,
    Loader2,
    Mail,
    Phone,
} from "lucide-react"

export default function StudentDetailPage() {
    const params = useParams()
    const router = useRouter()
    const studentId = params.id as string
    const [inviteMessage, setInviteMessage] = useState("")
    const [showMessageInput, setShowMessageInput] = useState(false)

    const { data: userData } = useQuery<{ me: User }>(ME)
    const isCompany = userData?.me?.role?.toLowerCase() === "company"

    const { data, loading } = useQuery<{ getAllStudentProfiles: StudentProfile[] }>(
        GET_ALL_STUDENT_PROFILES
    )

    const { data: invitationsData } = useQuery<{ getInvitations: Invitation[] }>(
        GET_INVITATIONS,
        { skip: !isCompany }
    )

    const [sendInvitation, { loading: sendingInvitation }] = useMutation(SEND_INVITATION, {
        refetchQueries: [{ query: GET_INVITATIONS }],
    })

    const student = data?.getAllStudentProfiles?.find((s) => s.id === studentId)

    const existingInvitation = invitationsData?.getInvitations?.find(
        (inv) => inv.studentProfileId === studentId
    )
    const alreadyInvited = existingInvitation?.status === "pending"
    const invitationAccepted = existingInvitation?.status === "accepted"

    const handleSendInvitation = async () => {
        try {
            await sendInvitation({
                variables: {
                    studentProfileId: studentId,
                    message: inviteMessage || null,
                },
            })
            toast.success("Урилга амжилттай илгээгдлээ!")
            setShowMessageInput(false)
            setInviteMessage("")
        } catch (err: any) {
            toast.error(err.message || "Урилга илгээхэд алдаа гарлаа")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
                <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                    <div className="h-8 w-20 bg-secondary/20 animate-pulse rounded-xl" />
                    <div className="h-32 bg-secondary/10 animate-pulse rounded-2xl" />
                    <div className="h-10 w-48 bg-secondary/20 animate-pulse rounded-xl mt-16" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 bg-secondary/10 animate-pulse rounded-2xl" />
                        <div className="h-24 bg-secondary/10 animate-pulse rounded-2xl" />
                    </div>
                    <div className="h-32 bg-secondary/10 animate-pulse rounded-2xl" />
                    <div className="h-20 bg-secondary/10 animate-pulse rounded-2xl" />
                </div>
            </div>
        )
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <UserCircle className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                    <h2 className="text-xl font-bold">Оюутан олдсонгүй</h2>
                    <p className="text-sm text-muted-foreground">Энэ оюутны мэдээлэл олдсонгүй.</p>
                    <Button
                        variant="outline"
                        className="rounded-xl font-bold"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Буцах
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B]">
            {/* Header Background */}
            <div className="h-48 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent relative">
                <div className="max-w-3xl mx-auto px-4 pt-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-white/10 transition-all gap-1.5"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Буцах
                    </Button>
                </div>

                {/* Profile Picture */}
                <div className="max-w-3xl mx-auto px-4">
                    <div className="absolute -bottom-12">
                        <div className="w-24 h-24 rounded-3xl bg-background border-4 border-background shadow-xl overflow-hidden flex items-center justify-center">
                            {student.profilePictureUrl ? (
                                <Image
                                    src={student.profilePictureUrl}
                                    alt={student.firstName || ""}
                                    width={96}
                                    height={96}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <UserCircle className="w-12 h-12 text-muted-foreground/30" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 pt-16 pb-12 space-y-8">
                {/* Name & Badge */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
                            <Zap className="w-3 h-3" />
                            Оюутан
                        </div>
                        <h1 className="text-3xl font-black tracking-tight leading-none mb-1">
                            {student.firstName} {student.lastName}
                        </h1>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                            {student.experienceLevel}
                        </p>
                    </div>
                    {isCompany && (
                        <div className="flex flex-col items-end gap-2">
                            {alreadyInvited ? (
                                <Button disabled className="rounded-xl h-10 px-6 font-bold bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-50">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Урилга илгээсэн
                                </Button>
                            ) : invitationAccepted ? (
                                <Button disabled className="rounded-xl h-10 px-6 font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-50">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Зөвшөөрсөн
                                </Button>
                            ) : (
                                <Button
                                    className="rounded-xl h-10 px-6 font-bold shadow-lg shadow-primary/20"
                                    onClick={() => setShowMessageInput(!showMessageInput)}
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Урих
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Invite Message Input */}
                {showMessageInput && isCompany && (
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
                        <label className="text-xs font-bold text-primary uppercase tracking-widest">
                            Урилгын мессеж (заавал биш)
                        </label>
                        <textarea
                            placeholder="Танд манай компанид дадлага хийх урилга илгээж байна..."
                            className="w-full rounded-xl border border-primary/20 bg-background resize-none p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            rows={3}
                            value={inviteMessage}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInviteMessage(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-xl font-bold"
                                onClick={() => {
                                    setShowMessageInput(false)
                                    setInviteMessage("")
                                }}
                            >
                                Болих
                            </Button>
                            <Button
                                size="sm"
                                className="rounded-xl font-bold"
                                onClick={handleSendInvitation}
                                disabled={sendingInvitation}
                            >
                                {sendingInvitation ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4 mr-2" />
                                )}
                                Илгээх
                            </Button>
                        </div>
                    </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            <Briefcase className="w-3 h-3" />
                            Төрөл
                        </div>
                        <p className="text-lg font-black capitalize">{student.experienceLevel}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            <Clock className="w-3 h-3" />
                            Сүүлд шинэчилсэн
                        </div>
                        <p className="text-lg font-black">{new Date(student.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Contact Info */}
                {(student.user?.email || student.user?.phoneNumber) && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            Холбоо барих
                            <div className="h-px flex-1 bg-primary/10" />
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {student.user?.email && (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 border border-border/30">
                                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Имэйл</p>
                                        <p className="text-sm font-bold truncate">{student.user.email}</p>
                                    </div>
                                </div>
                            )}
                            {student.user?.phoneNumber && (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 border border-border/30">
                                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Phone className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Утас</p>
                                        <p className="text-sm font-bold">{student.user.phoneNumber}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Bio */}
                <div className="space-y-3">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        Миний тухай
                        <div className="h-px flex-1 bg-primary/10" />
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground/80 font-medium whitespace-pre-wrap">
                        {student.bio || "Танилцуулга оруулаагүй байна."}
                    </p>
                </div>

                {/* Skills */}
                <div className="space-y-3">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        Ур чадварууд
                        <div className="h-px flex-1 bg-primary/10" />
                    </h3>
                    <div className="flex flex-wrap gap-2 pt-1">
                        {student.skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-xs font-bold border border-primary/10">
                                {skill}
                            </span>
                        ))}
                        {student.skills.length === 0 && (
                            <p className="text-sm text-muted-foreground font-medium">Ур чадвар оруулаагүй байна.</p>
                        )}
                    </div>
                </div>

                {/* Education */}
                {student.education && student.education.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            Боловсрол
                            <div className="h-px flex-1 bg-primary/10" />
                        </h3>
                        <div className="space-y-4 pt-1">
                            {student.education.map((edu, idx) => (
                                <div key={idx} className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-primary before:rounded-full before:shadow-[0_0_10px_rgba(var(--primary),0.5)]">
                                    <h4 className="font-bold text-sm leading-none mb-1.5">{edu.school}</h4>
                                    <p className="text-xs text-muted-foreground font-medium mb-1">{edu.degree}</p>
                                    <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{edu.year} он</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
