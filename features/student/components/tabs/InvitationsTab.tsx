"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Clock, Building2, CheckCircle, XCircle } from "lucide-react"
import { Invitation } from "@/lib/type"
import { cn } from "@/lib/utils"

type Props = {
    invitations?: Invitation[]
    loading: boolean
    responding: boolean
    onRespond: (id: string, status: "accepted" | "rejected") => void
}

export function StudentInvitationsTab({ invitations, loading, responding, onRespond }: Props) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
                <h2 className="text-xl font-bold tracking-tight">Компаниас ирсэн урилгууд</h2>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {invitations?.length || 0} урилга
                </p>
            </div>
            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-28 rounded-2xl bg-secondary/20 animate-pulse" />)}
                </div>
            ) : (
                <div className="grid gap-4">
                    {invitations?.map((invitation) => (
                        <Card key={invitation.id} className="border-border/60 bg-background rounded-2xl shadow-sm overflow-hidden">
                            <CardContent className="p-5 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 bg-secondary/30 rounded-xl flex items-center justify-center border border-border/40 overflow-hidden shrink-0">
                                            {invitation.company?.logoUrl ? (
                                                <Image src={invitation.company.logoUrl} alt={invitation.company.companyName || ""} width={44} height={44} className="object-cover w-full h-full" />
                                            ) : (
                                                <span className="text-sm font-medium text-primary/50 uppercase">
                                                    {invitation.company?.companyName?.[0] || <Building2 className="w-4 h-4 text-muted-foreground" />}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base leading-none mb-1">{invitation.company?.companyName}</h3>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                {invitation.company?.industry && <span>{invitation.company.industry}</span>}
                                                {invitation.company?.location && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{invitation.company.location}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {invitation.status === "pending" ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="h-8 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700"
                                                    onClick={() => onRespond(invitation.id, "accepted")}
                                                    disabled={responding}
                                                >
                                                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                                    Зөвшөөрөх
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 px-4 rounded-xl font-bold text-xs text-red-600 border-red-200 hover:bg-red-50"
                                                    onClick={() => onRespond(invitation.id, "rejected")}
                                                    disabled={responding}
                                                >
                                                    <XCircle className="w-3.5 h-3.5 mr-1.5" />
                                                    Татгалзах
                                                </Button>
                                            </>
                                        ) : (
                                            <span className={cn(
                                                "text-[9px] font-medium px-2.5 py-1 rounded-md uppercase tracking-widest border",
                                                invitation.status === "accepted" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"
                                            )}>
                                                {invitation.status === "accepted" ? "Зөвшөөрсөн" : "Татгалзсан"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {invitation.message && (
                                    <div className="p-3 rounded-xl bg-secondary/20 border border-border/30">
                                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                            &ldquo;{invitation.message}&rdquo;
                                        </p>
                                    </div>
                                )}
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase font-bold tracking-widest">
                                    <Clock className="w-3 h-3" />
                                    Илгээсэн: {new Date(invitation.sentAt).toLocaleDateString()}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                    {invitations?.length === 0 && (
                        <div className="py-20 text-center space-y-3 bg-secondary/10 rounded-2xl border-2 border-dashed border-border/40">
                            <Mail className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                            <p className="text-sm font-bold text-muted-foreground">Одоогоор урилга ирээгүй байна.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
