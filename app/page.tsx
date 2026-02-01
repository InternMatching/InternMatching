import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Building2, Users, Briefcase, ArrowRight, CheckCircle2 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">

      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl text-foreground">InternMatch</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Нэвтрэх</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Бүртгүүлэх</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main>

        <section className="py-20 md:py-42">
          <div className="container mx-auto px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight text-balance">
                Та өөрийн дадлага , ажил , оюутнуудаа эндээс хайгаарай.
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Оюутан, төгсөгчдөд мэргэжлээрээ дадлага хийх,  ажил олох, мөн компаниудад шинээр төгсөж буй чадварлаг оюутнуудыг  илрүүлэхэд нь туслах болно.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-base">
                  <Link href="/signup">
                    Эхлүүлэх
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base bg-transparent">
                  <Link href="/login">Өөрийн бүртгэл үүсгэх</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                2 талын хамтын боломж
              </h2>
              <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
                Та өөрийн анхны боломжийг хайж байгаа эсвэл шинэ чадварлаг оюутнаа хайж байгаа эсэхээс үл хамааран бид танд туслахад бэлэн байна.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* For Students Card */}
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Оюутан таньд</CardTitle>
                  <CardDescription className="text-base">
                    Та өөрийн гайхалтай карьераа эндээс эхлүүлээрэй.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Өөрийн ур чадвар дээр суурилан дадлага хайх</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Профайлаараа хялбархан хүсэлт гаргах</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Өөрийн карьерынхаа портфолио үүсгэх</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-transparent" variant="outline" asChild>
                    <Link href="/signup?role=student">Оюутанаар нэгдэх</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* For Companies Card */}
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Компань таньд</CardTitle>
                  <CardDescription className="text-base">
                    Шинээр гарч ирж буй  чадварлаг оюутнаа нээн илрүүлэх
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Дадлага болон ажлын зар байршуула</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground"> Шаардлага хангасан өргөдөл гаргагчдыг хянаж үзэх</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">Багийнхаа төгс тохирох хүнийг олоорой</span>
                    </li>
                  </ul>
                  <Button className="w-full mt-6 bg-transparent" variant="outline" asChild>
                    <Link href="/signup?role=company">Компаниар нэгдэх</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
                <div className="mt-2 text-muted-foreground">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">10k+</div>
                <div className="mt-2 text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">2k+</div>
                <div className="mt-2 text-muted-foreground">Jobs Posted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">85%</div>
                <div className="mt-2 text-muted-foreground">Match Rate</div>
              </div>
            </div>
          </div>
        </section> */}


        <section className="py-20 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Эхлэхэд та бэлэн үү?
            </h2>
            <p className="mt-4 text-primary-foreground/80 text-lg max-w-xl mx-auto">
              Ирээдүйгээ бүтээхийн тулд InternMatch-ийг аль хэдийн ашиглаж буй мянга мянган оюутан, компаниудтай нэгдээрэй.
            </p>
            <Button size="lg" variant="secondary" className="mt-8" asChild>
              <Link href="/signup">
                Өөрийн бүртгэлийг та яг одоо үүсгээрэй.
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">InternMatch</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Бидний тухай</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Холбогдох</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Үйлчилгээ</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              2026 InternMatch. Бүх эрх хуулийн хуулсанд хүлээлэгдсэн.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
