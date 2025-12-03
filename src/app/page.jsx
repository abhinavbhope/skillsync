'use client';
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
        {/* Hero Section with responsive padding */}
        <div className="px-4 sm:px-6 lg:px-8">
          <HeroSection />
        </div>
        
        {/* Stats Section with responsive padding and spacing */}
        <div className="px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-16">
          <StatsSection />
        </div>
        
        {/* Skill Graph Section with responsive padding and spacing */}
        <div className="px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-16">
          <SkillGraphSection />
        </div>
        
        {/* Final CTA Section with responsive padding and spacing */}
        <div className="px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-16">
          <FinalCtaSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}