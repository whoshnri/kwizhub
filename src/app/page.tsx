import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { IBM_Plex_Sans } from "next/font/google";
import { Shield, ArrowRight, CheckCircle, Zap, Lock, Smartphone, ArrowLeftRight } from "lucide-react";

const ibm_plex_sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center pt-32 pb-16 md:pt-48 md:pb-32  px-7">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-r from-transparent to-gray-500/10 bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto space-y-14">
            {/* Mentor Badge */}
            <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center gap-3 bg-muted/50 border border-border/50 rounded-full px-5 py-2 backdrop-blur-md shadow-sm transition-transform hover:scale-105 cursor-default">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-full border-2 border-background bg-primary/20 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary/20 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-background bg-accent/20 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Max" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-sm font-medium text-foreground/80">100+ Quality Materials Available</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
              <h1 className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-heading tracking-tight leading-[1.05] ${ibm_plex_sans.className}`}>
                Elevating Education
                <span className="block text-foreground/90 mt-2">
                  with <span className="bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent relative">
                    KwizHub
                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </span>
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
                Unlock your potential with premium study materials, past questions, and academic resources.
                The smarter way to excel in your academic journey.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <Link href="/marketplace" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base px-10 h-14 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 group transition-all cursor-pointer">
                  Start Learning Now
                  <ArrowRight className="ml-2 h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>
      {/* Social Proof / Stats Section */}
      <section className="py-24 bg-background border-t border-border/40 px-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary">
              <span>What We Do?</span>
            </div>
            <h2 className={`text-3xl md:text-5xl font-bold font-heading tracking-tight leading-tight ${ibm_plex_sans.className}`}>
              Empowering Students to <br className="hidden sm:block" />
              Achieve Academic Excellence
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We provide a robust marketplace for students to access high-quality study materials,
              connecting learners with verified educators across all departments.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-0">
            <div className="text-center space-y-4 lg:border-r border-border/40 py-4 px-2">
              <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-primary">1K+</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Study Materials</div>
            </div>
            <div className="text-center space-y-4 lg:border-r border-border/40 py-4 px-2">
              <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-primary">500+</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Happy Students</div>
            </div>
            <div className="text-center space-y-4 lg:border-r border-border/40 py-4 px-2">
              <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-primary">50+</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Verified Authors</div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background px-10">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Section Header */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight leading-[1.1] ${ibm_plex_sans.className}`}>
              Empowering Students <br className="hidden lg:block" />
              With Premium Academic <br className="hidden lg:block" />
              Resources
            </h2>
            <div className="space-y-6 md:pt-4">
              <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                Access a vast library of verified study materials, past questions, and academic resources.
                We're dedicated to simplifying your learning journey with high-quality content delivered instantly to your device.
              </p>
              <Link href="/marketplace">
                <Button className="rounded-full px-8 h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 group transition-all">
                  Explore More
                  <ArrowRight className="ml-2 h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pt-12">
            {/* Item 1 */}
            <div className="space-y-8 flex flex-col items-center text-center group">
              <div className="h-40 w-full flex items-center justify-center relative">
                <div className="absolute w-32 h-32 rounded-full bg-primary/5 border border-primary/10 animate-pulse" />
                <div className="relative w-24 h-24 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <CheckCircle className="w-12 h-12 text-primary" />
                  <div className="absolute -top-2 -right-2 bg-primary text-[10px] text-white font-bold px-2 py-0.5 rounded-full shadow-lg">VERIFIED</div>
                </div>
              </div>
              <h3 className="text-xl font-bold font-heading px-4">Verified & Quality Study Materials</h3>
            </div>

            {/* Item 2 */}
            <div className="space-y-8 flex flex-col items-center text-center group">
              <div className="h-40 w-full flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-48 h-px bg-linear-to-r from-transparent via-primary to-transparent" />
                  <div className="absolute right-12 w-2 h-2 rounded-full bg-primary animate-ping" />
                </div>
                <div className="relative w-20 h-24 rounded-xl bg-linear-to-b from-primary/10 to-transparent border border-primary/20 flex flex-col items-center justify-center gap-2 -translate-x-2 group-hover:translate-x-0 transition-transform duration-500">
                  <div className="w-12 h-1 bg-primary/40 rounded-full" />
                  <div className="w-8 h-1 bg-primary/20 rounded-full self-start ml-4" />
                  <Zap className="w-8 h-8 text-primary mt-2 animate-bounce" />
                </div>
              </div>
              <h3 className="text-xl font-bold font-heading px-4">Instant Digital Material Delivery</h3>
            </div>

            {/* Item 3 */}
            <div className="space-y-8 flex flex-col items-center text-center group">
              <div className="h-40 w-full flex items-center justify-center relative">
                <div className="absolute w-28 h-28 rounded-full border border-primary/10 scale-125 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative w-20 h-24 flex items-center justify-center bg-linear-to-b from-primary/20 to-primary/5 rounded-xl border border-primary/30">
                  <Shield className="w-14 h-14 text-primary relative z-10" />
                  <Lock className="absolute w-5 h-5 text-white z-20 translate-y-1" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-primary/20 rounded-full border-dashed animate-spin-slow" />
              </div>
              <h3 className="text-xl font-bold font-heading px-4">Secure & Encrypted Transactions</h3>
            </div>

            {/* Item 4 */}
            <div className="space-y-8 flex flex-col items-center text-center group">
              <div className="h-40 w-full flex items-center justify-center relative px-8">
                <div className="absolute w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
                <div className="flex items-center justify-between w-full max-w-[200px] relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-primary/60" />
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 group-hover:px-4 transition-all duration-500">
                    <ArrowLeftRight className="w-6 h-6 text-primary animate-pulse" />
                    <div className="w-full h-0.5 bg-primary/20 rounded-full" />
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary border border-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-white font-bold text-xs uppercase">App</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold font-heading px-4">Seamless Mobile Learning Experience</h3>
            </div>
          </div>
        </div>
      </section>


      {/* App CTA Section */}
      <section className="py-24 bg-background relative overflow-hidden px-7">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary">
                <span>New Mobile App</span>
              </div>
              <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-[1.1] tracking-tight ${ibm_plex_sans.className}`}>
                Study On The Go <br />
                With The <span className="text-primary">KwizHub App</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Download your academic materials for offline access. Enjoy a distraction-free reading experience with built-in security features and seamless synchronization across all devices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/app" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-base px-10 h-14 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 group transition-all">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 mx-auto w-72 h-[580px] bg-card rounded-[3rem] border-2 border-border shadow-2xl overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-card rounded-b-2xl border-x-2 border-b-2 border-border z-20" />
                <div className="w-full h-full bg-linear-to-br from-background via-background/95 to-primary/10 flex flex-col items-center justify-center p-8 text-center space-y-8">
                  <div className="w-24 h-24 bg-linear-to-br from-primary to-primary/80 rounded-4xl flex items-center justify-center shadow-xl shadow-primary/20">
                    <span className="text-5xl font-bold text-primary-foreground">K</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className={`font-bold text-3xl font-heading ${ibm_plex_sans.className}`}>KwizHub</h3>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">Mobile Reader</p>
                  </div>
                  <div className="w-full h-1 bg-border/20 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-primary" />
                  </div>
                  <Button className="w-full h-12 rounded-full shadow-md bg-primary hover:bg-primary/90">
                    Download
                  </Button>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[120px] rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 overflow-hidden px-10">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10 relative z-10">
          <div className="space-y-4">
            <h2 className={`text-4xl md:text-6xl font-bold font-heading tracking-tight leading-[1.1] ${ibm_plex_sans.className}`}>
              Ready to Excel in <br />
              Your <span className="text-primary">Studies?</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join thousands of students improving their grades with verified materials.
              Start your journey to academic excellence today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base px-10 h-14 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 group transition-all shadow-xl shadow-primary/5">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform" />
              </Button>
            </Link>
            <Link href="/marketplace" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-10 h-14 rounded-full border-2 transition-all">
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
