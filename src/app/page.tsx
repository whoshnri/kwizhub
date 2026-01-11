import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { 
    BookOpen, 
    Zap, 
    Shield, 
    TrendingUp, 
    Users, 
    Award,
    ArrowRight,
    CheckCircle2,
    Sparkles
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 border-b border-border/40">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>1,000+ Quality Materials Available</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold font-heading ">
                Your Gateway to
                <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Academic Excellence
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Access premium study materials, past questions, and academic resources from verified authors. 
                Excel in your studies with KwizHub.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/marketplace">
                <Button size="lg" className="text-base px-8 h-12 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                  Browse Marketplace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base px-8 h-12 border-2"
                >
                  Start Selling
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Verified Authors</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-heading">
              Why Choose KwizHub?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed to elevate your academic journey with quality resources and seamless experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
              <CardContent className="pt-8 pb-8 px-6">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <BookOpen className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold font-heading mb-3">Quality Materials</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access verified study materials, past questions, and resources curated by experienced authors and educators.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
              <CardContent className="pt-8 pb-8 px-6">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Zap className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold font-heading mb-3">Instant Access</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Download your purchased materials immediately after payment. No waiting, no delays—just instant access to your resources.
                </p>
              </CardContent>
            </Card>

            <Card className="group border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
              <CardContent className="pt-8 pb-8 px-6">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Shield className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold font-heading mb-3">Secure Platform</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your transactions and downloads are protected with industry-standard security measures and encryption.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-5xl md:text-6xl font-bold font-heading text-primary">1K+</div>
              <div className="text-sm text-muted-foreground font-medium">Study Materials</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl md:text-6xl font-bold font-heading text-primary">500+</div>
              <div className="text-sm text-muted-foreground font-medium">Happy Students</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl md:text-6xl font-bold font-heading text-primary">50+</div>
              <div className="text-sm text-muted-foreground font-medium">Verified Authors</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl md:text-6xl font-bold font-heading text-primary">34</div>
              <div className="text-sm text-muted-foreground font-medium">Departments</div>
            </div>
          </div>
        </div>
      </section>

      {/* App CTA Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>New Mobile App</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-heading leading-tight">
                Study on the go with the
                <span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  KwizHub Mobile App
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Download your materials for offline access. Enjoy a distraction-free reading experience with built-in security features and seamless synchronization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/app">
                  <Button size="lg" className="text-base px-8 h-12 shadow-lg">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 mx-auto w-72 h-[580px] bg-gradient-to-br from-card to-card/50 rounded-[3rem] border-2 border-border shadow-2xl overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-card rounded-b-2xl border-x-2 border-b-2 border-border z-20" />
                <div className="w-full h-full bg-gradient-to-br from-background to-muted/30 flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                    <span className="text-4xl font-bold text-primary-foreground">K</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl font-heading mb-1">KwizHub</h3>
                    <p className="text-sm text-muted-foreground">Mobile Reader</p>
                  </div>
                  <Button className="px-8 py-2.5 rounded-full shadow-md">
                    Download Now
                  </Button>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/20 blur-[120px] rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-muted/30 border-t border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold font-heading">
            Ready to Excel in Your Studies?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of students who have improved their grades with our quality study materials. 
            Start your journey to academic excellence today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="text-base px-8 h-12 shadow-lg shadow-primary/20">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="text-base px-8 h-12 border-2">
                Explore Materials
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
