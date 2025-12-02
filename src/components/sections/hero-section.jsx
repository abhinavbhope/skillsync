"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import Typewriter from '@/components/ui/typewriter';
import ParticleNetwork from '@/components/ui/particle-network';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      <ParticleNetwork />
      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto px-4">
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold text-white mb-4">
          <Typewriter text="Find Open-Source Projects That Match Your Vibe." />
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
          SkillSync uses AI to understand your{" "}
          <span className="text-primary/90 font-semibold animate-pulse">
            skills, tech stack, and personality
          </span>{" "}
          — then recommends open-source projects where you’ll feel naturally aligned.
        </p>

        <Button
          size="lg"
          className="group bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105 text-lg px-8 py-6 rounded-full"
        >
          Discover Your Perfect Project
          <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-gray-400 rounded-full animate-[scroll_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
