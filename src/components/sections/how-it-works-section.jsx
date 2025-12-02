"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, BrainCircuit, Puzzle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

const steps = [
  {
    icon: UploadCloud,
    title: 'Sync Your GitHub',
    description:
      'Connect your GitHub profile so we can analyze your repositories, tech stack, patterns, and the vibe of your coding style.',
  },
  {
    icon: BrainCircuit,
    title: 'AI Reads Your Dev Identity',
    description:
      'Our AI studies your code, languages, architectures, habits, and strengths — building a signature “developer fingerprint.”',
  },
  {
    icon: Puzzle,
    title: 'Get Open-Source Projects That Fit You',
    description:
      'You instantly receive curated open-source projects that match your skills, personality, coding style, and growth goals.',
  },
];

const StepCard = ({ icon: Icon, title, description, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Card className="bg-[#1a1a1a]/80 border-white/10 text-center h-full flex flex-col items-center p-8 backdrop-blur-sm">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 border border-primary/30">
            <Icon className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline text-white">{title}</CardTitle>
        </CardHeader>
        <CardDescription className="text-gray-400 text-base">{description}</CardDescription>
      </Card>
    </div>
  );
};

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-black/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-headline font-bold text-white">
            How SkillSync Finds Your Perfect Open-Source Match
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            No more random GitHub browsing. Our AI understands you as a developer
            and guides you to projects where you naturally belong.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
