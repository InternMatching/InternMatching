import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { ArrowLeft, Mail, Phone, Clock } from "lucide-react"

export const metadata = {
  title: "Холбоо барих | InternMatch",
  description: "InternMatch-тай холбоо барина",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">

      {/* Back */}
      <div
        className="container mx-auto px-6 lg:px-24 py-8 animate-in fade-in slide-in-from-top-2 duration-500"
        style={{ animationFillMode: "both" }}
      >
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
            Бидэнтэй{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              холбогдох
            </span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Асуулт байна уу? Санал байна уу? Хамтрахыг хүсэж байна уу? Бид сонсоход бэлэн. Доорх мэдээллээр холбоо барина уу.
          </p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="container mx-auto px-6 lg:px-24 py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <ContactInfoCard
            icon={Mail}
            label="Имэйл"
            value="internmatch@gmail.com"
            href="mailto:internmatch@gmail.com"
            delay={200}
          />
          <ContactInfoCard
            icon={Phone}
            label="Утас"
            value="+976 99111111"
            href="tel:+97699111111"
            delay={300}
          />
          <ContactInfoCard
            icon={Clock}
            label="Цаг"
            value="Өдөр бүр 09:00 – 18:00"
            delay={400}
          />
        </div>
      </div>

      {/* Response note */}
      <div className="container mx-auto px-6 lg:px-24 py-8">
        <div
          className="max-w-2xl mx-auto rounded-xl bg-muted/50 border border-border p-8 text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "500ms", animationFillMode: "both" }}
        >
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Хариу өгөх цаг</p>
          <p className="text-foreground leading-relaxed">
            Ихэвчлэн 24 цагийн дотор хариу өгнө. Их ачаалалтай үед 48 цаг болж болно.
          </p>
        </div>
      </div>

      {/* Why contact */}
      <div className="container mx-auto px-6 lg:px-24 py-8">
        <div
          className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "550ms", animationFillMode: "both" }}
        >
          <h2 className="text-2xl font-bold text-foreground text-center">Яагаад холбоо барих вэ?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Платформ сайжруулах санал, асуулт",
              "Компани, байгууллагатай хамтрал",
              "Төслийг дэмжих, спонсор болох",
              "Техник туслалцаа эсвэл бусад асуулт",
            ].map((text, i) => (
              <div
                key={text}
                className="flex items-start gap-3 rounded-lg bg-muted/30 border border-border p-5 hover:border-primary/30 hover:bg-muted/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
                style={{ animationDelay: `${600 + i * 70}ms`, animationFillMode: "both", animationDuration: "500ms" }}
              >
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                <span className="text-foreground text-sm leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactInfoCard({
  icon: Icon,
  label,
  value,
  href,
  delay,
}: {
  icon: LucideIcon
  label: string
  value: string
  href?: string
  delay: number
}) {
  const inner = (
    <div
      className="flex items-center gap-5 rounded-xl bg-muted/30 border border-border p-6 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both", animationDuration: "600ms" }}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className="text-lg font-semibold text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block group [&>div]:group-hover:border-primary/30 [&>div]:group-hover:bg-muted/50 [&>div]:group-hover:-translate-y-0.5">
        {inner}
      </Link>
    )
  }

  return inner
}
