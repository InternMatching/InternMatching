"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery } from "@apollo/client/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  GraduationCap,
  Building2,
  ArrowRight,
  Star,
  Users,
  Layout,
  CheckCircle2,
} from "lucide-react"
import Lenis from 'lenis'
import { ME } from "@/features/auth/graphql/auth.queries"
import { User } from "@/lib/type"

export default function LandingPage() {
  const router = useRouter()
  const { data: userData } = useQuery<{ me: User }>(ME)

  useEffect(() => {
    if (userData?.me) {
      const role = userData.me.role.toLowerCase()
      if (role === "admin") router.push("/admin")
      else if (role === "company") router.push("/company")
      else router.push("/student")
    }
  }, [userData, router])

  useEffect(() => {
    const lenis = new Lenis()
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto px-6 lg:px-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Star className="w-4 h-4 fill-primary" />
                  <span>Монголын хамгийн том дадлагын платформ</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
                  Ирээдүйн <span className="text-primary">карьераа</span> эндээс эхлүүл.
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  Оюутан, төгсөгчдөд мэргэжлээрээ дадлага хийх, харин компаниудад шинээр төгсөж буй чадварлаг залуусыг илрүүлэхэд тусална.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                  <Button size="lg" className="h-14 px-8 rounded-2xl text-base font-semibold shadow-lg shadow-primary/20 group" asChild>
                    <Link href="/signup">
                      Одоо нэгдэх
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 " />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl hover:bg-primary hover:text-white  text-base font-semibold border-border/60" asChild>
                    <Link href="/login">Нэвтрэх</Link>
                  </Button>
                </div>
              </div>

              {/* Visual Element: Dashboard Mockup */}
              <div className="relative lg:block hidden animate-in fade-in zoom-in duration-1000">
                <div className="relative z-10 bg-card border border-border shadow-2xl rounded-3xl p-6 backdrop-blur-sm overflow-hidden group">
                  {/* Mock dashboard header */}
                  <div className="flex items-center justify-between mb-8 border-b border-border pb-4 opacity-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Layout className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 w-24 bg-muted rounded-full" />
                        <div className="h-2 w-16 bg-muted rounded-full opacity-60" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted" />
                      <div className="w-8 h-8 rounded-full bg-muted" />
                    </div>
                  </div>

                  {/* Mock dashboard content */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="h-32 rounded-2xl bg-primary/5 border border-primary/10 p-4">
                        <Users className="w-5 h-5 text-primary mb-2" />
                        <div className="h-2 w-full bg-primary/20 rounded-full mb-2" />
                        <div className="h-2 w-1/2 bg-primary/20 rounded-full" />
                      </div>
                      <div className="h-40 rounded-2xl bg-secondary/5 border border-border p-4">
                        <div className="h-2 w-full bg-muted rounded-full mb-2" />
                        <div className="h-2 w-full bg-muted rounded-full mb-2" />
                        <div className="h-2 w-2/3 bg-muted rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-48 rounded-2xl bg-muted/30 border border-border p-4">
                        <div className="flex gap-2 mb-4">
                          <div className="w-6 h-6 rounded-full bg-primary" />
                          <div className="h-2 w-16 bg-muted rounded-full mt-2" />
                        </div>
                        <div className="space-y-2">
                          {[1, 2, 3, 4].map(i => <div key={i} className="h-2 w-full bg-muted rounded-full" />)}
                        </div>
                      </div>
                      <div className="h-24 rounded-2xl bg-primary border border-primary shadow-lg p-4 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[60px] group-hover:bg-primary/30 transition-colors" />
                </div>

                {/* Floating tags */}
                <div className="absolute top-10 -left-10 bg-background border border-border shadow-xl rounded-2xl p-3 flex items-center gap-2 animate-bounce duration-3000">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-xs font-semibold">Дадлага баталгаажсан</span>
                </div>

                <div className="absolute bottom-10 -right-6 bg-background border border-border shadow-xl rounded-2xl p-4 flex items-center gap-3 animate-pulse">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div className="space-y-1">
                    <div className="h-2 w-16 bg-muted rounded-full" />
                    <div className="h-2 w-8 bg-muted rounded-full opacity-60" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof: Companies Section */}
        <section className="py-12 border-y border-border bg-muted/30">
          <div className="container mx-auto px-6 lg:px-24">
            <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">
              Хамтран ажиллагч байгууллагууд
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              {['Unitel', 'Mobicom', 'Khan Bank', 'Golomt Bank', 'TDB', 'MCS Group'].map((name) => (
                <span key={name} className="text-xl md:text-2xl font-bold tracking-tighter text-foreground font-serif italic">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6 lg:px-24">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
                Хоёр талын хамтын боломж
              </h2>
              <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
                Та анхны боломжоо хайж байгаа эсвэл шинэ чадварлаг ажилтан хайж байгаа эсэхээс үл хамааран бид танд байна.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* For Students Card */}
              <Card className="border-border shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group box-border">
                <CardHeader className="p-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-bold">Оюутан танд</CardTitle>
                  <CardDescription className="text-base pt-2">
                    Та өөрийн гайхалтай карьераа эндээс эхлүүлээрэй.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <ul className="space-y-4">
                    {[
                      "Ур чадвар дээрээ суурилан дадлага хайх",
                      "Профайлаараа хялбархан хүсэлт гаргах",
                      "Өөрийн карьерын портфолио үүсгэх"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-muted-foreground font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-16 h-12 rounded-xl bg-primary/5 hover:bg-primary text-primary hover:text-white border border-primary/20 group/btn" variant="ghost" asChild>
                    <Link href="/signup?role=student">
                      Оюутнаар нэвтрэх
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1 " />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* For Companies Card */}
              <Card className="border-border shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group box-border">
                <CardHeader className="p-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-bold">Компани танд</CardTitle>
                  <CardDescription className="text-base pt-2">
                    Шинээр гарч ирж буй чадварлаг залуусыг нээн илрүүлэх.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <ul className="space-y-4">
                    {[
                      "Дадлагын зар байршуулах",
                      "Шаардлага хангасан өргөдөл гаргагчдыг хянах",
                      "Багийнхаа төгс тохирох хүнийг олох"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-muted-foreground font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-10 h-12 rounded-xl bg-primary/5 hover:bg-primary hover:text-white text-primary border border-primary/20 group/btn" variant="ghost" asChild>
                    <Link href="/signup?role=company">
                      Компаниар нэгдэх
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Section - Premium Redesign */}

      </main>

    </div>
  )
}
