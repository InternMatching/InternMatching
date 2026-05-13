"use client"

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import {
    Search,
    Trash2,
    Eye,
    UserPlus,
    Loader2,
    X,
    Shield,
    AlertTriangle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"

const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      email
      role
      createdAt
    }
  }
`

const GET_ALL_STUDENT_PROFILES = gql`
  query GetAllStudentProfiles {
    getAllStudentProfiles {
      id
      userId
    }
  }
`

const GET_ALL_COMPANIES = gql`
  query GetAllCompanies {
    getAllCompanyProfiles {
      id
      userId
    }
  }
`

const DELETE_USER = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId)
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
    id: string;
    email: string;
    role: string;
    createdAt: string;
}

interface GetAllUsersData {
    getAllUsers: User[];
}

interface DeleteUserData {
    deleteUser: boolean;
}

interface DeleteUserVars {
    userId: string;
}

export default function UsersManagementPage() {
    const { data, loading, error, refetch } = useQuery<GetAllUsersData>(GET_ALL_USERS)
    const { data: studentData } = useQuery<{ getAllStudentProfiles: { id: string; userId: string }[] }>(GET_ALL_STUDENT_PROFILES)
    const { data: companyData } = useQuery<{ getAllCompanyProfiles: { id: string; userId: string }[] }>(GET_ALL_COMPANIES)
    const [deleteUser] = useMutation<DeleteUserData, DeleteUserVars>(DELETE_USER)
    const [updateUserRole] = useMutation(UPDATE_USER_ROLE)
    const router = useRouter()

    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [showAddAdmin, setShowAddAdmin] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState("")
    const [addAdminLoading, setAddAdminLoading] = useState(false)

    const profileMap = useMemo(() => {
        const map: Record<string, string> = {}
        studentData?.getAllStudentProfiles?.forEach(p => { map[p.userId] = `/students/${p.id}` })
        companyData?.getAllCompanyProfiles?.forEach(p => { map[p.userId] = `/admin/companies/${p.id}` })
        return map
    }, [studentData, companyData])

    const filteredUsers = (data?.getAllUsers || []).filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === "all" || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    const availableUsers = (data?.getAllUsers || []).filter(u => u.role !== "admin")
    const selectedUser = availableUsers.find(u => u.id === selectedUserId)

    const handleDelete = (user: User) => {
        toast(`${user.email} хэрэглэгчийг устгах уу?`, {
            action: {
                label: "Устгах",
                onClick: async () => {
                    try {
                        const { data: deleteData } = await deleteUser({ variables: { userId: user.id } })
                        if (deleteData?.deleteUser) {
                            toast.success("Хэрэглэгчийг амжилттай устгалаа")
                            refetch()
                        }
                    } catch (err) {
                        toast.error(err instanceof Error ? err.message : "Хэрэглэгчийг устгахад алдаа гарлаа")
                    }
                },
            },
            cancel: {
                label: "Болих",
                onClick: () => {},
            },
            duration: 8000,
        })
    }

    const handleAddAdmin = async () => {
        if (!selectedUserId) {
            toast.error("Хэрэглэгч сонгоно уу")
            return
        }
        setAddAdminLoading(true)
        try {
            await updateUserRole({ variables: { userId: selectedUserId, role: "admin" } })
            toast.success("Админ амжилттай нэмэгдлээ")
            setSelectedUserId("")
            setShowAddAdmin(false)
            refetch()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Админ нэмэхэд алдаа гарлаа")
        } finally {
            setAddAdminLoading(false)
        }
    }

    const handleCancelAddAdmin = () => {
        setSelectedUserId("")
        setShowAddAdmin(false)
    }

    const getRoleName = (role: string) => {
        switch (role) {
            case 'admin': return 'Админ'
            case 'company': return 'Компани'
            case 'student': return 'Оюутан'
            default: return role
        }
    }

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>
    if (error) return <div className="p-4 text-destructive">Алдаа: {error.message}</div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Хэрэглэгчийн сан</h1>
                    <p className="text-muted-foreground">Платформын хэрэглэгчдийн эрх болон мэдээллийг удирдах хэсэг.</p>
                </div>
                <Button onClick={() => setShowAddAdmin(v => !v)} variant={showAddAdmin ? "secondary" : "default"}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Админ нэмэх
                </Button>
            </div>

            {/* Inline add admin panel */}
            <div className={`grid transition-all duration-300 ease-in-out ${showAddAdmin ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
                <Card className="p-5 mb-0">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Shield className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Админ нэмэх</p>
                                <p className="text-xs text-muted-foreground">Хэрэглэгчид админ эрх олгох</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCancelAddAdmin}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-end">
                        <div className="flex-1 space-y-1.5">
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

                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleCancelAddAdmin} disabled={addAdminLoading}>
                                Болих
                            </Button>
                            <Button size="sm" onClick={handleAddAdmin} disabled={addAdminLoading || !selectedUserId}>
                                {addAdminLoading
                                    ? <><Loader2 className="animate-spin mr-1.5 h-3.5 w-3.5" />Хүлээж байна...</>
                                    : "Нэмэх"
                                }
                            </Button>
                        </div>
                    </div>

                    {selectedUser && (
                        <div className="mt-3 flex items-start gap-1.5 pt-3 border-t">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-muted-foreground">
                                <span className="font-medium text-foreground">{selectedUser.email}</span>
                                {" "}хэрэглэгч бүх админ эрхийг авна
                            </p>
                        </div>
                    )}
                </Card>
            </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Имейл хаягаар хайх..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-md">
                    {['all', 'student', 'company', 'admin'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${roleFilter === role
                                ? 'bg-background text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {role === 'all' ? 'Бүгд' : getRoleName(role)}
                        </button>
                    ))}
                </div>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-secondary/20">
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Хэрэглэгч</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Эрх</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Огноо</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Үйлдэл</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground">
                                        Хэрэглэгч олдсонгүй.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-secondary/40 transition-colors group cursor-pointer" onClick={() => { const href = profileMap[user.id]; if (href) router.push(href) }}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                    {user.email[0].toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary">
                                                {getRoleName(user.role)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-muted-foreground">
                                                {(() => {
                                                    const timestamp = isNaN(Number(user.createdAt)) ? user.createdAt : Number(user.createdAt);
                                                    const date = new Date(timestamp);
                                                    return isNaN(date.getTime()) ? "Тодорхойгүй" : date.toLocaleDateString();
                                                })()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                {profileMap[user.id] && (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                        <Link href={profileMap[user.id]}>
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                    onClick={() => handleDelete(user)}
                                                    disabled={user.role === 'admin'}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
