'use client';                         // ← add at the top
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/sections/hero-section";
import SkillGraphSection from "@/components/sections/skill-graph-section";
import StatsSection from "@/components/sections/stats-section";
import FinalCtaSection from "@/components/sections/final-cta-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <SkillGraphSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
}