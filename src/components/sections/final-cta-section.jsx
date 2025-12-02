"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const FinalCtaSection = () => {
  return (
    <section className="py-20 sm:py-32 relative overflow-hidden bg-black">
        <div className="absolute -top-1/2 -left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <style jsx>{`
            @keyframes blob {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
            .animation-delay-4000 {
                animation-delay: 4s;
            }
        `}</style>
        
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-headline font-bold text-white mb-6">
          Ready to Build Your Future?
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
          Stop applying, start connecting. Create your dynamic skill profile today and let your abilities speak for themselves.
        </p>
        <Button size="lg" className="group bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105 text-xl px-10 py-8 rounded-full">
          Create Your Skill Profile
          <ArrowRight className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Button>
      </div>
    </section>
  );
};

export default FinalCtaSection;
