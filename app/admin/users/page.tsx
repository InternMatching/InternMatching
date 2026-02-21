"use client"

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";

import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Trash2,
    Eye,
    Mail,
    UserPlus,
    Download,
    AlertCircle,
    ShieldCheck,
    UserRound,
    Building2,
    ShieldAlert
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
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        if (data) {
            setUsers(data.getAllUsers)
        }
    }, [data])

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesRole = roleFilter === "all" || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    const handleDelete = async (userId: string) => {
        if (!confirm("Та энэ хэрэглэгчийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй бөгөөд холбоотой бүх профайл болон өгөгдөл устах болно.")) return

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

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return <ShieldCheck className="w-4 h-4 text-purple-600" />
            case 'company': return <Building2 className="w-4 h-4 text-blue-600" />
            case 'student': return <UserRound className="w-4 h-4 text-emerald-600" />
            default: return <Users className="w-4 h-4 text-slate-400" />
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

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200'
            case 'company': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'student': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
            default: return 'bg-slate-100 text-slate-700 border-slate-200'
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Хэрэглэгчийн сан</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium tracking-tight">Платформын хэрэглэгчдийн эрх болон мэдээллийг удирдах хэсэг.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-xl font-bold border-slate-200 shadow-sm">
                        <Download className="w-4 h-4 mr-2" />
                        CSV-ээр татах
                    </Button>
                    <Button className="rounded-xl font-bold shadow-lg shadow-primary/20">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Админ бүртгэх
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900">
                <CardHeader className="p-6 border-b border-slate-50 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Имейл хаягаар хайх..."
                                className="pl-10 rounded-xl border-slate-100 dark:border-slate-800 focus:ring-primary h-10 font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
                            {['all', 'student', 'company', 'admin'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setRoleFilter(role)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg capitalize transition-colors duration-200 ${roleFilter === role
                                        ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                                        }`}
                                >
                                    {role === 'all' ? 'Бүгд' : getRoleName(role)}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Хэрэглэгч</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Хандах эрх</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Бүртгүүлсэн огноо</th>
                                    <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Үйлдэл</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-xs font-bold uppercase tracking-wider">Хэрэглэгчийн санг шинэчилж байна...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                                            <ShieldAlert className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                            <p className="text-sm font-bold">Ийм имейл хаягтай хэрэглэгч олдсонгүй.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm group-hover:scale-105 transition-transform ${getRoleBadgeColor(user.role)}`}>
                                                        {user.email[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{user.email}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-tighter">ID: {user.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm ${getRoleBadgeColor(user.role)}`}>
                                                    {getRoleIcon(user.role)}
                                                    {getRoleName(user.role)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-[13px] font-bold text-slate-600 dark:text-slate-400">
                                                    {new Date(parseInt(user.createdAt) || user.createdAt).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-xl shadow-sm border border-transparent hover:border-slate-200">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-xl shadow-sm border border-transparent hover:border-slate-200">
                                                        <Mail className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl shadow-sm border border-transparent hover:border-rose-100"
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
                </CardContent>
                {filteredUsers.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Нийт: {filteredUsers.length} идэвхтэй хэрэглэгч</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled className="rounded-lg h-8 text-[10px] font-extrabold uppercase">Өмнөх</Button>
                            <Button variant="outline" size="sm" disabled className="rounded-lg h-8 text-[10px] font-extrabold uppercase">Дараах</Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Danger Zone Info */}
            <div className="p-4 bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                </div>
                <p className="text-xs text-rose-700 dark:text-rose-400 font-medium leading-relaxed">
                    <span className="font-extrabold uppercase tracking-wide mr-1">Буцаах боломжгүй үйлдэл:</span>
                    Системийн админ өөрийн бүртгэлийг устгах боломжгүй. Оюутан эсвэл Компанийн бүртгэлийг устгаснаар холбоотой бүх профайл,
                    ажлын зарууд болон өргөдлүүд мэдээллийн сангаас бүрмөсөн устахыг анхаарна уу.
                </p>
            </div>
        </div>
    )
}
