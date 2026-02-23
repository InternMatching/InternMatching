"use client"

import React from "react"
import {
    BarChart3,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Users,
    Briefcase,
    Calendar,
    Filter
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Аналитик & Тайлан</h1>
                    <p className="text-muted-foreground">Системийн өсөлт болон хэрэглэгчийн идэвхийг шинжлэх.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Сүүлийн 30 хоног
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Нийт ажилд зуучлалт", value: "1,280", trend: "+12.5%", icon: Briefcase, color: "text-blue-500" },
                    { label: "Идэвхтэй оюутнууд", value: "8,420", trend: "+5.2%", icon: Users, color: "text-green-500" },
                    { label: "Хариу өгөлтийн хурд", value: "2.4 өдөр", trend: "-0.5%", icon: PieChart, color: "text-amber-500" }
                ].map((stat, i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase">{stat.label}</p>
                                    <h3 className="text-2xl font-bold mt-1 text-foreground">{stat.value}</h3>
                                    <p className={`text-[10px] font-bold mt-1 ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-rose-600'}`}>
                                        {stat.trend} өмнөх сараас
                                    </p>
                                </div>
                                <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="min-h-[400px] flex flex-col items-center justify-center text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mb-4" />
                <CardTitle>Дэлгэрэнгүй тайлан ачааллаж байна</CardTitle>
                <CardDescription className="max-w-xs mx-auto">
                    Бид өгөгдлийг нэгтгэж байна. Энэ хэсэг тун удахгүй бэлэн болно.
                </CardDescription>
            </Card>
        </div>
    )
}
