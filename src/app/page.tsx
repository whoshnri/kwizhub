import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-blue-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm">Now live with 1000+ materials</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Gateway to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                Academic Excellence
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Access quality study materials, past questions, and academic resources
              from verified authors. Excel in your studies with KwizHub.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8">
                  Browse Marketplace
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-8 bg-transparent border-white text-white hover:bg-white hover:text-primary"
                >
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose KwizHub?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide a secure platform for buying and selling academic materials
              with instant delivery and verified quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <svg
                    className="w-8 h-8 text-primary group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality Materials</h3>
                <p className="text-muted-foreground">
                  Access verified study materials, past questions, and resources
                  curated by experienced authors.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <svg
                    className="w-8 h-8 text-primary group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Instant Access</h3>
                <p className="text-muted-foreground">
                  Download your purchased materials immediately after payment.
                  No waiting, no delays.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <svg
                    className="w-8 h-8 text-primary group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure Platform</h3>
                <p className="text-muted-foreground">
                  Your transactions and downloads are protected with industry-standard
                  security measures.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">1K+</div>
              <div className="text-muted-foreground">Study Materials</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Happy Students</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Verified Authors</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">34</div>
              <div className="text-muted-foreground">Departments</div>
            </div>
          </div>
        </div>
      </section>

      {/* App CTA Section */}
      <section className="py-20 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left space-y-6">
              <span className="inline-block px-4 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium border border-blue-500/30">
                New Mobile App
              </span>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Study on the go with the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  KwizHub Mobile App
                </span>
              </h2>
              <p className="text-gray-300 text-lg max-w-xl">
                Download your materials for offline access. Enjoy a distraction-free reading experience with built-in security features.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/app">
                  <Button size="lg" className="h-14 px-8 text-lg bg-white text-gray-900 hover:bg-gray-100 w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative z-10 mx-auto w-64 h-[500px] bg-gray-800 rounded-[2.5rem] border-8 border-gray-700 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-700 rounded-b-xl z-20"></div>
                <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-white">K</span>
                  </div>
                  <h3 className="font-bold text-xl">KwizHub</h3>
                  <button className="px-6 py-2 bg-blue-600 rounded-full text-sm font-medium">Download Now</button>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/20 blur-[100px] rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Excel in Your Studies?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who have improved their grades with our
            quality study materials. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Create Free Account
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
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
