"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, UserCircle, Send, ChevronRight } from "lucide-react"
import { StudentProfile, Invitation } from "@/lib/type"

type Props = {
    students?: StudentProfile[]
    invitations?: Invitation[]
    loading: boolean
    search: string
    setSearch: (v: string) => void
    sending: boolean
    onInvite: (studentProfileId: string, e: React.MouseEvent) => void
}

export function CompanyStudentsTab({ students, invitations, loading, search, setSearch, sending, onInvite }: Props) {
    const router = useRouter()
    const getInvitationStatus = (studentId: string) =>
        invitations?.find((inv) => inv.studentProfileId === studentId)

    const filtered = students?.filter((s) =>
        s.isActivelyLooking !== false &&
        (`${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
            s.skills.some((skill) => skill.toLowerCase().includes(search.toLowerCase())))
    ) || []

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5 mb-2">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight">Оюутны жагсаалт</h2>
                    <p className="text-xs text-muted-foreground font-medium">
                        Нийт {students?.filter((s) => s.isActivelyLooking !== false).length || 0} оюутан идэвхтэй хайж байна
                    </p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Оюутан хайх..."
                        className="pl-10 h-10 rounded-xl bg-secondary/10 border-border/40 font-bold"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-44 rounded-2xl bg-secondary/20 animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((student) => (
                        <Card
                            key={student.id}
                            className="group hover:border-primary/40 transition-all border-border/60 bg-background rounded-2xl overflow-hidden cursor-pointer flex flex-col"
                            onClick={() => router.push(`/students/${student.id}`)}
                        >
                            <CardContent className="p-5 space-y-4 flex-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-secondary/30 flex items-center justify-center border border-border/40 overflow-hidden shrink-0">
                                        {student.profilePictureUrl ? (
                                            <Image src={student.profilePictureUrl} alt={student.firstName || ""} width={48} height={48} className="object-cover w-full h-full" />
                                        ) : (
                                            <span className="text-lg font-medium text-primary/50 uppercase">
                                                {student.firstName?.[0] || <UserCircle className="w-5 h-5 text-muted-foreground" />}
                                            </span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{student.firstName} {student.lastName}</h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">
                                            {student.experienceLevel}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-xs text-muted-foreground/80 line-clamp-2 font-medium">
                                        {student.bio || "Танилцуулга оруулаагүй байна"}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {student.skills.slice(0, 3).map((skill, idx) => (
                                            <span key={idx} className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[9px] font-medium uppercase tracking-tight border border-primary/10">
                                                {skill}
                                            </span>
                                        ))}
                                        {student.skills.length > 3 && (
                                            <span className="px-2 py-0.5 rounded-md bg-secondary text-muted-foreground text-[9px] font-medium uppercase tracking-tight">
                                                +{student.skills.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                            <div className="px-5 py-3 border-t border-border/40 bg-secondary/5 group-hover:bg-primary/5 transition-colors flex items-center justify-between">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Профайл харах</span>
                                <div className="flex items-center gap-2">
                                    <InviteStatus inv={getInvitationStatus(student.id)} sending={sending} onInvite={(e) => onInvite(student.id, e)} />
                                    <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

function InviteStatus({ inv, sending, onInvite }: { inv?: Invitation; sending: boolean; onInvite: (e: React.MouseEvent) => void }) {
    if (inv?.status === "pending") {
        return <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">Урилга илгээсэн</span>
    }
    if (inv?.status === "accepted") {
        return <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Зөвшөөрсөн</span>
    }
    if (inv?.status === "rejected") {
        return <span className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">Татгалзсан</span>
    }
    return (
        <Button
            size="sm"
            variant="outline"
            className="h-7 px-3 rounded-lg text-[10px] font-bold gap-1 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={onInvite}
            disabled={sending}
        >
            <Send className="w-3 h-3" />
            Урих
        </Button>
    )
}
