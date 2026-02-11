import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Features } from "@/components/landing/features";
import { AppCTA } from "@/components/landing/app-cta";
import { FinalCTA } from "@/components/landing/final-cta";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <Hero />
      <Stats />
      <Features />
      <AppCTA />
      <FinalCTA />

      <Footer />
    </div>
  );
}
