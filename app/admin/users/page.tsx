"use client"

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import {
    Users,
    Search,
    Trash2,
    Eye,
    Mail,
    UserPlus,
    ShieldCheck,
    UserRound,
    Building2,
    ShieldAlert,
    Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

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

const DELETE_USER = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId)
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
    const [deleteUser] = useMutation<DeleteUserData, DeleteUserVars>(DELETE_USER)
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")

    const filteredUsers = (data?.getAllUsers || []).filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === "all" || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    const handleDelete = async (userId: string) => {
        if (!confirm("Та энэ хэрэглэгчийг устгахдаа итгэлтэй байна уу?")) return

        try {
            const { data: deleteData } = await deleteUser({ variables: { userId } })
            if (deleteData?.deleteUser) {
                toast.success("Хэрэглэгчийг амжилттай устгалаа")
                refetch()
            }
        } catch (err: any) {
            toast.error(err.message || "Хэрэглэгчийг устгахад алдаа гарлаа")
        }
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
                <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Админ нэмэх
                </Button>
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
                                    <tr key={user.id} className="hover:bg-secondary/10 transition-colors group">
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
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                    onClick={() => handleDelete(user.id)}
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
