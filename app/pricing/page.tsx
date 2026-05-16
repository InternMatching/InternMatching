import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"

export const metadata = {
  title: "Үнийн санал | InternMatch",
  description: "InternMatch-ийн үнийн санал",
}

export default function PricingPage() {
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
            Үнийн{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              санал
            </span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Санхүүгийн асуудал дадлага олоход саад болох ёсгүй. Оюутан бүр, компани бүр тэгш боломжтой байх нь бидний одоогийн зарчим юм.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 lg:px-24 py-16">
        <div className="max-w-3xl mx-auto space-y-12">

          {/* Free Section */}
          <div
            className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-12 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "200ms", animationFillMode: "both" }}
          >
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-2">Үнэгүй</h2>
                <p className="text-lg text-muted-foreground">
                  Төлбөр мөнгө байхгүй учир бүгдэд нь нээлттэй.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 pt-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-sm">📚</span>
                    Оюутан таньд
                  </h3>
                  <ul className="space-y-3">
                    <PricingFeature text="Профайл үүсгэх" />
                    <PricingFeature text="CV-гээ шүүмжлүүлэх" />
                    <PricingFeature text="Ажлын сайтуудыг хайх" />
                    <PricingFeature text="Ажилд өргөдөл гаргах" />
                    <PricingFeature text="Урилга хүлээн авах" />
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-sm">🏢</span>
                    Компань таньд
                  </h3>
                  <ul className="space-y-3">
                    <PricingFeature text="Компани профайл үүсгэх" />
                    <PricingFeature text="Ажлын сайт нийтлүүлэх" />
                    <PricingFeature text="Өргөдлүүдийг хүлээн авах" />
                    <PricingFeature text="Оюутнуудад урилга илгээх" />
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Why Free */}
          <div
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "300ms", animationFillMode: "both" }}
          >
            <h2 className="text-3xl font-bold text-foreground text-center">Яагаад үнэгүй байна?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <ReasonCard title="Идэвхтэй үйлчилгээ" description="Оюутан, компани хоёр идэвхтэй оролцож байвал платформ маань амьд байна гэдэгт бид итгэдэг." delay={350} />
              <ReasonCard title="Хүртээмжтэй" description="Санхүүтэй байдал дадлага олох боломжийг хаахгүй байх ёстой." delay={420} />
              <ReasonCard title="Нөхцөл сайтай" description="Хоёр тал ашигтай нөхцөлийг бид бүрдүүлнэ." delay={490} />
              <ReasonCard title="Үйлчилгээ сайтай" description="Үнэгүй гэдэг нь чанар муу гэсэн үг биш." delay={560} />
            </div>
          </div>

          {/* Future Note */}
          <div
            className="rounded-xl bg-muted/50 border border-border p-8 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "500ms", animationFillMode: "both" }}
          >
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Ирээдүйн үзэл
            </p>
            <p className="text-foreground leading-relaxed">
              Өнөөдрийн дадлага маргаашийн Монголыг бүтээнэ. Оюутан ирээдүйгээ, компани хойч үеэ дэмжиж байна — хамтдаа хичээцгээе.
            </p>
          </div>


        </div>
      </div>
    </div>
  )
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
      <span className="text-muted-foreground">{text}</span>
    </li>
  )
}

function ReasonCard({ title, description, delay }: { title: string; description: string; delay: number }) {
  return (
    <div
      className="rounded-lg bg-muted/30 border border-border p-6 space-y-3 hover:border-primary/30 hover:bg-muted/50 hover:-translate-y-0.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both", animationDuration: "600ms" }}
    >
      <h3 className="font-bold text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  )
}
