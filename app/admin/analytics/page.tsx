"use client"

import React from "react"
import { useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {
    BarChart3,
    PieChart,
    LineChart,
    Filter,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Users,
    Briefcase
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AnalyticsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Аналитик & Тайлан</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Системийн өсөлт болон хэрэглэгчийн идэвхийг нарийвчлан шинжлэх.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-xl font-bold border-slate-200">
                        <Calendar className="w-4 h-4 mr-2" />
                        Сүүлийн 30 хоног
                    </Button>
                    <Button variant="outline" className="rounded-xl font-bold border-slate-200">
                        <Filter className="w-4 h-4 mr-2" />
                        Шүүлтүүр
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Нийт ажилд зуучлалт</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">1,280</h3>
                            <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold mt-2">
                                <ArrowUpRight className="w-3 h-3" />
                                +12.5% өмнөх сараас
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                            <Briefcase className="w-5 h-5" />
                        </div>
                    </div>
                </Card>
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Идэвхтэй оюутнууд</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">8,420</h3>
                            <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold mt-2">
                                <ArrowUpRight className="w-3 h-3" />
                                +5.2% өмнөх сараас
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                </Card>
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Өргөдлийн хариу өгөлтийн хурд</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">2.4 өдөр</h3>
                            <div className="flex items-center gap-1 text-rose-500 text-[10px] font-bold mt-2">
                                <ArrowDownRight className="w-3 h-3" />
                                -0.5% өмнөх сараас
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                            <PieChart className="w-5 h-5" />
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-6">
                    <BarChart3 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Дэлгэрэнгүй тайлан ачааллаж байна</h3>
                <p className="text-sm text-slate-500 max-w-sm mt-2">Бид танд платформын гүйцэтгэлийг илүү нарийвчлан харуулахын тулд өгөгдлийг нэгтгэж байна. Энэ хэсэг тун удахгүй бэлэн болно.</p>
            </Card>
        </div>
    )
}
