"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, Users, Clock, Zap, Send } from "lucide-react"
import { Application, Invitation, ApplicationStatus } from "@/lib/type"
import { cn } from "@/lib/utils"

const getTimeRemaining = (deadline?: string) => {
    if (!deadline) return null
    const diff = new Date(deadline).getTime() - new Date().getTime()
    if (diff <= 0) return "Хугацаа дууссан"
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days > 0) return `${days} хоног үлдсэн`
    const hours = Math.floor(diff / (1000 * 60 * 60))
    return `${hours} цаг үлдсэн`
}

type Props = {
    applications?: Application[]
    invitations?: Invitation[]
    loading: boolean
    updatingStatus: boolean
    onStatusUpdate: (id: string, status: ApplicationStatus) => void
}

export function CompanyApplicantsTab({ applications, invitations, loading, updatingStatus, onStatusUpdate }: Props) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-5 mb-2">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold tracking-tight">Оюутнуудын хүсэлт</h2>
                    <p className="text-xs text-muted-foreground font-medium">Нийт {applications?.length || 0} өргөдөл</p>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-28 rounded-2xl bg-secondary/20 animate-pulse" />)}
                </div>
            ) : (
                <div className="grid gap-4">
                    {applications?.map((app) => (
                        <Card key={app.id} className="border-border/60 bg-background rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                            <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 font-medium">
                                <div className="flex-1 space-y-2">
                                    <Link href={`/students/${app.student?.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                        <div className="w-10 h-10 bg-secondary/50 rounded-xl flex items-center justify-center font-bold text-primary border border-border/20 overflow-hidden shrink-0">
                                            {app.student?.profilePictureUrl ? (
                                                <Image src={app.student.profilePictureUrl} alt={app.student.firstName || ""} width={40} height={40} className="object-cover w-full h-full" />
                                            ) : (
                                                <span className="text-sm font-bold text-primary uppercase">
                                                    {app.student?.firstName?.[0]}{app.student?.lastName?.[0]}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base leading-none mb-1 hover:text-primary transition-colors">{app.student?.firstName} {app.student?.lastName}</h3>
                                            <p className="text-xs font-bold text-primary flex items-center gap-1 leading-none uppercase tracking-tighter opacity-80">
                                                {app.job?.title}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest pt-1">
                                        <span className="bg-secondary/40 px-2 py-0.5 rounded text-primary">MATCH: {Math.round(app.matchScore)}%</span>
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{new Date(app.appliedAt).toLocaleDateString()}</span>
                                        {app.job?.deadline && (
                                            <span className={cn(
                                                "flex items-center gap-1.5 px-2 py-0.5 rounded",
                                                new Date(app.job.deadline).getTime() - new Date().getTime() < 86400000 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                                            )}>
                                                <Zap className="w-3 h-3" />
                                                {getTimeRemaining(app.job.deadline)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 justify-between md:justify-end border-t md:border-0 pt-4 md:pt-0">
                                    <span className={cn(
                                        "text-[9px] font-medium px-2.5 py-1 rounded-md uppercase tracking-widest border",
                                        app.status === "accepted" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            app.status === "rejected" ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                    )}>
                                        {app.status}
                                    </span>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="outline" className="h-9 w-9 text-emerald-600 border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50 shadow-sm" onClick={() => onStatusUpdate(app.id, "accepted")} disabled={updatingStatus}>
                                            <CheckCircle className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" variant="outline" className="h-9 w-9 text-red-600 border-red-100 bg-red-50/20 hover:bg-red-50 shadow-sm" onClick={() => onStatusUpdate(app.id, "rejected")} disabled={updatingStatus}>
                                            <XCircle className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {applications?.length === 0 && (
                        <div className="py-20 text-center space-y-3 bg-secondary/10 rounded-2xl border-2 border-dashed border-border/40">
                            <Users className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                            <p className="text-sm font-bold text-muted-foreground">Одоогоор хүсэлт ирээгүй байна.</p>
                        </div>
                    )}
                </div>
            )}

            <div className="border-t border-border/40 pt-6 mt-6">
                <div className="flex items-center justify-between pb-5 mb-2">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold tracking-tight">Илгээсэн урилгууд</h2>
                        <p className="text-xs text-muted-foreground font-medium">Нийт {invitations?.length || 0} урилга</p>
                    </div>
                </div>

                <div className="grid gap-4">
                    {invitations?.map((inv) => (
                        <Card key={inv.id} className="border-border/60 bg-background rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                            <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 font-medium">
                                <div className="flex-1 space-y-2">
                                    <Link href={`/students/${inv.student?.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                        <div className="w-10 h-10 bg-secondary/50 rounded-xl flex items-center justify-center font-bold text-primary border border-border/20 overflow-hidden shrink-0">
                                            {inv.student?.profilePictureUrl ? (
                                                <Image src={inv.student.profilePictureUrl} alt={inv.student.firstName || ""} width={40} height={40} className="object-cover w-full h-full" />
                                            ) : (
                                                <span className="text-sm font-bold text-primary uppercase">
                                                    {inv.student?.firstName?.[0]}{inv.student?.lastName?.[0]}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base leading-none mb-1 hover:text-primary transition-colors">
                                                {inv.student?.firstName} {inv.student?.lastName}
                                            </h3>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                {inv.student?.experienceLevel}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest pt-1">
                                        <span className="flex items-center gap-1.5">
                                            <Send className="w-3 h-3" />
                                            Илгээсэн: {new Date(inv.sentAt).toLocaleDateString()}
                                        </span>
                                        {inv.respondedAt && (
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" />
                                                Хариулсан: {new Date(inv.respondedAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    {inv.message && (
                                        <p className="text-xs text-muted-foreground/60 italic pt-1 line-clamp-1">
                                            &ldquo;{inv.message}&rdquo;
                                        </p>
                                    )}
                                </div>

                                <span className={cn(
                                    "text-[9px] font-medium px-2.5 py-1 rounded-md uppercase tracking-widest border shrink-0",
                                    inv.status === "accepted" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                        inv.status === "rejected" ? "bg-red-50 text-red-600 border-red-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                )}>
                                    {inv.status === "accepted" ? "Зөвшөөрсөн" : inv.status === "rejected" ? "Татгалзсан" : "Хүлээгдэж байна"}
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                    {(!invitations || invitations.length === 0) && (
                        <div className="py-16 text-center space-y-3 bg-secondary/10 rounded-2xl border-2 border-dashed border-border/40">
                            <Send className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                            <p className="text-sm font-bold text-muted-foreground">Одоогоор урилга илгээгээгүй байна.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
