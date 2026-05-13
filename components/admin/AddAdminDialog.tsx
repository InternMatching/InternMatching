"use client"

import { useState } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, Shield, AlertTriangle } from "lucide-react"

const GET_ALL_USERS = gql`
  query GetAllUsersForAdmin {
    getAllUsers {
      id
      email
      role
    }
  }
`

const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: ID!, $role: UserRole!) {
    updateUserRole(userId: $userId, role: $role) {
      id
      email
      role
    }
  }
`

interface User {
    id: string
    email: string
    role: string
}

interface Props {
    isOpen: boolean
    onClose: () => void
    onAdminAdded: () => void
}

export function AddAdminDialog({ isOpen, onClose, onAdminAdded }: Props) {
    const [selectedUserId, setSelectedUserId] = useState("")
    const [loading, setLoading] = useState(false)

    const { data: usersData } = useQuery<{ getAllUsers: User[] }>(GET_ALL_USERS, {
        skip: !isOpen,
    })
    const [updateUserRole] = useMutation(UPDATE_USER_ROLE)

    const availableUsers = (usersData?.getAllUsers || []).filter(
        (u) => u.role !== "admin"
    )

    const selectedUser = availableUsers.find((u) => u.id === selectedUserId)

    const getRoleName = (role: string) => {
        switch (role) {
            case "company": return "Компани"
            case "student": return "Оюутан"
            default: return role
        }
    }

    const handleAddAdmin = async () => {
        if (!selectedUserId) {
            toast.error("Хэрэглэгч сонгоно уу")
            return
        }
        setLoading(true)
        try {
            await updateUserRole({
                variables: { userId: selectedUserId, role: "admin" },
            })
            toast.success("Админ амжилттай нэмэгдлээ")
            setSelectedUserId("")
            onAdminAdded()
            onClose()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Админ нэмэхэд алдаа гарлаа")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setSelectedUserId("")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-sm p-0 overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Shield className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Админ нэмэх</h2>
                            <p className="text-xs text-muted-foreground">Хэрэглэгчид админ эрх олгох</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Хэрэглэгч</Label>
                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                            <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Хэрэглэгч сонгоно уу..." />
                            </SelectTrigger>
                            <SelectContent>
                                {availableUsers.length === 0 ? (
                                    <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                                        Хэрэглэгч байхгүй байна
                                    </div>
                                ) : (
                                    availableUsers.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                                                    {user.email[0].toUpperCase()}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-xs font-medium truncate">{user.email}</span>
                                                    <span className="text-[11px] text-muted-foreground">{getRoleName(user.role)}</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedUser && (
                        <div className="rounded-lg border bg-secondary/30 p-3 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                    {selectedUser.email[0].toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium truncate">{selectedUser.email}</p>
                                    <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                                        {getRoleName(selectedUser.role)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-start gap-1.5 pt-1 border-t">
                                <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                                <p className="text-[11px] text-muted-foreground">
                                    Энэ хэрэглэгч бүх админ эрхийг авна
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={handleClose} disabled={loading}>
                        Болих
                    </Button>
                    <Button size="sm" onClick={handleAddAdmin} disabled={loading || !selectedUserId}>
                        {loading ? (
                            <><Loader2 className="animate-spin mr-1.5 h-3.5 w-3.5" />Хүлээж байна...</>
                        ) : (
                            "Нэмэх"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
