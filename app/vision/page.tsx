import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { ArrowLeft, Target, Users, Zap, Globe, Shield } from "lucide-react"

export const metadata = {
  title: "Бидний алсын караа | InternMatch",
  description: "InternMatch-ийн алсын караа болон зорилго",
}

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">

      {/* Back */}
      <div className="container mx-auto px-6 lg:px-24 py-8 animate-in fade-in slide-in-from-top-2 duration-500" style={{ animationFillMode: "both" }}>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Буцах
        </Link>
      </div>

      {/* Hero */}
      <div className="container mx-auto px-6 lg:px-24 py-16 text-center">
        <div
          className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "100ms", animationFillMode: "both" }}
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Бидний алсын{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              караа
            </span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Монголын дадлагын экосистемийг шинэчлэх. Оюутан ба компанийг холбож, өмнө нь байгаагүй түвшний үйлчилгээ үзүүлэх платформ бүтээх.
          </p>
        </div>
      </div>

      {/* Vision Statement */}
      <div className="container mx-auto px-6 lg:px-24 py-12">
        <div
          className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "200ms", animationFillMode: "both" }}
        >
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold text-foreground">Бидний үзэл бодол</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Монгол Улсын оюутан болон аж ахуйн нэгжүүдийн хамтын сүлжээ байгуулж, эрүүл ба үр ашигтай дадлагын үйл ажиллагаанд орохыг дэмжих.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <StatCard icon={Users} title="100+" subtitle="Идэвхтэй оюутан" />
            <StatCard icon={Target} title="10+" subtitle="Идэвхтэй компань" />
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="container mx-auto px-6 lg:px-24 py-20">
        <div
          className="animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "300ms", animationFillMode: "both" }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Бидний үндсэн үнэт зүйлс
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ValueCard
              title="Хүртээмжтэй"
              description="Чанартай дадлагын боломжыг бүх оюутан, компанид хүргэнэ."
              icon={Globe}
              delay={350}
            />
            <ValueCard
              title="Үнэ цэнэтэй"
              description="Үр ашигтай үйл ажиллагаа, илүү сайн үр дүн."
              icon={Zap}
              delay={450}
            />
            <ValueCard
              title="Итгэлтэй"
              description="Сайн компани, сайн оюутан, хурдан хугацаа."
              icon={Shield}
              delay={550}
            />
          </div>
        </div>
      </div>

    </div>
  )
}

function StatCard({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle: string }) {
  return (
    <div className="rounded-lg bg-muted/50 border border-border p-6 space-y-2 hover:border-primary/30 hover:bg-muted/60 transition-all">
      <Icon className="w-6 h-6 text-primary" />
      <p className="text-2xl font-bold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}

function ValueCard({
  title,
  description,
  icon: Icon,
  delay,
}: {
  title: string
  description: string
  icon: LucideIcon
  delay: number
}) {
  return (
    <div
      className="rounded-xl bg-muted/30 border border-border p-8 space-y-4 hover:border-primary/30 hover:bg-muted/50 hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both", animationDuration: "600ms" }}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
